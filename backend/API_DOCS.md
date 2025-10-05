# API Documentation

## Exoplanet Classification API

A FastAPI-based REST API for exoplanet classification using a trained RandomForest machine learning model.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Request Examples](#request-examples)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)

---

## Getting Started

### Installation

1. Install dependencies from the project root:

```bash
pip install -r requirements.txt
```

2. Start the server from the backend directory:

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Access Documentation

Once the server is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **API Root**: http://localhost:8000/

---

## Base URL

```
http://localhost:8000
```

For production, replace with your deployment URL.

---

## Authentication

Currently, the API does not require authentication. For production deployment, consider implementing:

- API Key authentication
- OAuth2
- JWT tokens

---

## Endpoints

### 1. Root Endpoint

**GET** `/`

Returns API information and available endpoints.

**Response:**

```json
{
  "message": "Exoplanet Classification API",
  "version": "1.0.0",
  "status": "active",
  "model": "RandomForest Classifier",
  "endpoints": {
    "health": "/health",
    "model_info": "/model/info",
    "predict": "/predict",
    "predict_batch": "/predict/batch",
    "docs": "/docs"
  }
}
```

---

### 2. Health Check

**GET** `/health`

Check if the API and model are operational.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-05T13:45:30.123456",
  "model_loaded": true
}
```

---

### 3. Model Information

**GET** `/model/info`

Get detailed information about the loaded model.

**Response:**

```json
{
  "model_name": "RandomForest",
  "model_type": "classification",
  "model_path": "../models/RandomForest_classification_20251005_134019.joblib",
  "n_features": 24,
  "target_classes": ["CANDIDATE", "CONFIRMED", "FALSE POSITIVE"],
  "numeric_features": 23,
  "categorical_features": 1
}
```

---

### 4. Get Model Features

**GET** `/model/features`

Get the list of features expected by the model.

**Response:**

```json
{
  "status": "success",
  "features": {
    "numeric": ["koi_period", "koi_duration", "koi_depth", "..."],
    "categorical": ["mission_id"],
    "all": ["koi_period", "koi_duration", "..."]
  },
  "total_features": 24
}
```

---

### 5. Get Model Metrics

**GET** `/model/metrics`

Get model performance metrics.

**Response:**

```json
{
  "status": "success",
  "metrics": {
    "model_name": "RandomForest",
    "note": "Training metrics not available. Upload test data to calculate metrics."
  }
}
```

---

### 6. Single File Prediction

**POST** `/predict`

Upload a CSV file and get predictions with probabilities and metrics.

**Request:**

- **Content-Type**: `multipart/form-data`
- **Body**: CSV file

**Response:**

```json
{
  "status": "success",
  "filename": "test_data.csv",
  "total_rows": 100,
  "predictions": ["CONFIRMED", "CANDIDATE", "FALSE POSITIVE", "..."],
  "probabilities": [[0.05, 0.92, 0.03], [0.15, 0.75, 0.1], "..."],
  "metrics": {
    "total_predictions": 100,
    "class_distribution": {
      "CONFIRMED": 45,
      "CANDIDATE": 30,
      "FALSE POSITIVE": 25
    },
    "average_confidence": 0.8523
  },
  "timestamp": "2025-10-05T13:45:30.123456"
}
```

---

### 7. Batch Prediction with Details

**POST** `/predict/batch`

Upload a CSV file and get detailed row-by-row predictions.

**Request:**

- **Content-Type**: `multipart/form-data`
- **Body**: CSV file

**Response:**

```json
{
  "status": "success",
  "filename": "test_data.csv",
  "total_rows": 3,
  "predictions_detail": [
    {
      "row_id": 0,
      "prediction": "CONFIRMED",
      "confidence": 0.92,
      "probabilities": {
        "CANDIDATE": 0.05,
        "CONFIRMED": 0.92,
        "FALSE POSITIVE": 0.03
      }
    },
    {
      "row_id": 1,
      "prediction": "CANDIDATE",
      "confidence": 0.75,
      "probabilities": {
        "CANDIDATE": 0.75,
        "CONFIRMED": 0.15,
        "FALSE POSITIVE": 0.1
      }
    }
  ],
  "summary": {
    "total_samples": 100,
    "predictions_by_class": {
      "CONFIRMED": {
        "count": 45,
        "percentage": 45.0
      },
      "CANDIDATE": {
        "count": 30,
        "percentage": 30.0
      },
      "FALSE POSITIVE": {
        "count": 25,
        "percentage": 25.0
      }
    },
    "confidence_stats": {
      "mean": 0.8523,
      "std": 0.1234,
      "min": 0.5012,
      "max": 0.9876,
      "median": 0.8701
    }
  },
  "metrics": {
    "total_predictions": 100,
    "class_distribution": {
      "CONFIRMED": 45,
      "CANDIDATE": 30,
      "FALSE POSITIVE": 25
    },
    "average_confidence": 0.8523
  },
  "timestamp": "2025-10-05T13:45:30.123456"
}
```

---

### 8. JSON Prediction

**POST** `/predict/json`

Make predictions using JSON input.

**Request:**

- **Content-Type**: `application/json`
- **Body**:

```json
{
  "data": {
    "koi_period": 9.48803557,
    "koi_duration": 2.9575,
    "koi_depth": 616.0,
    "koi_ror": 0.022344,
    "koi_model_snr": 35.8,
    "koi_num_transits": 142.0,
    "koi_impact": 0.146,
    "koi_dor": 24.81,
    "koi_teq": 793.0,
    "..."
  }
}
```

**Response:**

```json
{
  "status": "success",
  "prediction": "CONFIRMED",
  "probabilities": [0.05, 0.92, 0.03],
  "confidence": 0.92,
  "timestamp": "2025-10-05T13:45:30.123456"
}
```

---

### 9. Analytics - Full Report

**POST** `/analytics`

Generate comprehensive analytics including statistics and visualizations.

**Request:**

- **Content-Type**: `multipart/form-data`
- **Body**: CSV file (optionally with target column for performance metrics)

**Response:**

```json
{
  "status": "success",
  "filename": "test_data.csv",
  "analytics": {
    "statistics": {
      "total_predictions": 100,
      "unique_classes": 3,
      "class_distribution": { ... },
      "confidence_statistics": {
        "mean": 0.8523,
        "std": 0.1234,
        "min": 0.5012,
        "max": 0.9876,
        "median": 0.8701,
        "q1": 0.7234,
        "q3": 0.9123
      },
      "confidence_ranges": {
        "high (>= 0.8)": { "count": 75, "percentage": 75.0 },
        "medium (0.6-0.8)": { "count": 20, "percentage": 20.0 },
        "low (< 0.6)": { "count": 5, "percentage": 5.0 }
      },
      "performance_metrics": {
        "accuracy": 0.9200,
        "precision_macro": 0.9150,
        "recall_macro": 0.9100,
        "f1_macro": 0.9125
      },
      "per_class_metrics": {
        "CONFIRMED": {
          "precision": 0.95,
          "recall": 0.92,
          "f1-score": 0.93,
          "support": 45
        }
      }
    },
    "plots": {
      "class_distribution": "base64_encoded_png...",
      "confusion_matrix": "base64_encoded_png...",
      "confidence_distribution": "base64_encoded_png...",
      "probability_heatmap": "base64_encoded_png...",
      "roc_curves": "base64_encoded_png...",
      "feature_importance": "base64_encoded_png...",
      "class_probability_comparison": "base64_encoded_png..."
    },
    "summary": {
      "total_samples": 100,
      "predictions_generated": 100,
      "plots_generated": 7,
      "has_ground_truth": true,
      "model_name": "RandomForest"
    }
  },
  "timestamp": "2025-10-05T13:45:30.123456"
}
```

**Note**: Plots are returned as base64-encoded PNG images that can be directly displayed in HTML:

```html
<img src="data:image/png;base64,{plot_base64}" alt="Plot" />
```

---

### 10. Analytics - Statistics Only

**POST** `/analytics/statistics`

Get statistics without generating plots (faster response).

**Request:**

- **Content-Type**: `multipart/form-data`
- **Body**: CSV file

**Response:**

```json
{
  "status": "success",
  "filename": "test_data.csv",
  "statistics": {
    "total_predictions": 100,
    "class_distribution": { ... },
    "confidence_statistics": { ... },
    "confidence_ranges": { ... },
    "performance_metrics": { ... }
  },
  "total_samples": 100,
  "timestamp": "2025-10-05T13:45:30.123456"
}
```

---

### 11. Available Plot Types

**GET** `/analytics/plots/types`

Get information about available visualization types.

**Response:**

```json
{
  "status": "success",
  "available_plots": [
    {
      "name": "class_distribution",
      "description": "Bar chart showing distribution of predicted classes",
      "requires_ground_truth": false
    },
    {
      "name": "confusion_matrix",
      "description": "Confusion matrix heatmap",
      "requires_ground_truth": true
    },
    {
      "name": "confidence_distribution",
      "description": "Histogram and box plot of prediction confidence scores",
      "requires_ground_truth": false
    },
    {
      "name": "probability_heatmap",
      "description": "Heatmap showing probability distributions",
      "requires_ground_truth": false
    },
    {
      "name": "roc_curves",
      "description": "ROC curves for multi-class classification",
      "requires_ground_truth": true
    },
    {
      "name": "feature_importance",
      "description": "Feature importance rankings (if supported by model)",
      "requires_ground_truth": false
    },
    {
      "name": "class_probability_comparison",
      "description": "Violin plot comparing probability distributions",
      "requires_ground_truth": false
    }
  ]
}
```

---

## Request Examples

### Using cURL

#### 1. Health Check

```bash
curl -X GET "http://localhost:8000/health"
```

#### 2. Model Info

```bash
curl -X GET "http://localhost:8000/model/info"
```

#### 3. Upload CSV for Prediction

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_data.csv"
```

