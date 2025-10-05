# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# North Star - Exoplanet Discovery Frontend

A modern, professional web application for analyzing exoplanet data using machine learning. Built with React, TypeScript, and Material-UI.

## 🌟 Features

### Dashboard

- **Model Overview**: View key information about the loaded ML model
- **Performance Metrics**: Real-time display of model status and capabilities
- **Quick Navigation**: Easy access to all features via interactive chips

### Predictions

- **Batch Upload**: Upload CSV files for bulk predictions
- **Single Prediction**: Manual form entry for individual predictions
- **Confidence Scores**: View prediction probabilities for all classes
- **Results Visualization**: Interactive tables and charts

### Analytics

- **Comprehensive Reports**: Generate detailed analytics from uploaded datasets
- **Performance Metrics**: Accuracy, F1 score, precision, and recall
- **Visualizations**:
  - Confusion matrices
  - ROC curves
  - Feature importance
  - Class distribution
  - Confidence histograms
  - Probability heatmaps
- **Statistics Dashboard**: Detailed statistical analysis of predictions

### Model Information

- **Feature Details**: Complete list of numeric and categorical features
- **Model Capabilities**: Overview of supported operations
- **Technical Specifications**: Model type, path, and configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8000

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit: http://localhost:5174

## 🛠️ Technology Stack

- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Material-UI v6**: Professional component library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API calls
- **Vite**: Fast build tool and dev server

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Predict.tsx
│   │   ├── Analytics.tsx
│   │   └── ModelInfo.tsx
│   ├── services/        # API configuration
│   │   └── api.ts
│   ├── theme/          # Material-UI theme
│   │   └── theme.ts
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## 🎨 Theme

The application uses a custom dark theme with a space-inspired color palette:

- **Primary**: Light blue (#64b5f6) - Space/Sky
- **Secondary**: Purple (#ce93d8) - Nebula
- **Background**: Deep space blue (#0a0e27)

## 🔌 API Integration

The frontend communicates with the backend API at `http://localhost:8000`. All API endpoints are configured in `src/services/api.ts`.

### Available Endpoints:

- `GET /model/info` - Model information
- `GET /model/metrics` - Model metrics
- `GET /model/features` - Feature details
- `POST /predict` - Single prediction
- `POST /predict/batch` - Batch predictions
- `POST /predict/json` - JSON prediction
- `POST /analytics` - Generate analytics

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Usage Guide

### Making Predictions

1. **Batch Upload**:

   - Navigate to Predict page
   - Select "Batch Upload" tab
   - Choose a CSV file with exoplanet data
   - Click "Upload and Predict"
   - View results in the table

2. **Single Prediction**:
   - Navigate to Predict page
   - Select "Single Prediction" tab
   - Fill in the feature values
   - Click "Get Prediction"
   - View the classification and confidence score

### Generating Analytics

1. Navigate to Analytics page
2. Upload a CSV file (optionally with ground truth labels)
3. Click "Generate Analytics"
4. Explore the comprehensive results:
   - Performance metrics
   - Class distributions
   - Visualizations (expandable accordions)

### Viewing Model Details

1. Navigate to Model Info page
2. Review model specifications
3. Explore feature lists
4. Check supported capabilities

## 🏆 NASA Space Apps Challenge

This application was built for the NASA Space Apps Challenge to demonstrate:

- ✅ AI/ML model for exoplanet classification
- ✅ Interactive web interface for researchers and novices
- ✅ Comprehensive analytics and visualizations
- ✅ Real-time predictions with confidence scores
- ✅ Batch processing capabilities
- ✅ Model transparency and interpretability

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributors

Built with ❤️ for the NASA Space Apps Challenge

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
