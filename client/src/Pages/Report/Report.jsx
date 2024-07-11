import React, { useState, useEffect } from "react";
import CreateReport from "../../Components/Report/CreateReport";
import ReportList from "../../Components/Report/ReportList";
import reportsApi from "../../api/reports";
import ReportPagination from "../../Components/Report/ReportPagination";
import GridLoader from "react-spinners/GridLoader";

const Report = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [report, setReport] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("DESC");
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await reportsApi.get(
        `/query?page=${page}&limit=${limit}&sort=${sort}&keyword=${search}`
      );
      console.log("Response data:", res.data);
      const { reports, pagination } = res.data;
      setTotalPages(pagination.totalPages);
      setReport(reports);
      setLoading(false);
      console.log("Report set:", reports);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, search]);


  return (
    <div>
      <div className="my-2 mx-4">
       <h1 className="text-3xl font-semibold font-acme text-blue-700">Reports</h1>
       </div>
      <div>
        <CreateReport
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          fetchReports={fetchReports}
        />
      </div>
      <div>
        <ReportList
          report={report}
          setReport={setReport}
          limit={limit}
          page={page}
          sort={sort}
          setSort={setSort}
          search={search}
          setSearch={setSearch}
          setPage={setPage}
        />
      </div>
      <div className="mt-2">
        <ReportPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Report;
