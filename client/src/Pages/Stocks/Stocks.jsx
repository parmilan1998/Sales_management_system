import React, { useEffect, useState, useRef } from "react";
import { EditableProTable, ProCard, ProForm } from "@ant-design/pro-components";
import { ConfigProvider, Select, DatePicker } from "antd";
import enUSIntl from "antd/lib/locale/en_US";
import toast from "react-hot-toast";
import stocksApi from "../../api/stocks";
import productApi from "../../api/products";
import StockSort from "../../Components/Stocks/StockSort";
import { Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
import StockSearch from "../../Components/Stocks/StockSearch";
import GridLoader from "react-spinners/GridLoader";

const Stocks = () => {
  const navigate = useNavigate();
  const [editableKeys, setEditableRowKeys] = useState([]);
  const formRef = useRef();
  const actionRef = useRef();
  const editableFormRef = useRef();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productOptions, setProductOptions] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortName, setSortName] = useState("ASC");
  const [sortDate, setSortDate] = useState("ASC");
  const [limit, setLimit] = useState(10);

  const fetchProductNames = async () => {
    try {
      const res = await productApi.get("/list");
      const products = res.data;
      const options = products.map((product) => ({
        label: product.productName,
        value: product.productName,
      }));
      setProductOptions(options);
    } catch (err) {
      console.log("Failed to fetch product names:", err.message);
    }
  };

  useEffect(() => {
    fetchProductNames();
  }, []);

  const fetchStocks = async () => {
    console.log("ttt", sortName, sortDate);
    setLoading(true);
    try {
      const res = await stocksApi.get(
        `/query?page=${page}&limit=${limit}&sort=${sortName}&sortBy=${sortDate}&keyword=${search}`
      );
      console.log("Response data:", res.data);
      const { stocks, pagination } = res.data;
      setTotalPages(pagination.totalPages);
      setStocks(stocks);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("ttt", sortName);
    fetchStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortName, sortDate, search]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Create/update stocks
  const onSubmit = async (data) => {
    try {
      let res;

      // Check if manufactured date is after expiry date
      if (
        data.manufacturedDate &&
        data.expiryDate &&
        data.manufacturedDate > data.expiryDate
      ) {
        toast.error("Manufactured date cannot be after expiry date.");
        return;
      }

      // Check if manufactured date is after purchase date
      if (
        data.manufacturedDate &&
        data.purchasedDate &&
        data.manufacturedDate > data.purchasedDate
      ) {
        toast.error("Manufactured date cannot be after purchase date.");
        return;
      }

      const payload = {
        stockID: data.id,
        productName: data.productName,
        productQuantity: data.productQuantity,
        purchasePrice: data.purchasePrice,
        manufacturedDate: formatDate(data.manufacturedDate),
        expiryDate: formatDate(data.expiryDate),
        purchasedDate: formatDate(data.purchasedDate),
      };

      // eslint-disable-next-line no-prototype-builtins
      if (!data?.hasOwnProperty("map_row_parentKey")) {
        // Edit existing stock
        res = await stocksApi.put(`/${data.id}`, payload);
        toast.success(`Stock updated successfully!`);
      } else {
        // Create new stock
        res = await stocksApi.post("", payload);
        toast.success(`Stock created successfully!`);
      }

      navigate("/stocks");
      fetchStocks();
    } catch (err) {
      console.log(err.message);
      toast.error(
        `Failed to ${
          // eslint-disable-next-line no-prototype-builtins
          data.hasOwnProperty("map_row_parentKey") ? "create" : "update"
        } stock: ${err.message}`
      );
      fetchStocks();
    }
  };

  // Delete stock
  const handleDelete = async (id) => {
    console.log("ss");
    console.log(id);
    try {
      await stocksApi.delete(`/${id}`);

      toast.success("Stock deleted Successfully!", { duration: 2000 });
      fetchStocks();
    } catch (err) {
      toast.error(
        "Can't delete this Stock since it is linked with other records!!"
      );
      console.log(err);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      ellipsis: true,
      width: 60,
      align: "center",
      render: (text, record, index) => (
        <div className="w-5 h-5 ml-3 bg-gray-600 text-white text flex justify-center items-center rounded-full">
          <span >{index + 1}</span>
        </div>
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      valueType: "select",
      align: "center",
      width: 173,
      fieldProps: {
        options: productOptions,
      },
      renderFormItem: (_, { recordKey, ...restProps }) => (
        <Select {...restProps}>
          {productOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Product Quantity",
      dataIndex: "productQuantity",
      valueType: "digit",
      align: "center",
      width: 125,
      render: (text, record) => `${record.productQuantity} ${record.unitType}`,
      renderFormItem: (_, { recordKey, ...restProps }) => (
        <input {...restProps} defaultValue={_.productQuantity || ""} />
      ),
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      valueType: "money",
      align: "center",
      width: 110,
    },
    {
      title: "Manufactured Date",
      dataIndex: "manufacturedDate",
      valueType: "date",
      align: "center",
      width: 140,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      valueType: "date",
      align: "center",
      width: 90,
    },
    {
      title: "Purchased Date",
      dataIndex: "purchasedDate",
      valueType: "date",
      align: "center",
      width: 115,
    },
    {
      title: "Action",
      valueType: "option",
      align: "center",
      render: (_, row) => [
        <React.Fragment key={`actions-${row.id}`}>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              console.log({ row });
              handleDelete(row.id);
            }}
          >
            <a key={`delete-${row.id}`}>Remove</a>,
          </Popconfirm>
          <a
            key={`edit-${row.id}`}
            onClick={() => {
              actionRef.current?.startEditable(row.id);
            }}
          >
            Edit
          </a>
        </React.Fragment>,
      ],
    },
  ];
  const rowClassName = "h-2";

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
        <ConfigProvider locale={enUSIntl}>
          <div className="max-w-screen-xl z-0 mx-auto lg:px-8 font-poppins cursor-pointer">
            <div className="flex flex-col  justify-between pb-5 relative">
              <div className="flex lg:flex-row md:flex-row flex-col items-center justify-between gap-4 pb-5">
                <div className="flex gap-3 mx-5">
                  <h1 className="text-4xl font-semibold font-acme text-blue-600">
                    Stocks List
                  </h1>
                </div>
                <div className="ml-auto flex flex-row mr-4 gap-2">
                  <h2 className="mt-3 ">SortBy:</h2>
                  <StockSort
                    sortName={sortName}
                    setSortName={setSortName}
                    sortDate={sortDate}
                    setSortDate={setSortDate}
                  />
                  <StockSearch
                    search={search}
                    setSearch={setSearch}
                    setPage={setPage}
                  />
                </div>
              </div>
              <div className="m-5 border rounded-md border-slate-400">
                <ProCard>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <div
                      style={{
                        maxWidth: 960,
                        margin: "auto",
                      }}
                    >
                      <ProForm
                        submitter={false}
                        // onFinish={(data) => {
                        //   console.log({ data });
                        // }}
                        formRef={formRef}
                        initialValues={{
                          table: stocks.map((stock) => ({
                            id: stock.id,
                            productName: stock.productName,
                            productQuantity: stock.productQuantity,
                            unitType: stock.unitType,
                            purchasePrice: stock.purchasePrice,
                            manufacturedDate: stock.manufacturedDate,
                            expiryDate: stock.expiryDate,
                            purchasedDate: stock.purchasedDate,
                          })),
                        }}
                      >
                        <EditableProTable
                          // rowSelection={{

                          //   onChange: (_, selectedRows) => {
                          //     console.log({ selectedRows });
                          //   },
                          // }}
                          rowKey="id"
                          scroll={{ x: 900 }}
                          editableFormRef={editableFormRef}
                          controlled
                          actionRef={actionRef}
                          name="table"
                          columns={columns}
                          recordCreatorProps={{
                            position: "top",
                            width: 20,
                            record: (index) => ({ id: index + 1 }),
                          }}
                          dataSource={stocks}
                          editable={{
                            type: "multiple",
                            editableKeys,
                            onChange: setEditableRowKeys,
                            onSave: async (rowKey, data, row) => {
                              onSubmit(data);
                              console.log(rowKey, data, row);
                            },
                            onDelete: async () => {
                              fetchStocks();
                            },
                            onCancel: async () => {},
                          }}
                          rowClassName={() => rowClassName}
                          locale={{
                            emptyText: "No Data",
                            edit: "Edit",
                            delete: "Delete",
                            deletePopconfirmMessage:
                              "Are you sure to delete this record?",
                            add: "Add",
                            save: "Save",
                            cancel: "Cancel",
                          }}
                          pagination={{
                            total: totalPages * limit,
                            current: page,
                            pageSize: limit,
                            onChange: (page) => setPage(page),
                          }}
                        />
                      </ProForm>
                    </div>
                  )}
                </ProCard>
              </div>
            </div>
          </div>
        </ConfigProvider>
      )}
    </>
  );
};

export default Stocks;
