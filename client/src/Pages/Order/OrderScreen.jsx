import React, { useEffect, useState } from "react";
import NavbarSales from "../../Components/NavbarSales";
import FooterSales from "../../Components/FooterSales";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import axios from "axios";
import Logo from "../../assets/men.jpg";
import { TiDelete } from "react-icons/ti";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GiFocusedLightning } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { IoAddCircleOutline } from "react-icons/io5";

const OrderScreen = () => {
  const [products, setProducts] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [unitPrice, setUnitPrice] = useState(0);
  const [customerFormFields, setCustomerFormFields] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // Handle Custom
  const onHandleCustomer = (values) => {
    console.log("Success:", values);
    setCustomerData(values.customer);
    setCustomerFormFields(true);
    toast.success("Customer details updated successfully");
  };

  // Handle Product
  const onHandleProduct = (values) => {
    console.log("Success:", values);

    const selectedProduct = products.find(
      (product) => product.productName === values.product.productName
    );

    if (selectedProduct) {
      setUnitPrice(selectedProduct.unitPrice);
    }

    const amount = values.product.salesQuantity * unitPrice;
    const productWithAmount = { ...values.product, unitPrice, amount };

    if (
      !addedProducts.some((p) => p.productName === values.product.productName)
    ) {
      setAddedProducts([...addedProducts, productWithAmount]);
      form.resetFields();
    } else {
      toast.error("Product already added");
    }
  };

  // Add a new product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      custName: customerData.custName,
      customerContact: customerData.contactNo,
      soldDate: customerData.soldDate.format("YYYY-MM-DD"),
      products: addedProducts.map((product) => ({
        productName: product.productName,
        salesQuantity: product.salesQuantity,
        unitPrice: product.unitPrice,
      })),
      discount,
      total,
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

  // Delete sales product
  const handleDeleteProduct = (index) => {
    const newProducts = addedProducts.filter((_, i) => i !== index);
    setAddedProducts(newProducts);
  };

  // Fetch products
  const fetchProductsApi = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/product/list");
      console.log(res.data);
      setProducts(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchProductsApi();
  }, []);

  // Handle discount
  const handleDiscountChange = (e) => {
    const discountValue = parseFloat(e.target.value);
    setDiscount(discountValue);
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = addedProducts.reduce(
      (total, product) => total + product.amount,
      0
    );
    const discountAmount = (subtotal * discount) / 100;
    const finalTotal = subtotal - discountAmount;
    setTotal(finalTotal);
  };

  // Subtotal calculation
  const totalAmount = addedProducts.reduce(
    (total, product) => total + product.amount,
    0
  );

  return (
    <>
      <NavbarSales />
      <div className="min-h-screen bg-gray-200 z-0 px-8 lg:h-[100%] py-12 lg:px-16 mx-auto font-poppins cursor-pointer">
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-3 w-full">
            <div>
              {/* <div className="flex bg-white gap-3 font-poppins border border-gray-400 rounded py-5 px-3 m-3"> */}
              <Form
                onFinish={onHandleCustomer}
                className="gap-3 p-8 rounded-md bg-white"
                layout="vertical"
                autoComplete="off"
              >
                <div className="text-gray-400 py-4 flex justify-center items-center gap-3 text-center text-2xl font-poppins font-bold">
                  <GiFocusedLightning size={32} />
                  Customer Details
                </div>
                <div className="flex w-full">
                  <Form.Item
                    name={["customer", "custName"]}
                    label="Customer Name"
                    className="px-3 font-poppins w-full"
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
                      disabled={customerFormFields}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["customer", "contactNo"]}
                    label="Contact No"
                    className="font-poppins px-3 w-full"
                    rules={[
                      {
                        required: true,
                        message: "Please input contact number!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Ex: 0770337897"
                      className="font-poppins py-1.5"
                      disabled={customerFormFields}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["customer", "soldDate"]}
                    label="Sold Date"
                    className="font-poppins px-3 w-full"
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
                      disabled={customerFormFields}
                    />
                  </Form.Item>
                </div>
                <div className="px-3">
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={customerFormFields}
                    className="font-poppins py-3 h-10 w-full"
                  >
                    Add Details
                  </Button>
                </div>
              </Form>
              {/* </div> */}
            </div>
            <div>
              <Form
                onFinish={onHandleProduct}
                form={form}
                layout="vertical"
                className="gap-3 p-8 my-3 rounded-md bg-white"
              >
                <div className="text-gray-400 py-2 flex justify-center items-center gap-3 text-center text-2xl font-poppins font-bold">
                  <GiFocusedLightning size={32} />
                  Product Details
                </div>
                <Form.Item
                  name={["product", "productName"]}
                  label="Product Name"
                  className="font-poppins px-3"
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
                        .includes(input.toLowerCase())
                    }
                    options={products.map((product) => ({
                      label: `${product.productName} (Qt-${product.totalQuantity})`,
                      value: product.productName,
                      disabled:
                        addedProducts.some(
                          (p) => p.productName == product.productName
                        ) || product.totalQuantity == 0,
                    }))}
                    onChange={(value) => {
                      const selectedProduct = products.find(
                        (product) => product.productName === value
                      );
                      if (selectedProduct) {
                        setUnitPrice(selectedProduct.unitPrice);
                        form.setFieldsValue({
                          product: {
                            unitPrice: selectedProduct.unitPrice,
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
                <div className="flex px-3 gap-3">
                  <Form.Item
                    name={["product", "salesQuantity"]}
                    className="font-poppins w-full"
                    label="Sales Quantity"
                    rules={[
                      {
                        required: true,
                        message: "Please input sales quantity!",
                      },
                    ]}
                  >
                    <InputNumber
                      max={100}
                      min={1}
                      defaultValue={1}
                      className="font-poppins w-full py-1"
                    />
                  </Form.Item>

                  <Form.Item
                    name={["product", "unitPrice"]}
                    className="font-poppins w-full"
                    label="Unit Price"
                    rules={[
                      {
                        required: true,
                        message: "Please input unit price!",
                      },
                      {
                        type: "number",
                        min: 100,
                        message: "Price must be at least 100!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={100}
                      defaultValue={100}
                      readOnly={true}
                      className="font-poppins w-full py-1"
                    />
                  </Form.Item>
                </div>
                <div className="px-3">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="font-poppins py-3 h-10 w-full"
                  >
                    Add Details
                  </Button>
                </div>
              </Form>
            </div>
          </div>
          <div className="col-span-3">
            <div className="min-h-screen bg-gray-200 z-0 lg:h-[100%] w-full mx-auto font-poppins cursor-pointer">
              <div className="grid grid-cols-6 gap-2 font-poppins">
                {addedProducts && (
                  <div className="col-span-6 bg-cyan-500 text-white rounded w-full p-4">
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
                                className="block sm:table-row sm:border-none mb-4"
                              >
                                <td
                                  data-th="Company"
                                  className="before:w-24 py-3 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-xs transition duration-300 stroke-slate-500 "
                                >
                                  <div className="relative">{index + 1}.</div>
                                </td>
                                <td
                                  data-th="Title"
                                  className="before:w-24 py-3 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500  "
                                >
                                  <div className="relative tracking-wide">
                                    {product.productName}
                                  </div>
                                </td>
                                <td
                                  data-th="Title"
                                  className="before:w-24 py-3 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500  "
                                >
                                  <div className="relative tracking-wide">
                                    {product.salesQuantity}
                                  </div>
                                </td>
                                <td
                                  data-th="amount"
                                  className="before:w-24 py-3 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500 "
                                >
                                  <div className="flex justify-end items-end  tracking-wider text-end px-2">
                                    <span>Rs.{product.amount.toFixed(2)}</span>
                                  </div>
                                </td>
                                <td
                                  data-th="Username"
                                  className="before:inline-block py-3 before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500 "
                                >
                                  <button
                                    className="flex justify-center items-center"
                                    onClick={() => handleDeleteProduct(index)}
                                  >
                                    <RxCross2 color="red" size={24} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* <div className="cols-span-2"></div> */}
                    <div className="flex gap-4 justify-center lg:ml-[263px]">
                      <span className="text-sm mt-0.5 tracking-wide">
                        Sub Total:
                      </span>
                      <h1 className="text-sm mt-0.5 tracking-wider flex">
                        Rs.{totalAmount.toFixed(2)}
                      </h1>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm m-4"></div>
                      <div className="lg:mx-12 py-4">
                        <input
                          type="number"
                          name="discount"
                          id="discount"
                          value={discount}
                          min={0}
                          placeholder="Discount %"
                          onChange={handleDiscountChange}
                          className="relative w-32 text-end px-6 h-8 text-xs transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center lg:ml-[296px]">
                      <span className="text-sm mt-0.5 tracking-wide">
                        Total:
                      </span>
                      <h1 className="text-sm mt-0.5 tracking-wider flex">
                        Rs.{total.toFixed(2)}
                      </h1>
                    </div>
                    <div className="relative flex justify-end "></div>
                    <div className="grid grid-cols-4 p-4">
                      <div className="col-span-2 flex justify-end gap-2"></div>
                      <div className="col-span-2 flex justify-end gap-2 mx-2">
                        <button
                          // onClick={handleSubmit}
                          className="text-sm px-3 py-2 bg-emerald-500 hover:bg-emerald-700 ease-in duration-200 rounded-sm text-white"
                        >
                          Preview
                        </button>
                        <button
                          onClick={calculateTotal}
                          className="text-sm px-5 py-2 bg-emerald-500 hover:bg-emerald-700 ease-in duration-200 rounded-sm text-white"
                        >
                          Total
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="text-sm px-3 py-2  bg-sky-500 hover:bg-sky-700 ease-in duration-200 rounded-sm text-white"
                        >
                          Finished
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSales />
    </>
  );
};

export default OrderScreen;
