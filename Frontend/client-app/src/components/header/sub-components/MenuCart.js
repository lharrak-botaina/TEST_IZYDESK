import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDiscountPrice } from "../../../helpers/product";
import { deleteFromCart } from "../../../store/slices/cart-slice";

const MenuCart = () => {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  let cartTotalPrice = 0;

  return (
    <div className="shopping-cart-content">
      {cartItems && cartItems.length > 0 ? (
        <Fragment>
          <ul>
            {cartItems.map((item) => {
              // Ensure numeric values
              const itemPrice = item.prix || 0;
              const itemDiscount = item.discount || 0;
              const currencyRate = currency.currencyRate || 1;

              const discountedPrice = getDiscountPrice(itemPrice, itemDiscount) || itemPrice;
              const finalProductPrice = (itemPrice * currencyRate).toFixed(2);
              const finalDiscountedPrice = (discountedPrice * currencyRate).toFixed(2);

              // Fix NaN issue by ensuring all calculations are based on numbers
              cartTotalPrice += parseFloat(
                (item.discount ? finalDiscountedPrice : finalProductPrice) * item.quantity
              );

              return (
                <li className="single-shopping-cart" key={item.cartItemId}>
                  <div className="shopping-cart-img">
                    <Link to={`/product/${item.id}`}>
                    
                    </Link>
                  </div>
                  <div className="shopping-cart-title">
                    <h4>
                      <Link to={`/product/${item.id}`}>{item.nom}</Link>
                    </h4>
                    <h6>Qty: {item.quantity}</h6>
                    <span>
                      {currency.currencySymbol}
                      {item.discount ? finalDiscountedPrice : finalProductPrice}
                    </span>
                    {item.selectedProductColor && item.selectedProductSize && (
                      <div className="cart-item-variation">
                        <span>Color: {item.selectedProductColor}</span>
                        <span>Size: {item.selectedProductSize}</span>
                      </div>
                    )}
                  </div>
                  <div className="shopping-cart-delete">
                    <button onClick={() => dispatch(deleteFromCart(item.cartItemId))}>
                      <i className="fa fa-times-circle" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="shopping-cart-total">
            <h4>
              Total :{" "}
              <span className="shop-total">
                {currency.currencySymbol}
                {cartTotalPrice.toFixed(2)}
              </span>
            </h4>
          </div>
          <div className="shopping-cart-btn btn-hover text-center">
            <Link className="default-btn" to="/cart">
              View Cart
            </Link>
            <Link className="default-btn" to="/checkout">
              Checkout
            </Link>
          </div>
        </Fragment>
      ) : (
        <p className="text-center">No items added to cart</p>
      )}
    </div>
  );
};

export default MenuCart;
