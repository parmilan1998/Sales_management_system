import axios from "axios";

const productApi = axios.create({
  baseURL: "http://localhost:5000/api/v1/product",
});

export default productApi;
