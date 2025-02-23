import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getProductCartQuantity } from "../../helpers/product";
import { addToCart } from "../../store/slices/cart-slice";

const ProductDescriptionInfo = ({
  product,
  currency,
  finalProductPrice,
  cartItems,
}) => {
  const dispatch = useDispatch();

  // Ensure `product.variation` is always an array
  const variations = product.variation || [];
  const defaultVariation = variations.length > 0 ? variations[0] : null;

  // Handle missing properties with default values
  const [selectedProductColor, setSelectedProductColor] = useState(
    defaultVariation ? defaultVariation.color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    defaultVariation ? defaultVariation.size?.[0]?.name || "" : ""
  );
  const [productStock, setProductStock] = useState(
    defaultVariation ? defaultVariation.size?.[0]?.stock || product.stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  return (
    <div className="product-details-content ml-70">
      <h2>{product.nom}</h2>
      <div className="product-details-price">
        <span>{currency.currencySymbol + finalProductPrice}</span>
      </div>
      <div className="pro-details-list">
        <p>{product.description}</p>
      </div>

      {/* Add to Cart */}
      <div className="pro-details-quality">
        <div className="cart-plus-minus">
          <button
            onClick={() => setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)}
            className="dec qtybutton"
          >
            -
          </button>
          <input className="cart-plus-minus-box" type="text" value={quantityCount} readOnly />
          <button
            onClick={() =>
              setQuantityCount(
                quantityCount < productStock - productCartQty
                  ? quantityCount + 1
                  : quantityCount
              )
            }
            className="inc qtybutton"
          >
            +
          </button>
        </div>
        <div className="pro-details-cart btn-hover">
          
            <button
              onClick={() =>
                dispatch(addToCart({
                  ...product,
                  quantity: quantityCount,
                  selectedProductColor,
                  selectedProductSize,
                }))
              }
              disabled={productCartQty >= productStock}
            >
              Add To Cart
            </button>
          
        </div>
      </div>
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  cartItems: PropTypes.array,
  currency: PropTypes.shape({
    currencySymbol: PropTypes.string,
  }),
  product: PropTypes.shape({
    nom: PropTypes.string,
    description: PropTypes.string,
    stock: PropTypes.number,
    variation: PropTypes.array,
  }),
};

export default ProductDescriptionInfo;
