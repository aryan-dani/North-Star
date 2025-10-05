import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
  Stack,
  Chip,
  Paper,
  Slider,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import {
  Upload as UploadIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  DataUsage as DataIcon,
} from "@mui/icons-material";
import api from "../services/api.ts";

interface HyperparameterInfo {
  type: string;
  default: any;
  min?: number;
  max?: number;
  options?: string[];
  description: string;
}

interface Hyperparameters {
  [key: string]: HyperparameterInfo;
}

interface TrainingProgress {
  progress: number;
  stage: string;
  message: string;
  metrics?: {
    accuracy?: number;
    f1_score?: number;
    precision?: number;
    recall?: number;
  };
}

interface ValidationResult {
  valid: boolean;
  issues: string[];
  warnings: string[];
  n_samples: number;
  n_features: number;
  target_column: string;
}

const TrainingStudio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState("RandomForest");
  const [targetColumn, setTargetColumn] = useState("koi_disposition");
  const [testSize, setTestSize] = useState(0.2);
  const [hyperparameters, setHyperparameters] = useState<Hyperparameters>({});
  const [paramValues, setParamValues] = useState<{ [key: string]: any }>({});
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [validating, setValidating] = useState(false);

  const modelOptions = [
    { value: "RandomForest", label: "Random Forest" },
    { value: "GradientBoosting", label: "Gradient Boosting" },
    { value: "SVM", label: "Support Vector Machine" },
    { value: "DecisionTree", label: "Decision Tree" },
    { value: "LogisticRegression", label: "Logistic Regression" },
    { value: "KNN", label: "K-Nearest Neighbors" },
  ];

  useEffect(() => {
    loadHyperparameters();
  }, [selectedModel]);

  const loadHyperparameters = async () => {
    try {
      const response = await api.get(
        `/training/hyperparameters/${selectedModel}`
      );
      setHyperparameters(response.data.hyperparameters);

      // Initialize param values with defaults
      const defaults: { [key: string]: any } = {};
      Object.entries(response.data.hyperparameters).forEach(
        ([key, info]: [string, any]) => {
          defaults[key] = info.default;
        }
      );
      setParamValues(defaults);
    } catch (err) {
      console.error("Error loading hyperparameters:", err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setValidation(null);
      setResult(null);
      setError(null);
    }
  };

  const handleValidate = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setValidating(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_column", targetColumn);

    try {
      const response = await api.post("/training/validate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValidation(response.data.validation);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error validating data");
    } finally {
      setValidating(false);
    }
  };

  const handleTrain = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    if (!validation || !validation.valid) {
      setError("Please validate data first");
      return;
    }

    setTraining(true);
    setError(null);
    setResult(null);
    setProgress({ progress: 0, stage: "starting", message: "Starting..." });

    // Generate session ID for WebSocket
    const sessionId = `training_${Date.now()}`;

    // Connect to WebSocket for real-time updates
    const ws = new WebSocket(`ws://localhost:8000/ws/training/${sessionId}`);

    ws.onopen = () => {
      console.log("WebSocket connected for training updates");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "training_progress") {
          setProgress({
            progress: data.progress,
            stage: data.stage,
            message: data.message,
            metrics: data.metrics,
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_name", selectedModel);
    formData.append("target_column", targetColumn);
    formData.append("test_size", testSize.toString());
    formData.append("session_id", sessionId);

    try {
      const response = await api.post("/training/train", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data.result);

      // Close WebSocket after training completes
      setTimeout(() => {
        ws.close();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error training model");
      setProgress(null);
      ws.close();
    } finally {
      setTraining(false);
    }
  };

  const handleParamChange = (param: string, value: any) => {
    setParamValues((prev) => ({ ...prev, [param]: value }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Training Studio
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Train custom models with your own data and hyperparameters. Upload a CSV
        file, configure settings, and track training progress in real-time.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Data Upload Section */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <DataIcon color="primary" />
              <Typography variant="h6">1. Upload Training Data</Typography>
            </Box>

            <Stack spacing={2}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                {file ? file.name : "Select CSV File"}
                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </Button>

              <TextField
                label="Target Column"
                value={targetColumn}
                onChange={(e) => setTargetColumn(e.target.value)}
                fullWidth
                helperText="Name of the column containing the target variable"
              />

              <Box>
                <Button
                  variant="contained"
                  onClick={handleValidate}
                  disabled={!file || validating}
                  fullWidth
                >
                  {validating ? "Validating..." : "Validate Data"}
                </Button>
              </Box>

              {validation && (
                <Paper sx={{ p: 2, bgcolor: "background.default" }}>
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {validation.valid ? (
                        <>
                          <CheckIcon color="success" />
                          <Typography color="success.main">
                            Data is valid
                          </Typography>
                        </>
                      ) : (
                        <>
                          <ErrorIcon color="error" />
                          <Typography color="error.main">
                            Data has issues
                          </Typography>
                        </>
                      )}
                    </Box>

                    <Box>
                      <Chip
                        label={`${validation.n_samples} samples`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`${validation.n_features} features`}
                        size="small"
                      />
                    </Box>

                    {validation?.issues?.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="error">
                          Issues:
                        </Typography>
                        {validation.issues.map((issue, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            color="error"
                            sx={{ ml: 2 }}
                          >
                            • {issue}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    {validation?.warnings?.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="warning.main">
                          Warnings:
                        </Typography>
                        {validation.warnings.map((warning, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 2 }}
                          >
                            • {warning}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Model Selection Section */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SettingsIcon color="primary" />
              <Typography variant="h6">2. Configure Model</Typography>
            </Box>

            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Model Type</InputLabel>
                <Select
                  value={selectedModel}
                  label="Model Type"
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {modelOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography gutterBottom>Train/Test Split</Typography>
                <Slider
                  value={testSize * 100}
                  onChange={(_, value) => setTestSize((value as number) / 100)}
                  min={10}
                  max={40}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}% test`}
                />
                <FormHelperText>
                  Percentage of data used for testing:{" "}
                  {(testSize * 100).toFixed(0)}%
                </FormHelperText>
              </Box>

              {/* Hyperparameters */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Hyperparameters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {Object.entries(hyperparameters).map(
                      ([param, info]: [string, any]) => (
                        <Box key={param}>
                          {info.type === "int" || info.type === "float" ? (
                            <Box>
                              <Typography gutterBottom variant="body2">
                                {param.replace(/_/g, " ").toUpperCase()}
                              </Typography>
                              <Slider
                                value={paramValues[param] || info.default}
                                onChange={(_, value) =>
                                  handleParamChange(param, value)
                                }
                                min={info.min}
                                max={info.max}
                                step={info.type === "int" ? 1 : 0.01}
                                marks={
                                  info.max - info.min < 20
                                    ? true
                                    : [
                                        { value: info.min, label: info.min },
                                        { value: info.max, label: info.max },
                                      ]
                                }
                                valueLabelDisplay="auto"
                              />
                              <FormHelperText>
                                {info.description}
                              </FormHelperText>
                            </Box>
                          ) : info.type === "select" ? (
                            <FormControl fullWidth size="small">
                              <InputLabel>{param}</InputLabel>
                              <Select
                                value={paramValues[param] || info.default}
                                label={param}
                                onChange={(e) =>
                                  handleParamChange(param, e.target.value)
                                }
                              >
                                {info.options?.map((option: string) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {info.description}
                              </FormHelperText>
                            </FormControl>
                          ) : null}
                        </Box>
                      )
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </CardContent>
        </Card>

        {/* Training Section */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PlayIcon color="primary" />
              <Typography variant="h6">3. Train Model</Typography>
            </Box>

            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={training ? null : <PlayIcon />}
                onClick={handleTrain}
                disabled={training || !validation?.valid}
                fullWidth
              >
                {training ? "Training..." : "Start Training"}
              </Button>

              {progress && (
                <Paper sx={{ p: 2, bgcolor: "background.default" }}>
                  <Stack spacing={1}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="text.secondary">
                        {progress.message}
                      </Typography>
                      <Chip
                        label={`${progress.progress}%`}
                        size="small"
                        color="primary"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress.progress}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Stage: {progress.stage}
                    </Typography>

                    {progress.metrics && (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: "primary.dark",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
                        >
                          Real-time Metrics:
                        </Typography>
                        <Box display="flex" gap={2} flexWrap="wrap">
                          {progress.metrics.accuracy !== undefined && (
                            <Chip
                              size="small"
                              label={`Accuracy: ${(
                                progress.metrics.accuracy * 100
                              ).toFixed(2)}%`}
                              color="success"
                            />
                          )}
                          {progress.metrics.f1_score !== undefined && (
                            <Chip
                              size="small"
                              label={`F1: ${progress.metrics.f1_score.toFixed(
                                4
                              )}`}
                            />
                          )}
                          {progress.metrics.precision !== undefined && (
                            <Chip
                              size="small"
                              label={`Precision: ${progress.metrics.precision.toFixed(
                                4
                              )}`}
                            />
                          )}
                          {progress.metrics.recall !== undefined && (
                            <Chip
                              size="small"
                              label={`Recall: ${progress.metrics.recall.toFixed(
                                4
                              )}`}
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}

              {result && (
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "success.dark",
                    border: "1px solid",
                    borderColor: "success.main",
                  }}
                >
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckIcon color="success" />
                      <Typography variant="h6" color="success.light">
                        Training Complete!
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Model Performance
                      </Typography>
                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Chip
                          label={`Accuracy: ${(
                            result.metrics.accuracy * 100
                          ).toFixed(2)}%`}
                          color="success"
                        />
                        <Chip
                          label={`F1 Score: ${(
                            result.metrics.f1_macro * 100
                          ).toFixed(2)}%`}
                          color="success"
                        />
                        <Chip
                          label={`Precision: ${(
                            result.metrics.precision_macro * 100
                          ).toFixed(2)}%`}
                          color="success"
                        />
                        <Chip
                          label={`Recall: ${(
                            result.metrics.recall_macro * 100
                          ).toFixed(2)}%`}
                          color="success"
                        />
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="success.light">
                        Model saved: {result.training_id}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {result.model_path}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default TrainingStudio;
