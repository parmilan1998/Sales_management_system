/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Logo from "../../assets/men.jpg";
import { TiDelete } from "react-icons/ti";
import { MdAddCircle } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import NavbarSales from "../../Components/NavbarSales";
import FooterSales from "../../Components/FooterSales";

const AddInvoice = () => {
  const { id } = useParams();
  const [productsData, setProductsData] = useState([]);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  const [formValues, setFormValues] = useState({
    custName: "",
    customerContact: "",
    soldDate: "",
    products: [
      {
        productName: "",
        salesQuantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/sales`,
        formValues
      );
      console.log(res.data);
      toast.success(`Sales created successfully!`);

      navigate("/invoice");
    } catch (err) {
      console.error("Error creating sales", err);
      toast.error("Error creating sales");
    }
  };

  // Input OnChange value
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
    if (name === "productName") {
      const selectedProduct = productsData.find(
        (product) => product.productName === value
      );
      newProducts[index] = {
        ...newProducts[index],
        productName: value,
        unitPrice: selectedProduct.unitPrice,
        amount: selectedProduct.unitPrice * newProducts[index].salesQuantity,
      };
    } else if (name === "salesQuantity") {
      newProducts[index] = {
        ...newProducts[index],
        salesQuantity: value,
        amount: value * newProducts[index].unitPrice,
      };
    }
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
          unitPrice: 0,
          amount: 0,
        },
      ],
    });
  };

  // Delete the sale
  const handleDeleteProduct = (index) => {
    const newProducts = formValues.products.filter((_, i) => i !== index);
    setFormValues({
      ...formValues,
      products: newProducts,
    });
  };

  // Fetch Products
  const fetchProductsApi = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/product/list");
      console.log(res.data);
      setProductsData(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Fetch SalesById
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

  useEffect(() => {
    const newTotal = formValues.products.reduce(
      (acc, product) => acc + product.amount,
      0
    );
    setTotal(newTotal);
  }, [formValues.products]);

  return (
    <>
      <NavbarSales />
      <div className="min-h-screen bg-gray-200 z-0 lg:h-[100%] py-12 mx-auto lg:px-16 font-poppins cursor-pointer">
        <div className="grid grid-cols-5 gap-2 font-poppins">
          <div className="col-span-3 bg-white p-4">
            <div className="grid grid-cols-3 border border-b-0 border-gray-400 p-4 gap-2">
              <div className="col-span-2">
                <div>
                  <img
                    src={Logo}
                    alt="Logo"
                    className="h-16 w-16 bg-cover object-fill"
                  />
                </div>
                <div className="space-y-2 mt-3">
                  <p className="text-xl font-bold text-gray-400">Viral Mart</p>
                  <p className="text-xs text-gray-400">123 Main St, Jaffna.</p>
                  <p className="text-xs text-gray-400">Phone: (076) 456-7890</p>
                  <p className="text-xs text-gray-400">
                    Email: viralmart@gmail.com
                  </p>
                  <div>
                    <h1 className="text-xs text-gray-400">Sri Lanka.</h1>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <h1 className=" font-acme text-center text-4xl font-bold capitalize text-gray-600">
                  INVOICE
                </h1>
                <div className="space-y-2 ml-3 py-6 flex flex-col">
                  <p className="text-xs text-gray-400">Invoice No: INV{}</p>
                  <p className="text-xs text-gray-400">
                    Invoice Date:
                    <input
                      value={formValues.soldDate}
                      onChange={handleInputChange}
                      type="date"
                      name="soldDate"
                      id="soldDate"
                      placeholder="Customer Name"
                      className="relative w-28 h-8 px-1 text-xs transition-all border-b-none outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 border border-y-0 border-gray-400 p-4 gap-2">
              <div className="col-span-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Bill To: </p>
                  <div className="flex gap-2">
                    <div className="relative my-2">
                      <input
                        value={formValues.custName}
                        onChange={handleInputChange}
                        type="text"
                        name="custName"
                        id="custName"
                        placeholder="Customer Name"
                        className="relative w-48 px-4 h-8 text-xs transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>
                    <div className="relative my-2">
                      <input
                        value={formValues.customerContact}
                        onChange={handleInputChange}
                        type="text"
                        name="customerContact"
                        id="customerContact"
                        placeholder="Contact No"
                        className="relative w-48 h-8 px-4 text-xs transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Sri Lanka.</p>
                </div>
              </div>
              <div className="col-span-1"></div>
            </div>

            <div className="border border-gray-400 px-4 py-0 border-y-0">
              <table
                className="w-full text-left border border-separate border-slate-200"
                cellSpacing="0"
              >
                <tbody>
                  <tr>
                    <th
                      scope="col"
                      className="hidden w-56 h-8 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
                    >
                      Description of Goods
                    </th>
                    <th
                      scope="col"
                      className="hidden h-8 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
                    >
                      Qt
                    </th>
                    <th
                      scope="col"
                      className="hidden h-8 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
                    >
                      Rate
                    </th>
                    <th
                      scope="col"
                      className="hidden h-8 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="hidden h-8 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
                    ></th>
                  </tr>
                  {formValues.products.map((product, index) => (
                    <tr
                      key={index}
                      className="block border-b sm:table-row last:border-b-0 border-slate-200 sm:border-none"
                    >
                      <td
                        data-th="Title"
                        className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 px-6 text-xs transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 "
                      >
                        {/* <div className="relative">
                   <input
                     id="id-b15"
                     type="text"
                     name="id-b15"
                     placeholder="Ex: Samsung Galaxy A22"
                     className="relative  h-8 text-xs transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                   />
                 </div> */}
                        <div className="relative">
                          <select
                            value={product.productName}
                            onChange={(e) => handleProductChange(index, e)}
                            type="text"
                            name="productName"
                            id={`productName-${index}`}
                            required
                            className="relative w-36 h-8 text-xs transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option
                              value=""
                              className="text-gray-200 opacity-5"
                            >
                              Ex - Home Essentials
                            </option>
                            {productsData.map((product, i) => (
                              <option
                                value={product.productName}
                                key={i}
                                disabled={product.totalQuantity == 0}
                              >
                                {product.productName}
                              </option>
                            ))}
                          </select>
                          {/* <label
                     htmlFor="id-01"
                     className="pointer-events-none absolute top-2.5 left-2 z-[1] px-2 text-sm text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                   >
                     Select an option
                   </label> */}
                          {/* <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="pointer-events-none absolute top-2.5 right-2 h-5 w-5 fill-slate-400 transition-all peer-focus:fill-emerald-500 peer-disabled:cursor-not-allowed"
                     viewBox="0 0 20 20"
                     fill="currentColor"
                     aria-labelledby="title-01 description-01"
                     role="graphics-symbol"
                   >
                     <title id="title-01">Arrow Icon</title>
                     <desc id="description-01">
                       Arrow icon of the select list.
                     </desc>
                     <path
                       fillRule="evenodd"
                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                       clip-rule="evenodd"
                     />
                   </svg> */}
                        </div>
                      </td>
                      <td
                        data-th="Company"
                        className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 px-6 text-xs transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 "
                      >
                        <div className="relative">
                          <input
                            value={product.salesQuantity}
                            onChange={(e) => handleProductChange(index, e)}
                            type="number"
                            min={1}
                            defaultValue={1}
                            name="salesQuantity"
                            id={`salesQuantity-${index}`}
                            placeholder="6"
                            className="relative w-10 h-8 text-xs transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          />
                        </div>
                      </td>
                      <td
                        data-th="Role"
                        className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 px-6 text-xs transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 "
                      >
                        <div className="relative flex items-center">
                          <span>Rs.</span>
                          <input
                            value={product.unitPrice}
                            onChange={(e) => handleProductChange(index, e)}
                            name="unitPrice"
                            type="number"
                            placeholder="Rs.6000.00"
                            className="relative w-20 h-8 text-xs transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          />
                        </div>
                      </td>
                      <td
                        data-th="amount"
                        className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 px-6 text-xs transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 "
                      >
                        <div className="flex items-center">
                          <span>Rs.</span>
                          <input
                            value={product.amount}
                            name="amount"
                            type="number"
                            className="w-48 h-8 px-2 mb-2 text-xs transition-all border-b outline-none sm:mb-0 sm:relative sm:w-full sm:border-none sm:py-1 sm:px-2 border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                            readOnly
                          />
                        </div>
                      </td>
                      <td
                        data-th="Username"
                        className=" before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-8 text-xs transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 "
                      >
                        <button onClick={() => handleDeleteProduct(index)}>
                          <TiDelete color="red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>{" "}
            </div>

            <div className="grid grid-cols-4 border border-t-0 border-gray-400 p-4 gap-2">
              <div className="col-span-2">
                <button
                  onClick={handleAddEdit}
                  className="text-sm font-acme flex justify-center items-center gap-1"
                >
                  <MdAddCircle color="green" />
                  Add Item
                </button>
              </div>
              <div className="col-span-2 flex justify-center">
                <div className=" space-y-2">
                  <div className="flex">
                    <span className="text-xs w-20 mt-1">Total:</span>
                    <h1 className="text-sm">Rs.{total.toFixed(2)}</h1>
                  </div>
                  {/* <div className="flex">
                    <span className="text-xs w-20 mt-2">Paid:</span>
                    <h1 className="text-sm">
                      <div className="relative">
                        <input
                          id="id-b15"
                          type="text"
                          name="id-b15"
                          placeholder="Rs.5000.00"
                          className="relative w-32 h-8 pr-12 text-sm transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        />
                      </div>
                    </h1>
                  </div>
                  <div className="flex">
                    <span className="text-xs w-20">Balance:</span>
                    <h1 className="text-sm">Rs.72,000.00</h1>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 border border-t-0 border-gray-400 p-4 gap-2">
              <div className="col-span-2">
                <span className="text-sm">Thank you for your purchase</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="text-sm py-1.5 px-3 bg-sky-500 hover:bg-sky-700 ease-in duration-200 rounded-sm text-white"
                >
                  Finished
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
      <FooterSales />
    </>
  );
};

export default AddInvoice;
