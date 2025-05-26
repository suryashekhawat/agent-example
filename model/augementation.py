import cv2
import numpy as np
import albumentations as A
from PIL import Image
import os
import glob

# Load RGBA image (with transparency)
input_path = "datasets/images/image-1.png"  # Your original image
output_dir = "datasets/augmented_images"
os.makedirs(output_dir, exist_ok=True)

image = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
alpha = image[:, :, 3]
rgb = image[:, :, :3]

# === Define Albumentations Pipeline ===
transform = A.Compose([
    A.HorizontalFlip(p=0.5),
    A.RandomRotate90(p=0.3),
    A.ShiftScaleRotate(shift_limit=0.1, scale_limit=0.1, rotate_limit=15, p=0.7),
    A.Perspective(scale=(0.05, 0.1), keep_size=True, p=0.4),  # Added Perspective
    A.ElasticTransform(alpha=1, sigma=50, alpha_affine=10, p=0.3),  # More visible deformation
    A.RandomBrightnessContrast(p=0.5),
    A.HueSaturationValue(hue_shift_limit=15, sat_shift_limit=20, val_shift_limit=20, p=0.5),
    A.GaussNoise(var_limit=(10.0, 50.0), p=0.3),
    A.MotionBlur(blur_limit=3, p=0.2),
    
    # === Artistic Transformations ===
    A.Solarize(threshold=128, p=0.2),
    A.Posterize(num_bits=4, p=0.2),
    A.CLAHE(clip_limit=4.0, tile_grid_size=(8, 8), p=0.3),
    A.InvertImg(p=0.1),

], additional_targets={'alpha': 'mask'})

# === Augment and Save ===
for i in range(40):  # Increase to 40 variations
    augmented = transform(image=rgb, alpha=alpha)
    aug_img = augmented['image']
    aug_alpha = augmented['alpha']

    rgba_aug = cv2.merge((aug_img, aug_alpha))
    out_path = os.path.join(output_dir, f"aug_{i+1:02d}.png")
    cv2.imwrite(out_path, rgba_aug)

print(f"Saved 40 augmented images in {output_dir}/")