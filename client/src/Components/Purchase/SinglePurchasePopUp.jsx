/* eslint-disable react/prop-types */
import React from "react";

const SinglePurchasePopUp = ({ purchaseRowData }) => {
  return (
    <div>
      {" "}
      <div className="overflow-hidden font-poppins rounded bg-white text-slate-500 shadow-md shadow-slate-200">
        {/*  <!-- Image --> */}
        <figure>
          <img
            src="https://www.cflowapps.com/wp-content/uploads/2021/05/PurchseordrFor-smbs.jpg"
            alt="card image"
            className="aspect-video w-full"
          />
        </figure>
        {/*  <!-- Body--> */}
        <div className="p-6">
          <header className="mb-4 space-y-2">
            <h3 className="text-xl font-medium text-slate-700">
              {purchaseRowData.productName}
            </h3>
            <p className="text-md text-slate-400">
              From: {purchaseRowData.purchaseVendor},{" "}
              {purchaseRowData.purchasedDate}
            </p>
            <p className="text-md text-slate-400">
              Contact No - {purchaseRowData.vendorContact}
            </p>
          </header>
        </div>
      </div>
    </div>
  );
};

export default SinglePurchasePopUp;
