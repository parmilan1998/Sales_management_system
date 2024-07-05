import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import categoryApi from "../../api/category";
import fetchProducts from "../../api/fetchProducts";
import ProductSearch from "../../Components/Products/ProductSearch";
import ProductPagination from "../../Components/Products/ProductPagination";
import ProductSort from "../../Components/Products/ProductSort";

const SingleCategory = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const baseUrl = "http://localhost:5000/public/products";

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ASC");
  const [limit, setLimit] = useState(6);

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
    fetchProducts(id, page, limit, sort, search, setProducts, setTotalPages);
  }, [id, page, limit, sort, search]);

  return (
    <div className="single-category px-4">
      <div className="flex justify-between items-center mx-4 mb-4 mt-2">
        <div className="flex gap-2 mt-2 mr-0 items-center">
          <h2 className="text-3xl  font-semibold mt-0">
            {category.categoryName}
          </h2>
          <div className="mt-1 ">
            <ProductSort
              sort={sort}
              setSort={setSort}
              fetchProducts={fetchProducts}
            />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <ProductSearch
            search={search}
            setSearch={setSearch}
            setPage={setPage}
          />
        </div>
      </div>
      <div className="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 ">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.productID}
              className="product-card p-4 border rounded-lg shadow bg-white  w-72 h-auto  flex flex-col  justify-center"
            >
              <div className="flex flex-col items-center justify-center bg-slate-300">
                <img
                  src={`${baseUrl}/${product.imageUrl}`}
                  alt={product.productName}
                  className=" object-cover h-32 m-1  "
                />
              </div>

              <h3 className="text-lg font-medium">{product.productName}</h3>
              <p className="text-sm">{product.productDescription}</p>
              <p className="text-sm font-semibold">{`Lkr.${product.unitPrice}`}</p>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      <ProductPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};

SingleCategory.propTypes = {
  categoryId: PropTypes.string,
  categoryName: PropTypes.string,
};

export default SingleCategory;
