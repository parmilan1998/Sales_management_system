import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiFocusedLightning } from "react-icons/gi";
import toast from "react-hot-toast";
import { IoCloseCircle } from "react-icons/io5";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import SalesTimeDate from "./SalesTimeDate";

const SalesList = () => {
  const [tempProducts, setTempProducts] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch products
  const fetchProductsApi = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/product/list");
      console.log(res.data);
      setProducts(res.data);
      setTempProducts(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const [addedProducts, setAddedProducts] = useState(
    products.map((product) => ({
      ...product,
      subtotal: product.discountedPrice * product.salesQuantity,
    }))
  );

  const handleCustomerChange = (allValues) => {
    setCustomerData(allValues.customer);
    console.log(allValues.customer);
    toast.success("Customer Information saved successfully");
    setShowContent(false);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const onHandleProduct = (values) => {
    console.log("Success:", values);

    const amount = values.product.salesQuantity * currentPrice;
    const updatedProduct = { ...values.product, currentPrice, amount };

    setAddedProducts((prevAddedProducts) => {
      const existingProductIndex = prevAddedProducts.findIndex(
        (p) => p.productName == values.product.productName
      );

      if (existingProductIndex >= 0) {
        // Update the existing product
        const updatedProducts = [...prevAddedProducts];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          salesQuantity:
            updatedProducts[existingProductIndex].salesQuantity +
            values.product.salesQuantity,
          discount: values.product.discount || 0,
        };

        // Update tempProducts quantity
        const updatedTempProducts = tempProducts.map((product) => {
          if (product.productName == values.product.productName) {
            return {
              ...product,
              totalQuantity:
                product.totalQuantity - values.product.salesQuantity,
            };
          }
          return product;
        });

        setTempProducts(updatedTempProducts);
        return updatedProducts;
      } else {
        // Add the new product
        const updatedProducts = [...prevAddedProducts, updatedProduct];

        // Update tempProducts quantity
        const updatedTempProducts = tempProducts.map((product) => {
          if (product.productName == values.product.productName) {
            return {
              ...product,
              totalQuantity:
                product.totalQuantity - values.product.salesQuantity,
            };
          }
          return product;
        });

        setTempProducts(updatedTempProducts);
        return updatedProducts;
      }
    });

    form.resetFields();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerData) {
      toast.error("Fill all the customer information!...");
    }

    const payload = {
      custName: customerData.custName,
      customerContact: customerData.contactNo,
      soldDate: formatDate(currentDate),
      finalDiscount: discount,
      products: addedProducts.map((product) => ({
        productName: product.productName,
        salesQuantity: product.salesQuantity,
      })),
    };

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/sales`,
        payload
      );
      console.log(res.data);
      toast.success(`Sales created successfully!`);
      navigate("/sales");
    } catch (err) {
      console.error(err);
      toast.error("Error creating sales");
    }
  };

  const restoreProductQuantity = (productName, quantity) => {
    const product = tempProducts.find((p) => p.productName == productName);
    if (product) {
      product.totalQuantity += quantity;
    }
  };

  const calculateSubtotal = () => {
    return addedProducts.reduce(
      (total, product) => total + product.currentPrice * product.salesQuantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (1 - discount / 100);
  };

  const handleDeleteProduct = (index) => {
    const productToDelete = addedProducts[index];
    restoreProductQuantity(
      productToDelete.productName,
      productToDelete.salesQuantity
    );

    const updatedProducts = addedProducts.filter((_, i) => i !== index);
    setAddedProducts(updatedProducts);
  };

  useEffect(() => {
    fetchProductsApi();
  }, []);

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  useEffect(() => {
    const saveProducts = JSON.parse(localStorage.getItem("addedProducts"));
    if (saveProducts) {
      setAddedProducts(saveProducts);
    }
  }, []);

  // Save in local storage
  useEffect(() => {
    localStorage.setItem("addedProducts", JSON.stringify(addedProducts));
  }, [addedProducts]);

  // Clear all items
  const clearAll = () => {
    setAddedProducts([]);
    localStorage.removeItem("addedProducts");
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-2">
        <div className=" col-span-7 px-3">
          <div className="py-2">
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
              <div className="bg-white px-2 w-3/4 my-2 rounded shadow-md">
                <div className="flex w-auto">
                  <Form
                    className="gap-3 pt-8 px-3 bg-white flex"
                    layout="vertical"
                    autoComplete="off"
                    initialValues={customerData}
                    onFinish={handleCustomerChange}
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
          <div>
            <Form
              onFinish={onHandleProduct}
              form={form}
              layout="vertical"
              className="gap-3 p-10 bg-white shadow rounded"
            >
              <div className="text-gray-400 py-2 flex justify-center items-center gap-3 text-center text-2xl font-poppins font-bold">
                <GiFocusedLightning size={32} />
                Product Details
              </div>
              <div className="flex w-full">
                <div className="w-full mx-2">
                  <Form.Item
                    name={["product", "productName"]}
                    label="Product Name"
                    className="font-poppins w-full"
                    rules={[
                      {
                        required: true,
                        message: "Please select a product!",
                      },
                    ]}
                  >
                    <Select
                      className="font-poppins"
                      showSearch
                      placeholder="Select the product"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase()) ||
                        (option?.code ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={tempProducts.map((product) => ({
                        label: `${product.productName}`,
                        value: product.productName,
                        code: product.code,
                        disabled: product.totalQuantity == 0,
                      }))}
                      onChange={(value) => {
                        const selectedProduct = products.find(
                          (product) => product.productName == value
                        );

                        if (selectedProduct) {
                          setCurrentPrice(selectedProduct.discountedPrice);

                          // Find if the selected product is already in addedProducts
                          const existingProduct = addedProducts.find(
                            (product) => product.productName == value
                          );

                          form.setFieldsValue({
                            product: {
                              currentPrice: selectedProduct.discountedPrice,
                            },
                          });
                        }
                      }}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <style>
                            {`
                              .ant-select-item-option-disabled {
                               color: red !important;
                                  }
                                `}
                          </style>
                        </div>
                      )}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex">
                <div className="w-full mx-2">
                  <Form.Item
                    name={["product", "currentPrice"]}
                    className="font-poppins w-full"
                    label="Current Price"
                  >
                    <InputNumber
                      placeholder="Ex:10.00"
                      readOnly={true}
                      className="font-poppins w-full py-0.5 h-8"
                    />
                  </Form.Item>
                </div>
                <div className="w-full mx-2">
                  <Form.Item
                    name={["product", "salesQuantity"]}
                    className="font-poppins w-full"
                    label="Sales Quantity"
                    rules={[
                      {
                        required: true,
                        message: "Please input sales quantity!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const selectedProduct = tempProducts.find(
                            (product) =>
                              product.productName ==
                              getFieldValue(["product", "productName"])
                          );
                          if (
                            selectedProduct &&
                            value > selectedProduct.totalQuantity
                          ) {
                            return Promise.reject(
                              new Error(
                                "Sales quantity exceeds available quantity!"
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputNumber
                      min={1}
                      placeholder="Ex:10"
                      className="font-poppins w-full py-0.5 h-8"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="font-poppins py-3 px-10 h-10 w-full"
                >
                  Add Details
                </Button>
              </div>
            </Form>
          </div>
        </div>
        <div className=" col-span-5">
          <div>
            {addedProducts && (
              <div className="bg-white text-gray-500 rounded w-full p-4">
                <div className="mx-4">
                  <SalesTimeDate
                    formatDate={formatDate}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                  />
                </div>
                <div className="grid grid-cols-5 p-4 gap-2">
                  <div className="py-2 flex justify-center items-center gap-3 text-center text-2xl font-poppins font-bold">
                    Items
                  </div>
                  <div className="col-span-5 overflow-x-auto">
                    <table className="w-full text-left" cellSpacing="0">
                      <tbody>
                        {addedProducts.map((product, index) => (
                          <tr
                            key={index}
                            className="block sm:table-row mb-4 gap-3 border-b-[1px]"
                          >
                            <td
                              data-th="Product Name"
                              className="before:w-20 w-72 py-6 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500"
                            >
                              <div className="relative tracking-wide">
                                {product.productName}
                              </div>
                            </td>
                            <td
                              data-th="Sales Quantity"
                              className="before:w-24 w-24 py-6 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500"
                            >
                              <div className="relative tracking-wide flex justify-center">
                                {product.salesQuantity}
                              </div>
                            </td>
                            <td
                              data-th="Subtotal"
                              className="before:w-24 py-6 w-48 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500"
                            >
                              <div className="relative tracking-wide text-end">
                                Rs.
                                {product.currentPrice * product.salesQuantity}
                              </div>
                            </td>
                            <td
                              data-th="Actions"
                              className="before:inline-block w-4 justify-end py-6 before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500"
                            >
                              <button
                                className="flex justify-end ml-12 items-center"
                                onClick={() => handleDeleteProduct(index)}
                              >
                                <IoCloseCircle color="red" size={24} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="relative flex justify-end "></div>

                <div className="flex justify-between items-center px-4 py-2 text-gray-600 border-t-0">
                  <h3 className="text-sm font-medium">Sub Total</h3>
                  <p className="text-sm font-medium ">
                    Rs.{calculateSubtotal().toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center px-4 py-2 text-gray-600 border-t-0">
                  <h3 className="text-sm font-medium">Discount</h3>
                  <p className="text-sm font-medium ">
                    <input
                      type="number"
                      className="w-16 px-2 py-1 text-sm border rounded"
                      value={discount}
                      min="0"
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                    <span className="text-gray-600 px-1 text-xs">%</span>
                  </p>
                </div>
                <div className="flex justify-between items-center px-4 text-gray-600 py-2 border-t-0">
                  <h3 className="text-sm font-medium">Total</h3>
                  <p className="text-sm font-medium">
                    Rs.{calculateTotal().toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-4 px-4 gap-3 border-t-0">
                  <button
                    onClick={clearAll}
                    className="bg-red-500 text-sm text-white w-full px-4 py-2 rounded"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-sm text-white w-full px-4 py-2 rounded"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 px-6 py-8"></div>
    </div>
  );
};

export default SalesList;
