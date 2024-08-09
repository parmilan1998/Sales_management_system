import React from "react";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-700">Payment Successful!</h1>
      <p className="text-lg text-green-600 mt-4">
        Thank you for your purchase.
      </p>
      <a href="/" className="mt-8 bg-green-500 text-white px-4 py-2 rounded">
        Go to Home
      </a>
    </div>
  );
};

export default Success;
