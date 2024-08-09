/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { IoIosTime } from "react-icons/io";
import PropTypes from "prop-types";

const SalesTimeDate = ({ formatDate, setCurrentDate, currentDate }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {" "}
      <div className="flex justify-between items-center pt-6">
        <span className=" flex gap-2 justify-center items-center text-md text-gray-500 font-medium">
          <BsFillCalendar2DateFill size={20} color="blue" />
          {formatDate(currentDate)}
        </span>
        <span className=" flex gap-2 justify-center items-center text-md text-gray-500 font-medium">
          <IoIosTime size={20} color="blue" />
          {currentDate.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default SalesTimeDate;

SalesTimeDate.propTypes = {
  setCurrentDate: PropTypes.func.isRequired,
  currentDate: PropTypes.object,
  formatDate: PropTypes.func,
};
