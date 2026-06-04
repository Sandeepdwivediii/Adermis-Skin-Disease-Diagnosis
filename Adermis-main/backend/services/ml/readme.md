# 🩺 Skin Disease Detection ML Service

## Overview

This service provides an API for skin disease classification using a Convolutional Neural Network (CNN) built with PyTorch and served through Flask.

A user uploads an image of a skin condition, and the system returns:

* Most likely disease
* Confidence score
* Top 3 predicted diseases

The model supports **11 skin disease classes**.

---

# High Level Architecture

```text
                User Uploads Image
                         │
                         ▼
               POST /ml/predict
                         │
                         ▼
               Flask Prediction API
                         │
                         ▼
                Image Preprocessing
                         │
                         ▼
                  CNN Model
                         │
                         ▼
                Raw Prediction Scores
                         │
                         ▼
                   Softmax Layer
                         │
                         ▼
               Disease Probabilities
                         │
                         ▼
                Top-3 Predictions
                         │
                         ▼
                  JSON Response
```

---

# Project Components

```text
services/
│
├── ml/
│   │
│   ├── model.py
│   │      CNN architecture
│   │      Model loading
│   │      GPU/CPU management
│   │
│   ├── preprocessing.py
│   │      Image transformations
│   │
│   └── routes.py
│          Prediction API
│
config.py
```

---

# Component 1: CNN Model

File:

```python
services/ml/model.py
```

Purpose:

```text
Define neural network architecture
Load trained weights
Serve model for inference
```

---

# CNN Architecture

The model contains:

```text
Input Image
      │
      ▼
Conv Layer 1 (3 → 32)
      │
      ▼
ReLU
      │
      ▼
MaxPool
      │
      ▼
Conv Layer 2 (32 → 64)
      │
      ▼
ReLU
      │
      ▼
MaxPool
      │
      ▼
Conv Layer 3 (64 → 128)
      │
      ▼
ReLU
      │
      ▼
MaxPool
      │
      ▼
Flatten
      │
      ▼
Dense Layer
      │
      ▼
Dropout
      │
      ▼
Output Layer
      │
      ▼
11 Disease Scores
```

---

# What CNN Actually Learns

The CNN gradually learns image features.

Level 1:

```text
Edges
Lines
Corners
```

Level 2:

```text
Textures
Patterns
```

Level 3:

```text
Lesions
Rashes
Disease-specific structures
```

Final Layer:

```text
Disease Classification
```

---

# Model Loading Strategy

The service uses a lazy-loading singleton.

```text
First Request
    │
    ▼
Download Model
    │
    ▼
Load Model
    │
    ▼
Cache Model
```

Subsequent requests:

```text
Request
    │
    ▼
Use Cached Model
```

No reloading occurs.

Benefits:

✅ Faster predictions

✅ Lower memory usage

✅ Better production performance

---

# Component 2: Image Preprocessing

File:

```python
services/ml/preprocessing.py
```

Purpose:

Convert uploaded image into a format the CNN understands.

---

# Preprocessing Pipeline

```text
Uploaded Image
      │
      ▼
Open Image
      │
      ▼
Convert To RGB
      │
      ▼
Resize To 224x224
      │
      ▼
Convert To Tensor
      │
      ▼
Normalize
      │
      ▼
Add Batch Dimension
      │
      ▼
Move To GPU/CPU
```

---

# Step 1: Open Image

```python
Image.open(image_file)
```

Reads uploaded file.

---

# Step 2: Convert To RGB

```python
.convert("RGB")
```

Ensures:

```text
3 Channels

Red
Green
Blue
```

---

# Step 3: Resize

```python
Resize((224,224))
```

CNN expects:

```text
224 × 224 × 3
```

Every image becomes the same size.

---

# Step 4: Tensor Conversion

```python
ToTensor()
```

Converts:

```text
Pixels
```

into

```text
Numerical Tensor
```

Example:

```text
255 → 1.0
128 → 0.5
```

---

# Step 5: Normalization

