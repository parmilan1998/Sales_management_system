import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { Button, DatePicker, Form, Input, InputNumber } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Invoice from "./Invoice";

const SalesCard = () => {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const navigate = useNavigate();

  const fetchCategoryData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/category/list");
      setCategory(res.data);
      console.log(res.data);
      const techCategory = res.data.find(
        (item) => item.categoryName === "Home Essentials"
      );
      if (techCategory) {
        setSelectedCategory(techCategory.categoryID);
        fetchProductsData(techCategory.categoryID);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const fetchProductsData = async (categoryID) => {
    try {
      setProducts([]);
      const res = await axios.get(
        `http://localhost:5000/api/v1/product/fbc/${categoryID}`
      );
      setProducts(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching products data:", error);
    }
  };

  // Add To Product
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.productID === product.productID
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.productID === product.productID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Increment quantity
  const incrementQuantity = (productID) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productID === productID
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrement quantity
  const decrementQuantity = (productID) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.productID === productID && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const itemDiscount = item.discount || 0;
      const discountedPrice = item.unitPrice * (1 - itemDiscount / 100);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  useEffect(() => {
    fetchCategoryData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      fetchProductsData(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Save cart in local storage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Clear all items
  const clearAll = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Handle finished
  const handleFinished = async (e) => {
    e.preventDefault();

    if (!customerData) {
      toast.error("Fill customer information!...");
      return;
    }

    const payload = {
      custName: customerData.custName,
      customerContact: customerData.contactNo,
      soldDate: customerData.soldDate.format("YYYY-MM-DD"),
      products: cart.map((product) => ({
        productName: product.productName,
        salesQuantity: product.quantity,
      })),
    };

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/sales`,
        payload
      );
      console.log(res.data);
      toast.success(`Sales created successfully!`);
      clearAll();
      navigate("/sales");
    } catch (err) {
      console.error(err);
      toast.error("Error creating sales");
    }
  };

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const handleFormSubmit = (values) => {
    setCustomerData(values.customer);
    console.log(values.customer);
    toast.success("Customer Information saved successfully");
    setShowContent(false);
  };

  return (
    <div className="px-6">
      <div className="pt-6">
        <button onClick={toggleContent} className="">
          {showContent ? (
            <>
              <IoIosArrowDropdownCircle size={28} />
            </>
          ) : (
            <div className="flex items-center gap-1">
              <IoIosArrowDroprightCircle size={28} />{" "}
              <span className="text-md font-medium text-gray-500">
                Customer Info
              </span>
            </div>
          )}
        </button>
        {showContent && (
          <div className="bg-white px-2 w-1/2 rounded shadow-md">
            <div className="flex w-full">
              <Form
                className="gap-3 pt-8 px-3 bg-white flex"
                layout="vertical"
                autoComplete="off"
                onFinish={handleFormSubmit}
              >
                <Form.Item
                  name={["customer", "custName"]}
                  label="Customer Name"
                  className="px-3 font-poppins font-medium w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please input customer name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ex: John Clerk"
                    className="font-poppins py-1.5"
                  />
                </Form.Item>
                <Form.Item
                  name={["customer", "contactNo"]}
                  label="Contact No"
                  className="font-poppins font-medium px-3 w-full"
                >
                  <InputNumber
                    placeholder="Ex: 0770337897"
                    className="font-poppins py-0.5 w-full"
                    maxLength={10}
                  />
                </Form.Item>
                <Form.Item
                  name={["customer", "soldDate"]}
                  label="Sold Date"
                  className="font-poppins font-medium px-3 w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please select the sold date!",
                    },
                  ]}
                >
                  <DatePicker
                    className="font-poppins py-1.5 w-full"
                    placeholder="Ex: 22.08.2024"
                  />
                </Form.Item>
                <Form.Item className="flex justify-center mt-7 items-center">
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-4">
          <div className="flex justify-center items-center pt-6">
            <div className="grid grid-cols-4 gap-2">
              {category.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(item.categoryID)}
                  className={`px-8 py-2 text-xs rounded shadow ${
                    selectedCategory === item.categoryID
                      ? "bg-indigo-800"
                      : "bg-indigo-500"
                  } text-white`}
                >
                  {item.categoryName}
                </button>
              ))}
            </div>
          </div>
          {selectedCategory !== null && (
            <div className="grid grid-cols-3 gap-4 py-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.productID}
                    className="border bg-white p-4 rounded shadow"
                  >
                    <img
                      src={`http://localhost:5000/public/products/${product.imageUrl}`}
                      alt={product.productName}
                      className="w-full h-32 object-cover mb-4"
                    />
                    <h3 className="font-bold">{product.productName}</h3>
                    <div className="flex justify-between">
                      <p className="text-gray-800 text-xs font-bold">
                        Price: Rs.{product.unitPrice}
                      </p>
                      <button onClick={() => addToCart(product)}>
                        <IoAddCircleOutline size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500">
                  No products available in this category.
                </div>
              )}
            </div>
          )}
        </div>
        <Invoice
          cart={cart}
          decrementQuantity={decrementQuantity}
          incrementQuantity={incrementQuantity}
          setCart={setCart}
          calculateSubtotal={calculateSubtotal}
          clearAll={clearAll}
          handleFinished={handleFinished}
        />
      </div>
    </div>
  );
};

export default SalesCard;
