import React from "react";
import PropTypes from "prop-types";
import { IoSearch } from "react-icons/io5";

const CategorySearch = ({ search, setSearch, setPage }) => {
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      {" "}
      <div className="flex flex-wrap">
        <IoSearch className="mr-2 mt-2 text-blue-400" />
        <input
          type="text"
          placeholder="Search Categories..."
          value={search}
          onChange={handleSearch}
          className="px-2 py-1 m-0 rounded-lg focus:outline-cyan-500"
        />
      </div>
    </div>
  );
};

CategorySearch.propTypes = {
  search: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default CategorySearch;
