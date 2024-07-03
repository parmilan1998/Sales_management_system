import React, { useEffect, useState, useRef } from "react";
import { EditableProTable, ProCard, ProForm } from "@ant-design/pro-components";
import { ConfigProvider } from "antd";
import enUSIntl from "antd/lib/locale/en_US";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import stocksApi from "../../api/stocks";

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

  const [editableKeys, setEditableRowKeys] = useState([]);
  const formRef = useRef();
  const actionRef = useRef();
  const editableFormRef = useRef();
  const [stocks, setStocks] = useState([]);

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
        <a
          key={`delete-${row.id}`}
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue("table");
            formRef.current?.setFieldsValue({
              table: tableDataSource.filter((item) => item.id !== row.id),
            });
          }}
        >
          Remove
        </a>,
        <a
          key={`edit-${row.id}`}
          onClick={() => {
            actionRef.current?.startEditable(row.id);
          }}
        >
          Edit
        </a>,
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
