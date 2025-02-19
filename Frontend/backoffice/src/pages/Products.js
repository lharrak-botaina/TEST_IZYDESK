import { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // ✅ Ensure correct backend URL

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nom: "",
    categorie: "",
    prix: "",
  });

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // ✅ Function to handle form submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/produits`, newProduct, {
        headers: { "Content-Type": "application/json" },
      });

      // ✅ Update product list with the new product
      setProducts([...products, response.data]);
      setShow(false);
      setNewProduct({ nom: "", categorie: "", prix: "" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Fresh Bootstrap Table - Products</h1>

      {/* Add Product Button */}
      <Button variant="primary" className="mb-3" onClick={() => setShow(true)}>
        + Add Product
      </Button>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <div className="fresh-table full-color-orange">
         
          <table
            id="fresh-table"
            className="table"
            data-toggle="table"
            data-search="true"
            data-pagination="true"
            data-page-size="5"
          >
            <thead>
              <tr>
                <th data-field="id">ID</th>
                <th data-field="name" data-sortable="true">
                  Nom
                </th>
                <th data-field="category" data-sortable="true">
                  categorie
                </th>
                <th data-field="price" data-sortable="true">
                  prix ($)
                </th>

                <th data-field="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.nom}</td>
                  <td>{product.categorie.nom}</td>
                  <td>{product.prix}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2">
                      <i className="fa fa-edit"></i>
                    </Button>
                    <Button variant="danger" size="sm">
                      <i className="fa fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={newProduct.nom}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, nom: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={newProduct.categorie}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, categorie: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={newProduct.prix}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, prix: e.target.value })
                }
                required
              />
            </Form.Group>
            
            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Products;
