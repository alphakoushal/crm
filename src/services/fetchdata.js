import axios from "axios";
import { API_URL,axiosConfig } from "../constant/Constant";

const fetchdata = (data,signal) => {
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
    return axios.post(API_URL+'employee/auth/react-index',data,{signal}).then((response) => {
       return response;
      }).catch((error)=> {return {data:{success:false,data:[]}};});
};
const fetchdomain = (data) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/react-index',data).then((response)=>{
    return response;
  }).catch((error)=> {return {data:{success:false,data:[]}};})
}
const fetchstatusheetdata = (data,signal) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/reactauth/fetchstatusheetdata',data,{signal}).then((response)=>{
    return response;
  }).catch((error)=> {return {data:{success:false,data:[]}};})
}
const fetchcomment = (data,signal) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/reactauth/currentcommentdata',data,signal).then((response)=>{
    return response;
  }).catch((error)=> {return {data:{success:false,data:[]}};});
}
const fetchitdata =(data,signal) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
return axios.post(API_URL+'employee/auth/reactauth/it-currentdata',data,{signal}).then((response) =>{
  return response
}).catch((error)=> {return {data:{success:false,data:[]}};})
}
const freshdata = (data,signal) => {
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
    return axios.post(API_URL+'employee/auth/react-index',data,{signal}).then((response) => {
       return response;
      }).catch((error)=> {return {data:{success:false,data:[]}};});
};
const fetchcrondata = (data) =>{
return axios({
method :"POST",
headers :axiosConfig,
url: API_URL+'employee/auth/reactauth/fetchcrondata',
data :data
}).then((response)=> {return response})
}
const fetchanalyticcrondata = (data) =>{
return axios({
method :"POST",
headers :axiosConfig,
url: API_URL+'employee/auth/react-index',
data :data
}).then((response)=> {return response})
}
const Analyticdata = (data,signal) => {
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
    return axios.post(API_URL+'employee/auth/react-index',data,{signal}).then((response) => {
       return response;
      }).catch((error)=> {return {data:{success:false,data:[]}};});
};

const fetchhistory = (data) =>{
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  return axios({
    method: 'POST',
    data: data,
headers:axiosConfig,
url: API_URL+'employee/auth/react-index',
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
const fetchanalytictemplatedata = (data) =>{
  return axios({
    method :"POST",
headers :axiosConfig,
url: API_URL+'employee/auth/react-index',
data :data
}).then((response)=> {return response})
}
const fetchanalytictemplate = (data) =>{
  return axios({
    method :"POST",
    headers: axiosConfig,
    url: API_URL+'employee/auth/react-index',
    data:data
  }).then((response)=>{return response});
}
const fetchITtemplate = (data) =>{
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
const reschedulecron = (data) =>{
  axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/react-index',data).then((response)=>{
    return response;
  })
}
const pausecron = (data) =>{
  axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded';
  return axios.post(API_URL+'employee/auth/react-index',data).then((response)=>{
    return response;
  })
}
const fetchformula = (data) =>{
  return axios({
headers:axiosConfig,
data: data,
url:API_URL+'employee/auth/react-index',
method:'POST'
  }).then((response)=>{return response;})
}
const fetchcountry = (data) =>{
  return axios({
headers:axiosConfig,
data: data,
url:API_URL+'employee/auth/react-index',
method:'POST'
  }).then((response)=>{return response;})
}
const fetchusernanlytic = (data) =>{
  return axios({
headers:axiosConfig,
data: data,
url:API_URL+'employee/auth/react-index',
method:'POST'
  }).then((response)=>{return response;})
}
const itaxiosrequest = (data) =>{
  return axios({
headers:axiosConfig,
data: data,
url:API_URL+'employee/auth/react-index',
method:'POST'
  }).then((response)=>{return response;})
}
const Fetchdata = {
  fetchapp,itaxiosrequest,fetchusernanlytic,pausecron,deletecron,reschedulecron,fetchanalytictemplatedata,fetchanalytictemplate,fetchformula,fetchcountry,fetchdomain,freshdata,fetchdata,fetchcomment,fetchstatusheetdata,fetchitdata,geteditdata,fetchhistory,Analyticdata,fetchcrondata,fetchanalyticcrondata,fetchtemp,fetchITtemplate,fetchtemplate
}

export default Fetchdata;