# North Star - Project Overview

## 🌟 NASA Space Apps Challenge 2025 Submission

**Project**: Exoplanet Discovery & Classification System  
**Date**: October 2025  
**Technology Stack**: Python, FastAPI, React, TypeScript, Machine Learning

---

## 📋 Executive Summary

North Star is a comprehensive machine learning web application designed to identify and classify exoplanet candidates from NASA's Kepler mission data. The system combines a high-performance Python backend with a modern React frontend to provide researchers and enthusiasts with powerful tools for exoplanet analysis.

### Key Achievements
- ✅ **76.05% Classification Accuracy** with RandomForest model
- ✅ **24 Features** including orbital parameters and stellar properties
- ✅ **3 Target Classes**: CANDIDATE, CONFIRMED, FALSE POSITIVE
- ✅ **Full-Stack Implementation** with REST API and interactive UI
- ✅ **Comprehensive Analytics** with 7+ visualization types

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + TypeScript + Material-UI + Vite                    │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │Dashboard │ Predict  │Analytics │ModelInfo │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST API
                      │ (localhost:8000)
┌─────────────────────▼───────────────────────────────────────┐
│                        BACKEND                               │
│  FastAPI + Python + scikit-learn                            │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │  Model   │Analytics │ Routes   │Services  │             │
│  │ Service  │ Service  │ (API)    │          │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Model Artifacts
┌─────────────────────▼───────────────────────────────────────┐
│                     DATA LAYER                               │
│  ┌────────────┬──────────────┬──────────────┐              │
│  │ ML Models  │   Datasets   │   Outputs    │              │
│  │ (.joblib)  │    (.csv)    │  (metrics)   │              │
│  └────────────┴──────────────┴──────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Directory Structure

```
North-Star/
│
├── frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.tsx      # App bar with gradient
│   │   │   ├── Sidebar.tsx     # Navigation drawer
│   │   │   └── Layout.tsx      # Main layout wrapper
│   │   ├── pages/              # Route pages
│   │   │   ├── Dashboard.tsx   # Model overview & stats
│   │   │   ├── Predict.tsx     # Prediction interface
│   │   │   ├── Analytics.tsx   # Visualization dashboard
│   │   │   └── ModelInfo.tsx   # Model documentation
│   │   ├── services/           # API integration
│   │   │   └── api.ts          # Axios instance
│   │   ├── theme/              # Material-UI theme
│   │   │   └── theme.ts        # Space-themed dark mode
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   └── README.md
│
├── backend/                     # FastAPI backend service
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app definition
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py       # API endpoints
│   │   └── services/
│   │       ├── model_service.py    # ML predictions
│   │       └── analytics_service.py # Analytics & plots
│   ├── main.py                 # Server entry point
│   ├── examples.py             # Usage examples
│   ├── test_api.py             # API tests
│   └── API_DOCS.md             # Complete API documentation
│
├── src/                         # Training scripts
│   ├── __init__.py
│   ├── train_model.py          # Basic training
│   ├── training_v2.py          # Enhanced training
│   └── training_v3.py          # Multi-model pipeline ⭐
│
├── models/                      # Trained model artifacts
│   ├── RandomForest_*.joblib   # Best model (76% accuracy)
│   ├── GradientBoosting_*.joblib
│   ├── SVM_*.joblib
│   └── ... (other models)
│
├── data/                        # Datasets
│   ├── merged_all_missions.csv # Main training data
│   ├── raw/
│   │   └── cumulative.csv      # Raw Kepler data
│   └── README.md
│
├── output/                      # Training results
│   ├── model_results_*.csv     # Performance metrics
│   ├── confusion_matrix_*.png  # Visualizations
│   ├── feature_info_*.json     # Feature metadata
│   └── training_metadata_*.json
│
├── docs/                        # Documentation
│   ├── reference-papers/       # Research papers
│   └── README.md
│
├── requirements.txt             # Python dependencies
├── README.md                    # Main documentation
├── LICENSE
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
└── .gitignore
```

---

## 🚀 Features

### Backend Features
1. **Model Service**
   - Load trained ML models dynamically
   - Make predictions on single samples or batches
   - Support for CSV and JSON input formats
   - Confidence scoring and probability distributions

2. **Analytics Service**
   - Generate comprehensive performance metrics
   - Create 7+ visualization types
   - Statistical analysis of predictions
   - ROC curves and confusion matrices
   - Feature importance rankings

3. **REST API**
   - 11+ endpoints for various operations
   - Swagger UI for interactive testing
   - File upload support (CSV)
   - JSON-based predictions
   - Health checks and model info

### Frontend Features
1. **Dashboard**
   - Real-time model status display
   - Quick statistics overview
   - Performance metrics visualization
   - Quick navigation to features

2. **Prediction Interface**
   - Batch CSV upload for bulk predictions
   - Manual form for single predictions
   - Results table with confidence scores
   - Probability visualization

3. **Analytics Dashboard**
   - Upload datasets for comprehensive analysis
   - Interactive plot accordions
   - Statistics cards with key metrics
   - Base64 image rendering
   - Export-ready visualizations

4. **Model Information**
   - Feature documentation
   - Model capabilities overview
   - Technical specifications
   - Training metadata

