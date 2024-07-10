import React from "react";
import PropTypes from "prop-types";
import { IoSearch } from "react-icons/io5";

const ReportSearch = ({ search, setSearch, setPage }) => {
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  return (
    <div className="flex relative flex-wrap my-2 mx-2 border rounded-md border-slate-500">
      <IoSearch className="my-1.5 ml-2 absolute text-blue-400 " />
      <input
        type="text"
        placeholder="Search Reports..."
        value={search}
        onChange={handleSearch}
        className="pl-8 py-1 m-0 rounded-lg text-sm focus:outline-cyan-500 w-52 "
      />
    </div>
  );
};
ReportSearch.propTypes = {
  search: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
};

export default ReportSearch;
