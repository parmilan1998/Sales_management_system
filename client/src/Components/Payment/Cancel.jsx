import React from "react";

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <h1 className="text-3xl font-bold text-red-700">Payment Cancelled</h1>
      <p className="text-lg text-red-600 mt-4">
        Your payment was not successful. Please try again.
      </p>
      <a href="/" className="mt-8 bg-red-500 text-white px-4 py-2 rounded">
        Go to Home
      </a>
    </div>
  );
};

export default Cancel;
