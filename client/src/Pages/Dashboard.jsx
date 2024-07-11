import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { DatePicker } from "antd";
import moment from "moment";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [maxRevenue, setMaxRevenue] = useState(0);
  const [sortType, setSortType] = useState("year"); // 'month' or 'year'
  const [year, setYear] = useState(new Date().getFullYear());

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
      {
        label: "333",
        data: [3, 3, 9],
        backgroundColor: "green",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const [data, setData] = useState(initialData);

  const fetchSalesData = async () => {
    let url = `http://localhost:5000/api/v1/sales/sort?sortType=${sortType}`;
    if (sortType === "month" && year) {
      url += `&year=${year}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSales(data);
      updateChartData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType, year]);

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

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: Math.floor(maxRevenue * 0.1),
        },
      },
    },
  };

  return (
    <div className=" max-w-screen-xl mx-auto lg:px-4 font-poppins cursor-pointer">
      <h1 className="text-2xl font-acme text-gray-700 pb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 w-full">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded w-full h-40 p-5 flex flex-col justify-between">
            <h1 className="text-xl text-neutral-400">Categories</h1>
            <span className="text-4xl text-neutral-800 font-medium font-acme">
              3,786
            </span>
         
          </div>
          <div className="bg-slate-50 rounded w-full h-40 p-5 flex flex-col justify-between">
            <h1 className="text-xl text-neutral-400">Products</h1>
            <span className="text-4xl text-neutral-800 font-medium font-acme">
              4,532
            </span>
          
          </div>
          <div className="bg-slate-50 rounded w-full h-40 p-5 flex flex-col justify-between">
            <h1 className="text-xl text-neutral-400">Sales</h1>
            <span className="text-4xl text-neutral-800 font-medium font-acme">
              8,452
            </span>
            
          </div>
          <div className="bg-slate-50 rounded w-full h-40 p-5 flex flex-col justify-between">
            <h1 className="text-xl text-neutral-400">Stocks</h1>
            <span className="text-4xl text-neutral-800 font-medium font-acme">
              5,536
            </span>
     
          </div>
        </div>
        <div className="w-full bg-slate-50 rounded">
          <div className="m-2 flex flex-row gap-2">
            <label className="mt-1.5 text-sm">Sort Type:</label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border rounded-md border-slate-300 h-7 mt-1 text-sm"
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
          <Bar data={data} options={options}></Bar>
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
