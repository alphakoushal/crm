import axios from "axios";
import { API_URL } from "../constant/Constant";
let axiosConfig = { 'content-type': 'application/x-www-form-urlencoded' };
const login = (data) => {
    return axios({
        method: 'POST',
        headers: axiosConfig,
        url: API_URL+'employee/auth/',
        data: data
      }).then((response) => {
        if (response.data.userid) {
          localStorage.setItem("user", JSON.stringify({'userid':response.data.userid,'role':response?.data?.role,'type':response.data.reg_type,'name':response.data.name,'email':response.data.email,'gender':response.data.gender,'org':response.data.org,'permission':response.data.permission??[]}));
        }
       return response;
      });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  login,
  logout,
  getCurrentUser,
}

export default AuthService;