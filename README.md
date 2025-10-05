# North-Star: Exoplanet Candidate Classification

🏆 **NASA Space Apps Challenge 2025 Submission**  
🌟 **Challenge**: "A World Away: Hunting for Exoplanets with AI"

North-Star is a comprehensive full-stack machine learning web application for identifying and classifying exoplanet candidates from the NASA Kepler catalog. Developed for the NASA Space Apps Challenge 2025, this project demonstrates the power of AI in astronomical discovery.

## ✨ Project Highlights

- **🎯 76% Classification Accuracy**: Random Forest model trained on 24 features
- **🌐 Full-Stack Web Application**: React + TypeScript frontend with FastAPI backend
- **🤖 Multi-Model System**: 7 trained ML algorithms with easy model switching
- **📊 Comprehensive Analytics**: Confusion matrices, ROC curves, feature importance, and more
- **⚡ Real-Time Training**: WebSocket-powered training studio with live progress tracking
- **🎨 Modern UI**: Material-UI v7 with custom space-themed dark mode
- **📚 Educational**: Extensive learning resources about exoplanets and machine learning

## 🚀 Key Features

### For Users

- **Upload & Predict**: Batch prediction on CSV files or manual single predictions
- **Interactive Analytics**: Generate 7+ visualization types with comprehensive metrics
- **Model Comparison**: Switch between Random Forest, Gradient Boosting, SVM, and more
- **Data Visualization**: Dynamic charts updating with your analytics data
- **Learning Resources**: Comprehensive educational content about exoplanet science

### For Developers

- **REST API**: 11+ endpoints with automatic OpenAPI documentation
- **WebSocket Support**: Real-time bidirectional communication for training updates
- **Custom Training**: Train new models with your own data and hyperparameters
- **Production-Ready**: Complete with error handling, logging, and validation

## 🏗️ Technology Stack

**Backend:**

- Python 3.13 with FastAPI
- scikit-learn for ML models
- pandas & NumPy for data processing
- WebSockets for real-time updates

**Frontend:**

- React 19 with TypeScript
- Material-UI v7 components
- Vite for fast development
- Axios for API calls

**Machine Learning:**

- Random Forest (76% accuracy)
- Gradient Boosting
- Support Vector Machine
- Decision Tree
- Logistic Regression
- K-Nearest Neighbors
- Naive Bayes

## 🚀 Quick Start

### Complete Setup (Frontend + Backend)

**Backend:**

```powershell
# Install Python dependencies
pip install -r requirements.txt

# Start the API server
cd backend
python main.py
```

Access at: http://localhost:8000/docs

**Frontend:**

```powershell
# Install Node dependencies
cd frontend
npm install

# Start the development server
npm run dev
```

Access at: http://localhost:5174

### Training Models

```powershell
cd src
python training_v3.py
```

### 📚 Documentation

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Comprehensive project documentation
- **[backend/README.md](backend/README.md)** - Backend setup and API details
- **[backend/API_DOCS.md](backend/API_DOCS.md)** - Complete API reference
- **[frontend/README.md](frontend/README.md)** - Frontend setup and usage

## 📁 Repository Layout

```
North-Star/
├── frontend/              # React + TypeScript web interface
│   ├── src/
│   │   ├── components/   # UI components (Header, Sidebar, Layout)
│   │   ├── pages/        # 8 pages: Dashboard, Predict, Analytics, etc.
│   │   ├── services/     # API integration & analytics store
│   │   └── theme/        # Material-UI space theme
│   └── README.md
├── backend/              # FastAPI REST API backend
│   ├── app/
│   │   ├── main.py      # FastAPI application
│   │   ├── api/         # API routes with WebSocket support
│   │   └── services/    # Model, analytics, training, WebSocket services
│   ├── main.py          # Server entry point
│   ├── API_DOCS.md      # Complete API documentation
│   └── README.md
├── src/                 # Training scripts
│   ├── training_v3.py   # Multi-model pipeline ⭐
│   ├── training_v2.py   # Enhanced training
│   └── train_model.py   # Basic training
├── models/              # Trained model artifacts (.joblib files)
├── data/                # Dataset storage
│   ├── merged_all_missions.csv
│   └── raw/
├── output/              # Training results and visualizations
├── docs/                # Documentation & reference papers
├── requirements.txt     # Python dependencies
├── PROJECT_OVERVIEW.md  # Comprehensive project documentation
└── README.md            # This file
```

## 🎯 NASA Space Apps Challenge 2025

### The Challenge

"A World Away: Hunting for Exoplanets with AI" challenges participants to develop AI/ML solutions for analyzing data from space missions like NASA's Kepler, TESS, and others to identify and classify exoplanet candidates.

### Our Solution: North Star

We created a complete end-to-end system that:

1. **Processes Real NASA Data**: Uses actual Kepler mission data with 24 features
2. **Multi-Model Approach**: Trains and compares 7 different ML algorithms
3. **Interactive Web Platform**: User-friendly interface for predictions and analysis
4. **Educational Focus**: Comprehensive learning resources about exoplanet science
5. **Production-Ready**: Fully documented API with WebSocket support for real-time updates

### Impact & Innovation

- **Scalable**: Can process millions of candidates faster than manual analysis
- **Accessible**: Web-based interface makes exoplanet research available to everyone
- **Educational**: Helps students and enthusiasts understand both astronomy and ML
- **Open Source**: Fully documented for reproduction and further development

Learn more about the challenge: [NASA Space Apps Challenge](https://www.spaceappschallenge.org/2025/challenges/a-world-away-hunting-for-exoplanets-with-ai/)

## 📁 Repository Layout

```
North-Star/
├── frontend/              # React + TypeScript web interface
│   ├── src/
│   │   ├── components/   # UI components (Header, Sidebar, Layout)
│   │   ├── pages/        # Dashboard, Predict, Analytics, ModelInfo
│   │   ├── services/     # API integration
│   │   └── theme/        # Material-UI space theme
│   └── README.md
├── backend/              # FastAPI REST API backend
│   ├── app/
│   │   ├── main.py      # FastAPI application
│   │   ├── api/         # API routes
│   │   └── services/    # Model & analytics services
│   ├── main.py          # Server entry point
│   ├── API_DOCS.md      # Complete API documentation
│   └── README.md
├── src/                 # Training scripts
│   ├── training_v3.py   # Multi-model pipeline ⭐
│   ├── training_v2.py   # Enhanced training
│   └── train_model.py   # Basic training
├── models/              # Trained model artifacts (.joblib files)
├── data/                # Dataset storage
│   ├── merged_all_missions.csv
│   └── raw/
├── output/              # Training results and visualizations
├── docs/                # Documentation & reference papers
├── requirements.txt     # Python dependencies
├── PROJECT_OVERVIEW.md  # Comprehensive project documentation
└── README.md            # This file
```

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

| Endpoint          | Method | Description                     |
| ----------------- | ------ | ------------------------------- |
| `/`               | GET    | API information                 |
| `/health`         | GET    | Health check                    |
| `/model/info`     | GET    | Model metadata                  |
| `/model/features` | GET    | Expected features               |
| `/predict`        | POST   | Upload CSV for predictions      |
| `/predict/batch`  | POST   | Detailed row-by-row predictions |
| `/predict/json`   | POST   | JSON input prediction           |

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

Edit `backend/app/main.py` to configure:

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
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
COPY models/ ./models/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
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
