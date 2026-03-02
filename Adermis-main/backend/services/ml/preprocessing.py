"""Image preprocessing pipeline for the CNN model."""
import torch
from PIL import Image
from torchvision import transforms
from services.ml.model import get_device

# Standard ImageNet-style transform for 224×224
_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
])


def preprocess_image(image_file) -> torch.Tensor:
    """Read an image file(-like) and return a batch tensor on device."""
    img = Image.open(image_file).convert("RGB")
    tensor = _transform(img).unsqueeze(0)  # [1, 3, 224, 224]
    return tensor.to(get_device())
