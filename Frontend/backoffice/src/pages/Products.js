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
  const [success, setSuccess] = useState(null);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteProduitId, setDeleteProduitId] = useState(null);

  const [newProduit, setNewProduit] = useState({
    nom: "",
    categorie: "",
    prix: "",
    description: "",
    image: null,
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

    const formData = new FormData();
    formData.append(
      "nom",
      editingProduit ? editingProduit.nom : newProduit.nom
    );
    formData.append(
      "description",
      editingProduit ? editingProduit.description : newProduit.description
    );
    formData.append(
      "prix",
      editingProduit ? editingProduit.prix : newProduit.prix
    );
    formData.append(
      "categorie_id",
      editingProduit ? editingProduit.categorie : newProduit.categorie
    );

    if (newProduit.image || (editingProduit && editingProduit.image)) {
      formData.append("image", newProduit.image || editingProduit.image);
    }

    try {
      if (editingProduit) {
        await updateProduit(editingProduit.id, formData);
        setSuccess("Product updated successfully!");
      } else {
        await createProduit(formData);
        setSuccess("Product added successfully!");
      }
      setNewProduit({
        nom: "",
        description: "",
        prix: "",
        categorie: "",
        image: null,
      });
      setEditingProduit(null);
      setShow(false);
      loadProduits();
    } catch (err) {
      setError("Error saving product");
    } finally {
      hideAlertAfterDelay();
    }
  };

  const handleEdit = (produit) => {
    setEditingProduit({
      ...produit,
      categorie: produit.categorie.id,
    });
    setShow(true);
  };

const handleDelete = async () => {
  try {
    await deleteProduit(deleteProduitId);
    setSuccess("Product deleted successfully!");
    loadProduits();
  } catch (err) {
    setError("Error deleting product");
  } finally {
    hideAlertAfterDelay();
    setShowDeleteModal(false);
  }
};
 const handleConfirmDelete = (id) => {
   setDeleteProduitId(id);
   setShowDeleteModal(true);
 };
  const hideAlertAfterDelay = () => {
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 3000);
  };

  return (
    <div className="container mt-4">
      <h1>List Products</h1>

      {/* Success and Error Alerts */}
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Button variant="dark" className="mb-3" onClick={() => setShow(true)}>
        + Add Product
      </Button>

      {loading && <Spinner animation="border" />}

      {!loading && (
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
                <th>Image</th>
                <th>Nom</th>
                <th>Categorie</th>
                <th>Prix ($)</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((produit) => (
                <tr key={produit.id}>
                  <td>
                    <img
                      src={`http://localhost:8000${produit.image}`}
                      alt={produit.nom}
                      width="100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/50";
                      }}
                    />
                  </td>
                  <td>{produit.nom}</td>
                  <td>{produit.categorie.nom}</td>
                  <td>{produit.prix}</td>
                  <td>{produit.description}</td>
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
                      onClick={() => handleConfirmDelete(produit.id)}
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
          <Form onSubmit={handleCreateOrUpdate} encType="multipart/form-data">
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
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={
                  editingProduit
                    ? editingProduit.categorie
                    : newProduit.categorie
                }
                onChange={(e) => {
                  const categoryId = parseInt(e.target.value);
                  if (editingProduit) {
                    setEditingProduit({
                      ...editingProduit,
                      categorie: categoryId,
                    });
                  } else {
                    setNewProduit({ ...newProduit, categorie: categoryId });
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
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={
                  editingProduit
                    ? editingProduit.description
                    : newProduit.description
                }
                onChange={(e) =>
                  editingProduit
                    ? setEditingProduit({
                        ...editingProduit,
                        description: e.target.value,
                      })
                    : setNewProduit({
                        ...newProduit,
                        description: e.target.value,
                      })
                }
                required
              />
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

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  if (editingProduit) {
                    setEditingProduit({
                      ...editingProduit,
                      image: e.target.files[0],
                    });
                  } else {
                    setNewProduit({ ...newProduit, image: e.target.files[0] });
                  }
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {editingProduit ? "Update Product" : "Add Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProduitsPage;
