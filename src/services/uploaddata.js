import { responsiveFontSizes } from "@mui/material";
import axios, { AxiosHeaders } from "axios";
import { method } from "lodash";

const API_URL = "https://www.anuation.com/oldcrm/";
let axiosConfig = { 'content-type': 'application/x-www-form-urlencoded' };


const uploaddata = (data) => {
    return axios({
        method: 'POST',
        headers: axiosConfig,
        url: API_URL+'employee/auth/',
        data: data
      }).then((response) => {
       return response;
      });
};

const addpct = (formdata) =>{

    return axios({
        method :"POST",
        url : API_URL+'employee/auth/',
        data: formdata,
        headers :axiosConfig
    }).then((response)=>{ return response});
}
const createssheet = (data) =>{
    return axios({
data:data,
headers:axiosConfig,
method:"POST",
url:API_URL+'employee/auth/reactauth/create-status-sheet.php',
    }).then((response)=>{ return response});
}
const updatepct = (data) =>{
    return axios({
data:data,
headers:axiosConfig,
method:"POST",
url:API_URL+'employee/auth/reactauth/update-pct.php',
    }).then((response)=>{ return response});
}
const assignsheet =(data)=>{
    return axios({
method:"POST",
headers:axiosConfig,
data : data,
url : API_URL+'employee/auth/',
    }).then((response)=>{return response})
}

const uploadanalyticdata = (data) =>{
    return axios({
method:'POST',
data:data,
headers:axiosConfig,
url: API_URL+'employee/auth/',
    }).then((response)=>{return response})
}
const fetchcomment = (data)=>
{
    return axios({
        method : "POST",
        headers : axiosConfig,
        url : "https://www.anuation.com/oldcrm/employee/auth/reactauth/commentbodydata.php",
        data : data
    }).then(response=>{return response});
}

const emailformat = (data) =>{
    let transferurl='https://www.anuation.com/oldcrm/employee/auth/reactauth/transfer-record.php';
    let assignedurl='https://www.anuation.com/oldcrm/employee/auth/reactauth/allocate-record-from-fresh-data-to-bd-team.php';
    let cronurl='https://www.anuation.com/oldcrm/employee/auth/reactauth/emailformat_testing.php';
    let urls= data.t=='assigned' ? assignedurl : (data.t=='transfer' ? transferurl : cronurl);
    return axios({
        method :'POST',
        headers : axiosConfig,
        url: urls,
        data : data
    }).then(response => { return response});
}
const iiprecordtransfer = (data) =>{
    let assignedurl='https://www.anuation.com/oldcrm/employee/auth/reactauth/iip-allocate-record-from-fresh-data-to-bd-team.php';
    let urls= assignedurl;
    return axios({
        method :'POST',
        headers : axiosConfig,
        url: urls,
        data : data
    }).then(response => { return response});
}
const ITemailformat = (data) =>{
    let itemailurl='https://www.anuation.com/oldcrm/employee/auth/reactauth/IT/itemail.php';
    return axios({
        method :'POST',
        headers : axiosConfig,
        url: itemailurl,
        data : data
    }).then(response => { return response});
}

const mailtemplate =(data) =>{
    return axios({
        method :'POST',
        headers : axiosConfig,
        url: "https://www.anuation.com/oldcrm/employee/auth/reactauth/mailtemplate.php",
        data : data
    }).then(response =>{ return response})
}
const ITmailtemplate =(data) =>{
    return axios({
        method :'POST',
        headers : axiosConfig,
        url: "https://www.anuation.com/oldcrm/employee/auth/reactauth/email-template/itmailtemplate.php",
        data : data
    }).then(response =>{ return response})
}
const sendtome =(data) =>{
    return axios({
        method :'POST',
        headers : axiosConfig,
        url: "https://www.anuation.com/oldcrm/employee/auth/reactauth/sendtome.php",
        data : data
    }).then(response =>{ return response})
}
const sendtomeitemail =(data) =>{
    return axios({
        method :'POST',
        headers : axiosConfig,
        url: "https://www.anuation.com/oldcrm/employee/auth/reactauth/IT/sendtomeitemail.php",
        data : data
    }).then(response =>{ return response})
}
const updateinfo = function(formdata)
{
    return axios({method :"POST",data:formdata,url:API_URL+'/employee/auth/',headers:axiosConfig}).then((response)=>{return response});
}
const uploadformula = (formdata) =>{
    return axios({
        method:'POST',
        headers : axiosConfig,
        data:formdata,
        url: "https://www.anuation.com/oldcrm/employee/auth/react-index",
    }).then(response =>{ return response})
}
 
const transferdatatopct = (formdata) =>{
return axios({
    method:'POST',
    headers:axiosConfig,
    data:formdata,
    url: "https://www.anuation.com/oldcrm/employee/auth/react-index",
}).then(response=>{return response})
}
const transferdatatoiippct = (formdata) =>{
return axios({
    method:'POST',
    headers:axiosConfig,
    data:formdata,
    url: "https://www.anuation.com/oldcrm/employee/auth/react-index",
}).then(response=>{return response})
}
const createpdf = (formdata) =>{
    return axios({
        method:'POST',
        headers : axiosConfig,
        data : formdata,
        url : "https://www.anuation.com/oldcrm/employee/auth/react-index",
    }).then((response)=>{return response;})
}

const Uploaddata = {
  uploaddata,uploadformula,iiprecordtransfer,transferdatatopct,transferdatatoiippct,createpdf,fetchcomment,assignsheet,updateinfo,addpct,createssheet,updatepct,uploadanalyticdata,emailformat,ITemailformat,mailtemplate,ITmailtemplate,sendtome,sendtomeitemail
}

export default Uploaddata;