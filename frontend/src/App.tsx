import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import theme from "./theme/theme.ts";
import Layout from "./components/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Predict from "./pages/Predict.tsx";
import Analytics from "./pages/Analytics.tsx";
import ModelInfo from "./pages/ModelInfo.tsx";
import Models from "./pages/Models.tsx";
import Learn from "./pages/Learn.tsx";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/model-info" element={<ModelInfo />} />
            <Route path="/models" element={<Models />} />
            <Route path="/learn" element={<Learn />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