#### 4. Batch Prediction

```bash
curl -X POST "http://localhost:8000/predict/batch" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_data.csv"
```

#### 5. JSON Prediction

```bash
curl -X POST "http://localhost:8000/predict/json" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "koi_period": 9.48803557,
      "koi_duration": 2.9575,
      "koi_depth": 616.0,
      "..."
    }
  }'
```

#### 6. Full Analytics

```bash
curl -X POST "http://localhost:8000/analytics" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_data.csv"
```

#### 7. Statistics Only

```bash
curl -X POST "http://localhost:8000/analytics/statistics" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_data.csv"
```

#### 8. Get Plot Types

```bash
curl -X GET "http://localhost:8000/analytics/plots/types"
```

---

### Using Python

#### Install requests library

```bash
pip install requests
```

#### Example: Upload CSV

```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("test_data.csv", "rb")}

response = requests.post(url, files=files)
print(response.json())
```

#### Example: JSON Prediction

```python
import requests

url = "http://localhost:8000/predict/json"
data = {
    "data": {
        "koi_period": 9.48803557,
        "koi_duration": 2.9575,
        "koi_depth": 616.0,
        # ... other features
    }
}

response = requests.post(url, json=data)
print(response.json())
```

#### Example: Get Full Analytics

```python
import requests
import base64

url = "http://localhost:8000/analytics"
files = {"file": open("test_data.csv", "rb")}

response = requests.post(url, files=files)
data = response.json()

# Access statistics
stats = data['analytics']['statistics']
print(f"Total Predictions: {stats['total_predictions']}")
print(f"Average Confidence: {stats['confidence_statistics']['mean']}")

# Save plots
plots = data['analytics']['plots']
for plot_name, plot_base64 in plots.items():
    img_data = base64.b64decode(plot_base64)
    with open(f"{plot_name}.png", "wb") as f:
        f.write(img_data)
    print(f"Saved {plot_name}.png")
```

