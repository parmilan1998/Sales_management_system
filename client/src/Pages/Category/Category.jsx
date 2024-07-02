import React, { useEffect, useState, useRef, useCallback } from "react";
import { MdAdd } from "react-icons/md";
import CategoryList from "../../Components/Category/CategoryList";
import { useForm } from "react-hook-form";
import categoryApi from "../../api/category";
import CategoryPagination from "../../Components/Category/CategoryPagination";
import CategorySearch from "../../Components/Category/CategorySearch";
import CategorySort from "../../Components/Category/CategorySort";
import toast from "react-hot-toast";

const Category = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [category, setCategory] = useState([]);
  const [formMode, setFormMode] = useState("add");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ASC");
  const [limit, setLimit] = useState(8);

  const popupRef = useRef();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  const baseUrl = "http://localhost:5000/public/category";

  // Reset input fields
  const handleClear = () => {
    reset();
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryApi.get(
        `/query?page=${page}&limit=${limit}&sort=${sort}&keyword=${search}`
      );
      console.log("Response data:", res.data);
      const { categories, pagination } = res.data;
      setTotalPages(pagination.totalPages);
      setCategory(categories);
      console.log("Categories set:", categories);
    } catch (err) {
      console.log(err.message);
    }
  }, [page, limit, sort, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
    setExistingImage(`${baseUrl}/${category.imageUrl}`);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Created category
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("categoryName", data.categoryName);
    if (data.image[0]) {
      formData.append("image", data.image[0]);
    }
    formData.append("categoryDescription", data.description);

    const url = formMode === "add" ? "/" : `/${selectedCategory.categoryID}`;

    const method = formMode === "add" ? "post" : "put";
    try {
      const res = await categoryApi({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      toast.success(
        `Category ${formMode === "add" ? "created" : "updated"} successfully!`
      );
      fetchCategories();
      setIsOpen(true);
      reset();
      selectedCategory(null);
      setFormMode("add");
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleClose = useCallback(() => {
    setIsOpen(true);
    setSelectedCategory(null);
    setFormMode("add");
    setImagePreview(null);
    setExistingImage(null);
    reset();
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
        <div className="flex flex-row gap-2 items-center">
          <h1 className="text-3xl font-semibold font-acme text-cyan-600">
            Category List
          </h1>
          <CategorySort
            sort={sort}
            setSort={setSort}
            fetchCategories={fetchCategories}
          />
        </div>
        <div className="flex gap-4">
          <CategorySearch
            search={search}
            setSearch={setSearch}
            setPage={setPage}
          />
          <button
            onClick={openAddPopup}
            className="flex mr-4 justify-center items-center text-white text-2xl  px-3 py-3  gap-1 font-medium rounded-full bg-cyan-500"
          >
            <MdAdd />
          </button>
        </div>
        {!isOpen && (
          <div className="fixed inset-0 mx-auto flex items-center justify-center max-h-svh z-50 overflow-y-auto">
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
                            required: false,
                          })}
                          type="file"
                          name="image"
                          id="image"
                          className="w-full py-2 px-2 rounded border border-gray-300 mx-auto text-sm focus:outline-cyan-400"
                          onChange={handleImageChange}
                        />

                        {errors.image && (
                          <p className="text-red-500 py-1 text-sm">
                            {errors.image.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className=" flex justify-center items-center  mt-2 mb-2 ">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="border-b-gray-900 shadow-lg object-cover h-36 w-36"
                        />
                      ) : (
                        existingImage &&
                        formMode === "edit" && (
                          <div className="my-2">
                            <p className="text-sm">Current Image:</p>
                            <img
                              src={existingImage}
                              alt="Current"
                              className="border-b-gray-900 shadow-lg object-cover h-36 w-36"
                            />
                          </div>
                        )
                      )}
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
          baseUrl={baseUrl}
        />
        <CategoryPagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default Category;
