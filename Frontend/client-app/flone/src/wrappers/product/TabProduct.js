import React, { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SectionTitle from "../../components/section-title/SectionTitle";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

const TabProduct = ({ spaceTopClass, spaceBottomClass, bgColorClass }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/produits`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductsByCategory = (type) => {
    return products.slice(0, 8); // Adjust logic to filter products if needed
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div
      className={clsx(
        "product-area",
        spaceTopClass,
        spaceBottomClass,
        bgColorClass
      )}
    >
      <div className="container">
        <SectionTitle titleText="DAILY DEALS!" positionClass="text-center" />
        <Tab.Container defaultActiveKey="bestSeller">
          <Nav
            variant="pills"
            className="product-tab-list pt-30 pb-55 text-center"
          >
            <Nav.Item>
              <Nav.Link eventKey="newArrival">
                <h4>New Arrivals</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bestSeller">
                <h4>Best Sellers</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="saleItems">
                <h4>Sale Items</h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            {["newArrival", "bestSeller", "saleItems"].map((tab) => (
              <Tab.Pane eventKey={tab} key={tab}>
                <div className="row">
                  {getProductsByCategory(tab).map((product) => (
                    <div
                      className="col-xl-3 col-md-6 col-lg-4 col-sm-6"
                      key={product.id}
                    >
                      <div className={clsx("product-wrap", "mb-25")}>
                        <div className="product-img">
                          <Link to={`/product/${product.id}`}>
                            <img
                              className="default-img"
                              src={product.image}
                              alt={product.nom}
                            />
                          </Link>
                          <div className="product-action">
                            <div className="pro-same-action pro-cart">
                              <button>
                                <i className="pe-7s-cart"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="product-content text-center">
                          <h3>
                            <Link to={`/product/${product.id}`}>
                              {product.nom}
                            </Link>
                          </h3>
                          <div className="product-price">
                            <span>${product.prix.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default TabProduct;