### Design Features
- 🌌 **Space-themed dark mode** UI
- 🎨 **Gradient effects** and professional styling
- 📱 **Responsive design** for all screen sizes
- ♿ **Accessible** interface following WCAG guidelines
- 🚀 **Fast loading** with optimized React components

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.10+ | Core language |
| FastAPI | 0.104+ | Web framework |
| scikit-learn | 1.4+ | Machine learning |
| pandas | 2.0+ | Data manipulation |
| NumPy | 1.26+ | Numerical computing |
| matplotlib | 3.8+ | Plotting |
| seaborn | 0.13+ | Statistical visualization |
| joblib | 1.3+ | Model serialization |
| uvicorn | 0.24+ | ASGI server |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1+ | UI library |
| TypeScript | 5.9+ | Type safety |
| Material-UI | 7.3+ | Component library |
| React Router | 7.9+ | Routing |
| Axios | 1.12+ | HTTP client |
| Vite | 7.1+ | Build tool |
| Emotion | 11.14+ | CSS-in-JS |

---

## 📊 Machine Learning Models

### Training Pipeline
The project uses `training_v3.py` to train multiple models:

1. **Logistic Regression** - Baseline linear model
2. **Random Forest** ⭐ - Best performer (76.05% accuracy)
3. **Gradient Boosting** - Ensemble method
4. **Support Vector Machine** - Non-linear classifier
5. **Decision Tree** - Interpretable model
6. **K-Nearest Neighbors** - Instance-based learning
7. **Naive Bayes** - Probabilistic classifier

### Model Performance
- **Training Samples**: 16,985
- **Test Samples**: 4,246
- **Features**: 24 (20 numeric, 4 categorical)
- **Classes**: 3 (CANDIDATE, CONFIRMED, FALSE POSITIVE)
- **Best Accuracy**: 76.05% (RandomForest)
- **Training Time**: ~30 seconds per model

### Feature Engineering
- Numeric features: Orbital parameters, stellar magnitudes, signal characteristics
- Categorical features: Mission ID, object names
- Preprocessing: StandardScaler for numeric, OneHotEncoder for categorical
- Pipeline: Integrated preprocessing + model training

---

## 🎯 NASA Space Apps Challenge Alignment

### Challenge Requirements
✅ **Analyze Exoplanet Data**: Uses official NASA Kepler catalog  
✅ **Machine Learning**: 7 trained models with ensemble techniques  
✅ **Web Interface**: Professional full-stack application  
✅ **User Accessibility**: Designed for researchers AND novices  
✅ **Data Visualization**: 7+ plot types with interactive displays  
✅ **Batch Processing**: Handle large CSV files efficiently  
✅ **Real-time Predictions**: Sub-second response times  
✅ **Model Transparency**: Feature importance and confidence scores  
✅ **Documentation**: Comprehensive guides and API docs  
✅ **Open Source**: MIT License with contribution guidelines

### Innovation Points
1. **Multi-Model Comparison**: Train and compare 7 different algorithms
2. **Comprehensive Analytics**: Generate publication-ready visualizations
3. **Professional UI/UX**: Space-themed design matching the domain
4. **Full-Stack Solution**: Backend API + Frontend interface
5. **Extensible Architecture**: Easy to add new models or features

---

## 🚦 Quick Start

### Backend Setup
```powershell
# Install dependencies
pip install -r requirements.txt

# Start the API server
cd backend
python main.py
```

**Access**: http://localhost:8000/docs

### Frontend Setup
```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access**: http://localhost:5174

### Training Models
```powershell
# Train all models
cd src
python training_v3.py
```

---

## 📈 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check |
| `/model/info` | GET | Model metadata |
| `/model/metrics` | GET | Performance metrics |
| `/model/features` | GET | Feature list |
| `/predict` | POST | Single file prediction |
| `/predict/batch` | POST | Detailed predictions |
| `/predict/json` | POST | JSON prediction |
| `/analytics` | POST | Full analytics report |
| `/analytics/statistics` | POST | Statistics only |
| `/analytics/plots/types` | GET | Available plots |

**Full documentation**: See `backend/API_DOCS.md`

---

## 🧪 Testing

### Backend Tests
```powershell
cd backend
python test_api.py
```

### Frontend Tests
```powershell
cd frontend
npm run lint
npm run build  # Test production build
```

---

## 📝 Documentation

- **Main README**: Project overview and setup
- **Frontend README**: Frontend-specific guide (`frontend/README.md`)
- **API Documentation**: Complete API reference (`backend/API_DOCS.md`)
- **Data README**: Dataset information (`data/README.md`)
- **This Document**: Comprehensive project overview

---

## 🤝 Contributing

We welcome contributions! Please see:
- `CONTRIBUTING.md` - Contribution guidelines
- `CODE_OF_CONDUCT.md` - Community standards
- `SECURITY.md` - Security policies

---

## 📄 License

MIT License - See `LICENSE` file for details

---

## 🏆 Team & Credits

Built with ❤️ for NASA Space Apps Challenge 2025

**Dataset**: NASA Exoplanet Archive - Kepler Mission  
**Inspiration**: Discovering new worlds beyond our solar system

---

## 🔮 Future Enhancements

- [ ] Add more visualization types (3D scatter plots, t-SNE)
- [ ] Implement model retraining through UI
- [ ] Add user authentication and saved predictions
- [ ] Support for multiple mission datasets (TESS, K2)
- [ ] Real-time streaming predictions
- [ ] Deployment to cloud platforms
- [ ] Mobile-responsive improvements
- [ ] Dark/light theme toggle
- [ ] Export reports as PDF
- [ ] Integration with NASA API for latest data

---

**Last Updated**: October 5, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
