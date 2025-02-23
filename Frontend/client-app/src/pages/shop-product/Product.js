import React, { Fragment, useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import axios from "axios";
import LayoutOne from "../../layouts/LayoutOne";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";

const API_URL = "http://127.0.0.1:8000/api";

const Product = () => {
  let { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/produits/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <Fragment>
      <LayoutOne headerTop="visible">
        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
        />
      </LayoutOne>
    </Fragment>
  );
};

export default Product;
