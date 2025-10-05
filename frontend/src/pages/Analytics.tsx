import { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { CloudUpload, ExpandMore, Assessment } from "@mui/icons-material";
import apiClient from "../services/api.ts";

interface AnalyticsResult {
  statistics: any;
  plots: Record<string, string>;
  summary: any;
}

const Analytics = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResult | null>(
    null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
      setAnalyticsData(null);
    }
  };

  const handleAnalytics = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/analytics", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnalyticsData(response.data.analytics);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate analytics");
      console.error("Error generating analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Analytics Dashboard
      </Typography>

      <Stack spacing={3}>
        {/* Upload Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload Dataset for Analysis
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Upload a CSV file with exoplanet data to generate comprehensive
              analytics including confusion matrices, feature importance, ROC
              curves, and more.
            </Alert>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
              >
                Choose CSV File
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {file && (
                <Chip
                  label={file.name}
                  onDelete={() => {
                    setFile(null);
                    setAnalyticsData(null);
                  }}
                />
              )}
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{ mt: 2 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalytics}
              disabled={!file || loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <Assessment />
              }
              sx={{ mt: 2 }}
            >
              {loading ? "Generating Analytics..." : "Generate Analytics"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {loading && (
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CircularProgress />
                <Typography>
                  Analyzing dataset and generating visualizations...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {analyticsData && (
          <>
            {/* Summary Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analysis Summary
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Chip
                    label={`Total Samples: ${
                      analyticsData.summary?.total_samples || 0
                    }`}
                    color="primary"
                  />
                  <Chip
                    label={`Predictions: ${
                      analyticsData.summary?.predictions_generated || 0
                    }`}
                    color="secondary"
                  />
                  <Chip
                    label={`Plots Generated: ${
                      analyticsData.summary?.plots_generated || 0
                    }`}
                    color="success"
                  />
                  <Chip
                    label={`Model: ${
                      analyticsData.summary?.model_name || "N/A"
                    }`}
                  />
                  {analyticsData.summary?.has_ground_truth && (
                    <Chip label="Ground Truth Available" color="info" />
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            {analyticsData.statistics && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statistical Analysis
                  </Typography>
                  <Stack spacing={2}>
                    {/* Performance Metrics */}
                    {analyticsData.statistics.performance_metrics && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Performance Metrics
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: 2,
                          }}
                        >
                          {Object.entries(
                            analyticsData.statistics.performance_metrics
                          ).map(([key, value]: [string, any]) => (
                            <Box key={key}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {key.replace(/_/g, " ").toUpperCase()}
                              </Typography>
                              <Typography variant="h6" color="primary">
                                {typeof value === "number"
                                  ? (value * 100).toFixed(2) + "%"
                                  : value}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    )}

                    {/* Class Distribution */}
                    {analyticsData.statistics.class_distribution && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Class Distribution
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {Object.entries(
                            analyticsData.statistics.class_distribution
                          ).map(([cls, data]: [string, any]) => (
                            <Chip
                              key={cls}
                              label={`${cls}: ${data.count} (${data.percentage}%)`}
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Paper>
                    )}

                    {/* Confidence Statistics */}
                    {analyticsData.statistics.confidence_statistics && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Confidence Statistics
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(120px, 1fr))",
                            gap: 2,
                          }}
                        >
                          {Object.entries(
                            analyticsData.statistics.confidence_statistics
                          ).map(([key, value]: [string, any]) => (
                            <Box key={key}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {key.toUpperCase()}
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {(value * 100).toFixed(2)}%
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Visualizations */}
            {analyticsData.plots &&
              Object.keys(analyticsData.plots).length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Visualizations
                    </Typography>
                    <Stack spacing={2}>
                      {Object.entries(analyticsData.plots).map(
                        ([plotName, plotData]) => (
                          <Accordion
                            key={plotName}
                            defaultExpanded={plotName === "confusion_matrix"}
                          >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {plotName
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "background.paper",
                                  borderRadius: 1,
                                  p: 2,
                                }}
                              >
                                <img
                                  src={`data:image/png;base64,${plotData}`}
                                  alt={plotName}
                                  style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    borderRadius: "8px",
                                  }}
                                />
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        )
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}
          </>
        )}

        {/* Instructions when no data */}
        {!analyticsData && !loading && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How to Use Analytics
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    1. Prepare Your Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload a CSV file containing exoplanet features. The file
                    can optionally include a target column (koi_disposition,
                    target, label, or class) for ground truth comparison.
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    2. Generate Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click "Generate Analytics" to run the model on your data and
                    create comprehensive visualizations including confusion
                    matrices, ROC curves, feature importance, and more.
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    3. Explore Results
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review performance metrics, class distributions, confidence
                    statistics, and interactive visualizations to understand
                    your model's performance.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export default Analytics;
