import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { getSortedProducts } from '../../helpers/product';
import LayoutOne from '../../layouts/LayoutOne';
import clsx from 'clsx';

const API_URL = "http://127.0.0.1:8000/api/produits";

const ShopGridStandard = () => {
    const [layout, setLayout] = useState('grid three-column');
    const [sortType, setSortType] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const pageLimit = 15;
    let { pathname } = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(API_URL);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let sortedProducts = getSortedProducts(products, sortType, sortValue);
        const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);
        sortedProducts = filterSortedProducts;
        setSortedProducts(sortedProducts);
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

    return (
        <Fragment>
            <LayoutOne headerTop="visible">
                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9 order-1 order-lg-2">
                                {loading ? <p>Loading products...</p> :
                                    <div className="shop-bottom-area mt-35">
                                        <div className={clsx("row", layout)}>
                                            {currentData.map((product) => (
                                                <div className="col-xl-4 col-sm-6" key={product.id}>
                                                    <div className="product-wrap">
                                                        <div className="product-img">
                                                            <img
                                                                className="default-img"
                                                                src={`http://localhost:8000/${product.image}`}
                                                                />

                                                        </div>
                                                        <div className="product-content text-center">
                                                            <h3>{product.nom}</h3>
                                                            <span>${product.prix}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    );
};

export default ShopGridStandard;
