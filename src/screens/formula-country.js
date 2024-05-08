import React,{Suspense,useEffect,useState,useContext} from "react";
import { Link } from "react-router-dom";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Fetchdata from "../services/fetchdata";
import Headerblank from "../component/Header-blank";
import { defaultvalue } from "../constant/Constant";
const Countrylist = () =>{
  const [templatelist,settemplate]=useState([]);
  const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:''});

  let clienttype={'1':'Agent','2':'Individual','3':'Both'};
  let templatetype= {'1':'Individual','2':'Dupe'};
  const fetchlist = async (type) =>{
let data=await Fetchdata.fetchtemplate({'type':type}).then((response)=>{ return response});
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
                  <h5 className="mb-3">Country List</h5> 
                    <div className="row custom-table">
                    <TableVirtuoso 
      components={{className:"koushal"}}
      style={{ height: 600 }}
      data={defaultvalue.countries}
      fixedHeaderContent={() => (
        <tr> 
 <th><div className="headers">Country</div></th>
 <th><div className="headers">Action</div></th>
        </tr>
      )}
      itemContent={(index, user) => (
        
        <>
                           <td><p className="mb-0 fs-1">{user['value']}</p></td>
                           <td><p className="mb-0 fs-1"><Link to={"/edit-country-formula?id="+user['key']}>Edit</Link></p></td>
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

export default Countrylist;