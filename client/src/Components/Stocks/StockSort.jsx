import React from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import Icon from "@mdi/react";
import { mdiSortCalendarAscending, mdiSortCalendarDescending } from "@mdi/js";

import PropTypes from "prop-types";

const StockSort = ({ sortName, setSortName, sortDate, setSortDate }) => {
  const handleSortName = () => {
    const newSortOrder = sortName === "ASC" ? "DESC" : "ASC";
    setSortName(newSortOrder);
    console.log("ttt", newSortOrder);
  };

  const handleSortDate = () => {
    const newSortOrder = sortDate === "ASC" ? "DESC" : "ASC";
    setSortDate(newSortOrder);
  };

  return (
    <div className="mt-2 flex gap-2">
      <button
        onClick={handleSortName}
        className="p-1 rounded-lg text-lg text-white bg-blue-700 border-blue-800"
      >
        {sortName === "ASC" ? (
          <AiOutlineSortDescending size={20} className="mx-1" />
        ) : (
          <AiOutlineSortAscending size={20} className="mx-1" />
        )}
      </button>
      <button
        onClick={handleSortDate}
        className="p-1 rounded-lg text-lg text-white bg-blue-700 border-blue-800"
      >
        {sortDate === "ASC" ? (
          <Icon path={mdiSortCalendarDescending} size={0.9} className="mx-1" />
        ) : (
          <Icon path={mdiSortCalendarAscending} size={0.9} className="mx-1" />
        )}
      </button>
    </div>
  );
};

StockSort.propTypes = {
  sortName: PropTypes.string.isRequired,
  setSortName: PropTypes.func.isRequired,
  sortDate: PropTypes.string.isRequired,
  setSortDate: PropTypes.func.isRequired,
};

export default StockSort;
