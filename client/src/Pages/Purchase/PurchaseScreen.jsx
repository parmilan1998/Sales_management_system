/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import PurchaseCard from "../../Components/Purchase/PurchaseCard";
import { message } from "antd";
import toast from "react-hot-toast";
import { LuPlus } from "react-icons/lu";
import PurchaseSort from "../../Components/Purchase/PurchaseSort";
import PurchaseSearch from "../../Components/Purchase/PurchaseSearch";
import PurchasePagination from "../../Components/Purchase/PurchasePagination";
import { Link } from "react-router-dom";

const Purchase = () => {
  const [purchase, setPurchase] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(12);

  const fetchPurchases = async (sortType = "ASC") => {
    const url = `http://localhost:5000/api/v1/purchase/query?page=${page}&limit=${limit}&sort=${sortType}&keyword=${search}`;
    console.log(sortType);
    try {
      const res = await axios.get(url);
      const { purchases, pagination } = res.data;
      setPurchase(purchases);
      setTotalPages(pagination.totalPages);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPurchases();
    console.log("useEffect");
  }, [page, search, limit]);

  const confirmDelete = async (id) => {
    await axios
      .delete(`http://localhost:5000/api/v1/purchase/${id}`)
      .then((res) => {
        message.success("Purchase deleted Successfully!");
        fetchPurchases();
        setPage(1);
      })
      .catch((err) => {
        toast.error("Error deleting purchase!");
        console.log(err);
      });
  };

  const cancelDelete = () => {
    message.error("Purchase deletion cancelled!");
  };

  return (
    <div className=" max-w-screen-xl mx-auto lg:px-8 font-poppins">
      <div className="flex items-center justify-between gap-4 pb-5">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-medium font-acme">All Purchases </h1>
          <Link
            to="/purchase/add"
            className="bg-green-600 text-white px-3 py-2 rounded flex gap-2 items-center"
          >
            <LuPlus />
            New Purchase
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <h1>SortBy:</h1>
          <PurchaseSort fetchPurchases={(sort) => fetchPurchases(sort)} />
          <PurchaseSearch
            search={search}
            setSearch={setSearch}
            setPage={setPage}
          />
        </div>
      </div>
      <div>
        <PurchaseCard
          purchase={purchase}
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
        />
      </div>
      <PurchasePagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Purchase;
