import axios from "axios";
import { API_URL,API_URL_NEW } from "../constant/Constant";
axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
const axiosInstance = axios.create({
  baseURL: API_URL_NEW,
});
axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
   
  return config;
});

export default axiosInstance;