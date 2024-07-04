import React from "react";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";
import PropTypes from "prop-types";

const StockSort = ({ sort, setSort, fetchStocks }) => {
  const handleSort = (selectedSort) => {
    if (sort === selectedSort) {
      selectedSort = sort === "ASC" ? "DESC" : "ASC";
    }
    setSort(selectedSort);
    fetchStocks(selectedSort);
  };

  return (
    <div className="mt-1">
      {sort === "ASC" ? (
        <button
          onClick={() => handleSort("DESC")}
          className="p-1 rounded-lg text-lg text-white bg-blue-100 border-blue-500"
        >
          <FcAlphabeticalSortingZa size={20} className="ml-2" />
        </button>
      ) : (
        <button
          onClick={() => handleSort("ASC")}
          className="p-1 rounded-lg text-lg text-white bg-blue-100 border-blue-500"
        >
          <FcAlphabeticalSortingAz size={20} className="ml-2" />
        </button>
      )}
    </div>
  );
};

StockSort.propTypes = {
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
  fetchStocks: PropTypes.func.isRequired,
};

export default StockSort;
