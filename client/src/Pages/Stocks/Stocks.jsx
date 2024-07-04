import React, { useEffect, useState, useRef } from "react";
import { EditableProTable, ProCard, ProForm } from "@ant-design/pro-components";
import { ConfigProvider, Select } from "antd";
import enUSIntl from "antd/lib/locale/en_US";
import toast from "react-hot-toast";
import stocksApi from "../../api/stocks";
import productsApi from "../../api/products";
import { Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

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
  const [sort, setSort] = useState("ASC");
  const [limit, setLimit] = useState(10);

  const fetchProductNames = async () => {
    try {
      const res = await productsApi.get("/list");
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

  const fetchStocks = async (sortType) => {
    setLoading(true);
    try {
      const res = await stocksApi.get(
        `/query?page=${page}&limit=${limit}&sort=${sortType}&keyword=${search}`
      );
      console.log("Response data:", res.data);
      const { stocks, pagination } = res.data;
      setTotalPages(pagination.totalPages);
      console.log({ stocks });
      setStocks(stocks);
      console.log("Stocks set:", stocks);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, search]);

  // const formatDate = (dateStr) => new Date(dateStr).toISOString().split("T")[0];
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Create/update stocks
  const onSubmit = async (data) => {
    console.log("hi", data);
    try {
      let res;

      console.log("sss", data);
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
        `Failed to ${data.id ? "update" : "create"} stock: ${err.message}`
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
      valueType: "indexBorder",
      ellipsis: true,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      valueType: "select",
      width: 180,
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
      width: 80,
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      valueType: "money",
      width: 120,
    },
    {
      title: "Manufactured Date",
      dataIndex: "manufacturedDate",
      valueType: "date",
      width: 140,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      valueType: "date",
      width: 120,
    },
    {
      title: "Purchased Date",
      dataIndex: "purchasedDate",
      valueType: "date",
      width: 100,
    },
    {
      title: "Action",
      valueType: "option",
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
  console.log({ stocks });
  return (
    <ConfigProvider locale={enUSIntl}>
      <ProCard>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div
            style={{
              maxWidth: 10000,
              margin: "auto",
            }}
          >
            <ProForm
              submitter={false}
              onFinish={(data) => {
                console.log({ data });
              }}
              formRef={formRef}
              initialValues={{
                table: stocks.map((stock) => ({
                  id: stock.stockID,
                  productName: stock.productName,
                  productQuantity: stock.productQuantity,
                  purchasePrice: stock.purchasePrice,
                  manufacturedDate: stock.manufacturedDate,
                  expiryDate: stock.expiryDate,
                  purchasedDate: stock.purchasedDate,
                })),
              }}
            >
              <EditableProTable
                onChange={(value) => {
                  console.log({ value });
                }}
                rowSelection={{
                  onChange: (_, selectedRows) => {
                    console.log({ selectedRows });
                  },
                }}
                rowKey="id"
                scroll={{ x: true }}
                editableFormRef={editableFormRef}
                controlled
                actionRef={actionRef}
                name="table"
                columns={columns}
                recordCreatorProps={{
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
              />
            </ProForm>
          </div>
        )}
      </ProCard>
    </ConfigProvider>
  );
};

export default Stocks;
