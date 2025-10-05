# North-Star: Exoplanet Candidate Classification

North-Star is a complete machine learning web application for identifying and classifying exoplanet candidates from the NASA Kepler catalog. The project includes:
- **Multiple ML Models**: Random Forest, Gradient Boosting, SVM, Decision Trees, and more
- **REST API Backend**: FastAPI-powered service for real-time predictions
- **Production-Ready**: Trained models with comprehensive evaluation metrics
- **Scalable Architecture**: Easy integration with frontend applications

## 🚀 Quick Start

### Backend API (Recommended)

```powershell
cd backend
pip install -r requirements.txt
python main.py
```

Access the API:
- **Swagger UI**: http://localhost:8000/docs
- **API Endpoint**: http://localhost:8000/predict

### Training Models

```powershell
cd src
python training_v3.py
```

## 📁 Repository Layout

```
North-Star/
├── backend/              # FastAPI REST API backend
│   ├── main.py          # FastAPI application with endpoints
│   ├── model_utils.py   # Model loading and prediction utilities
│   ├── requirements.txt # Backend dependencies
│   └── API_DOCS.md      # Complete API documentation
├── data/                # Dataset storage
│   ├── merged_all_missions.csv  # Combined dataset
│   ├── README.md
│   └── raw/
├── docs/
│   ├── reference-papers/ # Research papers and references
│   └── *.png            # Model evaluation visualizations
├── models/              # Trained model artifacts (.joblib files)
│   ├── best_model_*.joblib
│   ├── RandomForest_*.joblib
│   └── ... (other trained models)
├── output/              # Training results and visualizations
│   ├── model_results_*.csv
│   ├── confusion_matrix_*.png
│   └── training_metadata_*.json
├── src/                 # Training scripts
│   ├── __init__.py
│   ├── train_model.py   # Original training script
│   ├── training_v2.py   # Enhanced training with metrics
│   └── training_v3.py   # Multi-model training pipeline
├── requirements.txt     # Project dependencies
└── README.md
```

> ⚠️ PDF content is not parsed programmatically here. Review the files in
> `docs/reference-papers/` directly for the full research context.

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10 or higher
- pip or conda package manager

### Option 1: Virtual Environment (Recommended)

```powershell
# Create virtual environment
python -m venv .venv

# Activate (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Activate (Windows CMD)
.venv\Scripts\activate.bat

# Activate (Linux/Mac)
source .venv/bin/activate

# Install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Option 2: Conda Environment

```bash
conda create -n north-star python=3.10
conda activate north-star
pip install -r requirements.txt
```

### Data

1. Download the Kepler `cumulative.csv` file from the
   [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/).
2. Place the file in `data/raw/cumulative.csv`.
3. Optional helper datasets (for example `merged_all_missions.csv`) should
   also live under `data/raw/`.

Large raw files should be ignored in version control; consider using Git LFS
or storing download instructions instead of committing the raw data.

## 🎯 Usage

### 1. Training Models

The project includes three training scripts with increasing sophistication:

#### Basic Training (`train_model.py`)
```bash
cd src
python train_model.py
```
Trains a single RandomForest model with basic metrics.

#### Enhanced Training (`training_v2.py`)
```bash
cd src
python training_v2.py
```
Includes detailed metrics, visualizations, and progress tracking.

#### Multi-Model Training (`training_v3.py` - Recommended)
```bash
cd src
python training_v3.py
```

**Features:**
- Trains 7+ models (RandomForest, GradientBoosting, SVM, etc.)
- Saves all models to `../models/` directory
- Generates comprehensive evaluation metrics
- Creates visualizations (confusion matrices, comparison charts)
- Exports results to `../output/` directory
- Timestamped outputs for version tracking

**Output includes:**
- Individual model files: `{ModelName}_{timestamp}.joblib`
- Best model: `best_model_classification_{timestamp}.joblib`
- Results CSV with all metrics
- Confusion matrix visualization
- Model comparison charts
- Training metadata JSON

### 2. Backend API

#### Start the Server

```bash
cd backend
python main.py
```

The API will start at: **http://localhost:8000**

#### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs (Try out endpoints)
- **ReDoc**: http://localhost:8000/redoc (API reference)

#### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check |
| `/model/info` | GET | Model metadata |
| `/model/features` | GET | Expected features |
| `/predict` | POST | Upload CSV for predictions |
| `/predict/batch` | POST | Detailed row-by-row predictions |
| `/predict/json` | POST | JSON input prediction |

#### Example: Make Predictions

**Using cURL:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@data/test_data.csv"
```

**Using Python:**
```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("data/test_data.csv", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

**Response:**
```json
{
  "status": "success",
  "filename": "test_data.csv",
  "total_rows": 100,
  "predictions": ["CONFIRMED", "CANDIDATE", "..."],
  "probabilities": [[0.05, 0.92, 0.03], ...],
  "metrics": {
    "total_predictions": 100,
    "class_distribution": {
      "CONFIRMED": 45,
      "CANDIDATE": 30,
      "FALSE POSITIVE": 25
    },
    "average_confidence": 0.8523
  }
}
```

For complete API documentation, see [`backend/API_DOCS.md`](backend/API_DOCS.md).

## 🧪 Models & Performance

### Available Models
- **RandomForest** (Best Performance) ⭐
- Gradient Boosting
- Support Vector Machine (SVM)
- Decision Tree
- Logistic Regression
- K-Nearest Neighbors
- Naive Bayes (Classification only)

### Model Selection
The backend automatically loads the **RandomForest** model, which achieved the best accuracy during training. All trained models are saved in the `models/` directory with timestamps.

## 📊 Dataset

### Source
NASA Exoplanet Archive - Kepler Objects of Interest (KOI) dataset

### Features
- **24 features** including orbital parameters, stellar properties, and observational data
- **Target classes**: CANDIDATE, CONFIRMED, FALSE POSITIVE
- **Preprocessing**: Automated handling of numeric and categorical features

### Data Location
```
data/merged_all_missions.csv  # Main dataset
data/raw/                     # Raw data storage
```

## 🔧 Configuration

### Backend Configuration
Edit `backend/main.py` to configure:
- Port number (default: 8000)
- CORS origins (for production)
- Model selection

### Model Configuration
Edit `src/training_v3.py` to adjust:
- Model hyperparameters
- Train/test split ratio
- Feature engineering
- Output directories

## 🚀 Deployment

### Production Deployment

#### Using Gunicorn
```bash
cd backend
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

#### Using Docker
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
COPY models/ ../models/
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t north-star-api .
docker run -p 8000:8000 north-star-api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 Future Enhancements

- [ ] Frontend web interface for file upload and visualization
- [ ] Real-time prediction streaming
- [ ] Model retraining API endpoint
- [ ] A/B testing between models
- [ ] Feature importance visualization
- [ ] Batch processing for large datasets
- [ ] Model versioning and rollback
- [ ] Authentication and rate limiting
- [ ] Kubernetes deployment configuration

## References

- NASA Exoplanet Archive — Kepler Objects of Interest (KOI) Cumulative Table.
- See `docs/reference-papers/` for the attached research papers that motivate
  the modelling direction.
