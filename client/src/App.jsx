import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./Layout/RootLayout";
import Category from "./Pages/Category/Category";

import Dashboard from "./Pages/Dashboard";
import Home from "./Components/Home";
import PageNotFound from "./Pages/PageNotFound";
import Products from "./Pages/Products/Products";
import Stocks from "./Pages/Stocks/Stocks";
import Sales from "./Pages/Sales/Sales";
import Purchase from "./Pages/Purchase/Purchase";
import Report from "./Pages/Report/Report";
import ProductScreen from "./Pages/Products/ProductScreen";
import AddProductScreen from "./Pages/Products/AddProductScreen";
import EditProductScreen from "./Pages/Products/EditProductScreen";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/products/add" element={<AddProductScreen />} />
            <Route path="/products/edit/:id" element={<EditProductScreen />} />
            <Route path="/products" element={<ProductScreen />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
