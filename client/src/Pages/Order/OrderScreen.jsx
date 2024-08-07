import React, { useState } from "react";
import NavbarSales from "../../Components/NavbarSales";
import FooterSales from "../../Components/FooterSales";
import SalesCard from "../../Components/Order/SalesCard";
import SalesList from "../../Components/Order/SalesList";
import Marquee from "react-fast-marquee";

const OrderScreen = () => {
  const [display, setDisplay] = useState("Card");
  const [active, setActive] = useState("Card");

  const handleSalesCard = () => {
    setDisplay("Card");
    setActive("Card");
  };

  const handleSalesList = () => {
    setDisplay("List");
    setActive("List");
  };

  return (
    <>
      <NavbarSales />
      <div className="min-h-screen bg-gray-200 my-0 z-0 lg:h-[100%] mx-auto font-poppins cursor-pointer">
        <div
          className={`flex text-white justify-between ${
            active === "List" ? "bg-blue-500" : "bg-gray-600"
          }`}
        >
          <div className="flex">
            {" "}
            <button
              onClick={handleSalesCard}
              className={`px-5 py-2 text-white ${
                active === "Card" ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              Card
            </button>
            <button
              onClick={handleSalesList}
              className={`px-8 py-2 text-white ${
                active === "List" ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              List
            </button>
          </div>
          <div className="flex justify-end items-center mx-6">
            <Marquee className="text-sm tracking-wider font-extralight">
              Discover our best offers on top-quality products! Enjoy incredible
              discounts and unbeatable prices on a wide range of items.
            </Marquee>
          </div>
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
