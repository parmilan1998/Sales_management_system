import axios from 'axios'

const reportsApi = axios.create({
    baseURL: "http://localhost:5000/api/v1/reports",
  });
 


export default reportsApi