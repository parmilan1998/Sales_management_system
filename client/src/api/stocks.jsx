import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const stocksApi = axios.create({
  baseURL: `${apiUrl}/api/v1/stocks`,
});

export default stocksApi;
