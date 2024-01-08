import axios, { AxiosHeaders } from "axios";

const API_URL = "https://www.anuation.com/oldcrm/";
let axiosConfig = { 'content-type': 'application/x-www-form-urlencoded' };


const fetchdata = (data,signal) => {
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
    return axios.post(API_URL+'employee/auth/reactauth/currentdata',data,{signal}).then((response) => {
       return response;
      });
};
const fetchcrondata = (data) =>{
return axios({
method :"POST",
headers :axiosConfig,
url: API_URL+'employee/auth/reactauth/fetchcrondata',
data :data
}).then((response)=> {return response})
}

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
const fetchtemplate = (data) =>{
  return axios({
    method :"POST",
headers :axiosConfig,
url: API_URL+'employee/auth/reactauth/fetchtemplatedata',
data :data
}).then((response)=> {return response})
}
const fetchtemp = (data) =>{
  return axios({
    method :"POST",
headers :axiosConfig,
url: API_URL+'employee/auth/reactauth/fetchtemps',
data :data
}).then((response)=> {return response})
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
  fetchdata,geteditdata,fetchhistory,Analyticdata,fetchcrondata,fetchtemp,fetchtemplate
}

export default Fetchdata;