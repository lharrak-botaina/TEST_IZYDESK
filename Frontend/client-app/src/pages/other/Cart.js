import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import { addToCart, decreaseQuantity, deleteFromCart, deleteAllFromCart } from "../../store/slices/cart-slice";
import { cartItemStock } from "../../helpers/product";

const Cart = () => {
  let cartTotalPrice = 0;
  const [quantityCount] = useState(1);
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <Fragment>
      <LayoutOne headerTop="visible">
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items </h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((cartItem, key) => {
                            const itemPrice = cartItem.prix || 0;
                            const itemDiscount = cartItem.discount || 0;
                            const currencyRate = currency.currencyRate || 1;

                            const discountedPrice = getDiscountPrice(itemPrice, itemDiscount) || itemPrice;
                            const finalProductPrice = (itemPrice * currencyRate).toFixed(2);
                            const finalDiscountedPrice = (discountedPrice * currencyRate).toFixed(2);

                            cartTotalPrice += parseFloat(
                              cartItem.discount ? finalDiscountedPrice * cartItem.quantity : finalProductPrice * cartItem.quantity
                            );

                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link to={`/product/${cartItem.id}`}>
                                    <img
                                      className="img-fluid"
                                    
                                      src={`http://localhost:8000/${cartItem.image}`}
                                      />
                                  </Link>
                                </td>

                                <td className="product-name">
                                  <Link to={`/product/${cartItem.id}`}>{cartItem.nom}</Link>
                                  {cartItem.selectedProductColor && cartItem.selectedProductSize && (
                                    <div className="cart-item-variation">
                                      <span>Color: {cartItem.selectedProductColor}</span>
                                      <span>Size: {cartItem.selectedProductSize}</span>
                                    </div>
                                  )}
                                </td>

                                <td className="product-price-cart">
                                  {cartItem.discount ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {currency.currencySymbol + finalProductPrice}
                                      </span>
                                      <span className="amount">
                                        {currency.currencySymbol + finalDiscountedPrice}
                                      </span>
                                    </Fragment>
                                  ) : (
                                    <span className="amount">
                                      {currency.currencySymbol + finalProductPrice}
                                    </span>
                                  )}
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    <button
                                      className="dec qtybutton"
                                      onClick={() => dispatch(decreaseQuantity(cartItem))}
                                    >
                                      -
                                    </button>
                                    <input className="cart-plus-minus-box" type="text" value={cartItem.quantity} readOnly />
                                    <button
                                      className="inc qtybutton"
                                      onClick={() =>
                                        dispatch(addToCart({ ...cartItem, quantity: quantityCount }))
                                      }
                                      disabled={
                                        cartItem.quantity >=
                                        cartItemStock(cartItem, cartItem.selectedProductColor, cartItem.selectedProductSize)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="product-subtotal">
                                  {cartItem.discount
                                    ? currency.currencySymbol + (finalDiscountedPrice * cartItem.quantity).toFixed(2)
                                    : currency.currencySymbol + (finalProductPrice * cartItem.quantity).toFixed(2)}
                                </td>

                                <td className="product-remove">
                                  <button onClick={() => dispatch(deleteFromCart(cartItem.cartItemId))}>
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to="/shop-grid-standard">Continue Shopping</Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => dispatch(deleteAllFromCart())}>
                          Clear Shopping Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">Cart Total</h4>
                      </div>
                      <h5>
                        Total products{" "}
                        <span>{currency.currencySymbol + cartTotalPrice.toFixed(2)}</span>
                      </h5>
                      <h4 className="grand-totall-title">
                        Grand Total{" "}
                        <span>{currency.currencySymbol + cartTotalPrice.toFixed(2)}</span>
                      </h4>
                      <Link to="/checkout">Proceed to Checkout</Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart <br />
                      <Link to="/shop-grid-standard">Shop Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
