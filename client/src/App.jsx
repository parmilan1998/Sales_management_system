import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./Layout/RootLayout";
import Category from "./Pages/Category/Category";

import Dashboard from "./Pages/Dashboard";
import Home from "./Components/Home";
import PageNotFound from "./Pages/PageNotFound";
import Stocks from "./Pages/Stocks/Stocks";
import Sales from "./Pages/Sales/SalesScreen";
import Purchase from "./Pages/Purchase/PurchaseScreen";
import Report from "./Pages/Report/Report";
import ProductScreen from "./Pages/Products/ProductScreen";
import AddProductScreen from "./Pages/Products/AddProductScreen";
import EditProductScreen from "./Pages/Products/EditProductScreen";
import AddPurchaseScreen from "./Pages/Purchase/AddPurchaseScreen";
import EditPurchaseScreen from "./Pages/Purchase/EditPurchaseScreen";
import SingleCategory from "./Pages/Category/SingleCategory";
import AddEditSalesScreen from "./Pages/Sales/AddEditSalesScreen";
import LoginScreen from "./Pages/Admin/LoginScreen";
import ProfileSettingsScreen from "./Pages/ProfileSettingsScreen";
import OrderScreen from "./Pages/OrderScreen";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/category/fbc/:id" element={<SingleCategory />} />
            <Route path="/products/add" element={<AddProductScreen />} />
            <Route path="/products/edit/:id" element={<EditProductScreen />} />
            <Route path="/products" element={<ProductScreen />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/purchase/add" element={<AddPurchaseScreen />} />
            <Route path="/purchase/edit/:id" element={<EditPurchaseScreen />} />
            <Route path="/sales/add" element={<AddEditSalesScreen />} />
            <Route path="/sales/add/:id" element={<AddEditSalesScreen />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/profile" element={<ProfileSettingsScreen />} />
            <Route path="/order" element={<OrderScreen />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route path="/user/login" element={<LoginScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
