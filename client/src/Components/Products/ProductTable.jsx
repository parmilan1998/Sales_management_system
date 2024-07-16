import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { Link } from "react-router-dom";
import SingleProductPopUp from "./SingleProductPopUp";
import { Button, Popconfirm, Tooltip } from "antd";
import { Modal } from "antd";

const ProductTable = ({
  products,
  confirmDelete,
  page,
  limit,
  cancelDelete,
}) => {
  const [rowData, setRowData] = useState({});

  const baseUrl = "http://localhost:5000/public/products";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (record) => {
    setRowData(record);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full overflow-x-auto cursor-pointer">
      <table
        className="w-full text-left border bg-white rounded-lg border-separate border-slate-200"
        cellSpacing="0"
      >
        <tbody>
          <tr>
            <th
              scope="col"
              className="h-12 w-12 px-4 items-center justify-center text-sm font-medium border-0 first:border-l-0 stroke-slate-700 text-white bg-sky-500"
            >
              No
            </th>
            <th
              scope="col"
              className="h-12 px-4 w-48 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-sky-500"
            >
              Product Name
            </th>

            {/* <th
              scope="col"
              className="h-12 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-sky-500"
            >
              Description
            </th> */}
            <th
              scope="col"
              className="h-12 px-4 w-44 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-sky-500"
            >
              Category Name
            </th>

            <th
              scope="col"
              className="h-12 px-2 w-8 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-sky-500"
            >
              Unit Price
            </th>
            <th
              scope="col"
              className="h-12 px-2 w-32 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-sky-500"
            >
              Reorder Level
            </th>

            <th
              scope="col"
              className="h-12 w-40 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-sky-500"
            >
              Stocks
            </th>
            <th
              scope="col"
              className="h-12 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-sky-500"
            >
              Actions
            </th>
          </tr>
          {products.map((item, index) => (
            <tr
              className={`${
                item.totalQuantity < item.reOrderLevel
                  ? "blink-background "
                  : ""
              }`}
              key={index}
            >
              <td className="h-12 px-6 text-sm transition duration-300 border-t border-0 first:border-l-0 border-slate-200 stroke-slate-500 text-black">
                {(page - 1) * limit + (index + 1)}
              </td>
              <td className="h-12 px-6 text-sm transition duration-300 border-t border-0 first:border-l-0 border-slate-200 stroke-slate-500 text-black">
                {item.productName}
              </td>

              <td className="h-12 px-6 text-sm transition duration-300 border-t border-0 first:border-l-0 border-slate-200 stroke-slate-500 text-black">
                {item.categoryName}
              </td>

              <td className="h-12 px-6 text-sm transition duration-300 border-t border-0 first:border-l-0 border-slate-200 stroke-slate-500 text-black">
                Rs.{item.unitPrice}
              </td>
              <td className="h-12 px-6 text-sm transition duration-300 border-t border-0 first:border-l-0 border-slate-200 stroke-slate-500 text-black">
                {item.reOrderLevel}&nbsp;
                {item.unitType}
              </td>
              <td className="h-12 px-6 text-sm transition duration-300 border-t border-0 first:border-l-0 border-slate-200 stroke-slate-500 text-black">
                {item.totalQuantity}&nbsp;
                {item.unitType}
              </td>
              <td className="h-12 px-1 text-sm transition duration-300 border-t border-0 first:border-l-0 border-slate-200 stroke-slate-500 text-black">
                <div className="flex flex-row justify-center items-center gap-2">
                  <button
                    onClick={() => showModal(item)}
                    style={{
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    <Tooltip title="View Products">
                      <GrFormView
                        size={32}
                        color="white"
                        className="bg-green-500 p-1 rounded-full"
                      />{" "}
                    </Tooltip>
                  </button>
                  <Modal
                    title="Product Details"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                  >
                    <SingleProductPopUp rowData={rowData} />
                  </Modal>
                  <Link to={`/products/edit/${item.productID}`}>
                    <button className="py-1 ">
                      <Tooltip title="Edit Products">
                        <FaRegEdit
                          size={32}
                          color="white"
                          className="bg-sky-500 p-2 rounded-full"
                        />
                      </Tooltip>
                    </button>
                  </Link>
                  <Link>
                    <Popconfirm
                      title="Delete the Product"
                      description="Are you sure you want to delete this product?"
                      onConfirm={() => confirmDelete(item.productID)}
                      onCancel={cancelDelete}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button
                        style={{
                          border: "none",
                          boxShadow: "none",
                        }}
                      >
                        <Tooltip title="Delete Products">
                          <MdDelete
                            size={32}
                            color="white"
                            className="bg-red-500 mt-1.5 p-2 rounded-full"
                          />
                        </Tooltip>
                      </button>
                    </Popconfirm>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  cancelDelete: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default ProductTable;
