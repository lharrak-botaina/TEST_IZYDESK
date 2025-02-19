import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import { Button, Table, Modal, Form, Spinner, Alert } from "react-bootstrap";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [newCategory, setNewCategory] = useState({ nom: "" });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Error loading categories");
    }
    setLoading(false);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, editingCategory);
      } else {
        await createCategory(newCategory);
      }
      setNewCategory({ nom: "" });
      setEditingCategory(null);
      setShow(false);
      loadCategories();
    } catch (err) {
      setError("Error saving category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (err) {
        setError("Error deleting category");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Fresh Bootstrap Table - Categories</h1>

      {/* Add Category Button */}
      <Button variant="dark" className="mb-3" onClick={() => setShow(true)}>
        + Add Category
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
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.nom}</td> {/* Fixed Field */}
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(category)}
                    >
                      <i className="fa fa-edit"></i>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
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

      {/* Add/Edit Category Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? "Edit Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateOrUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={editingCategory ? editingCategory.nom : newCategory.nom}
                onChange={(e) =>
                  editingCategory
                    ? setEditingCategory({
                        ...editingCategory,
                        nom: e.target.value,
                      })
                    : setNewCategory({ nom: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {editingCategory ? "Update Category" : "Add Category"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
