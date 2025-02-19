import React, { useState, useEffect } from "react";
import {
  fetchProduits,
  createProduit,
  updateProduit,
  deleteProduit,
  fetchCategories,
} from "../services/api";
import { Button, Table, Modal, Form, Spinner, Alert } from "react-bootstrap";

const ProduitsPage = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [newProduit, setNewProduit] = useState({
    nom: "",
    categorie: "",
    prix: "",
  });
  const [editingProduit, setEditingProduit] = useState(null);

  useEffect(() => {
    loadProduits();
    loadCategories();
  }, []);

  const loadProduits = async () => {
    setLoading(true);
    try {
      const data = await fetchProduits();
      setProduits(data);
      setError(null);
    } catch (err) {
      setError("Error loading products");
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError("Error loading categories");
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingProduit) {
        await updateProduit(editingProduit.id, {
          ...editingProduit,
          categorie: categories.find(
            (c) => c.id === parseInt(editingProduit.categorie)
          ), // Send the full category object
        });
      } else {
        await createProduit({
          ...newProduit,
          categorie: categories.find(
            (c) => c.id === parseInt(newProduit.categorie)
          ), // Send the full category object
        });
      }
      setNewProduit({ nom: "", categorie: "", prix: "" });
      setEditingProduit(null);
      setShow(false);
      loadProduits();
    } catch (err) {
      setError("Error saving product");
    }
  };

  const handleEdit = (produit) => {
    setEditingProduit({
      ...produit,
      categorie: produit.categorie.id, // Store only the category ID
    });
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduit(id);
        loadProduits();
      } catch (err) {
        setError("Error deleting product");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Fresh Bootstrap Table - Products</h1>

      {/* Add Product Button */}
      <Button variant="dark" className="mb-3" onClick={() => setShow(true)}>
        + Add Product
      </Button>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <div className="fresh-table full-color-orange">
          <Table
            id="fresh-table"
            striped
            bordered
            hover
            className="table"
            responsive
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Categorie</th>
                <th>Prix ($)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((produit) => (
                <tr key={produit.id}>
                  <td>{produit.id}</td>
                  <td>{produit.nom}</td>
                  <td>{produit.categorie.nom}</td> {/* Display category name */}
                  <td>{produit.prix}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(produit)}
                    >
                      <i className="fa fa-edit"></i>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(produit.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduit ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateOrUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={editingProduit ? editingProduit.nom : newProduit.nom}
                onChange={(e) =>
                  editingProduit
                    ? setEditingProduit({
                        ...editingProduit,
                        nom: e.target.value,
                      })
                    : setNewProduit({ ...newProduit, nom: e.target.value })
                }
                required
              />
            </Form.Group>

            {/* Dropdown for Category */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={
                  editingProduit
                    ? editingProduit.categorie
                    : newProduit.categorie
                }
                onChange={(e) => {
                  if (editingProduit) {
                    setEditingProduit({
                      ...editingProduit,
                      categorie: parseInt(e.target.value),
                    });
                  } else {
                    setNewProduit({
                      ...newProduit,
                      categorie: parseInt(e.target.value),
                    });
                  }
                }}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={editingProduit ? editingProduit.prix : newProduit.prix}
                onChange={(e) =>
                  editingProduit
                    ? setEditingProduit({
                        ...editingProduit,
                        prix: e.target.value,
                      })
                    : setNewProduit({ ...newProduit, prix: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {editingProduit ? "Update Product" : "Add Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProduitsPage;
