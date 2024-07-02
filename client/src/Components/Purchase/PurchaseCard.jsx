/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { AiOutlineFolderView } from "react-icons/ai";
import { Button, Modal, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import SinglePurchasePopUp from "./SinglePurchasePopUp";

const PurchaseCard = ({ purchase, confirmDelete, cancelDelete }) => {
  const [purchaseRowData, setPurchaseRowData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (data) => {
    setPurchaseRowData(data);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-5">
        {purchase.map((purchase, index) => (
          <div
            className="overflow-hidden rounded bg-white border text-slate-500 shadow-lg shadow-slate-300"
            key={index}
          >
            {/*  <!-- Header--> */}
            <div className="p-6">
              <header className="flex gap-4 ">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-slate-700">
                    {purchase.productName}
                  </h3>
                  <p className="text-sm text-slate-400">
                    From {purchase.purchaseVendor}
                  </p>
                  <p className="text-sm text-slate-400">
                    Quantity: {purchase.purchaseQuantity}
                  </p>
                </div>
              </header>
            </div>

            {/*  <!-- Action icon buttons --> */}
            <div className="flex items-center justify-between">
              <div className="ml-4">
                <p className="text-sm">{purchase.purchasedDate}</p>
              </div>
              <div className="flex justify-end gap-2 p-2 pt-0">
                <button className="inline-flex h-10 items-center justify-center justify-self-center whitespace-nowrap rounded px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent">
                  <span className="relative only:-mx-6">
                    <Button
                      onClick={() => showModal(purchase)}
                      style={{
                        border: "none",
                        boxShadow: "none",
                        background: "none",
                      }}
                    >
                      <AiOutlineFolderView size={24} />
                    </Button>
                    <Modal
                      title="Purchase Details"
                      open={isModalOpen}
                      onCancel={handleCancel}
                      footer={null}
                    >
                      <SinglePurchasePopUp purchaseRowData={purchaseRowData} />
                    </Modal>
                  </span>
                </button>
                <button className="inline-flex h-10 items-center justify-center justify-self-center whitespace-nowrap rounded px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent">
                  <span className="relative only:-mx-6">
                    <MdEditSquare size={24} />
                  </span>
                </button>
                <div className="flex items-center">
                  <Popconfirm
                    title="Delete the Purchase"
                    description="Are you sure you want to delete this purchase?"
                    onConfirm={() => confirmDelete(purchase.purchaseID)}
                    onCancel={cancelDelete}
                    okText="Yes"
                    cancelText="No"
                  >
                    <MdDelete size={24} color="red" />
                  </Popconfirm>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseCard;
