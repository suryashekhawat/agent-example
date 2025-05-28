from ultralytics import YOLO

# Path to your data.yaml file
DATA_YAML = "data.yaml"

# Choose model type: yolov8n.pt, yolov8s.pt, yolov8m.pt, yolov8l.pt, yolov8x.pt
MODEL_TYPE = "yolov8n.pt"

# Load the model
model = YOLO(MODEL_TYPE)

# Train the model
model.train(
    data=DATA_YAML,
    epochs=50,
    imgsz=640,
    batch=16,
    name="custom-yolov8-model"
)
