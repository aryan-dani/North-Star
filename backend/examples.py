"""
Example usage of the North-Star Exoplanet Classification API
This script demonstrates how to interact with the API programmatically
"""
import requests
import pandas as pd
import json

API_BASE_URL = "http://localhost:8000"

def print_section(title):
    """Print formatted section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def example_1_health_check():
    """Example 1: Check if API is healthy"""
    print_section("Example 1: Health Check")
    
    response = requests.get(f"{API_BASE_URL}/health")
    data = response.json()
    
    print(f"Status: {data['status']}")
    print(f"Model Loaded: {data['model_loaded']}")
    print(f"Timestamp: {data['timestamp']}")

def example_2_model_info():
    """Example 2: Get model information"""
    print_section("Example 2: Model Information")
    
    response = requests.get(f"{API_BASE_URL}/model/info")
    data = response.json()
    
    print(f"Model Name: {data['model_name']}")
    print(f"Model Type: {data['model_type']}")
    print(f"Number of Features: {data['n_features']}")
    print(f"Target Classes: {data['target_classes']}")
    print(f"Numeric Features: {data['numeric_features']}")
    print(f"Categorical Features: {data['categorical_features']}")

def example_3_get_features():
    """Example 3: Get expected features"""
    print_section("Example 3: Expected Features")
    
    response = requests.get(f"{API_BASE_URL}/model/features")
    data = response.json()
    
    print(f"Total Features: {data['total_features']}")
    print(f"\nNumeric Features ({len(data['features']['numeric'])}):")
    for feature in data['features']['numeric'][:5]:  # Show first 5
        print(f"  - {feature}")
    print("  ...")
    
    if data['features']['categorical']:
        print(f"\nCategorical Features ({len(data['features']['categorical'])}):")
        for feature in data['features']['categorical']:
            print(f"  - {feature}")

def example_4_predict_csv(csv_path):
    """Example 4: Upload CSV file for predictions"""
    print_section("Example 4: Predict from CSV File")
    
    try:
        with open(csv_path, 'rb') as f:
            files = {'file': (csv_path, f, 'text/csv')}
            response = requests.post(f"{API_BASE_URL}/predict", files=files)
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"Filename: {data['filename']}")
            print(f"Total Rows: {data['total_rows']}")
            print(f"\nFirst 5 Predictions:")
            for i, pred in enumerate(data['predictions'][:5], 1):
                print(f"  {i}. {pred}")
            
            print(f"\nMetrics:")
            print(f"  Total Predictions: {data['metrics']['total_predictions']}")
            print(f"  Average Confidence: {data['metrics'].get('average_confidence', 'N/A')}")
            
            if 'class_distribution' in data['metrics']:
                print(f"\n  Class Distribution:")
                for cls, count in data['metrics']['class_distribution'].items():
                    print(f"    {cls}: {count}")
        else:
            print(f"Error: {response.status_code}")
            print(response.json())
    
    except FileNotFoundError:
        print(f"Error: File '{csv_path}' not found")
        print("Please provide a valid CSV file path")

def example_5_batch_prediction(csv_path):
    """Example 5: Batch prediction with detailed results"""
    print_section("Example 5: Batch Prediction (Detailed)")
    
    try:
        with open(csv_path, 'rb') as f:
            files = {'file': (csv_path, f, 'text/csv')}
            response = requests.post(f"{API_BASE_URL}/predict/batch", files=files)
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"Total Rows: {data['total_rows']}")
            
            print(f"\nFirst 3 Detailed Predictions:")
            for pred in data['predictions_detail'][:3]:
                print(f"\nRow {pred['row_id']}:")
                print(f"  Prediction: {pred['prediction']}")
                print(f"  Confidence: {pred.get('confidence', 'N/A')}")
                if 'probabilities' in pred:
                    print(f"  Probabilities:")
                    for cls, prob in pred['probabilities'].items():
                        print(f"    {cls}: {prob:.4f}")
            
            if 'summary' in data:
                summary = data['summary']
                print(f"\nSummary Statistics:")
                print(f"  Total Samples: {summary['total_samples']}")
                
                if 'predictions_by_class' in summary:
                    print(f"\n  Predictions by Class:")
                    for cls, info in summary['predictions_by_class'].items():
                        print(f"    {cls}: {info['count']} ({info['percentage']}%)")
                
                if 'confidence_stats' in summary:
                    stats = summary['confidence_stats']
                    print(f"\n  Confidence Statistics:")
                    print(f"    Mean: {stats['mean']:.4f}")
                    print(f"    Std: {stats['std']:.4f}")
                    print(f"    Min: {stats['min']:.4f}")
                    print(f"    Max: {stats['max']:.4f}")
                    print(f"    Median: {stats['median']:.4f}")
        else:
            print(f"Error: {response.status_code}")
            print(response.json())
    
    except FileNotFoundError:
        print(f"Error: File '{csv_path}' not found")

def example_6_json_prediction():
    """Example 6: Single prediction from JSON"""
    print_section("Example 6: JSON Prediction")
    
    sample_data = {
        "data": {
            "koi_period": 9.48803557,
            "koi_duration": 2.9575,
            "koi_depth": 616.0,
            "koi_ror": 0.022344,
            "koi_model_snr": 35.8,
            "koi_num_transits": 142.0,
            "koi_impact": 0.146,
            "koi_dor": 24.81,
            "koi_teq": 793.0,
            "koi_srho": 3.20796,
            "koi_kepmag": 15.347,
            "koi_gmag": 15.89,
            "koi_rmag": 15.27,
            "koi_imag": 15.114,
            "koi_zmag": 15.006,
            "koi_jmag": 14.082,
            "koi_hmag": 13.751,
            "koi_kmag": 13.648,
            "ra": 291.93423,
            "dec": 48.141651,
            "mission_id": "KEPLER",
            "object_name": "Kepler-227 b",
            "host_name": "",
            "source_primary_id": ""
        }
    }
    
    response = requests.post(f"{API_BASE_URL}/predict/json", json=sample_data)
    
    if response.status_code == 200:
        data = response.json()
        
        print(f"Prediction: {data['prediction']}")
        print(f"Confidence: {data.get('confidence', 'N/A')}")
        
        if 'probabilities' in data and data['probabilities']:
            print(f"\nProbabilities:")
            for i, prob in enumerate(data['probabilities']):
                print(f"  Class {i}: {prob:.4f}")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())

def main():
    """Run all examples"""
    print("\n" + "="*60)
    print("  North-Star API Usage Examples")
    print("="*60)
    print(f"\nAPI Base URL: {API_BASE_URL}")
    print("Make sure the server is running before executing these examples")
    print("Start server: cd backend && python main.py")
    
    try:
        example_1_health_check()
        example_2_model_info()
        example_3_get_features()
        
        csv_path = "../data/merged_all_missions.csv"
        
        print(f"\n{'='*60}")
        print("  File Upload Examples")
        print(f"{'='*60}")
        print(f"Using CSV file: {csv_path}")
        print("(Modify the csv_path variable if your file is elsewhere)")
        
        example_4_predict_csv(csv_path)
        example_5_batch_prediction(csv_path)
        
        example_6_json_prediction()
        
        print(f"\n{'='*60}")
        print("  Examples Complete!")
        print(f"{'='*60}\n")
        print("Check the API documentation for more details:")
        print(f"  - Swagger UI: {API_BASE_URL}/docs")
        print(f"  - ReDoc: {API_BASE_URL}/redoc")
        print(f"  - API Docs: backend/API_DOCS.md\n")
        
    except requests.exceptions.ConnectionError:
        print("\n" + "="*60)
        print("  ERROR: Cannot connect to API server")
        print("="*60)
        print("\nThe server is not running or not accessible.")
        print("Please start the server first:")
        print("  cd backend")
        print("  python main.py")
        print(f"\nThen try running this script again.\n")
    except Exception as e:
        print(f"\n\nError: {str(e)}")
        print("Check the error message above for details.\n")

if __name__ == "__main__":
    main()
