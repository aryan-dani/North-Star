import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Alert,
  Stack,
  Chip,
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DatasetIcon from "@mui/icons-material/Dataset";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import apiClient from "../services/api.ts";

interface ModelInfo {
  model_name: string;
  model_type: string;
  model_path: string;
  n_features: number | string;
  target_classes: string[] | null;
  numeric_features: number;
  categorical_features: number;
}

interface ModelMetrics {
  model_name: string;
  note?: string;
  [key: string]: any;
}

const Dashboard = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [infoResponse, metricsResponse] = await Promise.all([
          apiClient.get("/model/info"),
          apiClient.get("/model/metrics"),
        ]);

        console.log("Model Info:", infoResponse.data);
        console.log("Metrics:", metricsResponse.data);

        setModelInfo(infoResponse.data);
        setMetrics(metricsResponse.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch model data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const extractTimestamp = (path: string) => {
    const match = path.match(/(\\d{8}_\\d{6})/);
    if (match) {
      const timestamp = match[1];
      const year = timestamp.substring(0, 4);
      const month = timestamp.substring(4, 6);
      const day = timestamp.substring(6, 8);
      const hour = timestamp.substring(9, 11);
      const minute = timestamp.substring(11, 13);
      return `${year}-${month}-${day} ${hour}:${minute}`;
    }
    return "Unknown";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Loading model data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  const trainingDate = modelInfo?.model_path
    ? extractTimestamp(modelInfo.model_path)
    : "Unknown";

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Real-time overview of your exoplanet classification system
      </Typography>

      <Stack spacing={3}>
        {/* Top Statistics Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 3,
          }}
        >
          {/* Active Model Card */}
          <Card
            sx={{
              background: "linear-gradient(135deg, #1a237e 0%, #0a0e27 100%)",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Active Model
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>
                {modelInfo?.model_name || "N/A"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {modelInfo?.model_type || "classification"}
              </Typography>
            </CardContent>
          </Card>

          {/* Accuracy Card */}
          <Card
            sx={{
              background: "linear-gradient(135deg, #004d40 0%, #0a0e27 100%)",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUpIcon color="success" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Model Accuracy
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>
                76.05%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={76}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                color="success"
              />
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card
            sx={{
              background: "linear-gradient(135deg, #311b92 0%, #0a0e27 100%)",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <DatasetIcon color="info" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Total Features
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>
                {modelInfo?.n_features || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {modelInfo?.numeric_features || 0} numeric,{" "}
                {modelInfo?.categorical_features || 0} categorical
              </Typography>
            </CardContent>
          </Card>

          {/* Training Date Card */}
          <Card
            sx={{
              background: "linear-gradient(135deg, #4a148c 0%, #0a0e27 100%)",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AccessTimeIcon color="secondary" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Trained On
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={600}>
                {trainingDate.split(" ")[0]}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {trainingDate.split(" ")[1] || ""}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Model Details Row */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {/* Model Info Card */}
          <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Model Information
                </Typography>
                {modelInfo && (
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Model Name
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {modelInfo.model_name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Type
                      </Typography>
                      <Chip
                        label={modelInfo.model_type}
                        color="primary"
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Box>
                    {modelInfo.target_classes && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Target Classes
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            mt: 0.5,
                          }}
                        >
                          {modelInfo.target_classes.map((cls) => (
                            <Chip key={cls} label={cls} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Performance Metrics Card */}
          <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Accuracy
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LinearProgress
                        variant="determinate"
                        value={76}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                        color="success"
                      />
                      <Typography variant="body2" fontWeight={600}>
                        76%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      F1 Score (est.)
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LinearProgress
                        variant="determinate"
                        value={74}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                        color="info"
                      />
                      <Typography variant="body2" fontWeight={600}>
                        74%
                      </Typography>
                    </Box>
                  </Box>
                  {metrics?.note && (
                    <Alert severity="info" sx={{ py: 0.5 }}>
                      <Typography variant="body2">{metrics.note}</Typography>
                    </Alert>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Welcome Card */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #1a237e 20%, #0a0e27 100%)",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight={600}
                sx={{ mb: 0 }}
              >
                Welcome to North Star 🌟
              </Typography>
              <Chip
                label="NASA Space Apps 2025"
                color="warning"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body1" paragraph>
              This application uses machine learning to analyze exoplanet data
              from NASA's Kepler mission and predict whether celestial objects
              are confirmed exoplanets, candidates, or false positives.
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>🏆 NASA Space Apps Challenge 2025 Submission</strong>
                <br />
                "A World Away: Hunting for Exoplanets with AI" - A complete ML
                platform for exoplanet discovery with 7 trained models,
                real-time training, and comprehensive analytics.
              </Typography>
            </Alert>
            <Typography variant="body2" color="text.secondary" paragraph>
              Our RandomForest model analyzes 24 different features including
              orbital parameters, transit characteristics, and stellar
              properties to make accurate classifications with ~76% accuracy.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 3 }}>
              <Chip
                label="🔮 Make Predictions"
                clickable
                color="primary"
                onClick={() => (window.location.href = "/predict")}
                sx={{ px: 1 }}
              />
              <Chip
                label="📊 View Analytics"
                clickable
                color="secondary"
                onClick={() => (window.location.href = "/analytics")}
                sx={{ px: 1 }}
              />
              <Chip
                label="🤖 Switch Models"
                clickable
                onClick={() => (window.location.href = "/models")}
                sx={{ px: 1 }}
              />
              <Chip
                label="🎓 Train Custom Model"
                clickable
                color="success"
                onClick={() => (window.location.href = "/training")}
                sx={{ px: 1 }}
              />
              <Chip
                label="📚 Learn More"
                clickable
                color="info"
                onClick={() => (window.location.href = "/learn")}
                sx={{ px: 1 }}
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Dashboard;
