import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import CategoryList from "../../Components/CategoryList";
import { useForm } from "react-hook-form";
import axios from "axios";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const Category = () => {
  //   const [isOpen, setIsOpen] = useState(true);
  const [category, setCategory] = useState([]);

  //   const popUp = () => {
  //     setIsOpen(!isOpen);
  //   };

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

  //   const {
  //     register,
  //     formState: { errors },
  //     handleSubmit,
  //     reset,
  //   } = useForm;

  //   // Created category
  //   const onSubmit = async (data) => {
  //     const formData = new FormData();
  //     formData.append("categoryName", data.categoryName);
  //     formData.append("image", data.image[0]);
  //     formData.append("categoryDescription", data.description);

  //     const res = await axios
  //       .post("http://localhost:5000/api/v1/category", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res.data);
  //         toast.success("Category created successfully!");
  //         fetchCategories();
  //         // setIsOpen(true);
  //         reset();
  //       })
  //       .catch((err) => {
  //         console.log(err.message);
  //       });
  //   };
  return (
    <div>
      <CategoryList
        category={category}
        fetchCategories={fetchCategories}
        setCategory={setCategory}
      />
    </div>
  );
};

export default Category;
