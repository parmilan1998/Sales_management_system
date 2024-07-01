import axios from "axios";

const products = axios.create({
  baseURL: "http://localhost:5000/api/v1/product",
});

export default products;
