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
    const reportID = res.data.report.reportID;
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
      console.error(
        `Failed to create report:`,
        error
      );
      toast.error(
        `Failed to"create report: ${error.message}`
      );
    }
  };

  return (
    <div className="flex mx-5 bg-slate-100 p-2 border border-slate-300">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-row justify-between items-center gap-2">
          <div className="flex flex-col gap-1">
            <label>Report Type:</label>
            <select
              value={reportType}
              onChange={handleReportTypeChange}
              className="border border-slate-400"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Yearly">Yearly</option>
              <option value="Input">Other Types</option>
            </select>
            {errors.reportName && <p>This field is required</p>}
          </div>
          {reportType === "Input" && (
            <div className="flex flex-col gap-1 ">
              <label>Specific Report Name:</label>
              <input
                type="text"
                name="reportName"
                value={customReportName}
                onChange={(e) => setCustomReportName(e.target.value)}
                className="border border-slate-400"
              />
              {errors.reportName && <p>This field is required</p>}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="border border-slate-400"
            />
            {errors.startDate && <p>This field is required</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label>End Date:</label>
            {reportType === "Input" ? (
              <input
                type="date"
                name="endDate"
                value={manualEndDate}
                onChange={handleEndDateChange}
                className="border border-slate-400"
              />
            ) : (
              <input
                type="date"
                name="endDate"
                value={endDate}
                readOnly
                className="border border-slate-400"
              />
            )}
            {errors.endDate && <p>This field is required</p>}
          </div>
          <div className="pt-1 mr-2 ">
            <button
              type="submit"
              className="bg-blue-600 text-white text-m rounded-md p-1 border border-blue-700"
            >
              Generate Report
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
  setEndDate: PropTypes.func,
  fetchReports: PropTypes.func,
};

export default CreateReport;
