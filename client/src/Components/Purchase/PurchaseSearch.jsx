import React from "react";
import PropTypes from "prop-types";

const PurchaseSearch = ({ search, setSearch, setPage }) => {
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search purchases..."
        value={search}
        onChange={handleSearch}
        className="px-3 py-2 m-0 rounded-lg focus:outline-green-600"
      />
    </div>
  );
};

PurchaseSearch.propTypes = {
  search: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
};

export default PurchaseSearch;
