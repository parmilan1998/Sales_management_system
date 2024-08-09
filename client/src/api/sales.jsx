import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const salesApi = axios.create({
  baseURL: `${apiUrl}/api/v1/sales`,
});

export default salesApi;
