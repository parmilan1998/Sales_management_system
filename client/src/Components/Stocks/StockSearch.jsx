import React from "react";
import PropTypes from "prop-types";
import { IoSearch } from "react-icons/io5";

const StockSearch = ({ search, setSearch, setPage }) => {
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex relative flex-wrap  mx-2  mt-2 rounded-md">
      <IoSearch className=" ml-2 mt-2 absolute text-blue-400 " />
      <input
        type="text"
        placeholder="Search Stocks..."
        value={search}
        onChange={handleSearch}
        className="pl-8 py-1 m-0 rounded-lg text-sm focus:outline-cyan-500 w-48"
      />
    </div>
  );
};

StockSearch.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default StockSearch;
