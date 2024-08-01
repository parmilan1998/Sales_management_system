/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  IoIosAddCircleOutline,
  IoIosArrowDropdownCircle,
  IoIosArrowDroprightCircle,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiCircleRemove } from "react-icons/ci";
import { Button, DatePicker, Form, Input, InputNumber, Popover } from "antd";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SalesCard = () => {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
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

  // Calculate subtotal
  // const calculateSubtotal = () => {
  //   return cart.reduce(
  //     (total, item) => total + item.unitPrice * item.quantity,
  //     0
  //   );
  // };
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const itemDiscount = item.discount || 0;
      const discountedPrice = item.unitPrice * (1 - itemDiscount / 100);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  // Calculate total after discount
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - subtotal * (discount / 100);
  };

  useEffect(() => {
    fetchCategoryData();
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

  const calculateDiscountedSubtotal = (unitPrice, quantity) => {
    const subtotal = unitPrice * quantity;
    return subtotal - subtotal * (discount / 100);
  };

  // Handle finished
  const handleFinished = async (e) => {
    e.preventDefault();

    if (!customerData) {
      toast.error("Fill customer information!...");
    }

    const payload = {
      custName: customerData.custName,
      customerContact: customerData.contactNo,
      soldDate: customerData.soldDate.format("YYYY-MM-DD"),
      products: cart.map((product) => ({
        productName: product.productName,
        salesQuantity: product.quantity,
        subTotal:
          product.unitPrice *
          product.quantity *
          (1 - (product.discount || 0) / 100),
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
      <div className=" pt-6">
        <button onClick={toggleContent} className="">
          {showContent == true ? (
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
                  className="font-poppins font-medium  px-3 w-full"
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
                  className="font-poppins font-medium  px-3 w-full"
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
                  className={`px-8 py-2 text-sm rounded shadow ${
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
              {products.map((product) => (
                <div
                  key={product.productID}
                  className="border bg-white p-4 rounded shadow"
                >
                  <img
                    src={`http://localhost:5000/public/products/${product.imageUrl}`}
                    alt={product.productName}
                    className="w-full h-32 object-cover mb-4 rounded"
                  />
                  <h2 className="text-xs font-semibold">
                    {product.productName}
                  </h2>
                  <div className="flex justify-between">
                    <p className="text-gray-800 text-xs font-bold">
                      Price: Rs.{product.unitPrice}
                    </p>
                    <button onClick={() => addToCart(product)}>
                      <IoAddCircleOutline size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-span-3 col-start-6">
          <div className="bg-white lg:mt-6 rounded shadow-md px-4 mb-8">
            <h2 className="text-2xl font-semibold pt-6 font-acme text-gray-600">
              Items
            </h2>
            {cart.length === 0 ? (
              <p className="text-center pt-10 pb-16">Your cart is empty</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 py-4">
                  {cart.map((item, index) => (
                    <div key={index} className=" border-b-[1px]">
                      <div className="flex gap-2">
                        <table>
                          <tr className="flex gap-3 justify-center items-center">
                            <th className="flex justify-start items-start">
                              {" "}
                              <img
                                src={`http://localhost:5000/public/products/${item.imageUrl}`}
                                alt={item.productName}
                                className="w-12 h-12 object-cover mb-4 rounded"
                              />
                            </th>
                            <th className="w-24">
                              {" "}
                              <h2 className="text-xs text-start font-medium">
                                {item.productName}
                              </h2>
                            </th>
                            <th className="w-24">
                              {" "}
                              <p className="text-black text-start font-medium flex justify-center items-center gap-2">
                                <IoIosRemoveCircleOutline
                                  onClick={() =>
                                    decrementQuantity(item.productID)
                                  }
                                />
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() =>
                                    incrementQuantity(item.productID)
                                  }
                                >
                                  <IoIosAddCircleOutline />
                                </button>
                              </p>
                            </th>
                            <th className="w-24">
                              <input
                                type="number"
                                value={item.discount || 0}
                                onChange={(e) => {
                                  const updatedCart = cart.map((cartItem) =>
                                    cartItem.productID === item.productID
                                      ? {
                                          ...cartItem,
                                          discount: Number(e.target.value),
                                        }
                                      : cartItem
                                  );
                                  setCart(updatedCart);
                                }}
                                className="w-16 px-2 py-1 text-sm border rounded"
                                min="0"
                                max="100"
                              />
                              <span className="text-gray-600 px-1 text-xs">
                                %
                              </span>
                            </th>
                            <th className="w-20">
                              {" "}
                              <p className=" text-gray-800 text-start text-xs font-medium">
                                Rs.
                                {(
                                  item.unitPrice *
                                  item.quantity *
                                  (1 - (item.discount || 0) / 100)
                                ).toFixed(2)}
                              </p>
                            </th>
                            <th>
                              <button
                                className="mt-1"
                                onClick={() =>
                                  setCart(
                                    cart.filter(
                                      (p) => p.productID !== item.productID
                                    )
                                  )
                                }
                              >
                                <CiCircleRemove color="red" />
                              </button>
                            </th>
                          </tr>
                        </table>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 text-gray-600 py-1 border-t-0">
                    <h3 className="text-md font-bold">Total</h3>
                    <p className="text-sm font-bold">
                      Rs.{calculateSubtotal().toFixed(2)}
                    </p>
                  </div>
                  {/* <div className="flex justify-between items-center px-4 py-1 border-t-0">
                    <label
                      htmlFor="discount"
                      className="text-sm text-gray-600  font-semibold"
                    >
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      id="discount"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-20 px-2 py-1 text-sm border rounded"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex justify-between text-gray-600 items-center px-4 border-t-0">
                    <h3 className="text-sm font-semibold">Total</h3>
                    <p className="text-sm font-bold">
                      Rs.{calculateTotal().toFixed(2)}
                    </p>
                  </div> */}
                  <div className="flex justify-between items-center py-4 gap-3 border-t">
                    <button
                      onClick={clearAll}
                      className="bg-red-500 text-sm text-white w-full px-4 py-2 rounded"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleFinished}
                      className="bg-green-500 text-sm text-white w-full px-4 py-2 rounded"
                    >
                      Finished
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesCard;
