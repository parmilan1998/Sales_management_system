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
import GridLoader from "react-spinners/GridLoader";

const Purchase = () => {
  const [purchase, setPurchase] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(9);
  const [sortName, setSortName] = useState("ASC");
  const [sortDate, setSortDate] = useState("ASC");
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    const url = `http://localhost:5000/api/v1/purchase/query?page=${page}&limit=${limit}&sort=${sortName}&sortBy=${sortDate}&keyword=${search}`;

    try {
      const res = await axios.get(url);
      const { purchases, pagination } = res.data;
      setPurchase(purchases);
      setTotalPages(pagination.totalPages);
      setLoading(false);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [page, search, limit, sortDate, sortName]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-[75vh]">
          <GridLoader
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
            color="#4682B4"
          />
        </div>
      ) : (
        <div className=" max-w-screen-xl mx-auto lg:px-8 font-poppins">
          <div className="flex lg:flex-row md:flex-row flex-col items-center justify-between gap-4 pb-5">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-medium font-acme">All Purchases </h1>
              <Link
                to="/purchase/add"
                className="bg-green-600 text-white px-3 py-1.5 rounded flex gap-2 items-center"
              >
                <LuPlus />
                New Purchase
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <h1>SortBy:</h1>
              <PurchaseSort
                sortName={sortName}
                setSortName={setSortName}
                sortDate={sortDate}
                setSortDate={setSortDate}
              />
              <PurchaseSearch
                search={search}
                setSearch={setSearch}
                setPage={setPage}
              />
            </div>
          </div>
          <div>
            <PurchaseCard purchase={purchase} />
          </div>
          <PurchasePagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  );
};

export default Purchase;
