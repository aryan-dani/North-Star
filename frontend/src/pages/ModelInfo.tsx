import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore, Info } from "@mui/icons-material";
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

interface FeatureInfo {
  numeric: string[];
  categorical: string[];
  all: string[];
}

const ModelInfo = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [features, setFeatures] = useState<FeatureInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [infoResponse, featuresResponse] = await Promise.all([
          apiClient.get("/model/info"),
          apiClient.get("/model/features"),
        ]);

        setModelInfo(infoResponse.data);
        setFeatures(featuresResponse.data.features);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.detail || "Failed to fetch model information"
        );
        console.error("Error fetching model info:", err);
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
        Model Information
      </Typography>

      <Stack spacing={3}>
        {/* Model Overview Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Info color="primary" />
              <Typography variant="h6">Model Overview</Typography>
            </Box>
            {modelInfo && (
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Model Name
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {modelInfo.model_name}
                  </Typography>
                </Paper>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 2,
                  }}
                >
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type
                    </Typography>
                    <Chip
                      label={modelInfo.model_type}
                      color="primary"
                      sx={{ textTransform: "capitalize", mt: 1 }}
                    />
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Features
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {modelInfo.n_features}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Numeric Features
                    </Typography>
                    <Typography variant="h6" color="secondary">
                      {modelInfo.numeric_features}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Categorical Features
                    </Typography>
                    <Typography variant="h6" color="info.main">
                      {modelInfo.categorical_features}
                    </Typography>
                  </Paper>
                </Box>

                {modelInfo.target_classes && (
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Target Classes ({modelInfo.target_classes.length})
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}
                    >
                      {modelInfo.target_classes.map((cls) => (
                        <Chip key={cls} label={cls} color="success" />
                      ))}
                    </Box>
                  </Paper>
                )}

                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Model Path
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      wordBreak: "break-all",
                      display: "block",
                      mt: 1,
                      fontFamily: "monospace",
                      backgroundColor: "background.default",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    {modelInfo.model_path}
                  </Typography>
                </Paper>
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Feature Details */}
        {features && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feature Details
              </Typography>

              <Stack spacing={2}>
                {/* Numeric Features */}
                {features.numeric && features.numeric.length > 0 && (
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          Numeric Features
                        </Typography>
                        <Chip
                          label={features.numeric.length}
                          size="small"
                          color="secondary"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell>Feature Name</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {features.numeric.map((feature, idx) => (
                              <TableRow key={feature}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell sx={{ fontFamily: "monospace" }}>
                                  {feature}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Categorical Features */}
                {features.categorical && features.categorical.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          Categorical Features
                        </Typography>
                        <Chip
                          label={features.categorical.length}
                          size="small"
                          color="info"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell>Feature Name</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {features.categorical.map((feature, idx) => (
                              <TableRow key={feature}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell sx={{ fontFamily: "monospace" }}>
                                  {feature}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Model Capabilities */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Model Capabilities
            </Typography>
            <Stack spacing={2}>
              <Alert severity="info">
                This model is a <strong>{modelInfo?.model_name}</strong>{" "}
                classifier trained to identify exoplanets from observational
                data.
              </Alert>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Supported Operations
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label="Single Predictions"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label="Batch Predictions"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label="Probability Estimates"
                    color="secondary"
                    variant="outlined"
                  />
                  <Chip
                    label="Confidence Scores"
                    color="secondary"
                    variant="outlined"
                  />
                  <Chip
                    label="Feature Importance"
                    color="info"
                    variant="outlined"
                  />
                  <Chip
                    label="Analytics Generation"
                    color="success"
                    variant="outlined"
                  />
                </Box>
              </Paper>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ModelInfo;
