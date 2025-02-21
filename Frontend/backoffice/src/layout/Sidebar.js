import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png"; 
const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column vh-100  text-white p-3"
      style={{
        width: "250px",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#9B004A21",
      }}
    >
      {/* Sidebar Header */}
      <div className="mb-4 text-center">
        <h4 className="d-flex align-items-center ">
          <img src={logo} alt="Logo" width="180" className="me-2" />
        </h4>
        <hr className="border-light" />
      </div>

      {/* Navigation Items */}
      <Nav className="flex-column">
        {/* <Nav.Link as={Link} to="/" className="text-white">
          <i className="fas fa-home me-2"></i> Home
        </Nav.Link> */}
        <Nav.Link as={Link} to="/dashboard" className="text-black">
          <i className="fas fa-chart-line me-2"></i> Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/products" className="text-black">
          <i className="fas fa-th-large me-2"></i> Produits
        </Nav.Link>
        <Nav.Link as={Link} to="/categories" className="text-black">
          <i className="fas fa-users me-2"></i> categories
        </Nav.Link>
        <Nav.Link as={Link} to="/commandes" className="text-black">
          <i className="fas fa-box me-2"></i> Commandes
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