#### Example: Display Plots in Jupyter Notebook

```python
import requests
import base64
from IPython.display import Image, display

url = "http://localhost:8000/analytics"
files = {"file": open("test_data.csv", "rb")}

response = requests.post(url, files=files)
plots = response.json()['analytics']['plots']

# Display each plot
for plot_name, plot_base64 in plots.items():
    print(f"\n{plot_name.upper().replace('_', ' ')}")
    img_data = base64.b64decode(plot_base64)
    display(Image(data=img_data))
```

---

### Using JavaScript (Fetch API)

#### Upload CSV

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

fetch("http://localhost:8000/predict", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

#### JSON Prediction

```javascript
fetch("http://localhost:8000/predict/json", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    data: {
      koi_period: 9.48803557,
      koi_duration: 2.9575,
      koi_depth: 616.0,
      // ... other features
    },
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

---

## Response Formats

### Success Response

All successful responses include:

- `status`: "success"
- `timestamp`: ISO format timestamp
- Additional endpoint-specific data

### Prediction Response Fields

| Field                | Type   | Description                                   |
| -------------------- | ------ | --------------------------------------------- |
| `predictions`        | array  | List of predicted classes                     |
| `probabilities`      | array  | Probability distributions for each prediction |
| `confidence`         | float  | Confidence score (max probability)            |
| `metrics`            | object | Aggregated metrics                            |
| `class_distribution` | object | Count of predictions per class                |
| `average_confidence` | float  | Mean confidence across all predictions        |

---

## Error Handling

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Code | Meaning               | Common Causes                                 |
| ---- | --------------------- | --------------------------------------------- |
| 200  | Success               | Request processed successfully                |
| 400  | Bad Request           | Invalid file format, empty file, missing data |
| 404  | Not Found             | Endpoint doesn't exist                        |
| 500  | Internal Server Error | Model error, server issue                     |

### Error Examples

#### Invalid File Type

```json
{
  "detail": "File must be a CSV"
}
```

#### Empty CSV

```json
{
  "detail": "CSV file is empty"
}
```

#### Model Not Loaded

```json
{
  "detail": "Model not loaded. Call load_model() first."
}
```

---

## CSV File Format

Your CSV file should contain the following columns (in any order):

### Required Columns

```
koi_period, koi_duration, koi_depth, koi_ror, koi_model_snr,
koi_num_transits, koi_impact, koi_dor, koi_teq, koi_srho,
koi_kepmag, koi_gmag, koi_rmag, koi_imag, koi_zmag,
koi_jmag, koi_hmag, koi_kmag, ra, dec, mission_id,
object_name, host_name, source_primary_id
```

### Example CSV

```csv
koi_period,koi_duration,koi_depth,koi_ror,koi_model_snr,...
9.48803557,2.9575,616.0,0.022344,35.8,...
54.4183827,4.507,875.0,0.027954,25.8,...
```

**Note**: The target column (`koi_disposition`) should NOT be included in prediction requests.

---

## Rate Limiting

Currently, no rate limiting is implemented. For production:

- Consider implementing rate limiting using middleware
- Suggested: 100 requests per minute per IP

---

## CORS Configuration

The API currently allows all origins (`*`). For production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific domains
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

---

## Deployment

### Using Gunicorn (Production)

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t exoplanet-api .
docker run -p 8000:8000 exoplanet-api
```

---

## Support

For issues or questions:

- Check the interactive documentation: http://localhost:8000/docs
- Review error messages in the response
- Check server logs for detailed error traces

---

## Version History

### v1.0.0 (Current)

- Initial release
- RandomForest classifier
- CSV upload support
- JSON prediction support
- Batch predictions with detailed output
- Model information endpoints
