# Backend - Exoplanet Classification API

FastAPI-based REST API for real-time exoplanet classification using trained machine learning models.

## 🚀 Quick Start

### Start the Server

**Windows PowerShell:**
```powershell
.\start_server.ps1
```

**Linux/Mac:**
```bash
chmod +x start_server.sh
./start_server.sh
```

**Or manually:**
```bash
pip install -r requirements.txt
python main.py
```

The server will start at **http://localhost:8000**

## 📚 Documentation

- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Complete API Reference**: [API_DOCS.md](API_DOCS.md)

## 🏗️ Architecture

```
backend/
├── main.py              # FastAPI application with endpoints
├── model_utils.py       # Model loading and prediction logic
├── requirements.txt     # Python dependencies
├── API_DOCS.md         # Complete API documentation
├── start_server.ps1    # Windows startup script
└── start_server.sh     # Linux/Mac startup script
```

## 🔌 Key Features

✅ **Multiple Endpoints**
- File upload (CSV)
- JSON input
- Batch predictions
- Model information

✅ **Production Ready**
- Error handling
- CORS support
- Request validation
- Automatic documentation

✅ **High Performance**
- Async operations
- Efficient preprocessing
- Cached model loading

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check |
| `/model/info` | GET | Model metadata |
| `/model/features` | GET | Expected features |
| `/model/metrics` | GET | Model performance |
| `/predict` | POST | Upload CSV for predictions |
| `/predict/batch` | POST | Detailed predictions |
| `/predict/json` | POST | JSON input prediction |
| `/analytics` | POST | Full analytics with plots |
| `/analytics/statistics` | POST | Statistics only (faster) |
| `/analytics/plots/types` | GET | Available plot types |

## 💡 Usage Examples

### Upload CSV File

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_data.csv"
```

### Python Client

```python
import requests

# Upload file
url = "http://localhost:8000/predict"
files = {"file": open("test_data.csv", "rb")}
response = requests.post(url, files=files)
print(response.json())

# JSON prediction
url = "http://localhost:8000/predict/json"
data = {
    "data": {
        "koi_period": 9.488,
        "koi_duration": 2.957,
        # ... other features
    }
}
response = requests.post(url, json=data)
print(response.json())

# Get analytics with plots
url = "http://localhost:8000/analytics"
files = {"file": open("test_data.csv", "rb")}
response = requests.post(url, files=files)
analytics = response.json()['analytics']

# Access statistics
stats = analytics['statistics']
print(f"Accuracy: {stats['performance_metrics']['accuracy']}")

# Save plots
import base64
for plot_name, plot_base64 in analytics['plots'].items():
    img_data = base64.b64decode(plot_base64)
    with open(f"{plot_name}.png", "wb") as f:
        f.write(img_data)
```

### JavaScript/TypeScript

```javascript
// File upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:8000/predict', {
  method: 'POST',
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🔧 Configuration

### Port Configuration
Edit `main.py`:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8000)
```

### CORS Configuration
Edit `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Model Selection
The service automatically loads the RandomForest model. To use a different model, edit `model_utils.py`:
```python
# Look for specific model
model_files = list(models_dir.glob("GradientBoosting_*.joblib"))
```

## 📦 Dependencies

- **fastapi**: Web framework
- **uvicorn**: ASGI server
- **pandas**: Data manipulation
- **scikit-learn**: ML model support
- **joblib**: Model serialization
- **python-multipart**: File upload support

## 🚀 Production Deployment

### Using Gunicorn

```bash
gunicorn main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  -b 0.0.0.0:8000
```

### Using Docker

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

For production, consider using environment variables:
```python
import os

PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False") == "True"
```

## 🔒 Security Considerations

For production deployment:

1. **Enable HTTPS**: Use reverse proxy (nginx/traefik)
2. **Add Authentication**: Implement API keys or OAuth2
3. **Rate Limiting**: Prevent abuse
4. **CORS**: Restrict allowed origins
5. **Input Validation**: Already implemented with Pydantic

## 🧪 Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:8000/health

# Model info
curl http://localhost:8000/model/info

# Upload test file
curl -X POST http://localhost:8000/predict \
  -F "file=@../data/merged_all_missions.csv"
```

## 📊 Response Format

### Success Response
```json
{
  "status": "success",
  "predictions": ["CONFIRMED", "CANDIDATE"],
  "probabilities": [[0.05, 0.92, 0.03], [0.15, 0.75, 0.10]],
  "metrics": {
    "total_predictions": 2,
    "class_distribution": {
      "CONFIRMED": 1,
      "CANDIDATE": 1
    },
    "average_confidence": 0.835
  },
  "timestamp": "2025-10-05T13:45:30.123456"
}
```

### Error Response
```json
{
  "detail": "File must be a CSV"
}
```

## 🐛 Troubleshooting

### Model Not Found
```
Error: No model file found in models directory
```
**Solution**: Train models first using `cd ../src && python training_v3.py`

### Port Already in Use
```
Error: [Errno 48] Address already in use
```
**Solution**: Change port in `main.py` or kill the process using port 8000

### Import Errors
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution**: Install dependencies: `pip install -r requirements.txt`

## 📖 Additional Resources

- [Complete API Documentation](API_DOCS.md)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Main Project README](../README.md)

## 🤝 Support

For issues or questions:
1. Check the [API Documentation](API_DOCS.md)
2. Review server logs for error details
3. Test endpoints using Swagger UI at `/docs`
