from flask import Flask, request, jsonify
from ultralytics import YOLO
import numpy as np
import cv2
import base64
import os
from datetime import datetime

app = Flask(__name__)
model = YOLO("runs/detect/custom-yolov8-model2/weights/best.pt")

SAVE_DIR = "saved_images"
os.makedirs(SAVE_DIR, exist_ok=True)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    img_data = base64.b64decode(data["image"])
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Save image to disk
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"capture_{timestamp}.png"
    save_path = os.path.join(SAVE_DIR, filename)
    cv2.imwrite(save_path, img)

    # Run YOLOv8 inference
    results = model(img, conf=0.01)
    detections = []
    for box in results[0].boxes:
        cls = int(box.cls[0])
        conf = float(box.conf[0])
        xyxy = [float(x) for x in box.xyxy[0]]
        detections.append({
            "label": model.names[cls],
            "confidence": round(conf, 2),
            "box": xyxy
        })

    return jsonify({"detections": detections, "saved_path": save_path})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
