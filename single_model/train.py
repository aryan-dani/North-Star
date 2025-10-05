import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

# (Steps 1-4 are the same: Load, Preprocess, Separate X/y, Scale, and Split)
# --- Step 1 & 2: Load and Preprocess ---
df = pd.read_csv('cumulative.csv')
columns_to_drop = [
    'rowid', 'kepid', 'kepoi_name', 'kepler_name', 'koi_pdisposition',
    'koi_score', 'koi_tce_delivname', 'koi_teq_err1', 'koi_teq_err2'
]
df_cleaned = df.drop(columns=columns_to_drop)
df_cleaned.dropna(inplace=True)

# --- Step 3: Separate and Scale ---
y = df_cleaned['koi_disposition']
X = df_cleaned.drop(columns=['koi_disposition'])
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# --- Step 4: Train-Test Split ---
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# --- Step 5: Automated Tuning with GridSearchCV ---
print("Starting GridSearchCV... This will take several minutes.")

# Define the 'grid' of hyperparameters to test
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, 30],
    'min_samples_leaf': [1, 2, 4]
}

# Create a new RandomForest model
rf = RandomForestClassifier(random_state=42)

# Set up the GridSearchCV
# cv=3 means 3-fold cross-validation. n_jobs=-1 uses all your CPU cores.
grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, n_jobs=-1, verbose=2)

# Run the search on your training data
grid_search.fit(X_train, y_train)

# --- Step 6: Evaluate the BEST Model from the Search ---
print("\n--- Best Hyperparameters Found ---")
print(grid_search.best_params_)

# Get the best model found by the search
best_model = grid_search.best_estimator_

print("\n--- Evaluating BEST Model Performance ---")
predictions = best_model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Overall Accuracy: {accuracy:.4f}")

report = classification_report(y_test, predictions)
print("\n--- Classification Report ---")
print(report)

# --- Step 7: Save the BEST Model ---
filename = 'exoplanet_model_best.joblib'
joblib.dump(best_model, filename)
print(f"\nBest model saved to '{filename}'")