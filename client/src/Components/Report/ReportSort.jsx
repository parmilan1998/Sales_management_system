import React from "react";
import PropTypes from "prop-types";
import Icon from "@mdi/react";
import { mdiSortCalendarAscending, mdiSortCalendarDescending } from "@mdi/js";

const ReportSort = ({ sort, setSort }) => {
  const handleSortDate = () => {
    const newSortOrder = sort === "ASC" ? "DESC" : "ASC";
    setSort(newSortOrder);
  };
  return (
    <div>
      <button
        onClick={handleSortDate}
        className="p-1 rounded-lg text-lg text-white bg-blue-700 border-blue-500 mt-1.5"
      >
        {sort === "ASC" ? (
          <Icon path={mdiSortCalendarDescending} size={1} className="ml-2" />
        ) : (
          <Icon path={mdiSortCalendarAscending} size={1} className="ml-2" />
        )}
      </button>
    </div>
  );
};

ReportSort.propTypes = {
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
};

export default ReportSort;
