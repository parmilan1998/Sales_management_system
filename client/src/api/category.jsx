import axios from "axios";

const category = axios.create({
  baseURL: "http://localhost:5000/api/v1/category",
});

export default category;
