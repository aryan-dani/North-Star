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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ScienceIcon from "@mui/icons-material/Science";
import MenuBookIcon from "@mui/icons-material/MenuBook";

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
                      <Chip label="Transit Method" color="primary" size="small" sx={{ mb: 1 }} />
                      <Typography variant="body2" paragraph>
                        When a planet passes in front of its star, it blocks a
                        small fraction of the star's light. By measuring the
                        periodic dimming, astronomers can detect exoplanets and
                        determine their size and orbit. This is the method used
                        by NASA's Kepler and TESS missions.
                      </Typography>
                    </Box>
                    <Box>
                      <Chip label="Radial Velocity" color="primary" size="small" sx={{ mb: 1 }} />
                      <Typography variant="body2" paragraph>
                        As a planet orbits a star, its gravitational pull causes
                        the star to wobble slightly. This wobble shifts the
                        star's light spectrum, which can be measured to infer the
                        planet's mass and orbit.
                      </Typography>
                    </Box>
                    <Box>
                      <Chip label="Direct Imaging" color="primary" size="small" sx={{ mb: 1 }} />
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
                        Rocky planets larger than Earth but smaller than Neptune.
                        Some may have conditions suitable for life.
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
                    categorizes objects into three classes: CONFIRMED exoplanets,
                    CANDIDATES (potential exoplanets needing more study), and
                    FALSE POSITIVES (not actually planets). This differs from
                    regression, which predicts continuous numerical values.
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
                        Creates many decision trees and combines their votes. Like
                        asking 100 experts and taking the majority opinion. Robust
                        and accurate.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="secondary">
                        Gradient Boosting
                      </Typography>
                      <Typography variant="body2">
                        Builds trees one at a time, each correcting mistakes from
                        the previous. Like iteratively improving predictions.
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
                        Percentage of correct predictions. Our RandomForest model
                        achieves ~76% accuracy.
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
            </Stack>
          </CardContent>
        </Card>

        {/* NASA Resources */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <MenuBookIcon color="info" />
              <Typography variant="h5">NASA & External Resources</Typography>
            </Box>

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
                  Official database of confirmed exoplanets and candidates from
                  various missions.
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
                  Educational resources, latest discoveries, and interactive tools.
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
                  Learn about the Kepler Space Telescope that discovered thousands
                  of exoplanets.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="info" gutterBottom>
                  TESS Mission
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
                  The Transiting Exoplanet Survey Satellite, continuing exoplanet
                  discovery.
                </Typography>
              </Box>

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
                  Machine learning library used to build our classification models.
                </Typography>
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
                  observations, or enter values manually for a single prediction.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="success" gutterBottom>
                  Step 2: Get Predictions
                </Typography>
                <Typography variant="body2">
                  Our machine learning model analyzes the data and classifies each
                  object as CONFIRMED, CANDIDATE, or FALSE POSITIVE, along with
                  confidence scores.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="success" gutterBottom>
                  Step 3: Analyze Results
                </Typography>
                <Typography variant="body2">
                  Use the Analytics page to generate comprehensive visualizations
                  including confusion matrices, ROC curves, and feature importance.
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
