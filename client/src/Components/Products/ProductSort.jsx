/* eslint-disable react/prop-types */
import React from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

const ProductSort = ({ sort, setSort, fetchProducts }) => {
  const handleSort = (selectedSort) => {
    if (sort === selectedSort) {
      selectedSort = sort === "ASC" ? "DESC" : "ASC";
    }
    setSort(selectedSort);
    fetchProducts();
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

export default ProductSort;
