import React from "react";
import reportsApi from "../../api/reports";
import { Popconfirm } from "antd";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ReportList = ({ fetchReports, report, limit, page }) => {
  const handleDelete = async (id) => {
    try {
      await reportsApi.delete(`/${id}`);
      toast.success("Report deleted Successfully!", { duration: 2000 });
      fetchReports();
    } catch (err) {
      toast.error(
        "Can't delete this Report since it is linked with other records!!"
      );
      console.log(err);
    }
  };

  const handleFileDownload = async (fileName) => {
    try {
      const response = await reportsApi.downloadReport(fileName);

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and click it to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <div>
      <div className="m-4">ReportList</div>

      <table className="w-full text-left border border-separate rounded border-slate-200">
        <tbody>
          <tr>
            <th
              scope="col"
              className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              No
            </th>
            <th
              scope="col"
              className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Report Name
            </th>
            <th
              scope="col"
              className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Start Date
            </th>
            <th
              scope="col"
              className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              End Date
            </th>
            <th
              scope="col"
              className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Report
            </th>
            <th
              scope="col"
              className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Actions
            </th>
          </tr>
          {report.length > 0 ? (
            report.map((item, index) => (
              <tr
                className="block border-b sm:table-row last:border-b-0 border-slate-200 sm:border-none"
                key={index}
              >
                <td
                  data-th="Name"
                  className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500"
                >
                  {(page - 1) * limit + (index + 1)}
                </td>
                <td
                  data-th="Title"
                  className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500"
                >
                  {item.reportName}
                </td>
                <td
                  data-th="Company"
                  className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500"
                >
                  {item.startDate}
                </td>
                <td
                  data-th="Company"
                  className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500"
                >
                  {item.endDate}
                </td>
                <td
                  data-th="Role"
                  className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500"
                >
                  <button onClick={() => handleFileDownload(item.reportFile)}>
                    Download
                  </button>
                </td>
                <td
                  data-th="Username"
                  className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500"
                >
                  <button>
                    <FaRegEdit size={20} color="green" />
                  </button>
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => {
                      handleDelete(item.reportID);
                    }}
                  >
                    <button>
                      <MdDelete size={20} color="red" />
                    </button>
                  </Popconfirm>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

ReportList.propTypes = {
  fetchReports: PropTypes.func.isRequired,
  report: PropTypes.array,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default ReportList;
