import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import apiClient from "../services/api.ts";

interface Model {
  name: string;
  path: string;
  filename: string;
  timestamp: string;
  is_loaded: boolean;
}

interface ModelsResponse {
  status: string;
  models: Model[];
  total: number;
  current_model: string;
}

const Models = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [currentModel, setCurrentModel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [switching, setSwitching] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching models from /models/available...");
      const response = await apiClient.get<ModelsResponse>("/models/available");
      console.log("✅ Response received:", response.data);
      console.log("📊 Models array:", response.data?.models);
      console.log("🎯 Current model:", response.data?.current_model);
      
      // Defensive checks for undefined/null data
      const modelsArray = Array.isArray(response.data?.models) ? response.data.models : [];
      console.log("📋 Setting models state:", modelsArray);
      setModels(modelsArray);
      setCurrentModel(response.data?.current_model || "No model loaded");
      setError(null);
      console.log("✅ State updated successfully");
    } catch (err: any) {
      console.error("❌ Error fetching models:", err);
      setError(err.response?.data?.detail || "Failed to fetch models");
      console.error("Error fetching models:", err);
      // Set safe defaults on error
      setModels([]);
      setCurrentModel("No model loaded");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSwitchModel = async (modelName: string) => {
    try {
      setSwitching(modelName);
      await apiClient.post("/models/switch", { model_name: modelName });
      await fetchModels();
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || `Failed to switch to ${modelName}`
      );
      console.error("Error switching model:", err);
    } finally {
      setSwitching(null);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      if (!isoString) return "N/A";
      const date = new Date(isoString);
      return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
    } catch {
      return "N/A";
    }
  };

  const getModelDescription = (name: string) => {
    const descriptions: { [key: string]: string } = {
      RandomForest:
        "Ensemble learning method using multiple decision trees for robust predictions",
      GradientBoosting:
        "Boosting technique building trees sequentially to correct previous errors",
      SVM: "Support Vector Machine using hyperplanes for classification",
      DecisionTree:
        "Single tree-based model making decisions based on feature thresholds",
      KNN: "K-Nearest Neighbors classifying based on proximity to training samples",
      LogisticRegression:
        "Linear model using logistic function for probability estimation",
      best_model: "Automatically selected best performing model from training",
    };
    return descriptions[name] || "Machine learning classification model";
  };

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Model Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View and switch between available trained models. Each model has
        different characteristics and performance.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Current Model Card */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #1a237e 0%, #0a0e27 100%)",
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6">Currently Active Model</Typography>
              </Box>
              <Box>
                <Chip
                  label={currentModel || "No model loaded"}
                  color={currentModel && currentModel !== "No model loaded" ? "success" : "default"}
                  sx={{ fontSize: "1.1rem", py: 2.5, px: 1 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {currentModel ? getModelDescription(currentModel) : "No active model"}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* All Models Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Available Models ({models?.length ?? 0})
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Model Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Trained On</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(models || []).map((model) => (
                    <TableRow
                      key={model.filename}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(100, 181, 246, 0.05)",
                        },
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={model.name}
                          color={model.is_loaded ? "primary" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {getModelDescription(model.name)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {formatDate(model.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {model.is_loaded ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Active"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="Available"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {!model.is_loaded && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={
                              switching === model.name ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                <SwapHorizIcon />
                              )
                            }
                            onClick={() => handleSwitchModel(model.name)}
                            disabled={switching !== null}
                          >
                            {switching === model.name
                              ? "Switching..."
                              : "Switch"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Model Information Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Model Descriptions
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="primary">
                  Random Forest
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Creates multiple decision trees and combines their
                  predictions. Excellent for handling complex patterns and
                  resistant to overfitting. Generally provides the best balance
                  of accuracy and speed.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="primary">
                  Gradient Boosting
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Builds trees sequentially, each correcting errors from
                  previous ones. Can achieve very high accuracy but may require
                  more computational resources.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="primary">
                  Support Vector Machine (SVM)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Finds optimal hyperplanes to separate classes. Works well with
                  high-dimensional data and when classes are clearly separable.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="primary">
                  K-Nearest Neighbors (KNN)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Classifies based on the majority class among k-nearest
                  training examples. Simple and interpretable but can be slow
                  with large datasets.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="primary">
                  Logistic Regression
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fast linear model that predicts probabilities. Good baseline
                  model and works well when decision boundaries are roughly
                  linear.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="primary">
                  Decision Tree
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Single tree making decisions based on feature thresholds.
                  Highly interpretable but prone to overfitting without proper
                  tuning.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Models;
