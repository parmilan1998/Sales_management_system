/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditProductScreen = () => {
  const baseUrl = "http://localhost:5000/public/products";

  const { id } = useParams();
  const [category, setCategory] = useState([]);

  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  // Fetch and display update product Details use setValue
  const fetchUpdateProductDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/product/${id}`);
      const product = res.data;
      setValue("productName", product.productName);
      setValue("categoryName", product.categoryName);
      setValue("unitPrice", product.unitPrice);
      setValue("description", product.productDescription);
      setValue("imageUrl", `${baseUrl}/${product.imageUrl}`);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("image", data.image[0]);
    formData.append("categoryName", data.categoryName);
    formData.append("unitPrice", data.unitPrice);
    formData.append("productDescription", data.description);

    const res = await axios
      .put(`http://localhost:5000/api/v1/product/${id}`, formData)
      .then((res) => {
        console.log(res.data);
        toast.success(`Product updated successfully!`);
        navigate("/products");
        reset();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleClear = () => {
    reset();
  };

  // Fetch categories
  const fetchCategoryApi = async () => {
    const res = await axios
      .get("http://localhost:5000/api/v1/category/list")
      .then((res) => {
        console.log(res.data);
        setCategory(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchCategoryApi();
    fetchUpdateProductDetails();
  }, []);

  return (
    <div className=" max-w-screen-xl mx-auto lg:px-24 font-poppins cursor-pointer">
      <div className=" max-w-screen-xl mx-auto lg:px-24 font-poppins cursor-pointer">
        <div className="bg-white rounded p-10">
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
              Edit Product!
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
              <div className="mb-4">
                <label
                  htmlFor="productName"
                  className="flex pb-2 text-gray-600"
                >
                  ProductName
                </label>
                <input
                  {...register("productName", {
                    required: "ProductName is required",
                  })}
                  type="text"
                  name="productName"
                  id="productName"
                  className="w-full py-3 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                  placeholder="Ex - Memory Foam Pillow"
                />
                {errors.productName && (
                  <p className="text-red-500 py-1 text-sm">
                    {errors.productName.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="flex pb-2 text-gray-600">
                  Product Image
                </label>
                <input
                  {...register("image", {
                    required: "Image is required",
                  })}
                  type="file"
                  name="image"
                  id="image"
                  className="w-full py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                  placeholder="Ex - Rs.59.99"
                />
                {errors.image && (
                  <p className="text-red-500 py-1 text-sm">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="flex pb-2 text-gray-600"
                >
                  Category Name
                </label>
                <select
                  {...register("categoryName", {
                    required: "Category Name is required",
                  })}
                  type="text"
                  name="categoryName"
                  id="categoryName"
                  className="w-full py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                  placeholder="Ex - Home Essentials"
                >
                  <option value="" className="text-gray-200 opacity-5">
                    Ex - Home Essentials
                  </option>
                  {category.map((category, index) => (
                    <option value={category.categoryName} key={index}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {errors.categoryName && (
                  <p className="text-red-500 py-1 text-sm">
                    {errors.categoryName.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="unitPrice" className="flex pb-2 text-gray-600">
                  Unit Price
                </label>
                <input
                  {...register("unitPrice", {
                    required: "Unit price is required",
                  })}
                  type="text"
                  name="unitPrice"
                  id="unitPrice"
                  className="w-full py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                  placeholder="Ex - Rs.59.99"
                />
                {errors.unitPrice && (
                  <p className="text-red-500 py-1 text-sm">
                    {errors.unitPrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="flex pb-2 text-gray-600">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                type="text"
                name="description"
                id="description"
                rows={5}
                className="w-full py-2.5 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                placeholder="Ex - Ergonomically designed pillow for superior neck support and comfort."
              />
              {errors.description && (
                <p className="text-red-500 py-1 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="mt-6 sm:flex sm:gap-4 flex justify-center">
              <Link to="/products">
                <button
                  className="mt-2 cursor-pointer inline-block w-full rounded-lg bg-gray-500 px-12 py-2 text-center text-sm font-semibold text-white sm:mt-0 sm:w-auto"
                  href="#"
                >
                  Cancel
                </button>
              </Link>
              <button
                onClick={handleClear}
                className="mt-2 cursor-pointer inline-block w-full rounded-lg bg-blue-500 px-12 py-2 text-center text-sm font-semibold text-white sm:mt-0 sm:w-auto"
                href="#"
              >
                Clear
              </button>
              <button
                type="submit"
                className="inline-block w-full cursor-pointer rounded-lg bg-green-500 px-12 py-2 text-center text-sm font-semibold text-white sm:w-auto"
                href="#"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductScreen;
