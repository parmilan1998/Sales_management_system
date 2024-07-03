import React, { useState } from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import PropTypes from "prop-types";

const PurchaseSort = ({ fetchPurchases }) => {
  const [sort, setSort] = useState("ASC");
  const handleSort = (selectedSort) => {
    if (sort === selectedSort) {
      selectedSort = sort === "ASC" ? "DESC" : "ASC";
    }
    setSort(selectedSort);
    fetchPurchases(selectedSort);
  };

  return (
    <div>
      {sort === "ASC" ? (
        <button
          onClick={() => handleSort("DESC")}
          className={`p-1 rounded-lg text-lg text-white bg-gray-500 ${
            sort === "DESC" ? "border-blue-500" : ""
          }`}
        >
          <AiOutlineSortDescending size={20} />
        </button>
      ) : (
        <button
          onClick={() => handleSort("ASC")}
          className={`p-1 rounded-lg text-lg text-white bg-blue-500 ${
            sort === "ASC" ? "border-blue-500" : ""
          }`}
        >
          <AiOutlineSortAscending size={20} />
        </button>
      )}
    </div>
  );
};

PurchaseSort.propTypes = {
  fetchPurchases: PropTypes.func.isRequired,
};

export default PurchaseSort;
