import { Fragment } from "react";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderOne from "../../wrappers/hero-slider/HeroSliderOne";
import TabProduct from "../../wrappers/product/TabProduct";

const HomeFashion = () => {
  return (
    <Fragment>
     
     
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-1"
      >
        {/* hero slider */}
        <HeroSliderOne />

      
        {/* tab product */}
        <TabProduct spaceBottomClass="pb-60" category="fashion" />

        {/* blog featured */}
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFashion;
