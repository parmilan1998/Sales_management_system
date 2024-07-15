/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { AiOutlineFolderView } from "react-icons/ai";
import { Button, Modal, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import SinglePurchasePopUp from "./SinglePurchasePopUp";
import { formatDistance, formatDistanceToNow, parseISO } from "date-fns";
import { GiBeveledStar, GiReturnArrow } from "react-icons/gi";

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
  const [selectedId, setSelectedId] = useState(null);

  //   const date = parseISO(purchase.createdAt);
  //   const timePeriod = formatDistanceToNow(date);
  //   const timeAgo = `${timePeriod}ago`;

  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
        {purchase.map((purchase, index) => (
          <div
            className="overflow-hidden rounded-lg bg-gray-50 border-l-indigo-500 border-indigo-300 border-l-[6px] border-2 text-slate-500 shadow-lg shadow-slate-300"
            key={index}
          >
            {/*  <!-- Header--> */}
            <div className="p-6">
              <header className="flex gap-4 ">
                <div className="space-y-3">
                  <h3 className="flex items-center text-md gap-2 font-semibold text-slate-700">
                    <GiBeveledStar />
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
                <Link to={`/purchase/edit/${purchase.purchaseID}`}>
                  <button className="inline-flex h-10 items-center justify-center justify-self-center whitespace-nowrap rounded px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent">
                    <span className="relative only:-mx-6">
                      <MdEditSquare size={24} />
                    </span>
                  </button>
                </Link>
                <div className="flex items-center cursor-pointer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseCard;
