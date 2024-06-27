import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import ProductList from "../../Components/ProductList";
import { useForm } from "react-hook-form";
import axios from "axios";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm;

  // Created products
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("categoryName", data.categoryName);
    formData.append("image", data.image[0]);
    formData.append("categoryDescription", data.description);

    const res = await axios
      .post("http://localhost:5000/api/v1/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Category created successfully!");
        fetchCategories();
        setIsOpen(true);
        reset();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const popUp = () => {
    setIsOpen(!isOpen);
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
    fetchCategories;
  }, []);
  return <>Category</>;
};

export default Category;
