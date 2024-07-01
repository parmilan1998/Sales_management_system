import React from "react";
import PropTypes from "prop-types";

const ProductSearch = ({ search, setSearch, setPage }) => {
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleSearch}
        className="px-3 py-2 m-0 rounded-lg focus:outline-cyan-500"
      />
    </div>
  );
};

ProductSearch.propTypes = {
  search: PropTypes.array.isRequired,
  setPage: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
};

export default ProductSearch;
