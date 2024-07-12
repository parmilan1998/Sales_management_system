import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { DatePicker } from "antd";
import moment from "moment";
import categoryApi from "../api/category";
import productApi from "../api/products";
import stockApi from "../api/stocks";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import salesApi from "../api/sales";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [maxRevenue, setMaxRevenue] = useState(0);
  const [sortType, setSortType] = useState("year"); // 'month' or 'year'
  const [year, setYear] = useState(new Date().getFullYear());

  const [category, setCategory] = useState(0);
  const [stock, setStock] = useState(0);
  const [product, setProduct] = useState(0);
  const [saleCount, setSaleCount] = useState(0);

  const initialData = {
    labels: ["Mon", "Tue", "Wed"],
    datasets: [
      {
        label: "Sales",
        data: [3, 6, 9],
        backgroundColor: "skyblue",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const [data, setData] = useState(initialData);

  const fetchCategory = async () => {
    try {
      const res = await categoryApi.get("/count");

      setCategory(res.data.count);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchCategory();
    fetchProducts();
    fetchStocks();
    fetchSaleCount();
    fetchSalesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType, year]);

  const fetchProducts = async () => {
    try {
      const res = await productApi.get("/count");

      setProduct(res.data.count);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await stockApi.get("/total");

      setStock(res.data.totalQuantity);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchSaleCount = async () => {
    try {
      const res = await salesApi.get("/count");

      setSaleCount(res.data.count);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchSalesData = async () => {
    let url = `http://localhost:5000/api/v1/sales/sort?sortType=${sortType}`;
    if (sortType === "month" && year) {
      url += `&year=${year}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSales(data);
      console.log("hello",data);
      updateChartData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const updateChartData = (salesData) => {
    if (salesData.length === 0) {
      setData(initialData);
      return;
    }

    // Determine the maximum total revenue
    const maxRevenue = Math.max(...salesData.map((sale) => sale.totalRevenue));
    setMaxRevenue(maxRevenue);

    let labels = [];
    let salesByPeriod = [];

    if (sortType === "month") {
      // Labels for months (January to December)
      labels = Array.from({ length: 12 }, (_, index) =>
        new Date(year, index).toLocaleString("en-US", { month: "short" })
      );

      // Initialize salesByPeriod with zeros for each month
      salesByPeriod = Array.from({ length: 12 }, () => 0);

      // Update salesByPeriod based on fetched data
      salesData.forEach((sale) => {
        const monthIndex = sale.month - 1; // Assuming month is returned as 1-based index
        salesByPeriod[monthIndex] = sale.totalRevenue;

      });
    } else {
      // Labels for last 5 years
      const currentYear = new Date().getFullYear();
      labels = Array.from({ length: 5 }, (_, index) =>
        (currentYear - index).toString()
      ).reverse();

      // Initialize salesByPeriod with zeros for each year
      salesByPeriod = Array.from({ length: 5 }, () => 0);

      // Update salesByPeriod based on fetched data
      salesData.forEach((sale) => {
        const yearIndex = labels.indexOf(sale.year.toString());
        if (yearIndex !== -1) {
          salesByPeriod[yearIndex] = sale.totalRevenue;
        }
      });
    }

    // Update chart data
    setData({
      labels: labels,
      datasets: [
        {
          label: "Sales",
          data: salesByPeriod,
          backgroundColor: "skyblue",
          borderColor: "black",
          borderWidth: 1,
        },
      ],
    });
  };

  // Socket event listeners
  useEffect(() => {

    socket.on("categoryCount", (newCategory) => {
      setCategory(newCategory);
    });

    socket.on("productCount", (newProduct) => {
      setProduct(newProduct);
    });

    socket.on("totalProductQuantityUpdated", (newStock) => {
      setStock(newStock);
    });

    socket.on("saleCount", (newSaleCount) => {
      setSaleCount(newSaleCount);
    });

    socket.on("salesUpdated", (newSalesData) => {

      console.log("hi", newSalesData);
      setSales(newSalesData);
      updateChartData(newSalesData);
    });

    // Cleanup on unmount
    return () => {
      socket.off("updateCategory");
      socket.off("updateProduct");
      socket.off("updateStock");
      socket.off("updateSaleCount");
      socket.off("updateSalesData");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: Math.floor(maxRevenue * 0.1),
        },
        title: {
          display: true,
          text: "Total Revenue",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className=" max-w-screen-xl mx-auto lg:px-4 font-poppins cursor-pointer">
      <h1 className="text-2xl font-acme text-gray-700 pb-4">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 w-full">
        <div className="flex flex-row gap-3">
          <div className="bg-slate-50 rounded w-full h-30 p-5 flex flex-col justify-between">
            <h1 className="text-xl text-neutral-400">Categories</h1>
            <span className="text-4xl text-neutral-800 font-medium font-acme">
              {category}
            </span>
          </div>
          <div className="bg-slate-50 rounded w-full h-30 p-5 flex flex-col justify-between">
            <h1 className="text-xl text-neutral-400">Products</h1>
            <span className="text-4xl text-neutral-800 font-medium font-acme">
              {product}
            </span>
          </div>
          <div className="bg-slate-50 rounded w-full h-30 p-5 flex flex-col justify-between">
            <h1 className="text-xl text-neutral-400">Sales</h1>
            <span className="text-4xl text-neutral-800 font-medium font-acme">
              {saleCount}
            </span>
          </div>
          <div className="bg-slate-50 rounded w-full h-30 p-5 flex flex-col justify-between">
            <h1 className="text-xl text-neutral-400">Stocks</h1>
            <span className="text-4xl text-neutral-800 font-medium font-acme">
              {stock}
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-50 py-2 h-96 rounded border border-slate-300">
          <div className="m-2 flex flex-row   gap-2 ">
            <label className="mt-1.5 text-sm">Sort Type:</label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border rounded-md border-slate-300 h-8 mt-1 text-sm"
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
            </select>
            {sortType === "month" && (
              <>
                <label className="mt-1.5">Year:</label>
                <DatePicker
                  onChange={(date) => setYear(date.year())}
                  picker="year"
                  value={moment(year, "YYYY")}
                  className="w-24 mt-0.5"
                />
              </>
            )}
          </div>
          <div className="h-80 px-3">
            <Bar data={data} options={options}></Bar>
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-3 gap-6 py-4">
        <div className="bg-slate-50 rounded w-full h-64 col-span-2"></div>
        <div className="bg-slate-50 rounded w-full h-64 col-span-1"></div>
      </div> */}
    </div>
  );
};

export default Dashboard;
