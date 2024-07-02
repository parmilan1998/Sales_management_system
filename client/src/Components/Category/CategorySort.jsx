import React from "react";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from "react-icons/fc";
import PropTypes from "prop-types";

const CategorySort = ({ sort, setSort, fetchCategories }) => {
  const handleSort = (selectedSort) => {
    if (sort === selectedSort) {
      selectedSort = sort === "ASC" ? "DESC" : "ASC";
    }
    setSort(selectedSort);
    fetchCategories();
  };
  return (
    <div>
      {sort === "ASC" ? (
        <button
          onClick={() => handleSort("DESC")}
          className="p-1 rounded-lg text-lg text-white bg-slate-100 border-blue-500"
        >
          <FcAlphabeticalSortingZa size={20} className="ml-2" />
        </button>
      ) : (
        <button
          onClick={() => handleSort("ASC")}
          className="p-1 rounded-lg text-lg text-white bg-slate-100 border-blue-500"
        >
          <FcAlphabeticalSortingAz size={20} className="ml-2" />
        </button>
      )}
    </div>
  );
};

CategorySort.propTypes = {
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
};

export default CategorySort;
