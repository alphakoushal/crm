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
      const Deletecron = async(id) =>{
        let auth ={'posttype':'deletecron','id':id};
let d = await Fetchdata.deletecron(auth).then((response)=>{return response});
      }
 async function getcrondata(){
    let crond = await Fetchdata.fetchcrondata(auth).then((response)=>{return response});
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
 <th><div className="headers">Sent Email</div></th>
 <th><div className="headers">Template Name</div></th>
 <th><div className="headers">Account Name</div></th>
 <th><div className="headers">Schedule On</div></th>
 <th><div className="headers">Status</div></th>
 <th><div className="headers">Action</div></th>
        </tr>
      )}
      itemContent={(index, user) => (
        
        <>
                            <td className="ps-0">
                              <div className="d-flex align-items-center">
                                <div>
                                  <h6 className="fw-semibold mb-1">{user[0]}</h6>
                                  <p className="fs-1 mb-0 text-muted">
                                  {designation[user[1]]}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user[2]}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user[3]}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user[7]}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user[4]}</p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">{user[5]}</p>
                            </td>
                            <td>
                              <p className="fs-1 text-dark mb-0">{moment(user[6]).format('lll')}</p>
                            </td>
                            <td>
                              <span className={`badge fw-semibold py-1 w-85 bg-${(user[3]==user[7] ? 'success' : 'danger')}-subtle text-${(user[3]==user[7] ? 'success' : 'danger')}`}>{(user[3]==user[7] ? 'Completed' : 'Pending')}</span>
                            </td>
                            <td>
                              <span onClick={Deletecron(user[8])} className={`badge fw-semibold py-1 w-85 bg-success-subtle text-success`}>Delete</span>
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