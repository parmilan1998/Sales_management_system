/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, message, Popconfirm, Table } from "antd";
import SalesTable from "../../Components/Sales/SalesTable";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import SalesSearch from "../../Components/Sales/SalesSearch";
import SalesSort from "../../Components/Sales/SalesSort";
import GridLoader from "react-spinners/GridLoader";

const SalesScreen = () => {
  const navigate = useNavigate();
  const expandedRowRender = (record) => {
    console.log({ record });
    const column = [
      {
        title: "Product Name",
        dataIndex: "productName",
        key: "productName",
      },
      {
        title: "Sales Quantity",
        dataIndex: "salesQuantity",
        key: "salesQuantity",
        render: (text, record) => `${record.salesQuantity} ${record.unitType}`,
      },
    ];
    const dataList = [];

    record &&
      record.details?.map((x, idx) => {
        dataList.push({
          ...x,
          key: `child-${idx}`,
        });
      });
    console.log({ dataList });
    return <Table columns={column} dataSource={dataList} pagination={false} />;
  };

  const handleEdit = (key) => {
    console.log(`Edit clicked for record ${key}`);
    navigate(`/sales/add/${key}`);
  };

  const [columns, setColumns] = useState([
    {
      title: "No",
      dataIndex: "name",
      key: "name",
      className: "text-md font-poppins",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Customer Name",
      dataIndex: "custName",
      key: "custName",
      className: "text-md font-poppins",
    },
    {
      title: "Customer Contact",
      dataIndex: "customerContact",
      key: "customerContact",
      className: "text-md font-poppins",
    },
    {
      title: "Sold Date",
      dataIndex: "soldDate",
      key: "soldDate",
      className: "text-md font-poppins",
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      className: "text-md font-poppins",
      render: (text, record) => `Rs. ${record.totalRevenue}`,
    },
    {
      title: "Actions",
      key: "operation",
      render: (text, record) => (
        <span className="flex gap-2">
          <Button
            type="primary"
            onClick={() => handleEdit(record.salesID)}
            className="text-md font-poppins"
          >
            Edit
          </Button>
        </span>
      ),
    },
  ]);

  const [dataSource, setDataSource] = useState([]);
  const [expandData, setExpandData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(8);
  const [sortName, setSortName] = useState("ASC");
  const [sortDate, setSortDate] = useState("ASC");
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    const url = `http://localhost:5000/api/v1/sales/query?page=${page}&limit=${limit}&sort=${sortName}&sortBy=${sortDate}&keyword=${search}`;
    try {
      const res = await axios.get(url);
      const { sales, pagination } = res.data;
      let dataList = [];
      sales &&
        sales.map((x, idx) => {
          dataList.push({
            ...x,
            key: `parent-${idx}`,
          });
        });
      setLoading(false);
      setDataSource(dataList);
      setExpandData(sales.details);
      setTotalPages(pagination.totalPages);
      console.log(res.data);
      console.log("ss", sales);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, search, limit, sortDate, sortName]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-[75vh]">
          <GridLoader
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
            color="#4682B4"
          />
        </div>
      ) : (
        <div className="max-w-screen-xl z-0 mx-auto h-[100%] lg:px-8 font-poppins cursor-pointer">
          <div className="flex lg:flex-row md:flex-row flex-col items-center justify-between gap-4 pb-5">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-medium font-acme">
                All Sales Here!
              </h1>
              <Link
                to="/sales/add"
                className="bg-cyan-500 text-white px-3 py-2 rounded flex gap-2 items-center"
              >
                <LuPlus />
                New Sale
              </Link>
            </div>
            <div className="flex lg:flex-row md:flex-row flex-col  items-center gap-2">
              <h1>SortBy:</h1>
              <SalesSort
                sortName={sortName}
                setSortName={setSortName}
                sortDate={sortDate}
                setSortDate={setSortDate}
              />
              <SalesSearch
                search={search}
                setSearch={setSearch}
                setPage={setPage}
              />
            </div>
          </div>
          <div>
            <SalesTable
              expandedRowRender={(record) => expandedRowRender(record)}
              columns={columns}
              dataSource={dataSource}
              page={page}
              limit={limit}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SalesScreen;
