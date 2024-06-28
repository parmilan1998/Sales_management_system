import React, { useEffect, useState, useRef, useCallback } from "react";
import { MdAdd } from "react-icons/md";
import CategoryList from "../../Components/CategoryList";
import { useForm } from "react-hook-form";
import axios from "axios";
// import PropTypes from "prop-types";
import toast from "react-hot-toast";

const Category = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [category, setCategory] = useState([]);
  const [formMode, setFormMode] = useState("add");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const popupRef = useRef();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  // Reset input fields
  const handleClear = () => {
    reset();
  };

  const fetchCategories = async () => {
    const res = await axios
      .get("http://localhost:5000/api/v1/category/list")
      .then((res) => {
        setCategory(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddPopup = () => {
    setSelectedCategory(null);
    setFormMode("add");
    setIsOpen(false);
  };

  const openEditPopup = (category) => {
    setSelectedCategory(category);
    setFormMode("edit");
    setIsOpen(false);

    // Populate the form with the category data
    setValue("categoryName", category.categoryName);
    setValue("description", category.categoryDescription);
  };

  // Created category
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("categoryName", data.categoryName);
    formData.append("image", data.image[0]);
    formData.append("categoryDescription", data.description);

    const url =
      formMode === "add"
        ? "http://localhost:5000/api/v1/category"
        : `http://localhost:5000/api/v1/category/${selectedCategory.categoryID}`;

    const method = formMode === "add" ? "post" : "put";
    await axios({
      method,
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res.data);
        toast.success(
          `Category ${formMode === "add" ? "created" : "updated"} successfully!`
        );
        fetchCategories();
        setIsOpen(true);
        reset();
        setSelectedCategory(null);
        setFormMode("add");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleClose = useCallback(() => {
    setIsOpen(true);
    setSelectedCategory(null);
    setFormMode("add");
    reset(); // Reset the form fields
  }, [reset]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(true);
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef, handleClose]);

  return (
    <div className=" max-w-screen-xl mx-auto lg:px-16 font-poppins cursor-pointer">
      <div className="flex flex-row items-center justify-between py-5 relative">
        <h1 className="text-3xl font-semibold font-acme text-cyan-600">
          Category List
        </h1>
        <div className="flex gap-4">
          <input
            type="text"
            // value={query}
            // onChange={(e) => setQuery(e.target.value)}
            placeholder="Search here.."
            className="px-3 py-2 m-0 rounded-lg focus:outline-cyan-500"
          />
          <button
            onClick={openAddPopup}
            className="flex mr-4 justify-center items-center text-white text-2xl  px-3 py-3  gap-1 font-medium rounded-full bg-cyan-500"
          >
            <MdAdd />
          </button>
        </div>
        {!isOpen && (
          <div className="fixed inset-0 mx-auto flex items-center justify-center z-50">
            <div
              ref={popupRef}
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
                  {formMode === "add" ? "Add New Category" : "Update Category"}
                </p>
              </div>
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-[500px]">
                    <div className="grid lg:grid-cols-2 gap-2">
                      <div className="mb-3 w-full">
                        <label
                          htmlFor="categoryName"
                          className="flex pb-2 text-gray-600"
                        >
                          CategoryName
                        </label>
                        <input
                          {...register("categoryName", {
                            required: "CategoryName is required",
                          })}
                          type="text"
                          name="categoryName"
                          id="categoryName"
                          className="w-full py-2 px-2 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                          placeholder="Ex - Tech Gadgets"
                        />
                        {errors.categoryName && (
                          <p className="text-red-500 py-1 text-sm">
                            {errors.categoryName.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-3 w-full">
                        <label
                          htmlFor="image"
                          className="flex pb-2 text-gray-600"
                        >
                          Category Image
                        </label>
                        <input
                          {...register("image", {
                            required: "Image is required",
                          })}
                          type="file"
                          name="image"
                          id="image"
                          className="w-full py-2 px-2 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                          placeholder="Ex - Rs.59.99"
                        />
                        {errors.image && (
                          <p className="text-red-500 py-1 text-sm">
                            {errors.image.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-2 w-full">
                      <label
                        htmlFor="description"
                        className="flex pb-2 text-gray-600"
                      >
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
                        className="w-full py-2 px-3 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                        placeholder="Ex - Latest technology gadgets and accessories for tech enthusiasts."
                      />
                      {errors.description && (
                        <p className="text-red-500 py-1 text-sm">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 sm:flex sm:gap-4 flex justify-center">
                    <button
                      onClick={handleClose}
                      className="mt-2 cursor-pointer inline-block w-full rounded-lg bg-gray-100 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto"
                      href="#"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleClear}
                      className="mt-2 cursor-pointer inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-semibold text-white sm:mt-0 sm:w-auto"
                      href="#"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="inline-block w-full cursor-pointer rounded-lg bg-green-500 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto"
                      href="#"
                    >
                      {formMode === "add" ? "Add Category" : "Update Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <CategoryList
          category={category}
          fetchCategories={fetchCategories}
          setCategory={setCategory}
          openEditPopup={openEditPopup}
        />
      </div>
    </div>
  );
};

export default Category;
