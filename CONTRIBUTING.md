# Contributing to North-Star

Thanks for your interest in improving North-Star! This guide outlines how to get
started, report issues, and submit improvements.

## Code of Conduct

Participation in this project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).
Please review it before contributing.

## Getting Started

1. **Fork** the repository and create your local clone.
2. **Create a virtual environment** and install dependencies:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```
3. **Download data** as described in the main `README.md` and place it under
   `data/raw/`.
4. Run the baseline training to ensure everything works:
   ```powershell
   python -m src.train_model
   ```

## Development Workflow

- Create a feature branch from `main` for each change set.
- Keep pull requests focused; avoid bundling unrelated fixes.
- Ensure the training script still runs without errors before opening a PR.
- Add tests or notebooks where helpful to demonstrate new behaviour.
- Update documentation (`README.md`, `docs/`, etc.) when behaviour changes.

## Coding Standards

- Target Python 3.10+.
- Format code with `black` (or a comparable PEP 8 formatter) and organise
  imports with `isort` if you use these tools locally.
- Prefer small, well-named functions; add brief comments for non-obvious logic.
- Avoid committing large artefacts; add them to `.gitignore` or document how
  to recreate them.

## Commit & Pull Request Guidelines

- Write descriptive commit messages (e.g., `feat: add feature engineering for KOI`).
- Reference related issues in your PR description (e.g., `Closes #42`).
- Include screenshots or console excerpts when modifying outputs or behaviour.
- Be responsive to review feedback; discussions are welcomed.

## Reporting Issues

If you discover a bug or have a feature request:

1. Check the issue tracker to avoid duplicates.
2. Provide context—dataset used, environment details, steps to reproduce.
3. Attach logs or stack traces when relevant (censor sensitive data).

## Questions?

Open a discussion or start a draft issue; project maintainers will help point
you in the right direction. We're excited to collaborate!
