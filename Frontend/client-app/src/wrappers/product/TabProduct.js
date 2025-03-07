import React, { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SectionTitle from "../../components/section-title/SectionTitle";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cart-slice";

const API_URL = "http://127.0.0.1:8000/api";

const TabProduct = ({ spaceTopClass, spaceBottomClass, bgColorClass }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

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
    return products.slice(0, 8);
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
                              src={`http://localhost:8000/${product.image}`}
                              alt={product.nom}
                            />
                          </Link>
                          <div className="product-action">
                            <div className="pro-same-action pro-cart">
                              <button onClick={() => dispatch(addToCart({
                                id: product.id,
                                nom: product.nom,
                                image: product.image,
                                prix: product.prix,
                                quantity: 1,
                                selectedProductColor: product.selectedProductColor || null,
                                selectedProductSize: product.selectedProductSize || null,
                              }))}>
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