import React,{Suspense,useEffect,useState,useContext} from "react";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Fetchdata from "../services/fetchdata";
import moment from 'moment'
import Headerblank from "../component/Header-blank";
import Uploaddata from "../services/uploaddata";
import { Link } from "react-router-dom";
const ITTemplateList = ({service}) =>{
  const [templatelist,settemplate]=useState([]);
  const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:''});

  let clienttype={'1':'Agent','2':'Individual','3':'Both'};
  let templatetype= {'1':'Individual','2':'Dupe'};
  const sendtome = async(e,id) =>{
    e.preventDefault();
    let email  = document.querySelector('#sendtome').value;
    let res =await Uploaddata.sendtomeitemail({'email':email,'id':id,matter:(service=='ps' ? '3' : '2')}).then((resposne)=>{return resposne});
    if (res.data.success) { setvalidate((prev)=>({ ...prev, status: true, message: res.data.message,color:'success',icon:'success' })) }
else {setvalidate((validate)=>({...validate,status:true,message:res.data.errors.error,color:'error',icon:'error'}));}
setTimeout(()=>{},1000);
  }
  const fetchlist = async (type) =>{
let data=await Fetchdata.fetchITtemplate({'type':type,matter:(service=='ps' ? '4' : '2')}).then((response)=>{ return response});
settemplate(data.data.data);

  }
  useEffect(()=>{
    document.querySelector('table').classList.add("table","table-bordered","table-hover");

    fetchlist('');
  },[])
    return (
        <>
            <Snackbar open={validate.status} autoHideDuration={6000}>

<MuiAlert elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
</Snackbar>
        <Headerblank except={false}></Headerblank>
        <div className={"body-wrapper1 custom-table "}>   
    <div className="container-fluid bootstrap-table">
        <div className="fixed-table-container fixed-height d-flex">
<div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3">Email Template List</h5> 
                    <div className="row custom-table">
                    <TableVirtuoso 
      components={{className:"koushal"}}
      style={{ height: 300 }}
      data={templatelist}
      fixedHeaderContent={() => (
        <tr> 

 <th><div className="headers">Tile</div></th>
 <th><div className="headers">Email Subject</div></th>
 <th><div className="headers">Edit</div></th>
 <th><div className="headers">Test Email <input type='text' id='sendtome'></input></div></th>
        </tr>
      )}
      itemContent={(index, user) => (
        
        <>
                           <td>
                              <p className="mb-0 fs-1">{user['title']}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user['subject']}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1"><Link to={"/edit-it-template?id="+user['id']}>Edit</Link></p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1"><a href="#" onClick={(e)=>{sendtome(e,user['id'])}} className="text-bg-light rounded py-1 px-8 d-flex align-items-center text-decoration-none">
                        <i className="ti ti-message-2 fs-6 text-primary"></i>
                      </a></p>
                            </td>
 </>
      )} 
      
    />
                    </div>
                </div>
              </div>
            </div>
          </div>
          </div></div></div>
        </>
    )
}

export default ITTemplateList;