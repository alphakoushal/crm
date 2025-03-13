import axios from "axios";
import { API_URL } from "../constant/Constant";
let axiosConfig = { 'content-type': 'application/x-www-form-urlencoded' };
const updatecomments =(data)=>{
return axios({
    method : "POST",
    headers : axiosConfig,
    url : `${API_URL}employee/auth/`,
    data :data,
}).then((response)=>{ return response;})
}

const commentprocess ={updatecomments};
export default commentprocess;