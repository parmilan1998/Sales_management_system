import React, { useState, useEffect } from "react";
import reportsApi from "../../api/reports";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addDays, addMonths } from "date-fns";

const CreateReport = ({
  startDate: initialStartDate,
  endDate: initialEndDate,
  setEndDate,
  fetchReports,
}) => {
  const [reportType, setReportType] = useState("Weekly");
  const [customReportName, setCustomReportName] = useState("");
  const [manualEndDate, setManualEndDate] = useState("");
  const [startDate, setLocalStartDate] = useState(initialStartDate || "");
  const [endDate, setLocalEndDate] = useState(initialEndDate || "");

  const {
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleReportTypeChange = (e) => {
    const type = e.target.value;
    setReportType(type);
    if (type === "Input") {
      setCustomReportName("");
      setManualEndDate("");
    } else {
      let end;
      switch (type) {
        case "Weekly":
          end = addDays(new Date(startDate), 7);
          break;
        case "Monthly":
          end = addMonths(new Date(startDate), 1);
          break;
        case "Half-Yearly":
          end = addMonths(new Date(startDate), 6);
          break;
        case "Yearly":
          end = addMonths(new Date(startDate), 12);
          break;
        default:
          end = new Date(startDate);
      }
      const formattedEnd = formatDate(end);
      setLocalEndDate(formattedEnd);
      setEndDate(formattedEnd);
    }
  };

  const handleStartDateChange = (e) => {
    const start = e.target.value;
    setLocalStartDate(start);
    if (reportType !== "Input") {
      let end;
      switch (reportType) {
        case "Weekly":
          end = addDays(new Date(start), 7);
          break;
        case "Monthly":
          end = addMonths(new Date(start), 1);
          break;
        case "Half-Yearly":
          end = addMonths(new Date(start), 6);
          break;
        case "Yearly":
          end = addMonths(new Date(start), 12);
          break;
        default:
          end = new Date(start);
      }
      const formattedEnd = formatDate(end);
      setLocalEndDate(formattedEnd);
      setEndDate(formattedEnd);
    }
  };
  const handleEndDateChange = (e) => {
    setManualEndDate(e.target.value);
  };

  const onSubmit = async () => {
    try {
      const start = startDate;
      const end =
        reportType === "Input"
          ? formatDate(manualEndDate)
          : formatDate(endDate);
      console.log(start, end);

      if (start > end) {
        toast.error("Start date cannot be after end date.");
        return;
      }

      const payload = {
        reportName: reportType !== "Input" ? reportType : customReportName,
        startDate: startDate,
        endDate: end,
      };
      const res = await reportsApi.post("", payload);
      console.log("hi", res.data);

      const reportID = res.data.report.reportID; // Adjust according to your API response structure

      // Download the generated PDF file
      const downloadResponse = await fetch(
        `http://localhost:5000/api/v1/reports/download/${reportID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );

      const blob = await downloadResponse.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `Gross_Profit_Report_${start}_to_${end}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Report created successfully!`);
      fetchReports();
    } catch (error) {
      console.error("Failed to create report:", error);
      toast.error(`Failed to create report: ${error.message}`);
    }
  };

  return (
    <div className="flex mx-10 bg-slate-100 w-3/4 p-2">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <label>Report Type:</label>
            <select value={reportType} onChange={handleReportTypeChange}>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Yearly">Yearly</option>
              <option value="Input">Other Types</option>
            </select>
            {errors.reportName && <p>This field is required</p>}
          </div>
          {reportType === "Input" && (
            <div className="flex flex-col">
              <label>Specific Report Name:</label>
              <input
                type="text"
                name="reportName"
                value={customReportName}
                onChange={(e) => setCustomReportName(e.target.value)}
              />
              {errors.reportName && <p>This field is required</p>}
            </div>
          )}
          <div className="flex flex-col">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleStartDateChange}
            />
            {errors.startDate && <p>This field is required</p>}
          </div>
          <div className="flex flex-col">
            <label>End Date:</label>
            {reportType === "Input" ? (
              <input
                type="date"
                name="endDate"
                value={manualEndDate}
                onChange={handleEndDateChange}
              />
            ) : (
              <input type="date" name="endDate" value={endDate} readOnly />
            )}
            {errors.endDate && <p>This field is required</p>}
          </div>
          <div className="pt-1 mr-2">
            <button
              type="submit"
              className="bg-blue-600 text-white text-m rounded-md p-1"
            >
              Generate report
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

CreateReport.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  setEndDate: PropTypes.func.isRequired,
  fetchReports: PropTypes.func.isRequired,
};

export default CreateReport;
