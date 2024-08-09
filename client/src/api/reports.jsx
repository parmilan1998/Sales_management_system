import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const reportsApi = axios.create({
  baseURL: `${apiUrl}/api/v1/reports`,
});

export default reportsApi;
