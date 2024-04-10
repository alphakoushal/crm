import axios, { Axios, AxiosHeaders } from "axios";

const API_URL = "https://www.anuation.com/oldcrm/";
let axiosConfig = { 'content-type': 'application/x-www-form-urlencoded' };


const fetchdata = (data,signal) => {
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
    return axios.post(API_URL+'employee/auth/react-index',data,{signal}).then((response) => {
       return response;
      });
};
const fetchdomain = (data) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/react-index',data).then((response)=>{
    return response;
  })
}
const fetchstatusheetdata = (data,signal) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/reactauth/fetchstatusheetdata',data,{signal}).then((response)=>{
    return response;
  })
}
const fetchcomment = (data,signal) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/reactauth/currentcommentdata',data,signal).then((response)=>{
    return response;
  });
}
const fetchitdata =(data,signal) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
return axios.post(API_URL+'employee/auth/reactauth/it-currentdata',data,{signal}).then((response) =>{
  return response
})
}
const freshdata = (data,signal) => {
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
    return axios.post(API_URL+'employee/auth/react-index',data,{signal}).then((response) => {
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
const fetchapp = (data) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/reactauth/checkapp',data).then((response)=>{
    return response;
  })
}
const deletecron = (data) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/react-index',data).then((response)=>{
    return response;
  })
}
const Fetchdata = {
  fetchapp,deletecron,fetchdomain,freshdata,fetchdata,fetchcomment,fetchstatusheetdata,fetchitdata,geteditdata,fetchhistory,Analyticdata,fetchcrondata,fetchtemp,fetchtemplate
}

export default Fetchdata;