import React, { useEffect, useState, useRef } from "react";
import { EditableProTable, ProCard, ProForm } from "@ant-design/pro-components";
import { ConfigProvider } from "antd";
import enUSIntl from "antd/lib/locale/en_US";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import stocksApi from "../../api/stocks";
import { Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";

const Stocks = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  const handleClear = () => {
    reset();
  };

  const navigate = useNavigate();
  const [editableKeys, setEditableRowKeys] = useState([]);
  const formRef = useRef();
  const actionRef = useRef();
  const editableFormRef = useRef();
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ASC");
  const [limit, setLimit] = useState(10);

  const fetchStocks = async (sortType) => {
    try {
      const res = await stocksApi.get(
        `/query?page=${page}&limit=${limit}&sort=${sortType}&keyword=${search}`
      );
      console.log("Response data:", res.data);
      const { stocks, pagination } = res.data;
      setTotalPages(pagination.totalPages);
      setStocks(stocks);
      console.log("Stocks set:", stocks);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchStocks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, search]);

  // Created stocks
  const onSubmit = async (data) => {
    console.log({ data });
    try {
      const formData = new FormData();
      formData.append("productName", data.productName);
      formData.append("productQuantity", data.productQuantity);
      formData.append("purchasePrice", data.purchasePrice);
      formData.append("manufacturedDate", data.manufacturedDate);
      formData.append("expiryDate", data.expiryDate);
      formData.append("purchasedDate", data.purchasedDate);

      const res = await stocksApi.post("", formData);
      console.log(res.data);
      toast.success(`stock created successfully!`);
      navigate("/stocks");
      reset();
    } catch (err) {
      console.log(err.message);
      // Handle error or show error toast
      toast.error(`Failed to create stock: ${err.message}`);
    }
  };

  // Delete stock
  const handleDelete = async (stockID) => {
    try {
      await stocksApi.delete(`/${stockID}`);
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
      valueType: "text",
      ellipsis: true,
    },
    {
      title: "Product Quantity",
      dataIndex: "productQuantity",
      valueType: "digit",
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      valueType: "money",
    },
    {
      title: "Manufactured Date",
      dataIndex: "manufacturedDate",
      valueType: "date",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      valueType: "date",
    },
    {
      title: "Purchased Date",
      dataIndex: "purchasedDate",
      valueType: "date",
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
              handleDelete(row.stockID);
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

  return (
    <ConfigProvider locale={enUSIntl}>
      <ProCard>
        <div
          style={{
            maxWidth: 800,
            margin: "auto",
          }}
        >
          {stocks.length > 0 && (
            <ProForm
              onFinish={(data) => {
                console.log({ data });
              }}
              formRef={formRef}
              initialValues={{
                table: stocks.map((stock, index) => ({
                  id: index,
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
                onSubmit={(data) => {
                  console.log("agxs");
                  console.log({ data });
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
                editable={{
                  type: "multiple",
                  editableKeys,
                  onChange: setEditableRowKeys,
                  onSave: async (rowKey, data, row) => {
                    onSubmit(data);
                    // console.log(rowKey, data, row);
                  },
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
          )}
        </div>
      </ProCard>
    </ConfigProvider>
  );
};

export default Stocks;
