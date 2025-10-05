"""
Comprehensive API Test Suite for North-Star Backend
Tests all endpoints in the FastAPI application
"""
import requests
import pandas as pd
import json
import sys
import time
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:8000"
TEST_DATA_PATH = "../data/merged_all_missions.csv"

class APITester:
    """Comprehensive API testing class"""

    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
        self.test_results = []
        self.passed = 0
        self.failed = 0

    def log_test(self, name, status, message="", response_time=None):
        """Log test result"""
        result = {
            "name": name,
            "status": status,
            "message": message,
            "response_time": response_time
        }
        self.test_results.append(result)

        if status == "PASS":
            self.passed += 1
            print(f"✓ {name}")
        else:
            self.failed += 1
            print(f"✗ {name}")
            if message:
                print(f"  Error: {message}")

        if response_time:
            print(".3f")

    def test_endpoint(self, method, endpoint, name, expected_status=200, **kwargs):
        """Test a single endpoint"""
        url = f"{self.base_url}{endpoint}"
        start_time = time.time()

        try:
            if method.upper() == "GET":
                response = requests.get(url, timeout=10, **kwargs)
            elif method.upper() == "POST":
                response = requests.post(url, timeout=30, **kwargs)
            else:
                raise ValueError(f"Unsupported method: {method}")

            response_time = time.time() - start_time

            if response.status_code == expected_status:
                self.log_test(name, "PASS", response_time=response_time)
                return response.json()
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test(name, "FAIL", error_msg, response_time)
                return None

        except requests.exceptions.ConnectionError:
            self.log_test(name, "FAIL", "Connection refused - server not running")
        except requests.exceptions.Timeout:
            self.log_test(name, "FAIL", "Request timeout")
        except Exception as e:
            self.log_test(name, "FAIL", f"Exception: {str(e)}")

        return None

    def test_get_endpoints(self):
        """Test all GET endpoints"""
        print("\n" + "="*60)
        print("TESTING GET ENDPOINTS")
        print("="*60)

        # Root endpoint
        self.test_endpoint("GET", "/", "Root endpoint")

        # Health check
        self.test_endpoint("GET", "/health", "Health check")

        # Model info
        self.test_endpoint("GET", "/model/info", "Model information")

        # Model features
        self.test_endpoint("GET", "/model/features", "Model features")

        # Model metrics
        self.test_endpoint("GET", "/model/metrics", "Model metrics")

        # Available plot types
        self.test_endpoint("GET", "/analytics/plots/types", "Available plot types")

    def test_json_prediction(self):
        """Test JSON prediction endpoint"""
        print("\n" + "="*60)
        print("TESTING JSON PREDICTION")
        print("="*60)

        # Sample data for prediction
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

        self.test_endpoint("POST", "/predict/json", "JSON prediction",
                          json=sample_data)

    def test_file_endpoints(self):
        """Test file upload endpoints"""
        print("\n" + "="*60)
        print("TESTING FILE UPLOAD ENDPOINTS")
        print("="*60)

        # Check if test data exists
        if not Path(TEST_DATA_PATH).exists():
            print(f"⚠ Test data file not found: {TEST_DATA_PATH}")
            print("Skipping file upload tests...")
            return

        # Create a small test file (first 10 rows)
        try:
            df = pd.read_csv(TEST_DATA_PATH, nrows=10)
            test_file_path = "test_sample.csv"
            df.to_csv(test_file_path, index=False)

            with open(test_file_path, 'rb') as f:
                files = {'file': ('test_sample.csv', f, 'text/csv')}

                # Single prediction
                self.test_endpoint("POST", "/predict", "Single file prediction",
                                 files=files.copy())

                # Reset file pointer
                f.seek(0)
                # Batch prediction
                self.test_endpoint("POST", "/predict/batch", "Batch prediction",
                                 files=files.copy())

                # Reset file pointer
                f.seek(0)
                # Analytics
                self.test_endpoint("POST", "/analytics", "Analytics generation",
                                 files=files.copy())

                # Reset file pointer
                f.seek(0)
                # Statistics only
                self.test_endpoint("POST", "/analytics/statistics", "Statistics only",
                                 files=files.copy())

            # Clean up
            Path(test_file_path).unlink()

        except Exception as e:
            print(f"Error preparing test file: {e}")

    def test_error_cases(self):
        """Test error handling"""
        print("\n" + "="*60)
        print("TESTING ERROR HANDLING")
        print("="*60)

        # Invalid JSON prediction
        self.test_endpoint("POST", "/predict/json", "Invalid JSON prediction",
                          expected_status=400, json={"invalid": "data"})

        # Non-existent endpoint
        try:
            response = requests.get(f"{self.base_url}/nonexistent", timeout=5)
            if response.status_code == 404:
                self.log_test("404 Error handling", "PASS")
            else:
                self.log_test("404 Error handling", "FAIL", f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("404 Error handling", "FAIL", str(e))

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting North-Star API Test Suite")
        print(f"Base URL: {self.base_url}")
        print(f"Test Data: {TEST_DATA_PATH}")

        start_time = time.time()

        # Run test suites
        self.test_get_endpoints()
        self.test_json_prediction()
        self.test_file_endpoints()
        self.test_error_cases()

        # Summary
        total_time = time.time() - start_time
        total_tests = self.passed + self.failed

        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {self.passed}")
        print(f"Failed: {self.failed}")
        print(".2f")
        print(".2f")

        if self.failed == 0:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed. Check the output above for details.")
            print("\nFailed Tests:")
            for result in self.test_results:
                if result["status"] == "FAIL":
                    print(f"  - {result['name']}: {result['message']}")
            return 1

def main():
    """Main test runner"""
    tester = APITester()

    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            print("❌ Server is not responding properly")
            print("Please start the server first:")
            print("  cd backend")
            print("  python main.py")
            return 1
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server")
        print("Please start the server first:")
        print("  cd backend")
        print("  python main.py")
        return 1

    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())
