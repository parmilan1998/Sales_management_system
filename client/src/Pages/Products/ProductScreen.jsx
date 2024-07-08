/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import fetchProducts from "../../api/fetchProducts";
import productApi from "../../api/products";

import ProductSearch from "../../Components/Products/ProductSearch";
import ProductTable from "../../Components/Products/ProductTable";
import ProductPagination from "../../Components/Products/ProductPagination";
import ProductSort from "../../Components/Products/ProductSort";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { message, Tooltip } from "antd";

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ASC");
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    fetchProducts(null, page, limit, sort, search, setProducts, setTotalPages);
  }, [page, limit, sort, search]);

  const confirmDelete = async (id) => {
    try {
      await productApi.delete(`/${id}`);
      message.success("Product deleted Successfully!");
      fetchProducts(
        null,
        page,
        limit,
        sort,
        search,
        setProducts,
        setTotalPages
      );
      setPage(1);
    } catch (err) {
      toast.error("Can't delete this product!");
      console.log(err);
    }
  };

  const cancelDelete = () => {
    message.error("Product deletion cancelled!");
  };

  return (
    <div className=" max-w-screen-xl mx-auto lg:px-8 font-poppins cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <h1 className="text-3xl font-semibold font-acme text-cyan-600">
            Products List
          </h1>
          <div className="flex gap-1 items-center">
            <h1 className="text-md font-medium text-gray-600">SortBy:</h1>
            <ProductSort
              sort={sort}
              setSort={setSort}
              fetchProducts={() =>
                fetchProducts(
                  null,
                  page,
                  limit,
                  sort,
                  search,
                  setProducts,
                  setTotalPages
                )
              }
            />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <ProductSearch
            search={search}
            setSearch={setSearch}
            setPage={setPage}
          />

          <Link to="/products/add">
            <Tooltip title="Add Product">
              <button className="flex mr-4 justify-center items-center text-white text-2xl px-3 py-3  gap-1 font-medium rounded-full bg-cyan-500">
                <MdAdd />
              </button>
            </Tooltip>
          </Link>
        </div>
      </div>
      <ProductTable
        products={products}
        page={page}
        limit={limit}
        confirmDelete={confirmDelete}
        cancelDelete={cancelDelete}
      />
      <ProductPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};

export default ProductScreen;
