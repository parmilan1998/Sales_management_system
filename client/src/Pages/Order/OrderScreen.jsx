import React, { useState } from "react";
import NavbarSales from "../../Components/NavbarSales";
import FooterSales from "../../Components/FooterSales";
import SalesCard from "../../Components/Order/SalesCard";
import SalesList from "../../Components/Order/SalesList";

const OrderScreen = () => {
  const [display, setDisplay] = useState(null);
  const handleSalesCard = () => {
    setDisplay("Card");
  };

  const handleSalesList = () => {
    setDisplay("List");
  };

  return (
    <>
      <NavbarSales />
      <div className="min-h-screen bg-gray-200 my-0 z-0 lg:h-[100%] mx-auto font-poppins cursor-pointer">
        <div className="flex">
          <button
            onClick={handleSalesCard}
            className="px-5 py-2 bg-indigo-500 text-white hover:bg-indigo-700 ease-in duration-200"
          >
            Card
          </button>
          <button
            onClick={handleSalesList}
            className="px-8 py-2 bg-gray-500 text-white hover:bg-gray-700 ease-in duration-200"
          >
            List
          </button>
        </div>
        <div>
          {display === "List" ? (
            <div>
              <SalesList />
            </div>
          ) : (
            <div>
              <SalesCard />
            </div>
          )}
        </div>
      </div>
      <FooterSales />
    </>
  );
};

export default OrderScreen;
