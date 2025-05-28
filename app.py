from flask import Flask, request, jsonify
from ultralytics import YOLO
import numpy as np
import cv2
import base64

app = Flask(__name__)
model = YOLO("runs/detect/custom-yolov8-model2/weights/best.pt")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    img_data = base64.b64decode(data["image"])
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model(img, conf=0.1)
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

    return jsonify({"detections": detections})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