```python
Normalize(
 mean=[0.5,0.5,0.5],
 std=[0.5,0.5,0.5]
)
```

Transforms values:

```text
[0,1]
```

into approximately:

```text
[-1,1]
```

Benefits:

* Faster convergence
* Stable predictions
* Better generalization

---

# Step 6: Batch Dimension

```python
unsqueeze(0)
```

Adds:

```text
Batch Size = 1
```

Shape changes:

```text
Before:
[3,224,224]

After:
[1,3,224,224]
```

---

# Component 3: Prediction API

File:

```python
services/ml/routes.py
```

Endpoint:

```http
POST /ml/predict
```

---

# Complete Request Flow

```text
Client
  │
  ▼
Uploads Image
  │
  ▼
Flask API
  │
  ▼
Validate Input
  │
  ▼
Load Model
  │
  ▼
Preprocess Image
  │
  ▼
CNN Inference
  │
  ▼
Softmax
  │
  ▼
Top-3 Extraction
  │
  ▼
JSON Response
```

---

# Step 1: Receive Image

```python
request.files.get("image")
```

Checks whether image exists.

If missing:

```json
{
  "error":"No image provided"
}
```

---

# Step 2: Load Model

```python
model = get_model()
```

Returns cached CNN.

---

# Step 3: Preprocess Image

```python
img_tensor = preprocess_image(...)
```

Produces:

```text
[1,3,224,224]
```

Tensor.

---

# Step 4: Model Inference

```python
outputs = model(img_tensor)
```

CNN produces:

```text
[
 2.1,
 8.4,
 1.2,
 ...
]
```

These are raw scores.

Called:

```text
Logits
```

---

# Step 5: Softmax

```python
softmax(outputs)
```

Converts logits into probabilities.

Example:

Before:

```text
[2.1,8.4,1.2]
```

After:

```text
[0.01,0.95,0.04]
```

Now:

```text
Total = 100%
```

---

# Step 6: Top-3 Predictions

```python
torch.topk(...)
```

Finds highest probabilities.

Example:

```text
Eczema        95%
Psoriasis      3%
Acne           2%
```

---

# Step 7: Class Mapping

Model outputs:

```text
0
1
2
...
10
```

Mapping:

```python
CLASS_NAMES[index]
```

Converts:

```text
3
```

into:

```text
Psoriasis
```

---

# Final Response

Example:

```json
{
  "disease": "Psoriasis",
  "confidence": 0.94,
  "top3_predictions": [
    {
      "disease":"Psoriasis",
      "confidence":0.94
    },
    {
      "disease":"Eczema",
      "confidence":0.04
    },
    {
      "disease":"Acne",
      "confidence":0.02
    }
  ]
}
```

---

# End-To-End Sequence Diagram

```text
User
 │
 │ Upload Image
 ▼
Flask API
 │
 │ Validate
 ▼
Preprocessor
 │
 │ Resize
 │ Normalize
 │ Tensor Conversion
 ▼
CNN Model
 │
 │ Feature Extraction
 │ Classification
 ▼
Softmax
 │
 ▼
Top-3 Selection
 │
 ▼
JSON Response
 │
 ▼
User
```

---

# Production Optimizations Used

### Model Caching

```text
Load Once
Use Forever
```

Avoids repeated loading.

---

### GPU Support

```python
torch.cuda.is_available()
```

Automatically uses CUDA if available.

---

### Inference Mode

```python
torch.no_grad()
```

Disables gradient calculations.

Benefits:

* Faster inference
* Lower memory consumption

---

### Evaluation Mode

```python
model.eval()
```

Disables training behaviors such as Dropout.

Ensures stable predictions.

---

# Complete ML Lifecycle

```text
Image
  │
  ▼
Preprocessing
  │
  ▼
Tensor
  │
  ▼
CNN Feature Extraction
  │
  ▼
Disease Scores
  │
  ▼
Softmax Probabilities
  │
  ▼
Top-3 Diseases
  │
  ▼
JSON Response
```

---


