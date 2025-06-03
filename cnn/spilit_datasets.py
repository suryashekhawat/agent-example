import os
import shutil
import random
from pathlib import Path

# Config
image_dir = Path("datasets/augmented_images")
label_dir = Path("datasets/yolo_labels")
output_dir = Path("datasets")
train_ratio = 0.8  # 80% train, 20% val

# Output folders
for folder in ["images/train", "images/val", "labels/train", "labels/val"]:
    (output_dir / folder).mkdir(parents=True, exist_ok=True)

# Get image files
image_files = list(image_dir.glob("*.png"))
random.shuffle(image_files)

split_idx = int(len(image_files) * train_ratio)
train_files = image_files[:split_idx]
val_files = image_files[split_idx:]

def move_files(files, subset):
    for img_path in files:
        label_path = label_dir / (img_path.stem + ".txt")
        shutil.copy(img_path, output_dir / f"images/{subset}" / img_path.name)
        if label_path.exists():
            shutil.copy(label_path, output_dir / f"labels/{subset}" / label_path.name)
        else:
            print(f"Warning: Label not found for {img_path.name}")

move_files(train_files, "train")
move_files(val_files, "val")

# Write data.yaml
data_yaml = output_dir / "data.yaml"
with open(data_yaml, "w") as f:
    f.write(f"""train: {output_dir}/images/train
val: {output_dir}/images/val

nc: 2
names: ['input', 'button']
""")

print("✅ Dataset split complete. You can now train YOLO using `data.yaml`.")
