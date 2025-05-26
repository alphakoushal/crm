import axios from "axios";
import { API_URL,axiosConfig } from "../constant/Constant";
import moment from "moment";
const twoDaysAgo = moment().subtract(12, 'days').startOf('day');
const todaytime = moment().format('YYYY/MM/DD')
const timestamp = twoDaysAgo.format('YYYY/MM/DD');
const gmailtoken= JSON.parse(localStorage.getItem("gmailtoken")); 
const urls={'draft':'https://gmail.googleapis.com/gmail/v1/users/me/drafts','inbox':'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=label:INBOX','sent':'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=label:SENT','message':'https://gmail.googleapis.com/gmail/v1/users/me/messages/','failed':`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subject:(Delivery Status Notification OR from:mailer-daemon) after:${timestamp} before:${todaytime}&maxResults=300`};
const fetchlist= (data) =>{
    if(data.type=='failed')
    {
        urls['failed'] = data.query!='' ? urls['failed']=`https://gmail.googleapis.com/gmail/v1/users/koushal.sethi@anuation.com/messages?q=${data.query}` : urls['failed'];
    }
    axiosConfig.Authorization= `Bearer ${gmailtoken.access_token}`;
    try
    {
        return axios({
        headers:axiosConfig,
        data: data,
        url:urls[data.type],
        method:'GET'
          }).then((response)=>{return response;})
        }catch(error){
            console.error("Error fetching Gmail list: ", error);
            return {data:{success:false,data:[]}};
        }
}
const fetchmaildata = (data) =>{
    try
    {
        return axios({
        headers:axiosConfig,
        data: data,
        url:`https://gmail.googleapis.com/gmail/v1/users/me/messages/${data.id}`,
        method:'GET'
          }).then((response)=>{return response;})
        }catch(error){
            console.error("Error fetching Gmail list: ", error);
            return {data:{success:false,data:[]}};
        }
}
const refreshtoken = (data) =>{
    try
    {
        return axios({
            headers:axiosConfig,
            data:data,
        url:`${API_URL}auth/gmail/callback.php`,
        method:'POST'
          }).then((response)=>{return response;})
        }catch(error){
            console.error("Error fetching Gmail list: ", error);
            return {data:{success:false,data:[]}};
        }
}
const gmailfetch = {fetchlist,fetchmaildata,refreshtoken};
export default gmailfetch;