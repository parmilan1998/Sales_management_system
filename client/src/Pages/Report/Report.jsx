import React, { useState, useEffect } from "react";
import CreateReport from "../../Components/Report/CreateReport";
import ReportList from "../../Components/Report/ReportList";
import reportsApi from "../../api/reports";

const Report = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [pdfDataUrl, setPdfDataUrl] = useState();
  const [report, setReport] = useState([]);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ASC");
  const [limit, setLimit] = useState(8);

  const fetchReports = async (sortType) => {
    try {
      const res = await reportsApi.get(
        `/query?page=${page}&limit=${limit}&sort=${sortType}&keyword=${search}`
      );
      console.log("Response data:", res.data);
      const { reports, pagination } = res.data;
      setTotalPages(pagination.totalPages);
      setReport(reports);
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
          pdfDataUrl={pdfDataUrl}
          setPdfDataUrl={setPdfDataUrl}
          fetchReports={fetchReports}
          limit={limit}
          page={page}
        />
      </div>
    </div>
  );
};

export default Report;
