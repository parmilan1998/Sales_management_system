/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import ProductSearch from "../../Components/Products/ProductSearch";
import ProductTable from "../../Components/Products/ProductTable";
import ProductPagination from "../../Components/Products/ProductPagination";
import ProductSort from "../../Components/Products/ProductSort";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { message } from "antd";

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ASC");
  const [limit, setLimit] = useState(5);

  const fetchProducts = async () => {
    const url = `http://localhost:5000/api/v1/product/query?page=${page}&limit=${limit}&sort=${sort}&keyword=${search}`;
    try {
      const res = await axios.get(url);
      const { products, pagination } = res.data;
      setProducts(products);
      setTotalPages(pagination.totalPages);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sort, search, limit]);

  const confirmDelete = async (id) => {
    await axios
      .delete(`http://localhost:5000/api/v1/product/${id}`)
      .then((res) => {
        message.success("Product deleted Successfully!");
        fetchProducts();
        setPage(1);
      })
      .catch((err) => {
        toast.error("Error deleting product!");
        console.log(err);
      });
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
          <ProductSort
            sort={sort}
            setSort={setSort}
            fetchProducts={fetchProducts}
          />
        </div>
        <div className="flex gap-4 items-center">
          <ProductSearch
            search={search}
            setSearch={setSearch}
            setPage={setPage}
          />

          <Link to="/products/add">
            <button className="flex mr-4 justify-center items-center text-white text-2xl px-3 py-3  gap-1 font-medium rounded-full bg-cyan-500">
              <MdAdd />
            </button>
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
