import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import productApi from "../../api/products";
import categoryApi from "../../api/category";

const SingleCategory = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const baseUrl = "http://localhost:5000/public/products";

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await categoryApi.get(`/${id}`);
        setCategory(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategory();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.get(`/fbc/${id}`);
        setProducts(res.data);
        console.log("sss", res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [id]);

  return (
    <div className="single-category">
      <h2 className="text-2xl font-semibold">{category.categoryName}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.productID}
              className="product-card p-4 border rounded-lg shadow"
            >
              <img
                src={`${baseUrl}/${product.imageUrl}`}
                alt={product.productName}
                className="w-full h-32 object-cover mb-2"
              />
              <h3 className="text-lg font-medium">{product.productName}</h3>
              <p className="text-sm">{product.productDescription}</p>
              <p className="text-sm font-semibold">{`$${product.unitPrice}`}</p>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

SingleCategory.propTypes = {
  categoryId: PropTypes.string,
  categoryName: PropTypes.string,
};

export default SingleCategory;
