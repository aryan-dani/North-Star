# North-Star: Exoplanet Candidate Classification

North-Star experiments with machine-learning pipelines for identifying
exoplanet candidates in the NASA Kepler catalog. The repository currently
provides a Random Forest baseline trained on the cumulative exoplanet
catalog released via the NASA Exoplanet Archive.

## Repository Layout

```
North-Star/
├── data/                # Guidance and storage location for raw datasets
│   ├── README.md
│   └── raw/
├── docs/
│   └── reference-papers/ # Background reading and research PDFs
├── models/              # Serialized model artifacts (ignored by git)
├── notebooks/           # Exploratory notebooks (placeholder)
├── src/
│   ├── __init__.py
│   └── train_model.py   # Main training script
├── requirements.txt
└── README.md
```

> ⚠️ PDF content is not parsed programmatically here. Review the files in
> `docs/reference-papers/` directly for the full research context.

## Getting Started

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If you prefer `conda`, create an environment with Python 3.10+ and install
packages from `requirements.txt` with `pip` or `conda-forge` equivalents.

### Data

1. Download the Kepler `cumulative.csv` file from the
   [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/).
2. Place the file in `data/raw/cumulative.csv`.
3. Optional helper datasets (for example `merged_all_missions.csv`) should
   also live under `data/raw/`.

Large raw files should be ignored in version control; consider using Git LFS
or storing download instructions instead of committing the raw data.

### Training the baseline model

```
python -m src.train_model
```

The command will:

- load and preprocess the raw catalog;
- split the data into training/testing sets (80/20);
- train a `RandomForestClassifier` with deterministic seeding;
- report accuracy and a full classification report;
- export the fitted model to `models/exoplanet_model.joblib`.

Re-run the command any time you refresh the dataset or experiment with
hyperparameters.

## Future Ideas

- Explore feature engineering and class-balancing strategies.
- Compare additional ensemble models and gradient-boosting methods.
- Package the pipeline into a reusable module or CLI with configurable
  parameters.
- Add notebooks under `notebooks/` for exploratory analysis and visualization.

## References

- NASA Exoplanet Archive — Kepler Objects of Interest (KOI) Cumulative Table.
- See `docs/reference-papers/` for the attached research papers that motivate
  the modelling direction.
