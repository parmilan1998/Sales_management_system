import React from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import PropTypes from "prop-types";
import Icon from "@mdi/react";
import { mdiSortCalendarAscending, mdiSortCalendarDescending } from "@mdi/js";

const SalesSort = ({ sortDate, setSortName, setSortDate, sortName }) => {
  const handleSortName = () => {
    const newSortOrder = sortName === "ASC" ? "DESC" : "ASC";
    setSortName(newSortOrder);
  };

  const handleSortDate = () => {
    const newSortOrder = sortDate === "ASC" ? "DESC" : "ASC";
    setSortDate(newSortOrder);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={handleSortName}
        className="p-1 rounded-lg text-lg text-white bg-cyan-500 border-blue-500"
      >
        {sortName === "ASC" ? (
          <AiOutlineSortDescending size={20} className="ml-2" />
        ) : (
          <AiOutlineSortAscending size={20} className="ml-2" />
        )}
      </button>
      <button
        onClick={handleSortDate}
        className="p-1 rounded-lg text-lg text-white bg-cyan-500 border-blue-500"
      >
        {sortDate === "ASC" ? (
          <Icon path={mdiSortCalendarDescending} size={1} className="ml-2" />
        ) : (
          <Icon path={mdiSortCalendarAscending} size={1} className="ml-2" />
        )}
      </button>
    </div>
  );
};

SalesSort.propTypes = {
  sortName: PropTypes.string.isRequired,
  setSortName: PropTypes.func.isRequired,
  sortDate: PropTypes.string.isRequired,
  setSortDate: PropTypes.func.isRequired,
};

export default SalesSort;
