import axios from "axios";
const API_URL = "https://www.anuation.com/oldcrm/employee/auth/";
let axiosConfig = { 'content-type': 'application/x-www-form-urlencoded' };
const updatecomments =(data)=>{
return axios({
    method : "POST",
    headers : axiosConfig,
    url : API_URL,
    data :data,
}).then((response)=>{ return response;})
}

const commentprocess ={updatecomments};
export default commentprocess;