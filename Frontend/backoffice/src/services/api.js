import axios from "axios";

// 🔹 Replace with your actual backend URL
const API_URL = "http://127.0.0.1:8000/api"; // Or use http://localhost:8000/api

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/produits/`)
     
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response || error);
    throw error;
  }
};
