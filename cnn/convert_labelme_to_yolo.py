import os
import json
from PIL import Image

# Map labels to YOLO class indices
LABEL_MAP = {
    "input": 0,
    "button": 1,
}

# Paths
IMG_DIR = "datasets/augmented_images"
ANNOTATION_DIR = "datasets/augmented_annotations"
OUTPUT_LABEL_DIR = "datasets/yolo_labels"

os.makedirs(OUTPUT_LABEL_DIR, exist_ok=True)

# Process each annotation
for filename in os.listdir(ANNOTATION_DIR):
    if not filename.endswith(".json"):
        continue

    json_path = os.path.join(ANNOTATION_DIR, filename)
    with open(json_path, "r") as f:
        data = json.load(f)

    image_filename = os.path.basename(data["imagePath"]).replace("\\", "/")
    image_path = os.path.join(IMG_DIR, image_filename)

    if not os.path.exists(image_path):
        print(f"Image not found for {image_path}")
        continue

    img = Image.open(image_path)
    width, height = img.size

    yolo_annotations = []

    for shape in data["shapes"]:
        label = shape["label"]
        if label not in LABEL_MAP:
            continue

        points = shape["points"]
        x_coords = [p[0] for p in points]
        y_coords = [p[1] for p in points]

        x_min = min(x_coords)
        x_max = max(x_coords)
        y_min = min(y_coords)
        y_max = max(y_coords)

        # YOLO format: class_id x_center y_center width height (all normalized)
        x_center = ((x_min + x_max) / 2) / width
        y_center = ((y_min + y_max) / 2) / height
        bbox_width = (x_max - x_min) / width
        bbox_height = (y_max - y_min) / height

        yolo_annotations.append(
            f"{LABEL_MAP[label]} {x_center:.6f} {y_center:.6f} {bbox_width:.6f} {bbox_height:.6f}"
        )

    txt_filename = os.path.splitext(image_filename)[0] + ".txt"
    with open(os.path.join(OUTPUT_LABEL_DIR, txt_filename), "w") as out_file:
        out_file.write("\n".join(yolo_annotations))
