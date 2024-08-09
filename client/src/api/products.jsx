import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const productApi = axios.create({
  baseURL: `${apiUrl}/api/v1/product`,
});

export default productApi;
