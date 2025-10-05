import {
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ScienceIcon from "@mui/icons-material/Science";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PublicIcon from "@mui/icons-material/Public";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import CodeIcon from "@mui/icons-material/Code";
import TimelineIcon from "@mui/icons-material/Timeline";

const Learn = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Learn About Exoplanets & Machine Learning
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Educational resources to understand exoplanet discovery and the machine
        learning behind our classification system.
      </Typography>

      <Stack spacing={3}>
        {/* NASA Space Apps Challenge Section */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #1a237e 0%, #311b92 100%)",
            border: "2px solid",
            borderColor: "primary.main",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <EmojiEventsIcon sx={{ fontSize: 32, color: "warning.main" }} />
              <Typography variant="h5" fontWeight={700}>
                NASA Space Apps Challenge 2025
              </Typography>
            </Box>

            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                🏆 This project was developed for the NASA Space Apps Challenge
                2025
              </Typography>
            </Alert>

            <Typography variant="body1" paragraph>
              <strong>Challenge:</strong> "A World Away: Hunting for Exoplanets
              with AI"
            </Typography>

            <Typography variant="body2" paragraph color="text.secondary">
              NASA's Space Apps Challenge is an international hackathon where
              teams collaborate to solve real-world challenges using NASA's open
              data. The exoplanet challenge focuses on developing AI/ML
              solutions to analyze data from space missions like Kepler, TESS,
              and others to identify and classify potential exoplanets.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Our Solution: North Star
            </Typography>

            <Stack spacing={1.5} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography variant="body2" sx={{ minWidth: 24 }}>
                  🎯
                </Typography>
                <Typography variant="body2">
                  <strong>Multi-Model ML System:</strong> Trained 7 different
                  machine learning algorithms (Random Forest, Gradient Boosting,
                  SVM, etc.) achieving 76% accuracy
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography variant="body2" sx={{ minWidth: 24 }}>
                  🌐
                </Typography>
                <Typography variant="body2">
                  <strong>Full-Stack Web Application:</strong> React +
                  TypeScript frontend with FastAPI backend, featuring real-time
                  predictions and comprehensive analytics
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography variant="body2" sx={{ minWidth: 24 }}>
                  📊
                </Typography>
                <Typography variant="body2">
                  <strong>Advanced Visualizations:</strong> Confusion matrices,
                  ROC curves, feature importance plots, probability
                  distributions, and more
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography variant="body2" sx={{ minWidth: 24 }}>
                  🔄
                </Typography>
                <Typography variant="body2">
                  <strong>Real-Time Training:</strong> WebSocket-powered
                  training studio with live progress tracking and hyperparameter
                  tuning
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography variant="body2" sx={{ minWidth: 24 }}>
                  📚
                </Typography>
                <Typography variant="body2">
                  <strong>Educational Focus:</strong> Comprehensive learning
                  resources to help users understand both exoplanet science and
                  machine learning
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<PublicIcon />}
              href="https://www.spaceappschallenge.org/2025/challenges/a-world-away-hunting-for-exoplanets-with-ai/"
              target="_blank"
              rel="noopener"
              sx={{ mt: 1 }}
            >
              View Challenge Details
            </Button>
          </CardContent>
        </Card>

        {/* What are Exoplanets */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <RocketLaunchIcon color="primary" />
              <Typography variant="h5">What are Exoplanets?</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Exoplanets are planets that orbit stars outside our solar system.
              Since the first confirmed detection in 1992, thousands of
              exoplanets have been discovered, revolutionizing our understanding
              of planetary systems and the potential for life beyond Earth.
            </Typography>

            <Stack spacing={2} mt={3}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Detection Methods
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Chip
                        label="Transit Method"
                        color="primary"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" paragraph>
                        When a planet passes in front of its star, it blocks a
                        small fraction of the star's light. By measuring the
                        periodic dimming, astronomers can detect exoplanets and
                        determine their size and orbit. This is the method used
                        by NASA's Kepler and TESS missions.
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        label="Radial Velocity"
                        color="primary"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" paragraph>
                        As a planet orbits a star, its gravitational pull causes
                        the star to wobble slightly. This wobble shifts the
                        star's light spectrum, which can be measured to infer
                        the planet's mass and orbit.
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        label="Direct Imaging"
                        color="primary"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2">
                        Taking pictures of exoplanets by blocking out the star's
                        bright light. This method works best for large planets
                        orbiting far from their stars.
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Types of Exoplanets
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Gas Giants
                      </Typography>
                      <Typography variant="body2">
                        Large planets similar to Jupiter and Saturn, composed
                        primarily of hydrogen and helium.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Hot Jupiters
                      </Typography>
                      <Typography variant="body2">
                        Gas giants that orbit very close to their stars,
                        resulting in extremely high temperatures.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Super-Earths
                      </Typography>
                      <Typography variant="body2">
                        Rocky planets larger than Earth but smaller than
                        Neptune. Some may have conditions suitable for life.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Terrestrial Planets
                      </Typography>
                      <Typography variant="body2">
                        Rocky planets similar in size to Earth, Mars, or Venus.
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </CardContent>
        </Card>

        {/* Machine Learning Concepts */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <ScienceIcon color="secondary" />
              <Typography variant="h5">Machine Learning Concepts</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Our system uses advanced machine learning algorithms to classify
              exoplanet candidates. Here's how it works:
            </Typography>

            <Stack spacing={2} mt={3}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Classification vs Regression
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    Our system performs <strong>classification</strong> - it
                    categorizes objects into three classes: CONFIRMED
                    exoplanets, CANDIDATES (potential exoplanets needing more
                    study), and FALSE POSITIVES (not actually planets). This
                    differs from regression, which predicts continuous numerical
                    values.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Training Data & Features
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Typography variant="body2">
                      The model learns from NASA's Kepler mission data, which
                      includes measurements like:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                      <li>
                        <Typography variant="body2">
                          <strong>Orbital Period:</strong> How long it takes to
                          orbit the star
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          <strong>Transit Duration:</strong> How long the planet
                          blocks star light
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          <strong>Transit Depth:</strong> How much light is
                          blocked
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          <strong>Stellar Properties:</strong> Star's
                          temperature, size, and brightness
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          <strong>Signal-to-Noise Ratio:</strong> Quality of the
                          detection
                        </Typography>
                      </li>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Model Types Explained
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Random Forest (Our Default)
                      </Typography>
                      <Typography variant="body2">
                        Creates many decision trees and combines their votes.
                        Like asking 100 experts and taking the majority opinion.
                        Robust and accurate.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Gradient Boosting
                      </Typography>
                      <Typography variant="body2">
                        Builds trees one at a time, each correcting mistakes
                        from the previous. Like iteratively improving
                        predictions.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Support Vector Machine (SVM)
                      </Typography>
                      <Typography variant="body2">
                        Finds the best boundary to separate different classes.
                        Works well when data is well-separated.
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Model Evaluation Metrics
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Accuracy
                      </Typography>
                      <Typography variant="body2">
                        Percentage of correct predictions. Our RandomForest
                        model achieves ~76% accuracy.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Precision
                      </Typography>
                      <Typography variant="body2">
                        Of all predicted exoplanets, how many are actually
                        exoplanets? High precision means few false alarms.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Recall
                      </Typography>
                      <Typography variant="body2">
                        Of all actual exoplanets, how many did we find? High
                        recall means we don't miss many real exoplanets.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        F1 Score
                      </Typography>
                      <Typography variant="body2">
                        Harmonic mean of precision and recall. Balances both
                        metrics for overall performance assessment.
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Advanced Concepts
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Confusion Matrix
                      </Typography>
                      <Typography variant="body2" paragraph>
                        A table showing how well the model distinguishes between
                        classes. Rows represent actual classes, columns
                        represent predictions. Diagonal values are correct
                        predictions.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        ROC Curve & AUC
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Receiver Operating Characteristic curve plots True
                        Positive Rate vs False Positive Rate. Area Under Curve
                        (AUC) measures overall classification performance (1.0 =
                        perfect, 0.5 = random).
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Feature Importance
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Shows which features (orbital period, transit depth,
                        etc.) contribute most to predictions. Helps understand
                        what the model considers important for classification.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Hyperparameter Tuning
                      </Typography>
                      <Typography variant="body2">
                        Process of optimizing model settings (like number of
                        trees in Random Forest, learning rate in Gradient
                        Boosting) to improve performance. Our Training Studio
                        lets you experiment with these parameters.
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Data Preprocessing Pipeline
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Typography variant="body2" paragraph>
                      Before training, raw data goes through several
                      preprocessing steps:
                    </Typography>
                    <Box component="ol" sx={{ pl: 3 }}>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Missing Value Imputation:</strong> Replace
                          missing values with mean (numeric) or most frequent
                          (categorical)
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Feature Scaling:</strong> Standardize numeric
                          features to have mean=0 and variance=1 using
                          StandardScaler
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>One-Hot Encoding:</strong> Convert categorical
                          variables into binary columns for machine learning
                          compatibility
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          <strong>Train-Test Split:</strong> Divide data
                          (typically 80/20) to evaluate model on unseen data
                        </Typography>
                      </li>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CodeIcon color="primary" />
              <Typography variant="h5">Technical Architecture</Typography>
            </Box>

            <Typography variant="body1" paragraph>
              North Star is built with modern, production-ready technologies:
            </Typography>

            <Stack spacing={2} mt={3}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Backend Stack
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Chip
                        label="Python 3.13"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label="FastAPI"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label="scikit-learn"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip label="pandas" size="small" sx={{ mr: 1, mb: 1 }} />
                      <Chip label="NumPy" size="small" sx={{ mr: 1, mb: 1 }} />
                    </Box>
                    <Typography variant="body2">
                      <strong>FastAPI:</strong> High-performance async Python
                      web framework with automatic OpenAPI documentation
                    </Typography>
                    <Typography variant="body2">
                      <strong>scikit-learn:</strong> Industry-standard machine
                      learning library with 7+ algorithms implemented
                    </Typography>
                    <Typography variant="body2">
                      <strong>WebSockets:</strong> Real-time bidirectional
                      communication for live training progress updates
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Frontend Stack
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Chip
                        label="React 19"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label="TypeScript"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label="Material-UI v7"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip label="Vite" size="small" sx={{ mr: 1, mb: 1 }} />
                      <Chip label="Axios" size="small" sx={{ mr: 1, mb: 1 }} />
                    </Box>
                    <Typography variant="body2">
                      <strong>React + TypeScript:</strong> Type-safe
                      component-based UI with modern hooks and state management
                    </Typography>
                    <Typography variant="body2">
                      <strong>Material-UI:</strong> Comprehensive component
                      library with custom space-themed dark mode
                    </Typography>
                    <Typography variant="body2">
                      <strong>Poppins Font:</strong> Modern, clean typography
                      throughout the application
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    ML Pipeline & Models
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Typography variant="body2" paragraph>
                      <strong>7 Trained Models Available:</strong>
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                      <li>
                        <Typography variant="body2">
                          Random Forest (76% accuracy) ⭐
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Gradient Boosting
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Support Vector Machine (SVM)
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">Decision Tree</Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Logistic Regression
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          K-Nearest Neighbors (KNN)
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">Naive Bayes</Typography>
                      </li>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <strong>Training Features:</strong> Custom training studio
                      with hyperparameter tuning, real-time progress tracking
                      via WebSocket, and comprehensive evaluation metrics
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    API & Integration
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    <Typography variant="body2">
                      RESTful API with 11+ endpoints for predictions, analytics,
                      training, and model management
                    </Typography>
                    <Box>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Key Endpoints:
                      </Typography>
                      <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                        <li>
                          <Typography variant="body2">
                            <code>/predict</code> - Single/batch predictions
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            <code>/analytics</code> - Generate visualizations
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            <code>/training/train</code> - Custom model training
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            <code>/ws/training/:id</code> - WebSocket for live
                            updates
                          </Typography>
                        </li>
                      </Box>
                    </Box>
                    <Alert severity="info">
                      <Typography variant="body2">
                        Full API documentation available at <code>/docs</code>
                        (Swagger UI) and <code>/redoc</code>
                      </Typography>
                    </Alert>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </CardContent>
        </Card>

        {/* The Science Behind Exoplanets */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TimelineIcon color="info" />
              <Typography variant="h5">The Science Behind Detection</Typography>
            </Box>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  NASA Kepler Mission
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography variant="body2" paragraph>
                    The Kepler Space Telescope (2009-2018) revolutionized
                    exoplanet discovery by continuously monitoring 150,000 stars
                    for 4 years, detecting tiny brightness changes as planets
                    transit their stars.
                  </Typography>
                  <Box>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Key Achievements:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                      <li>
                        <Typography variant="body2">
                          Discovered 2,662 confirmed exoplanets
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Identified 2,900+ candidate exoplanets
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Found planets in habitable zones
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Determined ~20-50% of stars have Earth-sized planets
                        </Typography>
                      </li>
                    </Box>
                  </Box>
                  <Paper sx={{ p: 2, bgcolor: "background.default" }}>
                    <Typography variant="body2" color="text.secondary">
                      💡 <strong>Fun Fact:</strong> Kepler's most precise light
                      measurements could detect the equivalent of a flea
                      crawling across a car headlight from thousands of miles
                      away!
                    </Typography>
                  </Paper>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Why Machine Learning?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography variant="body2" paragraph>
                    With millions of data points from Kepler, manual analysis is
                    impossible. Machine learning excels at:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3 }}>
                    <li>
                      <Typography variant="body2" paragraph>
                        <strong>Pattern Recognition:</strong> Identifying subtle
                        patterns in light curves that indicate planetary
                        transits
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        <strong>Noise Filtering:</strong> Distinguishing real
                        signals from instrumental artifacts and stellar
                        variability
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        <strong>False Positive Reduction:</strong> Eliminating
                        eclipsing binary stars, background objects, and other
                        mimics
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <strong>Scalability:</strong> Processing millions of
                        candidates faster than human analysts
                      </Typography>
                    </li>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Challenges in Classification
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography variant="body2" paragraph>
                    Exoplanet classification faces unique challenges:
                  </Typography>
                  <Box>
                    <Typography variant="subtitle2" color="warning.main">
                      Imbalanced Classes
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Most candidates are false positives. Our model uses
                      techniques like class weighting to handle this imbalance.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="warning.main">
                      Noisy Data
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Stellar activity, instrumental noise, and cosmic rays can
                      mask or mimic planetary signals.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="warning.main">
                      Rare Events
                    </Typography>
                    <Typography variant="body2">
                      Small planets around faint stars are hardest to detect but
                      potentially most interesting for habitability studies.
                    </Typography>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>

        {/* Tips & Best Practices */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TipsAndUpdatesIcon color="warning" />
              <Typography variant="h5">Tips & Best Practices</Typography>
            </Box>

            <Stack spacing={2}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Getting Better Predictions
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        ✓ Ensure Data Quality
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check for missing values, outliers, and correct data
                        types before making predictions
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        ✓ Use Multiple Models
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Compare predictions across different models to increase
                        confidence in classifications
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        ✓ Check Confidence Scores
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Higher confidence scores (&gt;0.8) indicate more
                        reliable predictions
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        ✓ Validate with Analytics
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use the Analytics page to generate confusion matrices
                        and ROC curves for deeper insights
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Training Custom Models
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        🎯 Start with Default Hyperparameters
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Begin with default settings, then tune based on
                        validation results
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        🎯 Validate Before Training
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Always use the validation feature to check data quality
                        and identify issues early
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        🎯 Monitor Training Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Watch real-time metrics during training to catch
                        overfitting or other issues
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        🎯 Save Successful Models
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Models are automatically saved with timestamps - keep
                        track of which configurations work best
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Interpreting Results
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>CONFIRMED:</strong> High confidence the object
                        is a real exoplanet based on multiple verification
                        criteria
                      </Typography>
                    </Alert>
                    <Alert severity="warning">
                      <Typography variant="body2">
                        <strong>CANDIDATE:</strong> Shows promising signals but
                        requires additional observation or analysis to confirm
                      </Typography>
                    </Alert>
                    <Alert severity="error">
                      <Typography variant="body2">
                        <strong>FALSE POSITIVE:</strong> Signal caused by
                        stellar activity, binary stars, or instrumental
                        artifacts
                      </Typography>
                    </Alert>
                    <Typography
                      variant="body2"
                      sx={{ mt: 2 }}
                      color="text.secondary"
                    >
                      Remember: Even with 76% accuracy, some predictions will be
                      incorrect. Always consider confidence scores and use
                      multiple validation methods.
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </CardContent>
        </Card>

        {/* NASA Resources */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <MenuBookIcon color="info" />
              <Typography variant="h5">
                External Resources & Documentation
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  NASA Official Resources
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      NASA Exoplanet Archive
                    </Typography>
                    <Link
                      href="https://exoplanetarchive.ipac.caltech.edu/"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://exoplanetarchive.ipac.caltech.edu/
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Official database of confirmed exoplanets and candidates
                      from various missions. Download datasets and access
                      research papers.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      NASA Exoplanet Exploration
                    </Typography>
                    <Link
                      href="https://exoplanets.nasa.gov/"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://exoplanets.nasa.gov/
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Educational resources, latest discoveries, interactive
                      tools, and stunning visualizations of exoplanetary
                      systems.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      Kepler Mission Overview
                    </Typography>
                    <Link
                      href="https://www.nasa.gov/mission_pages/kepler/overview/index.html"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://www.nasa.gov/mission_pages/kepler/
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Learn about the Kepler Space Telescope that discovered
                      thousands of exoplanets and revolutionized our
                      understanding of planetary systems.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      TESS Mission (Current)
                    </Typography>
                    <Link
                      href="https://www.nasa.gov/tess-transiting-exoplanet-survey-satellite"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://www.nasa.gov/tess
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      The Transiting Exoplanet Survey Satellite, continuing
                      exoplanet discovery by surveying the entire sky.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      James Webb Space Telescope
                    </Typography>
                    <Link
                      href="https://www.nasa.gov/mission_pages/webb/main/index.html"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://www.nasa.gov/webb
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      JWST is studying exoplanet atmospheres to search for
                      biosignatures and understand planetary formation.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" gutterBottom color="secondary">
                  Machine Learning Resources
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      Scikit-learn Documentation
                    </Typography>
                    <Link
                      href="https://scikit-learn.org/stable/documentation.html"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://scikit-learn.org/stable/
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Comprehensive documentation for the machine learning
                      library powering our classification models.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      FastAPI Framework
                    </Typography>
                    <Link
                      href="https://fastapi.tiangolo.com/"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://fastapi.tiangolo.com/
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Modern Python web framework used for our high-performance
                      API backend.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      React Documentation
                    </Typography>
                    <Link
                      href="https://react.dev/"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://react.dev/
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Official React documentation - the framework powering this
                      user interface.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      Material-UI (MUI)
                    </Typography>
                    <Link
                      href="https://mui.com/"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://mui.com/
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Component library providing the beautiful UI elements
                      throughout this application.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" gutterBottom color="success.main">
                  Research Papers & Publications
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      Kepler Data Characteristics Handbook
                    </Typography>
                    <Link
                      href="https://archive.stsci.edu/kepler/manuals/KSCI-19040-005.pdf"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      KSCI-19040-005 (PDF)
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Comprehensive guide to Kepler mission data, processing,
                      and quality flags.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      Machine Learning for Exoplanet Detection
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      See <code>docs/reference-papers/</code> directory for
                      academic papers on ML applications in exoplanet discovery.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="info" gutterBottom>
                      NASA Space Apps Challenge
                    </Typography>
                    <Link
                      href="https://www.spaceappschallenge.org/"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      https://www.spaceappschallenge.org/
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Annual global hackathon bringing together teams to solve
                      challenges using NASA's open data.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* How to Use This Tool */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SchoolIcon color="success" />
              <Typography variant="h5">How to Use This Tool</Typography>
            </Box>

            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="success" gutterBottom>
                  Step 1: Upload Your Data
                </Typography>
                <Typography variant="body2">
                  Go to the Predict page and upload a CSV file with exoplanet
                  observations, or enter values manually for a single
                  prediction.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="success" gutterBottom>
                  Step 2: Get Predictions
                </Typography>
                <Typography variant="body2">
                  Our machine learning model analyzes the data and classifies
                  each object as CONFIRMED, CANDIDATE, or FALSE POSITIVE, along
                  with confidence scores.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="success" gutterBottom>
                  Step 3: Analyze Results
                </Typography>
                <Typography variant="body2">
                  Use the Analytics page to generate comprehensive
                  visualizations including confusion matrices, ROC curves, and
                  feature importance.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="success" gutterBottom>
                  Step 4: Switch Models (Optional)
                </Typography>
                <Typography variant="body2">
                  Visit the Models page to try different machine learning
                  algorithms and compare their performance on your data.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Learn;
