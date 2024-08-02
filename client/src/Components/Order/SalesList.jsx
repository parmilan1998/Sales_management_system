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
  IoIosRemoveCircleOutline,
} from "react-icons/io";

const SalesList = () => {
  const [tempProducts, setTempProducts] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [unitPrice, setUnitPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [showContent, setShowContent] = useState(false);

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
      discount: 0,
      subtotal: product.unitPrice * product.salesQuantity,
    }))
  );

  const calculateSubtotal = (product) => {
    const discount =
      product.discount != null ? parseFloat(product.discount) : 0;
    return (
      product.unitPrice *
      product.salesQuantity *
      (1 - discount / 100)
    ).toFixed(2);
  };

  const calculateTotal = () => {
    return addedProducts
      .reduce((total, product) => {
        const discount =
          product.discount != null ? parseFloat(product.discount) : 0;
        return (
          total +
          ((100 - discount) / 100) * (product.salesQuantity * product.unitPrice)
        );
      }, 0)
      .toFixed(2);
  };

  const handleCustomerChange = (allValues) => {
    setCustomerData(allValues.customer);
    console.log(allValues.customer);
    toast.success("Customer Information saved successfully");
    setShowContent(false);
  };

  const onHandleProduct = (values) => {
    console.log("Success:", values);

    const selectedProduct = products.find(
      (product) => product.productName === values.product.productName
    );

    if (selectedProduct) {
      setUnitPrice(selectedProduct.unitPrice);
    }

    const amount = values.product.salesQuantity * unitPrice;
    const updatedProduct = { ...values.product, unitPrice, amount };

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
          discount: values.product.discount || 0, // Ensure discount is updated
          subtotal: calculateSubtotal(updatedProduct),
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
      soldDate: customerData.soldDate.format("YYYY-MM-DD"),
      products: addedProducts.map((product) => ({
        productName: product.productName,
        salesQuantity: product.salesQuantity,
        subTotal: calculateSubtotal(product),
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

  const handleDiscountChange = (index, discount) => {
    if (index >= 0 && index < addedProducts.length) {
      const newProducts = [...addedProducts];
      newProducts[index].discount = discount != null ? parseFloat(discount) : 0;
      setAddedProducts(newProducts);
    }
  };

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
      <div className="px-6 pt-6">
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

      <div className="grid grid-cols-8 px-6 py-8">
        <div className="col-span-4">
          {/* <div className="text-gray-400 py-4 flex justify-center items-center gap-3 text-center text-2xl font-poppins font-bold">
            <GiFocusedLightning size={32} />
            Customer Details
          </div>
          <div className="flex w-full">
            <Form
              className="gap-3 pt-8 px-12  bg-white flex"
              layout="vertical"
              autoComplete="off"
              onFinish={handleCustomerChange}
            >
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
                />
              </Form.Item>
              <Form.Item
                name={["customer", "contactNo"]}
                label="Contact No"
                className="font-poppins px-3 w-full"
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
                />
              </Form.Item>
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
          </div> */}
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
                          setUnitPrice(selectedProduct.unitPrice);

                          // Find if the selected product is already in addedProducts
                          const existingProduct = addedProducts.find(
                            (product) => product.productName == value
                          );

                          form.setFieldsValue({
                            product: {
                              unitPrice: selectedProduct.unitPrice,
                              discount: existingProduct
                                ? existingProduct.discount
                                : 0,
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
                <div className="w-full mx-2">
                  <Form.Item
                    name={["product", "unitPrice"]}
                    className="font-poppins w-full"
                    label="Unit Price"
                    rules={[
                      {
                        required: true,
                        message: "Please input unit price!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Ex:10.00"
                      readOnly={true}
                      className="font-poppins w-full py-0.5 h-8"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex">
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
                <div className="w-full mx-2">
                  <Form.Item
                    name={["product", "discount"]}
                    className="font-poppins w-full"
                    label="Discount"
                  >
                    <InputNumber
                      className="w-full"
                      min={0}
                      placeholder="Ex:20"
                      onChange={(value) =>
                        handleDiscountChange(parseFloat(value) || 0)
                      }
                      addonAfter="%"
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
        <div className="col-start-6 col-span-3">
          <div>
            {addedProducts && (
              <div className="bg-white text-gray-500 rounded w-full p-4">
                <div className="grid grid-cols-5 p-4 gap-2">
                  <div className="py-2 flex justify-center items-center gap-3 text-center text-2xl font-poppins font-bold">
                    Items
                  </div>
                  <div className="col-span-5 overflow-x-auto">
                    <table className="w-full text-left" cellSpacing="0">
                      {/* <thead>
                        <tr className="block sm:table-row sm:border-none mb-4">
                          <th
                            data-th="No"
                            className="py-3 w-8 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell text-sm font-medium text-left"
                          >
                            No
                          </th>
                          <th
                            data-th="Product Name"
                            className="py-3 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell text-sm font-medium text-left"
                          >
                            Product Name
                          </th>
                          <th
                            data-th="Sales Quantity"
                            className="py-3 w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell text-sm font-medium text-left"
                          >
                            Quantity
                          </th>

                          <th
                            data-th="Discount"
                            className="py-3 w-12 text-end before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell text-sm font-medium"
                          >
                            Discount
                          </th>
                          <th
                            data-th="Subtotal"
                            className="py-3 w-24 before:inline-block text-end before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell text-sm font-medium"
                          >
                            Subtotal
                          </th>
                        </tr>
                      </thead> */}
                      <tbody>
                        {addedProducts.map((product, index) => (
                          <tr
                            key={index}
                            className="block sm:table-row mb-4 gap-3 border-b-[1px]"
                          >
                            {/* <td
                              data-th="Index"
                              className="before:w-24  py-3 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-xs transition duration-300 stroke-slate-500"
                            >
                              <div className="relative">{index + 1}.</div>
                            </td> */}
                            {/* <td className="flex justify-start items-start">
                              {" "}
                              <img
                                src={`http://localhost:5000/public/products/${product.imageUrl}`}
                                alt={product.productName}
                                className="w-12 h-12 object-cover mb-4 rounded"
                              />
                            </td> */}
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
                              data-th="Discount"
                              className="py-6 flex w-24 items-center sm:table-cell h-8 text-sm transition duration-300"
                            >
                              <div className="relative tracking-wide text-end">
                                {product.discount != null
                                  ? product.discount.toFixed(2)
                                  : "0"}
                                %
                              </div>
                            </td>
                            <td
                              data-th="Subtotal"
                              className="before:w-24 py-6 w-48 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500"
                            >
                              <div className="relative tracking-wide text-end">
                                Rs.{calculateSubtotal(product)}
                              </div>
                            </td>

                            <td
                              data-th="Actions"
                              className="before:inline-block w-24 justify-end py-6 before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-sm transition duration-300 stroke-slate-500"
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
                        <tr>
                          <td
                            colSpan="5"
                            className="text-right text-sm font-medium py-3 px-20"
                          >
                            <span className="mr-4">Total:</span> Rs.
                            {calculateTotal(addedProducts)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="relative flex justify-end "></div>
                {/* <div className="grid grid-cols-4 p-4">
                  <div className="col-span-2 flex justify-end gap-2"></div>
                  <div className="col-span-2 flex justify-end gap-2 mx-2">
                    <button className="text-sm px-3 py-2 bg-emerald-500 hover:bg-emerald-700 ease-in duration-200 rounded-sm text-white">
                      Preview
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="text-sm px-3 py-2  bg-sky-500 hover:bg-sky-700 ease-in duration-200 rounded-sm text-white"
                    >
                      Finished
                    </button>
                  </div>
                </div> */}
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
                    Finished
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesList;
