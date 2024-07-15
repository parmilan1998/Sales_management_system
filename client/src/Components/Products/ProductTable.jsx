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
              className="h-16 px-4 items-center justify-center text-sm font-medium border-0 first:border-l-0 stroke-slate-700 text-white bg-cyan-500"
            >
              No
            </th>
            <th
              scope="col"
              className="h-12 px-4 w-36 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-cyan-500"
            >
              Product Name
            </th>

            <th
              scope="col"
              className="h-16 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-cyan-500"
            >
              Description
            </th>
            <th
              scope="col"
              className="h-16 px-4 w-40 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-cyan-500"
            >
              Category Name
            </th>
            <th
              scope="col"
              className="h-16 px-2 w-8 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-cyan-500"
            >
              Unit Price
            </th>
            <th
              scope="col"
              className="h-16 w-40 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-cyan-500"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="h-16 px-6 text-sm font-medium border-l first:border-l-0 stroke-slate-700 text-white bg-cyan-500"
            >
              Actions
            </th>
          </tr>
          {products.map((item, index) => (
            <tr
              className={`odd:bg-slate-50 ${
                item.totalQuantity === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              key={index}
            >
              <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                {(page - 1) * limit + (index + 1)}
              </td>
              <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                {item.productName}
              </td>

              <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                {item.productDescription}
              </td>
              <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                {item.categoryName}
              </td>
              <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                Rs.{item.unitPrice}
              </td>
              <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                {item.totalQuantity === 0 ? (
                  <div className="bg-red-300 rounded-full font-medium text-red-600 flex items-center justify-center mx-auto">
                    Out of stock
                  </div>
                ) : (
                  <div className="bg-green-300 rounded-full font-medium text-green-600 flex items-center justify-center mx-auto">
                    Available
                  </div>
                )}
              </td>
              <td className="h-16 px-1 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                <div className="flex flex-row justify-center items-center gap-0">
                  <Button
                    onClick={() => showModal(item)}
                    style={{
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    <Tooltip title="View Products">
                      <GrFormView
                        size={36}
                        color="white"
                        className="bg-green-500 p-2 rounded-full"
                      />{" "}
                    </Tooltip>
                  </Button>
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
                          size={36}
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
                      <Button
                        danger
                        style={{
                          border: "none",
                          boxShadow: "none",
                        }}
                      >
                        <Tooltip title="Delete Products">
                          <MdDelete
                            size={36}
                            color="white"
                            className="bg-red-500 mt-2.5 p-2 rounded-full"
                          />
                        </Tooltip>
                      </Button>
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
