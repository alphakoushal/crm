import axios, { AxiosHeaders } from "axios";

const API_URL = "https://www.anuation.com/oldcrm/";
let axiosConfig = { 'content-type': 'application/x-www-form-urlencoded' };


const fetchdata = (data) => {
    return axios({
        method: 'POST',
        headers: axiosConfig,
        url: API_URL+'employee/auth/reactauth/currentdata',
        data: data
      }).then((response) => {
       return response;
      });
};
const Analyticdata = (data) => {
  return axios({
      method: 'POST',
      headers: axiosConfig,
      url: API_URL+'employee/auth/reactauth/analyticdata',
      data: data
    }).then((response) => {
     return response;
    });
};
const fetchhistory = (data) =>{
  return axios({
    method: 'POST',
    data: data,
headers:axiosConfig,
url: API_URL+'employee/auth/reactauth/fetch-history',
  }).then((response)=>{ return response})
}
const geteditdata = function(formdata)
{
  return axios({
method: "POST",
headers: axiosConfig,
data:formdata,
url: API_URL+'employee/auth/',
  }).then((response)=>{return response;})
}
const Fetchdata = {
  fetchdata,geteditdata,fetchhistory,Analyticdata
}

export default Fetchdata;