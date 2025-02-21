import axios from "axios";

// 🔹 Replace with your actual backend URL
const API_URL = "http://127.0.0.1:8000/api"; // Or use http://localhost:8000/api

export const fetchProduits = async () => {
  try {
    const response = await axios.get(`${API_URL}/produits`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Create a new product
export const createProduit = async (produitData) => {
  try {
    const response = await axios.post(`${API_URL}/produits`, produitData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduit = async (id, produitData) => {
  try {
    const response = await axios.put(`${API_URL}/produits/${id}`, produitData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduit = async (id) => {
  try {
    await axios.delete(`${API_URL}/produits/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};


// Get all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get a single category by ID
export const fetchCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/categories`,categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update an existing category
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_URL}/categories/${id}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};


export const fetchCommandes = async (status = "") => {
  const url = status
    ? `${API_URL}/commandes?status=${status}`
    : `${API_URL}/commandes/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return await response.json();
};


export const createCommande = async (commandeData) => {
  const response = await fetch(`${API_URL}/commandes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commandeData),
  });
  if (!response.ok) throw new Error("Failed to create order");
  return await response.json();
};

export const updateCommande = async (id, commandeData) => {
  const response = await fetch(`${API_URL}/commandes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commandeData),
  });
  if (!response.ok) throw new Error("Failed to update order");
  return await response.json();
};

export const deleteCommande = async (id) => {
  const response = await fetch(`${API_URL}/commandes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete order");
  return await response.json();
};
