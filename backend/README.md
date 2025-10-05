# Backend - Exoplanet Classification API

FastAPI-powered REST API for exoplanet classification using machine learning.

## 🚀 Quick Start

### Prerequisites

- Python 3.10 or higher
- Trained model file in `../models/` directory

### Installation

1. Navigate to the backend directory:

```powershell
cd backend
```

2. Install dependencies (from project root):

```powershell
pip install -r ../requirements.txt
```

3. Start the server:

```powershell
python main.py
```

The API will be available at: **http://localhost:8000**

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py        # API endpoints
│   └── services/
│       ├── model_service.py     # ML predictions
│       └── analytics_service.py # Analytics & plots
├── main.py                  # Server entry point
├── examples.py              # Usage examples
├── test_api.py              # API tests
└── API_DOCS.md              # Complete API documentation
```

## 🔌 API Endpoints

### Core Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /model/info` - Model metadata
- `GET /model/metrics` - Performance metrics
- `GET /model/features` - Feature details

### Prediction Endpoints

- `POST /predict` - Upload CSV for predictions
- `POST /predict/batch` - Detailed row-by-row predictions
- `POST /predict/json` - JSON input prediction

### Analytics Endpoints

- `POST /analytics` - Generate comprehensive analytics
- `POST /analytics/statistics` - Statistics only (faster)
- `GET /analytics/plots/types` - Available plot types

## 📊 Services

### Model Service

Located in `app/services/model_service.py`

**Features:**

- Load trained models dynamically
- Make predictions on single samples or batches
- Support for CSV and JSON input
- Confidence scoring
- Probability distributions

**Key Functions:**

```python
load_model(model_path: str) -> tuple
predict(data: pd.DataFrame) -> tuple
predict_proba(data: pd.DataFrame) -> np.ndarray
get_model_info() -> dict
```

### Analytics Service

Located in `app/services/analytics_service.py`

**Features:**

- Generate comprehensive statistics
- Create 7+ visualization types
- ROC curves and confusion matrices
- Feature importance rankings
- Performance metrics calculation

**Available Plots:**

1. Class Distribution - Bar chart of predictions
2. Confusion Matrix - Heatmap (requires ground truth)
3. Confidence Distribution - Histogram & box plot
4. Probability Heatmap - Probability distributions
5. ROC Curves - Multi-class ROC (requires ground truth)
6. Feature Importance - Rankings (if supported)
7. Class Probability Comparison - Violin plots

**Key Functions:**

```python
calculate_statistics(predictions, probabilities, y_true=None) -> dict
generate_complete_analytics(df, predictions, probabilities, y_true=None) -> dict
```

## 🧪 Testing

### Run API Tests

```powershell
python test_api.py
```

### Manual Testing with cURL

#### Health Check

```bash
curl http://localhost:8000/health
```

#### Upload CSV for Prediction

```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@../data/test_data.csv"
```

#### JSON Prediction

```bash
curl -X POST "http://localhost:8000/predict/json" \
  -H "Content-Type: application/json" \
  -d '{"data": {"koi_period": 9.488, "koi_duration": 2.9575, ...}}'
```

### Testing with Python

```python
import requests

# Health check
response = requests.get("http://localhost:8000/health")
print(response.json())

# Predict from CSV
files = {"file": open("../data/test_data.csv", "rb")}
response = requests.post("http://localhost:8000/predict", files=files)
print(response.json())
```

## 📝 Examples

See `examples.py` for complete usage examples:

```powershell
python examples.py
```

## 🔧 Configuration

### Port Configuration

Edit `main.py` to change the port:

```python
uvicorn.run(
    "app.main:app",
    host="0.0.0.0",
    port=8000,  # Change port here
    reload=True
)
```

### CORS Configuration

Edit `app/main.py` to configure CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Model Selection

The API automatically loads the latest RandomForest model. To use a different model, edit `app/services/model_service.py`:

```python
# Find and modify the model pattern
model_files = glob.glob(str(models_dir / "RandomForest*.joblib"))
# Change to: "GradientBoosting*.joblib", "SVM*.joblib", etc.
```

## 🚀 Deployment

### Development

```powershell
python main.py
```

### Production with Gunicorn

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Docker Deployment

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
COPY models/ ./models/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t exoplanet-api .
docker run -p 8000:8000 exoplanet-api
```

## 📚 Dependencies

Core dependencies (from `../requirements.txt`):

- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **pandas** - Data manipulation
- **scikit-learn** - Machine learning
- **joblib** - Model serialization
- **matplotlib** - Plotting
- **seaborn** - Statistical visualization
- **python-multipart** - File uploads

## 🐛 Troubleshooting

### Model Not Found

```
FileNotFoundError: No model files found
```

**Solution**: Train a model first:

```powershell
cd ../src
python training_v3.py
```

### Port Already in Use

```
OSError: [Errno 48] Address already in use
```

**Solution**: Change port in `main.py` or kill the process:

```powershell
# Find process on port 8000
netstat -ano | findstr :8000
# Kill process (replace PID)
taskkill /PID <PID> /F
```

### CORS Errors

**Solution**: Update CORS settings in `app/main.py` to include your frontend origin.

## 📖 Documentation

- **API_DOCS.md** - Complete API reference with examples
- **Project README** - Main project documentation (`../README.md`)
- **Swagger UI** - Interactive API documentation (http://localhost:8000/docs)

## 🤝 Contributing

When adding new endpoints:

1. Add route in `app/api/routes.py`
2. Implement logic in appropriate service
3. Update `API_DOCS.md` with new endpoint
4. Add tests in `test_api.py`
5. Update this README

## 📄 License

MIT License - See `../LICENSE` file for details

---

**Last Updated**: October 5, 2025  
**Version**: 1.0.0
