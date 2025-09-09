import axios from "axios";
import { API_URL,axiosConfig } from "../../constant/Constant";
const fetchagent = (data) =>{
  return axios({
headers:axiosConfig,
data: data,
url:API_URL+'employee/auth/react-index',
method:'POST'
  }).then((response)=>{return response;})
}
const Fetchipdata = {
  fetchagent
}

export default Fetchipdata;