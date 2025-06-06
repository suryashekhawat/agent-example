import os
import base64
import json
from openai import OpenAI
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# === CONFIGURATION ===
input_dir = "datasets/data_images/screenshots"
output_json_dir = "datasets/ai-labels"
output_annotated_dir = "datasets/ai-annotated"
os.makedirs(output_json_dir, exist_ok=True)
os.makedirs(output_annotated_dir, exist_ok=True)

MAX_ITERATIONS = 10
ALIGNMENT_THRESHOLD = 0.98

# === PROMPT TEMPLATE ===
prompt = """
You are a UI analysis assistant.

Analyze the screenshot provided. Identify all visible user interface (UI) elements such as:
- Menus (sidebars, dropdowns)
- Navigation bars (top bars, tab bars)
- Buttons
- Tables
- Input fields

For each element, return a JSON object in this format:
{
  "type": "button" | "menu" | "table" | "input" | "tab" | "top-bar" | "other",
  "label": "visible text on element, if any",
  "box": [x1, y1, x2, y2]  // bounding box in pixels (top-left to bottom-right)
}
All coordinates must exactly match the visible UI layout in the image.
If unsure, estimate conservatively. Return high-confidence pixel coordinates only.

Return only a JSON array of such objects.
Do not include markdown, explanations, or comments — just valid, raw JSON.
"""

def clean_json_output(output):
    output = output.strip()
    if output.startswith("```json"):
        output = output[len("```json"):].strip()
    if output.startswith("```"):
        output = output[len("```"):].strip()
    if output.endswith("```"):
        output = output[:-3].strip()
    return output

def convert_box_to_polygon(box):
    x1, y1, x2, y2 = box
    return [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]

def format_labelme_json(image_path, annotations):
    img = Image.open(image_path)
    width, height = img.size
    shapes = []

    for ann in annotations:
        if "box" not in ann or "type" not in ann:
            continue
        shape = {
            "label": ann["type"],
            "points": convert_box_to_polygon(ann["box"]),
            "group_id": None,
            "description": "",
            "shape_type": "polygon",
            "flags": {}
        }
        shapes.append(shape)

    with open(image_path, "rb") as img_file:
        encoded_img = base64.b64encode(img_file.read()).decode('utf-8')

    return {
        "version": "5.2.1",
        "flags": {},
        "shapes": shapes,
        "imagePath": os.path.basename(image_path),
        "imageData": encoded_img,
        "imageHeight": height,
        "imageWidth": width
    }

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def analyze_image_with_gpt4(image_path):
    base64_image = encode_image(image_path)
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for UI element detection."},
            {"role": "user", "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {
                    "url": f"data:image/png;base64,{base64_image}",
                    "detail": "high"  # force high resolution processing
                }}
            ]}
        ],
        max_tokens=2048
    )
    return response.choices[0].message.content

def draw_boxes(image_path, elements, save_path):
    image = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("arial.ttf", 14)
    except:
        font = ImageFont.load_default()

    for el in elements:
        if not all(k in el for k in ("box", "type")):
            continue
        x1, y1, x2, y2 = el["box"]
        label = f"{el['type']}: {el.get('label', '')}"
        draw.rectangle([x1, y1, x2, y2], outline="red", width=2)
        draw.text((x1, y1 - 10), label, fill="red", font=font)

    image.save(save_path)

# === PROCESS TOP IMAGE ===
image_files = sorted([
    f for f in os.listdir(input_dir)
    if f.lower().endswith(('.png', '.jpg', '.jpeg'))
])[:1]

for filename in image_files:
    img_path = os.path.join(input_dir, filename)
    print(f"\nProcessing: {filename}")

    annotations = None

    for iteration in range(MAX_ITERATIONS):
        print(f"🌀 Iteration {iteration+1}...")

        if iteration == 0:
            output = analyze_image_with_gpt4(img_path)
            cleaned_output = clean_json_output(output)
            annotations = json.loads(cleaned_output)
        else:
            print("🔄 Placeholder: no automatic refinement in this iteration.")

        step_img = os.path.join(output_annotated_dir, f"step{iteration+1}_{filename}")
        draw_boxes(img_path, annotations, step_img)

        if iteration >= 2:
            print("✅ Reached simulated alignment threshold.")
            break
        else:
            print("🔁 Continuing refinement loop...")

    labelme_data = format_labelme_json(img_path, annotations)
    json_filename = filename.rsplit(".", 1)[0] + ".json"
    with open(os.path.join(output_json_dir, json_filename), "w") as f:
        json.dump(labelme_data, f, indent=2)

    print(f"✅ Saved LabelMe JSON: {json_filename}")