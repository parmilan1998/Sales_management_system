/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

const AddSalesScreen = () => {
  const { id } = useParams();
  const [productsData, setProductsData] = useState([]);

  const [formValues, setFormValues] = useState({
    custName: "",
    customerContact: "",
    soldDate: "",
    products: [
      {
        productName: "",
        salesQuantity: "",
      },
    ],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    if (!formValues.custName) errors.custName = "Customer Name is required";
    if (!formValues.customerContact)
      errors.customerContact = "Customer Contact is required";
    if (!formValues.soldDate) errors.soldDate = "Sale Date is required";

    formValues.products.forEach((product, index) => {
      if (!product.productName)
        errors[`productName-${index}`] = "Product Name is required";
      if (!product.salesQuantity || product.salesQuantity <= 0)
        errors[`salesQuantity-${index}`] =
          "Sales Quantity must be greater than 0";
    });

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...formValues.products];
    newProducts[index] = {
      ...newProducts[index],
      [name]: value,
    };
    setFormValues({
      ...formValues,
      products: newProducts,
    });
  };

  const handleAddEdit = () => {
    setFormValues({
      ...formValues,
      products: [
        ...formValues.products,
        {
          productName: "",
          salesQuantity: "",
        },
      ],
    });
  };

  const handleDeleteProduct = (index) => {
    const newProducts = formValues.products.filter((_, i) => i !== index);
    setFormValues({
      ...formValues,
      products: newProducts,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    console.log("Form submitted with values:", formValues);
    try {
      if (id) {
        const res = await axios.put(
          `http://localhost:5000/api/v1/sales/${id}`,
          formValues
        );
        console.log(res.data);
        toast.success(`Sales updated successfully!`);
      } else {
        const res = await axios.post(
          `http://localhost:5000/api/v1/sales`,
          formValues
        );
        console.log(res.data);
        toast.success(`Sales created successfully!`);
      }
      navigate("/sales");
    } catch (err) {
      console.error("Error creating sales", err);
      toast.error("Error creating sales");
    }
  };

  const fetchProductsApi = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/product/list");
      console.log(res.data);
      setProductsData(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchSalesApi = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/sales/${id}`);
      console.log(res.data);
      setFormValues({
        custName: res.data.custName,
        customerContact: res.data.customerContact,
        soldDate: res.data.soldDate,
        products: res.data.details,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchProductsApi();
    fetchSalesApi(id);
  }, [id]);

  return (
    <div className="max-w-screen-xl mx-auto lg:px-24 font-poppins cursor-pointer">
      <div className="max-w-screen-lg bg-white p-12 rounded">
        <div className="flex items-center justify-center gap-4 py-8 font-poppins">
          <span className="shrink-0 rounded-full bg-blue-400 p-2 text-white">
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                fillRule="evenodd"
              />
            </svg>
          </span>
          <p className="font-semibold sm:text-2xl text-gray-700">
            {id ? "Update" : "Create New"} Sales!
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="custName" className="flex pb-2 text-gray-600">
              Customer Name
            </label>
            <input
              value={formValues.custName}
              onChange={handleInputChange}
              type="text"
              name="custName"
              id="custName"
              className={`w-full py-3 px-3 rounded border ${
                errors.custName ? "border-red-500" : "border-gray-300"
              } mx-auto text-sm focus:outline-cyan-400`}
              placeholder="Ex - John Clerk"
            />
            {errors.custName && (
              <p className="text-red-500 text-sm">{errors.custName}</p>
            )}
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div className="mb-4">
              <label
                htmlFor="customerContact"
                className="flex pb-2 text-gray-600"
              >
                Customer Contact
              </label>
              <input
                value={formValues.customerContact}
                onChange={handleInputChange}
                type="text"
                name="customerContact"
                id="customerContact"
                className={`w-full py-3 px-3 rounded border ${
                  errors.customerContact ? "border-red-500" : "border-gray-300"
                } mx-auto text-sm focus:outline-cyan-400`}
                placeholder="Ex - 0771234567"
              />
              {errors.customerContact && (
                <p className="text-red-500 text-sm">{errors.customerContact}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="soldDate" className="flex pb-2 text-gray-600">
                Sale Date
              </label>
              <input
                value={formValues.soldDate}
                onChange={handleInputChange}
                type="date"
                name="soldDate"
                id="soldDate"
                className={`w-full py-2.5 px-3 rounded border ${
                  errors.soldDate ? "border-red-500" : "border-gray-300"
                } mx-auto text-sm focus:outline-cyan-400`}
              />
              {errors.soldDate && (
                <p className="text-red-500 text-sm">{errors.soldDate}</p>
              )}
            </div>
          </div>

          {formValues.products.map((product, index) => (
            <div
              key={index}
              className="grid lg:grid-cols-3 grid-cols-1 gap-2 items-center"
            >
              <div className="mb-4">
                <label
                  htmlFor={`productName-${index}`}
                  className="flex pb-2 text-gray-600"
                >
                  Product Name
                </label>
                <select
                  value={product.productName}
                  onChange={(e) => handleProductChange(index, e)}
                  type="text"
                  name="productName"
                  id={`productName-${index}`}
                  className={`w-full py-2.5 px-3 rounded border ${
                    errors[`productName-${index}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  } mx-auto text-sm focus:outline-cyan-400`}
                  placeholder="Ex - Home Essentials"
                >
                  <option value="" className="text-gray-200 opacity-5">
                    Ex - Home Essentials
                  </option>
                  {productsData.map((product, i) => (
                    <option
                      value={product.productName}
                      key={i}
                      disabled={product.totalQuantity == 0}
                    >
                      {product.productName} - Qt({product.totalQuantity})
                    </option>
                  ))}
                </select>
                {errors[`productName-${index}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`productName-${index}`]}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor={`salesQuantity-${index}`}
                  className="flex pb-2 text-gray-600"
                >
                  Sales Quantity
                </label>
                <input
                  value={product.salesQuantity}
                  onChange={(e) => handleProductChange(index, e)}
                  type="number"
                  name="salesQuantity"
                  id={`salesQuantity-${index}`}
                  className={`w-full py-2 px-3 rounded border ${
                    errors[`salesQuantity-${index}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  } mx-auto text-sm focus:outline-cyan-400`}
                  placeholder="Ex - 23"
                />
                {errors[`salesQuantity-${index}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`salesQuantity-${index}`]}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="w-24 mt-3.5 py-2 rounded bg-red-500 text-white"
                onClick={() => handleDeleteProduct(index)}
              >
                Delete
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddEdit}
            className="w-full py-2.5 my-6 text-base font-poppins outline-dashed outline-1 outline-cyan-400 px-3 rounded border border-gray-300 mx-auto focus:outline-cyan-400"
          >
            Add Rows
          </button>
          <div className="flex gap-3">
            <Link
              to="/sales"
              className="w-full flex justify-center text-white bg-blue-500 py-2.5 mt-6 text-base font-poppins px-3 rounded border border-gray-300 mx-auto focus:outline-cyan-400"
            >
              Close Sale
            </Link>
            <button
              type="submit"
              className="w-full text-white bg-red-500 py-2.5 mt-6 text-base font-poppins px-3 rounded border border-gray-300 mx-auto focus:outline-cyan-400"
            >
              Clear Sale
            </button>
            <button
              type="submit"
              className="w-full text-white bg-green-500 py-2.5 mt-6 text-base font-poppins px-3 rounded border border-gray-300 mx-auto focus:outline-cyan-400"
            >
              {id ? "Update Sale" : "Create New Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalesScreen;
