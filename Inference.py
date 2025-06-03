from ultralytics import YOLO
import matplotlib.pyplot as plt
import cv2

# Load your trained model
model = YOLO("runs/detect/custom-yolov8-model2/weights/best.pt")

# Run inference with very low confidence threshold
results = model("cnn/datasets/images/image-1.png", conf=0.01)

# Check how many boxes were detected
print(f"Boxes detected: {len(results[0].boxes)}")

# Print each detection
for box in results[0].boxes:
    cls = int(box.cls[0])
    conf = float(box.conf[0])
    xyxy = box.xyxy[0].tolist()
    print(f"Detected {model.names[cls]} with confidence {conf:.3f} at {xyxy}")

# Render predictions on image
rendered = results[0].plot()  # BGR
rendered_rgb = cv2.cvtColor(rendered, cv2.COLOR_BGR2RGB)

# Show image with bounding boxes
plt.imshow(rendered_rgb)
plt.axis("off")
plt.title("YOLOv8 Predictions (conf ≥ 0.01)")
plt.show()
