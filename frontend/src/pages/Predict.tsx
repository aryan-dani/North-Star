import { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Tabs,
  Tab,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CloudUpload, SendRounded } from "@mui/icons-material";
import apiClient from "../services/api.ts";

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
      id={`prediction-tabpanel-${index}`}
      aria-labelledby={`prediction-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Predict = () => {
  const [tabValue, setTabValue] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchResults, setBatchResults] = useState<any>(null);
  const [singleResult, setSingleResult] = useState<any>(null);

  // Manual entry form state
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setBatchResults(null);
    setSingleResult(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleBatchUpload = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/predict/batch", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBatchResults(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to process file");
      console.error("Error uploading file:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSinglePrediction = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert form data to proper types (numbers where applicable)
      const data: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        const numValue = parseFloat(value);
        data[key] = isNaN(numValue) ? value : numValue;
      });

      const response = await apiClient.post("/predict/json", { data });
      setSingleResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to make prediction");
      console.error("Error making prediction:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Make Predictions
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Batch Upload" />
            <Tab label="Single Prediction" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Batch Upload Tab */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <Alert severity="info">
                Upload a CSV file containing exoplanet data. The file should
                include all required features for prediction.
              </Alert>

              <Box>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
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
                    onDelete={() => setFile(null)}
                    sx={{ ml: 2 }}
                  />
                )}
              </Box>

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleBatchUpload}
                disabled={!file || loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SendRounded />
                }
              >
                {loading ? "Processing..." : "Upload and Predict"}
              </Button>

              {batchResults && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Results
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Chip
                        label={`Total Rows: ${batchResults.total_rows}`}
                        color="primary"
                      />
                      {batchResults.summary?.predictions_by_class &&
                        Object.entries(
                          batchResults.summary.predictions_by_class
                        ).map(([cls, data]: [string, any]) => (
                          <Chip
                            key={cls}
                            label={`${cls}: ${data.count} (${data.percentage}%)`}
                          />
                        ))}
                    </Box>

                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Row ID</TableCell>
                            <TableCell>Prediction</TableCell>
                            <TableCell>Confidence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {batchResults.predictions_detail
                            ?.slice(0, 10)
                            .map((pred: any) => (
                              <TableRow key={pred.row_id}>
                                <TableCell>{pred.row_id}</TableCell>
                                <TableCell>
                                  <Chip label={pred.prediction} size="small" />
                                </TableCell>
                                <TableCell>
                                  {(pred.confidence * 100).toFixed(2)}%
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {batchResults.predictions_detail?.length > 10 && (
                      <Typography variant="caption" color="text.secondary">
                        Showing first 10 of{" "}
                        {batchResults.predictions_detail.length} predictions
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          </TabPanel>

          {/* Single Prediction Tab */}
          <TabPanel value={tabValue} index={1}>
            <Stack spacing={3}>
              <Alert severity="info">
                Enter values for key features. Numeric fields are required for
                prediction. Leave categorical fields empty if unknown.
              </Alert>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 2,
                }}
              >
                {/* Sample fields - these should match your model's expected features */}
                <TextField
                  label="Orbital Period (days)"
                  type="number"
                  value={formData.koi_period || ""}
                  onChange={(e) =>
                    handleFormChange("koi_period", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Transit Duration (hours)"
                  type="number"
                  value={formData.koi_duration || ""}
                  onChange={(e) =>
                    handleFormChange("koi_duration", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Planet Radius (Earth radii)"
                  type="number"
                  value={formData.koi_prad || ""}
                  onChange={(e) => handleFormChange("koi_prad", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Stellar Effective Temp (K)"
                  type="number"
                  value={formData.koi_steff || ""}
                  onChange={(e) =>
                    handleFormChange("koi_steff", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Stellar Surface Gravity"
                  type="number"
                  value={formData.koi_slogg || ""}
                  onChange={(e) =>
                    handleFormChange("koi_slogg", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Stellar Radius (Solar radii)"
                  type="number"
                  value={formData.koi_srad || ""}
                  onChange={(e) => handleFormChange("koi_srad", e.target.value)}
                  fullWidth
                />
              </Box>

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSinglePrediction}
                disabled={loading || Object.keys(formData).length === 0}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SendRounded />
                }
              >
                {loading ? "Predicting..." : "Get Prediction"}
              </Button>

              {singleResult && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Prediction Result
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Classification
                        </Typography>
                        <Chip
                          label={singleResult.prediction}
                          color="primary"
                          sx={{ mt: 1, fontSize: "1.1rem", px: 2, py: 1 }}
                        />
                      </Box>
                      {singleResult.confidence && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Confidence
                          </Typography>
                          <Typography variant="h5" color="primary">
                            {(singleResult.confidence * 100).toFixed(2)}%
                          </Typography>
                        </Box>
                      )}
                      {singleResult.probabilities && (
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Class Probabilities
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {Object.entries(singleResult.probabilities).map(
                              ([cls, prob]: [string, any]) => (
                                <Chip
                                  key={cls}
                                  label={`${cls}: ${(prob * 100).toFixed(2)}%`}
                                  variant="outlined"
                                />
                              )
                            )}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Predict;
