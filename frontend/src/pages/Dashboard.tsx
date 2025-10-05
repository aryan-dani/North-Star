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
} from "@mui/material";
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Stack spacing={3}>
        {/* Top Row - Model Info and Features */}
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
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Features
                      </Typography>
                      <Typography variant="body1">
                        {modelInfo.n_features} (
                        <strong>{modelInfo.numeric_features}</strong> numeric,{" "}
                        <strong>{modelInfo.categorical_features}</strong>{" "}
                        categorical)
                      </Typography>
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

          {/* Model Status Card */}
          <Box sx={{ flex: "1 1 300px", minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Model Status
                </Typography>
                {metrics && (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label="Ready"
                        color="success"
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    {metrics.note && (
                      <Alert severity="info" sx={{ py: 0.5 }}>
                        <Typography variant="body2">{metrics.note}</Typography>
                      </Alert>
                    )}
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Model Path
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          wordBreak: "break-all",
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        {modelInfo?.model_path
                          ?.split(/[\\/]/)
                          .slice(-2)
                          .join("/")}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Welcome Message */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Welcome to North Star 🌟
            </Typography>
            <Typography variant="body1" paragraph>
              This application uses machine learning to analyze exoplanet data
              and predict whether celestial objects are confirmed exoplanets,
              candidates, or false positives.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Navigate using the sidebar to explore predictions, analytics, and
              detailed model information.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
              <Chip
                label="📊 View Analytics"
                clickable
                onClick={() => (window.location.href = "/analytics")}
              />
              <Chip
                label="🔮 Make Predictions"
                clickable
                onClick={() => (window.location.href = "/predict")}
              />
              <Chip
                label="ℹ️ Model Details"
                clickable
                onClick={() => (window.location.href = "/model-info")}
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Dashboard;
