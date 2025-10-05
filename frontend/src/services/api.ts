import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", // Adjust this to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
