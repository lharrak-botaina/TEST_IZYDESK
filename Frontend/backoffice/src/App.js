import { Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Commandes from "./pages/Commandes";
import { userRoutes } from "./routes/allRoutes";

function App() {
  return (
    <div className="d-flex">
      {/* Sidebar (Fixed Left) */}
      <Sidebar />

      {/* Main Content */}
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/commandes" element={<Commandes />} />
          {userRoutes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.component} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default App;
