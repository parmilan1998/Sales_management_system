import axios from "axios";

const stocksApi = axios.create({
  baseURL: "http://localhost:5000/api/v1/stocks",
});

export default stocksApi;
