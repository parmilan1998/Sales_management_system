/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import PropTypes from "prop-types";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrFormView } from "react-icons/gr";
import { Link } from "react-router-dom";
import SingleProductPopUp from "./SingleProductPopUp";
import { Button, Popconfirm } from "antd";
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
    <div className="relative w-full overflow-x-auto cursor-pointer py-5">
      <table
        className="w-full text-left border bg-white rounded-lg border-separate border-slate-200"
        cellSpacing="0"
      >
        <tbody>
          <tr>
            <th
              scope="col"
              className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              No
            </th>
            <th
              scope="col"
              className="h-12 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Product Name
            </th>
            <th
              scope="col"
              className="h-12 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Image
            </th>
            <th
              scope="col"
              className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Description
            </th>
            <th
              scope="col"
              className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Category Name
            </th>
            <th
              scope="col"
              className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Unit Price
            </th>
            <th
              scope="col"
              className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
            >
              Actions
            </th>
          </tr>
          {products.map(
            (item, index) => (
              // item.totalQuantity !== 0 && (
              <tr className="odd:bg-slate-50" key={index}>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  {(page - 1) * limit + (index + 1)}
                </td>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  {item.productName}
                </td>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                  <img
                    src={`${baseUrl}/${item.imageUrl}`}
                    alt={item.productName}
                    className="w-32 h-24 px-1 py-3 bg-cover object-fill rounded-md"
                  />
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
                    <div>Out of stock</div>
                  ) : (
                    <div>In Stock</div>
                  )}
                </td>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  <div className="flex flex-row justify-center items-center gap-0">
                    <Button
                      onClick={() => showModal(item)}
                      style={{
                        border: "none",
                        background: "none",
                        boxShadow: "none",
                      }}
                    >
                      <GrFormView size={26} color="blue" />
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
                      <button className="py-1">
                        <FaRegEdit size={20} color="green" />
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
                            background: "none",
                            boxShadow: "none",
                          }}
                        >
                          <MdDelete size={20} color="red" />
                        </Button>
                      </Popconfirm>
                    </Link>
                  </div>
                </td>
              </tr>
            )
            // )
          )}
        </tbody>
      </table>
    </div>
  );
};

// ProductTable.propTypes = {
//   products: PropTypes.array.isRequired,
// };

export default ProductTable;
