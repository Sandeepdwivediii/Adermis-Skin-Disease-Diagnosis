"""CNN model definition and loading with local caching."""
import os
import torch
import torch.nn as nn
import gdown
from config import MODEL_URL, MODEL_DIR, MODEL_PATH


class SkinDiseaseCNN(nn.Module):
    """3-layer CNN for 11-class skin disease classification."""

    def __init__(self, num_classes: int = 11):
        super().__init__()
        self.conv_layers = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        self.fc_layers = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 28 * 28, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes),
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = self.fc_layers(x)
        return x


# ─── Lazy singleton ───
_model = None
_device = None


def get_device():
    global _device
    if _device is None:
        _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    return _device


def _ensure_model_downloaded():
    """Download model file only if it doesn't already exist."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    if not os.path.exists(MODEL_PATH):
        print("⬇  Downloading skin disease model …")
        gdown.download(MODEL_URL, MODEL_PATH, quiet=False)
        print("✅  Model downloaded successfully.")
    else:
        print("✅  Model already cached locally.")


def get_model() -> SkinDiseaseCNN:
    """Return the loaded model (downloads on first call, then cached)."""
    global _model
    if _model is None:
        _ensure_model_downloaded()
        device = get_device()
        _model = SkinDiseaseCNN(num_classes=11)
        _model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        _model.to(device)
        _model.eval()
        print("✅  CNN model loaded.")
    return _model
