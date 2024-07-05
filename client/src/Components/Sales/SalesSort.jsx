import React from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import PropTypes from "prop-types";

const SalesSort = ({ sort, setSort, fetchSales }) => {
  const handleSort = (selectedSort) => {
    if (sort === selectedSort) {
      selectedSort = sort === "ASC" ? "DESC" : "ASC";
    }
    setSort(selectedSort);
    fetchSales();
  };

  return (
    <div>
      {sort === "ASC" ? (
        <button
          onClick={() => handleSort("DESC")}
          className={`p-2 rounded-lg text-lg text-white bg-cyan-500 ${
            sort === "DESC" ? "border-blue-500" : ""
          }`}
        >
          <AiOutlineSortDescending size={20} />
        </button>
      ) : (
        <button
          onClick={() => handleSort("ASC")}
          className={`p-2 rounded-lg text-lg text-white bg-blue-500 ${
            sort === "ASC" ? "border-blue-500" : ""
          }`}
        >
          <AiOutlineSortAscending size={20} />
        </button>
      )}
    </div>
  );
};

SalesSort.propTypes = {
  fetchSales: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
};

export default SalesSort;
