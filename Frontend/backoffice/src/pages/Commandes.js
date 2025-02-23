import React, { useState, useEffect } from "react";
import {
  fetchCommandes,
  updateCommande,
  deleteCommande,
  fetchProduits,
} from "../services/api";
import {
  Button,
  Table,
  Modal,
  Spinner,
  Alert,
  Dropdown,
} from "react-bootstrap";

const CommandesPage = () => {
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);

  useEffect(() => {
    loadCommandes();
    loadProduits();
  }, [statusFilter]);

 const loadCommandes = async () => {
   setLoading(true);
   try {
     const data = await fetchCommandes(
       statusFilter === "All" ? "" : statusFilter
     );
     setCommandes(data);
     setError(null);
   } catch (err) {
     setError("Error loading orders");
   }
   setLoading(false);
 };


  const loadProduits = async () => {
    try {
      const data = await fetchProduits();
      setProduits(data);
    } catch (err) {
      setError("Error loading products");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateCommande(id, { status: newStatus });
      setSuccess(`Order ${id} updated to ${newStatus}`);
      loadCommandes();
    } catch (err) {
      setError("Error updating status");
    } finally {
      hideAlertAfterDelay();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteCommande(id);
        setSuccess("Order deleted successfully!");
        loadCommandes();
      } catch (err) {
        setError("Error deleting order");
      } finally {
        hideAlertAfterDelay();
      }
    }
  };

  const handleViewOrder = (commande) => {
    setSelectedCommande(commande);
    setShowViewModal(true);
  };

  const hideAlertAfterDelay = () => {
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 3000);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "warning",
      Shipped: "info",
      Delivered: "success",
      Canceled: "secondary",
    };
    return <span className={`badge bg-${statusColors[status]}`}>{status}</span>;
  };

  return (
    <div className="container mt-4">
      <h1>Commandes Management</h1>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      

      {!loading && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Products</th>
              <th>Amount ($)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((commande) => {
              const totalAmount = commande.produits.reduce(
                (sum, p) => sum + p.produit.prix * p.quantite,
                0
              );

              return (
                <tr key={commande.id}>
                  <td>{commande.id}</td>
                  <td>{new Date(commande.date).toLocaleString()}</td>
                  <td>
                    {commande.produits.map((p) => (
                      <div key={p.id} className="d-flex align-items-center">
                        
                        <div>
                          {p.produit.nom} (x{p.quantite})
                        </div>
                      </div>
                    ))}
                  </td>
                  <td>${totalAmount.toLocaleString()}</td>
                  <td>{getStatusBadge(commande.status)}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleViewOrder(commande)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* View Order Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCommande && (
            <>
              <p>
                <strong>Order ID:</strong> {selectedCommande.id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedCommande.date).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {getStatusBadge(selectedCommande.status)}
              </p>
              <p>
                <strong>Products:</strong>
              </p>
              <ul className="list-group">
                {selectedCommande.produits.map((p) => (
                  <li
                    key={p.id}
                    className="list-group-item d-flex align-items-center"
                  >
                    <img
                      src={p.produit.image}
                      alt={p.produit.nom}
                      width="50"
                      height="50"
                      className="me-2"
                      style={{ borderRadius: "8px" }}
                    />
                    <div>
                      <strong>{p.produit.nom}</strong> - x{p.quantite} - $
                      {p.produit.prix.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                <strong>Total Amount:</strong> $
                {selectedCommande.produits
                  .reduce((sum, p) => sum + p.produit.prix * p.quantite, 0)
                  .toLocaleString()}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommandesPage;
