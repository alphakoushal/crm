import React,{Suspense,useEffect,useState,useContext} from "react";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Fetchdata from "../services/fetchdata";
import moment from 'moment'
import Headerblank from "../component/Header-blank";
import Uploaddata from "../services/uploaddata";
import { Link } from "react-router-dom";
import Toast from "../component/New-toast";
const QuotationList = () =>{
  const [templatelist,settemplate]=useState([]);
  const auth = JSON.parse(localStorage.getItem("user"));
  const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:''});

  const deleteq = async(id) =>{ 
    let confirm = window.confirm("Are you sure you want to delete this quotation?");
    if (confirm) {
  let res =await Uploaddata.pctaxiosrequest({'id':id,'posttype':'deletequotation'}).then((resposne)=>{return resposne});
    if (res.data.success) { setvalidate((prev)=>({ ...prev, status: true, message: res.data.message,color:'success',icon:'success' })) }
else {setvalidate((validate)=>({...validate,status:true,message:res.data.errors.error,color:'error',icon:'error'}));}
setTimeout(()=>{fetchlist('');},1000);
 }

  }
  const handleClose = () =>{
    setvalidate((prev)=>({...prev,file:'',status:false,message:``,color:'success',icon:'success'}));
  }
  const fetchlist = async (type) =>{
let data=await Fetchdata.pctaxiosrequest({'userid':auth.userid,'posttype':'fetchquotationlist'}).then((response)=>{ return response});
settemplate(data.data.data);
  }
  useEffect(()=>{
    document.querySelector('table').classList.add("table","table-bordered","table-hover");

    fetchlist('');
  },[])
    return (
        <>
<Toast validate={validate} handleClose={handleClose}></Toast>
        <Headerblank except={false}></Headerblank>
        <div className={"body-wrapper1 custom-table "}>   
    <div className="container-fluid bootstrap-table">
        <div className="fixed-table-container fixed-height d-flex">
<div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3">Quotation List</h5> 
                    <div className="row custom-table">
                    <TableVirtuoso 
      components={{className:"koushal"}}
      style={{ height: 300 }}
      data={templatelist}
      fixedHeaderContent={() => (
        <tr> 

 <th><div className="headers">Contact Person</div></th>
 <th><div className="headers">Application number</div></th>
 <th><div className="headers">Countries</div></th>
 <th><div className="headers">Matter</div></th>
 <th><div className="headers">Last sent on</div></th>
 <th><div className="headers">Action</div></th>
        </tr>
      )}
      itemContent={(index, user) => (
        
        <>
                           <td>
                              <p className="mb-0 fs-1">{user['contactperson']}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user['appno']}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user['country']}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user['matter']}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user['lastsenton']}</p>
                            </td>
                            <td>
                                <div className="d-flex justify-content-evenly">
                              <p className="mb-0 fs-1"><Link to={"/calculate?id="+user['id']}><span class="badge bg-danger">Edit</span></Link></p>
                              <span onClick={()=>{deleteq(user['id'])}} class="badge bg-danger cursor-pointer">Delete</span>
                              </div>
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

export default QuotationList;