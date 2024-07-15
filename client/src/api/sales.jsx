import axios from "axios";

const salesApi = axios.create({
  baseURL: "http://localhost:5000/api/v1/sales",
});

export default salesApi;