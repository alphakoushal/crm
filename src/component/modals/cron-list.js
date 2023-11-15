import React,{Suspense,useEffect,useState,useContext} from "react";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Fetchdata from "../../services/fetchdata";
import moment from 'moment'
const Cronlist = ({closecronbox})=>{
    const [crondata,setcrondata] =useState([]);
    let designation = {'6':'Business Development Executive','1':'Associate Business Development Executive','2':'Sr Business Development Executive','3':'Team Lead','4':'Trainee','5':'Manager'};
  let auth= localStorage.getItem("user"); 
 
  auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
    const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:'',modalstatus:true});

    function Loading() {
        return <h2>🌀 Loading...</h2>;
      }
 async function getcrondata(){
    let crond = await Fetchdata.fetchcrondata().then((response)=>{return response});
   // console.log(crondata.data.data.length);
    setcrondata(crond.data.data);
    console.log(crond.data.data[0]);
 }
      useEffect(()=>{
        document.querySelector('table').classList.add("table","table-bordered","table-hover");
        getcrondata();
      },[])
      
return (
    <>
    <Snackbar open={validate.status} autoHideDuration={6000} >

<MuiAlert elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
</Snackbar>
            <div className="modal fade filing-form show" id="filing-form-modal" tabIndex="-1" role="dialog" aria-labelledby="edit-modal-label" style={{"display":"block","padding-left": "17px"}}>
    <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
            <form className="form-horizontal filing-form_data">
            <div className="modal-header d-flex align-items-center">
                                <h4 className="modal-title" id="myLargeModalLabel">
                                  Total Cron List {crondata.length}
                                </h4>
                                <button onClick={()=>{closecronbox(false)}} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                <div className="modal-body custom-table">
                    <Suspense fallback={<Loading/>}> 
                                    <TableVirtuoso 
      components={{className:"koushal"}}
      style={{ height: 300 }}
      data={crondata}
      fixedHeaderContent={() => (
        <tr> 

 <th><div className="headers">User</div></th>
 <th><div className="headers">Cron Title</div></th>
 <th><div className="headers">Total Record</div></th>
 <th><div className="headers">Template Name</div></th>
 <th><div className="headers">Account Name</div></th>
 <th><div className="headers">Schedule On</div></th>
 <th><div className="headers">Status</div></th>
        </tr>
      )}
      itemContent={(index, user) => (
        
        <>
                            <td class="ps-0">
                              <div class="d-flex align-items-center">
                                <div class="me-2 pe-1">
                                  <img src="../crm/assets/images/profile/user-1.jpg" class="rounded-circle" width="40" height="40" alt=""/>
                                </div>
                                <div>
                                  <h6 class="fw-semibold mb-1">{JSON.parse(user.P_INFO).f_name}</h6>
                                  <p class="fs-2 mb-0 text-muted">
                                  {designation[JSON.parse(user.P_INFO).emp_designation]}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p class="mb-0 fs-3">{JSON.parse(user.other_details).title}</p>
                            </td>
                            <td>
                              <p class="mb-0 fs-3">{JSON.parse(user.other_details).totalapp}</p>
                            </td>
                            <td>
                              <p class="mb-0 fs-3">{JSON.parse(user.other_details).template}</p>
                            </td>
                            <td>
                              <p class="mb-0 fs-3">{JSON.parse(user.other_details).account}</p>
                            </td>
                            <td>
                              <p class="fs-3 text-dark mb-0">{moment(JSON.parse(user.other_details).scheduleon).format('lll')}</p>
                            </td>
                            <td>
                              <span class="badge fw-semibold py-1 w-85 bg-primary-subtle text-primary">Low</span>
                            </td>
                            
 </>
      )} 
      
    />
    </Suspense>
</div>
</form>
        </div>
    </div>
</div>
    </>
)
}
export default Cronlist