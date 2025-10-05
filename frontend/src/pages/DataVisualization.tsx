import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Assessment as ChartIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import api from "../services/api.ts";
import { getAnalyticsData } from "../services/analyticsStore.ts";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`viz-tabpanel-${index}`}
      aria-labelledby={`viz-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DataVisualization: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [featureData, setFeatureData] = useState({
    total_features: 41,
    numeric_features: 38,
    categorical_features: 3,
  });

  useEffect(() => {
    loadModelInfo();
    loadAnalyticsData();

    // Listen for analytics updates
    const handleAnalyticsUpdate = () => {
      loadAnalyticsData();
    };
    window.addEventListener("analyticsUpdated", handleAnalyticsUpdate);

    return () => {
      window.removeEventListener("analyticsUpdated", handleAnalyticsUpdate);
    };
  }, []);

  const loadAnalyticsData = () => {
    const data = getAnalyticsData();
    if (data) {
      setAnalyticsData(data);
      if (data.summary) {
        setFeatureData({
          total_features: data.summary.total_samples || 41,
          numeric_features: 38,
          categorical_features: 3,
        });
      }
    }
  };

  const loadModelInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get("/model/info");
      setModelInfo(response.data);
    } catch (err: any) {
      console.error("Error loading model info:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        <ChartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Data Visualization & Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {analyticsData
          ? "Showing visualizations from your uploaded dataset!"
          : "Upload a dataset in Analytics to see comprehensive visualizations."}
      </Typography>

      <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 300px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Dataset Overview
              </Typography>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Total Samples:</Typography>
                  <Chip
                    label={featureData.total_features}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Numeric Features:</Typography>
                  <Chip label={featureData.numeric_features} size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Categorical:</Typography>
                  <Chip label={featureData.categorical_features} size="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 300px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Current Model
              </Typography>
              {modelInfo && !loading ? (
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Model Type:</Typography>
                    <Chip
                      label={modelInfo.model_name || "RandomForest"}
                      size="small"
                      color="secondary"
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Accuracy:</Typography>
                    <Chip
                      label={`${((modelInfo.accuracy || 0.76) * 100).toFixed(
                        2
                      )}%`}
                      size="small"
                      color="success"
                    />
                  </Box>
                </Stack>
              ) : (
                <CircularProgress size={24} />
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 300px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Quick Actions
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                fullWidth
                onClick={() => {
                  loadModelInfo();
                  loadAnalyticsData();
                }}
                disabled={loading}
              >
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Distributions & Plots" />
          <Tab label="Confusion Matrix" />
          <Tab label="Feature Importance" />
          <Tab label="Statistics & Quality" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Feature Distributions & Class Plots
          </Typography>

          <Stack spacing={2}>
            {analyticsData && analyticsData.plots ? (
              <>
                <Alert severity="success">
                  Showing visualizations from{" "}
                  {analyticsData.summary?.total_samples || 0} samples!
                </Alert>

                {analyticsData.plots.class_distribution && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Class Distribution
                      </Typography>
                      <Box
                        component="img"
                        src={`data:image/png;base64,${analyticsData.plots.class_distribution}`}
                        alt="Class Distribution"
                        sx={{ width: "100%", maxWidth: 800, height: "auto" }}
                      />
                    </CardContent>
                  </Card>
                )}

                {analyticsData.plots.confidence_distribution && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Prediction Confidence Distribution
                      </Typography>
                      <Box
                        component="img"
                        src={`data:image/png;base64,${analyticsData.plots.confidence_distribution}`}
                        alt="Confidence Distribution"
                        sx={{ width: "100%", maxWidth: 800, height: "auto" }}
                      />
                    </CardContent>
                  </Card>
                )}

                {analyticsData.plots.class_probability_comparison && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Class Probability Comparison
                      </Typography>
                      <Box
                        component="img"
                        src={`data:image/png;base64,${analyticsData.plots.class_probability_comparison}`}
                        alt="Class Probability Comparison"
                        sx={{ width: "100%", maxWidth: 800, height: "auto" }}
                      />
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Alert severity="info" icon={<InfoIcon />}>
                No visualizations available. Upload your dataset in the{" "}
                <strong>Analytics</strong> page to generate beautiful charts!
              </Alert>
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Confusion Matrix & ROC Curves
          </Typography>

          <Stack spacing={2}>
            {analyticsData && analyticsData.plots ? (
              <>
                {analyticsData.plots.confusion_matrix && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Confusion Matrix
                      </Typography>
                      <Box
                        component="img"
                        src={`data:image/png;base64,${analyticsData.plots.confusion_matrix}`}
                        alt="Confusion Matrix"
                        sx={{ width: "100%", maxWidth: 800, height: "auto" }}
                      />
                    </CardContent>
                  </Card>
                )}

                {analyticsData.plots.roc_curves && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        ROC Curves (Multi-class)
                      </Typography>
                      <Box
                        component="img"
                        src={`data:image/png;base64,${analyticsData.plots.roc_curves}`}
                        alt="ROC Curves"
                        sx={{ width: "100%", maxWidth: 800, height: "auto" }}
                      />
                    </CardContent>
                  </Card>
                )}

                {!analyticsData.plots.confusion_matrix &&
                  !analyticsData.plots.roc_curves && (
                    <Alert severity="warning">
                      Confusion matrix and ROC curves require ground truth
                      labels. Make sure your CSV includes the target column!
                    </Alert>
                  )}
              </>
            ) : (
              <Alert severity="info" icon={<InfoIcon />}>
                Confusion matrix and ROC curves will appear after uploading a
                dataset with labels in the Analytics page.
              </Alert>
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Feature Importance
          </Typography>

          <Stack spacing={2}>
            {analyticsData && analyticsData.plots?.feature_importance ? (
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Top Features Ranked by Importance
                  </Typography>
                  <Box
                    component="img"
                    src={`data:image/png;base64,${analyticsData.plots.feature_importance}`}
                    alt="Feature Importance"
                    sx={{ width: "100%", maxWidth: 800, height: "auto" }}
                  />
                </CardContent>
              </Card>
            ) : (
              <>
                <Alert severity="info" icon={<InfoIcon />}>
                  Feature importance visualization available in Model Info page
                  or after uploading dataset in Analytics.
                </Alert>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      View Current Model's Feature Importance
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      See which features contribute most to predictions using
                      the current {modelInfo?.model_name || "RandomForest"}{" "}
                      model.
                    </Typography>
                    <Button variant="contained" href="/model-info">
                      Go to Model Info
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Statistics & Data Quality
          </Typography>

          <Stack spacing={2}>
            {analyticsData && analyticsData.statistics ? (
              <>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Dataset Statistics
                    </Typography>
                    <Stack spacing={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">
                          Total Predictions:
                        </Typography>
                        <Chip
                          label={analyticsData.statistics.total_predictions}
                          size="small"
                          color="primary"
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Unique Classes:</Typography>
                        <Chip
                          label={analyticsData.statistics.unique_classes}
                          size="small"
                          color="secondary"
                        />
                      </Box>
                      {analyticsData.statistics.performance_metrics && (
                        <>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">Accuracy:</Typography>
                            <Chip
                              label={`${(
                                analyticsData.statistics.performance_metrics
                                  .accuracy * 100
                              ).toFixed(2)}%`}
                              size="small"
                              color="success"
                            />
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">
                              F1 Score (Macro):
                            </Typography>
                            <Chip
                              label={analyticsData.statistics.performance_metrics.f1_macro.toFixed(
                                4
                              )}
                              size="small"
                            />
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">
                              Precision (Macro):
                            </Typography>
                            <Chip
                              label={analyticsData.statistics.performance_metrics.precision_macro.toFixed(
                                4
                              )}
                              size="small"
                            />
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">
                              Recall (Macro):
                            </Typography>
                            <Chip
                              label={analyticsData.statistics.performance_metrics.recall_macro.toFixed(
                                4
                              )}
                              size="small"
                            />
                          </Box>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                {analyticsData.plots.probability_heatmap && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Probability Heatmap
                      </Typography>
                      <Box
                        component="img"
                        src={`data:image/png;base64,${analyticsData.plots.probability_heatmap}`}
                        alt="Probability Heatmap"
                        sx={{ width: "100%", maxWidth: 800, height: "auto" }}
                      />
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Alert severity="info" icon={<InfoIcon />}>
                Data quality metrics will appear after uploading a dataset in
                the Analytics page.
              </Alert>
            )}
          </Stack>
        </TabPanel>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>💡 Tip:</strong> Upload your CSV file in the{" "}
            <strong>Analytics</strong> page to generate all visualizations here
            automatically! Includes confusion matrices, ROC curves, feature
            importance, and more.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default DataVisualization;
