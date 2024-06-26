import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import ProductList from "../../Components/ProductList";
import { useForm } from "react-hook-form";

const Products = () => {
  const [isOpen, setIsOpen] = useState(true);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };

  const popUp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" max-w-screen-xl mx-auto lg:px-4 font-poppins">
      <div className="flex flex-row items-center justify-between py-5 relative">
        <h1 className="text-3xl font-semibold font-acme text-cyan-600">
          Products List
        </h1>
        <Link to="">
          <button
            onClick={popUp}
            className="flex mr-4 justify-center items-center text-white text-2xl p-1 gap-1 font-medium rounded-full bg-cyan-500"
          >
            <MdAdd />
          </button>
        </Link>

        {!isOpen && (
          <div className="fixed inset-0 mx-auto flex items-center justify-center">
            <div
              className="rounded-2xl absolute z-50 border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8"
              role="alert"
            >
              <div className="flex items-center justify-center gap-4 py-6 font-poppins">
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
                  Add New Product!
                </p>
              </div>

              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label
                      htmlFor="productName"
                      className="flex pb-2 text-gray-600"
                    >
                      ProductName
                    </label>
                    <input
                      {...register("productName", {
                        required: "Email Address is required",
                      })}
                      type="text"
                      name="productName"
                      id="productName"
                      className="w-[500px] py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                      placeholder="Ex - Memory Foam Pillow"
                    />
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                    <div className="mb-4">
                      <label
                        htmlFor="categoryName"
                        className="flex pb-2 text-gray-600"
                      >
                        Category Name
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        id="categoryName"
                        className="w-full py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                        placeholder="Ex - Home Essentials"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="unitPrice"
                        className="flex pb-2 text-gray-600"
                      >
                        Unit Price
                      </label>
                      <input
                        type="text"
                        name="unitPrice"
                        id="unitPrice"
                        className="w-full py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                        placeholder="Ex - Rs.59.99"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="flex pb-2 text-gray-600"
                    >
                      Description
                    </label>
                    <textarea
                      type="text"
                      name="description"
                      id="description"
                      rows={5}
                      className="w-full py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                      placeholder="Ex - Ergonomically designed pillow for superior neck support and comfort."
                    />
                  </div>
                </form>
              </div>

              <div className="mt-6 sm:flex sm:gap-4 flex justify-center">
                <button
                  onClick={popUp}
                  className="mt-2 inline-block w-full rounded-lg bg-gray-100 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto"
                  href="#"
                >
                  Close
                </button>
                <button
                  // onClick={popUp}
                  className="mt-2 inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-semibold text-white sm:mt-0 sm:w-auto"
                  href="#"
                >
                  Clear
                </button>
                <button
                  className="inline-block w-full rounded-lg bg-green-500 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto"
                  href="#"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg">
        <ProductList />
      </div>
    </div>
  );
};

export default Products;
