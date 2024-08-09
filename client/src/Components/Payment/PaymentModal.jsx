/* eslint-disable react/prop-types */
import React from "react";

const PaymentModal = ({ orderId, name, amount, handleFinished }) => {
  // Put the payment variables here
  var payment = {
    sandbox: true,
    merchant_id: "1227883",
    return_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
    notify_url: "http://sample.com/notify",
    order_id: orderId,
    items: name,
    amount: amount,
    currency: "LKR",
    first_name: "Saman",
    last_name: "Perera",
    email: "samanp@gmail.com",
    phone: "0771234567",
    address: "No.1, Galle Road",
    city: "Colombo",
    country: "Sri Lanka",
    delivery_address: "No. 46, Galle road, Kalutara South", // optional field
    delivery_city: "Kalutara", // optional field
    delivery_country: "Sri Lanka", // optional field
    custom_1: "", // optional field
    custom_2: "", // optional field
  };

  // Called when user completed the payment. It can be a successful payment or failure
  window.payhere.onCompleted = function onCompleted(orderId) {
    console.log("Payment completed. OrderID:" + orderId);
    //Note: validate the payment and show success or failure page to the customer
  };

  // Called when user closes the payment without completing
  window.payhere.onDismissed = function onDismissed() {
    //Note: Prompt user to pay again or show an error page
    console.log("Payment dismissed");
  };

  // Called when error happens when initializing payment such as invalid parameters
  window.payhere.onError = function onError(error) {
    // Note: show an error page
    console.log("Error:" + error);
  };

  function handlePayNow() {
    window.payhere.startPayment(payment);
    // handleFinished();
  }

  return (
    <button
      onClick={handlePayNow}
      className="bg-green-500 text-sm text-white w-full px-4 py-2 rounded"
    >
      Pay Now
    </button>
  );
};

export default PaymentModal;
