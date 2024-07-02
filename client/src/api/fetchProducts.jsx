import axios from "axios";
import productApi from "./products";
const fetchProducts = async (
  categoryID,
  page,
  limit,
  sort,
  search,
  setProducts,
  setTotalPages
) => {
  let url = `/query?page=${page}&limit=${limit}&sort=${sort}&keyword=${search}`;
  if (categoryID) {
    url += `&categoryID=${categoryID}`;
  }
  try {
    const res = await productApi.get(url);
    const { products, pagination } = res.data;
    setProducts(products);
    setTotalPages(pagination.totalPages);
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
};

export default fetchProducts;
