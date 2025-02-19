import { Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./pages/Dashboard";
// import Orders from "./pages/Orders";
import Products from "./pages/Products";
// import Customers from "./pages/Customers";

function App() {
  return (
    <div className="d-flex">
      {/* Sidebar (Fixed Left) */}
      <Sidebar />

      {/* Main Content */}
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/orders" element={<Orders />} /> */}
          <Route path="/products" element={<Products />} />
          {/* <Route path="/customers" element={<Customers />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
