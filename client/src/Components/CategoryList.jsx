import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios, { Axios } from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const CategoryList = ({ category, setCategory, fetchCategories }) => {
  const baseUrl = "http://localhost:5000/public/category";

  useEffect(() => {
    setCategory(category);
  }, [category, setCategory]);

  // Delete category
  const handleDelete = async (id) => {
    await axios
      .delete(`http://localhost:5000/api/v1/category/${id}`)
      .then((res) => {
        toast.success("Category deleted Successfully!", { duration: 3000 });
        fetchCategories();
      })
      .catch((err) => {
        toast.error("Error deleting product!");
        console.log(err);
      });
  };

  return (
    <div>
      <div className="w-full overflow-x-auto cursor-pointer">
        <h1 className="text-3xl font-semibold font-acme text-cyan-600">
          Categories List
        </h1>
        {category.map((item, index) => (
          <article
            className="relative overflow-hidden rounded-lg shadow transition hover:shadow-lg"
            key={index}
          >
            <img
              src={`${baseUrl}/${item.imageUrl}`}
              alt={item.categoryName}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="relative bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
              <div className="p-4 sm:p-6">
                <time
                  dateTime="2022-10-10"
                  className="block text-xs text-white/90"
                >
                  {" "}
                  10th Oct 2022{" "}
                </time>

                <a href="#">
                  <h3 className="mt-0.5 text-lg text-white">
                    {item.categoryName}
                  </h3>
                </a>

                <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95">
                  {item.categoryDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-3">
              <Link to={`/edit/${item.categoryID}`}>
                <FaRegEdit size={20} color="green" />
              </Link>
              <button onClick={() => handleDelete(item.categoryID)}>
                <MdDelete size={20} color="red" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

CategoryList.propTypes = {
  category: PropTypes.array.isRequired,
  setCategory: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
};

export default CategoryList;
