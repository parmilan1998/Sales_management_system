import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios, { Axios } from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const res = axios
      .get(`http://localhost:5000/api/v1/product/query?keyword=${query}`)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [query]);

  const fetchProducts = async () => {
    const res = await axios
      .get("http://localhost:5000/api/v1/product/list")
      .then((res) => {
        setProducts(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await axios
      .delete(`http://localhost:5000/api/v1/product/${id}`)
      .then((res) => {
        toast.success("Product deleted Successfully!", { duration: 3000 });
        fetchProducts();
      })
      .catch((err) => {
        toast.error("Error deleting product!");
        console.log(err);
      });
  };

  return (
    <div>
      <div className="w-full overflow-x-auto">
        <table
          className="w-full text-left border rounded-lg border-separate border-slate-200"
          cellSpacing="0"
        >
          <tbody>
            <tr>
              <th
                scope="col"
                className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
              >
                No
              </th>
              <th
                scope="col"
                className="h-12 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
              >
                Product Name
              </th>
              <th
                scope="col"
                className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
              >
                Description
              </th>
              <th
                scope="col"
                className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
              >
                Category Name
              </th>
              <th
                scope="col"
                className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
              >
                Unit Price
              </th>
              <th
                scope="col"
                className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="h-16 px-6 text-md font-medium border-l first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
              >
                Actions
              </th>
            </tr>
            {products.map((item, index) => (
              <tr className="odd:bg-slate-50" key={index}>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  {index + 1}
                </td>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  {item.productName}
                </td>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  {item.productDescription}
                </td>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  {item.categoryName}
                </td>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  Rs.{item.unitPrice}
                </td>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  {item.totalQuantity}
                </td>
                <td className="h-16 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 ">
                  <div className="flex flex-row gap-3">
                    <Link to={`/admin/edit/${item.productID}`}>
                      <FaRegEdit size={20} color="green" />
                    </Link>
                    <button onClick={() => handleDelete(item.productID)}>
                      <MdDelete size={20} color="red" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
