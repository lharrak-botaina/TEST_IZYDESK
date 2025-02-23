import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Fragment } from "react";
import Swiper, { SwiperSlide } from "../../components/swiper";
import ProductDescriptionInfo from "../../components/product/ProductDescriptionInfo";

const ProductImageDescription = ({ spaceTopClass, spaceBottomClass, product }) => {
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  
  const finalProductPrice = +(product.prix * currency.currencyRate).toFixed(2);

  // ✅ Ensure `product.image` is always an array
  const images = Array.isArray(product.image) ? product.image : [product.image];

  return (
    <div className={clsx("shop-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            {/* ✅ Product Image Gallery */}
            <Fragment>
              <div className="row row-5 test">
                <div className="product-large-image-wrapper">
                  {images.length > 0 ? (
                    <Swiper>
                      {images.map((image, key) => (
                        <SwiperSlide key={key}>
                          <div className="single-image">
                            <img
                              src={`http://localhost:8000/${product.image}`}
                              className="img-fluid"
                              alt={`Product ${key}`}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>
            </Fragment>
          </div>

          <div className="col-lg-6 col-md-6">
            {/* ✅ Product Description Info */}
            <ProductDescriptionInfo
              product={product}
              currency={currency}
              finalProductPrice={finalProductPrice}
              cartItems={cartItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ProductImageDescription.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }),
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default ProductImageDescription;
