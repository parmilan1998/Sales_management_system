import React from "react";
import PropTypes from "prop-types";
import { IoSearch } from "react-icons/io5";

const CategorySearch = ({ search, setSearch, setPage }) => {
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex relative flex-wrap my-2 mx-2 ">
      <IoSearch className="my-2 ml-2 absolute text-blue-400 " />
      <input
        type="text"
        placeholder="Search Categories..."
        value={search}
        onChange={handleSearch}
        className="pl-8 py-1 m-0 rounded-lg text-sm focus:outline-cyan-500 w-52"
      />
    </div>
  );
};

CategorySearch.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default CategorySearch;
