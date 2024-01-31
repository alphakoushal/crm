import React,{Suspense,useEffect,useState,useContext} from "react";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Uploaddata from "../../services/uploaddata";
import Fetchdata from "../../services/fetchdata";
import { costs,standard,defaultvalue } from "../../constant/Constant";
const Emailbox = ({platform,fn,emailsdata,closeemailsendbox,changedata,alldata})=>{
  const [templatelist,settemplate]=useState([]);
  let auth= localStorage.getItem("user"); 
  auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
  let accounts =(defaultvalue.accounts[auth.userid]!==undefined ? defaultvalue.accounts[auth.userid] :Object.values(defaultvalue.accounts).flat());
    const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:'',modalstatus:true});
    const fetchlist = async (type) =>{
      let data=await Fetchdata.fetchtemplate({'type':type}).then((response)=>{ return response});
      settemplate(data.data.data);
        }

    async function emailformat(t,a,emailsdata,title,template,account,type)
    {
      let appno=document.querySelectorAll('.appno'); let apppush=[];
      let formdata={
        'type':'emailformat',
        'data':'',
        't':t,
        'templatename':template,
        'preview':type,
        'account':account,
        'platform':platform.current,
        'title':title,
        'userid':auth.userid,
        'a':a,
        'totalapp':emailsdata.length,
        'apps':JSON.stringify(emailsdata.map((val)=>{return {'weblink':val[0],'title':val[1],'email_id':val[11],'deadline_30_month':val[5],'applicant_name':val[7],'application_no':val[2],'contact_person':val[10],'deadline_30_month':val[5],'deadline_31_month':val[6],'incost':costs.IN.apply({'c':'IN','as':val[8],'ci':val[9],'pages':val[14],'claim':val[15],'priority':val[16],'co':val[3],'isa':val[18],'standard':standard})}}))
      }
     return Uploaddata.emailformat(formdata).then((resposne)=>{return resposne});
     }
     
    function Loading() {
        return <h2>🌀 Loading...</h2>;
      }
      function handleClose()
{
   
}
      async function choosetype(e,type){
        
        let appno = emailsdata.map((item)=> {return item[2]});
        e.preventDefault();
let t=document.querySelector('#templateid');
let a=document.querySelector('#chooseaccount');
let title=document.querySelector('#crontitle').value;
if(t.value=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Please Choose Email format'}));
        }
        else if(a.value=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Please Choose Account'}));

        }
        else if(title=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Please Enter Title'}));

        }
        else{
const res =await emailformat(t.value,a.value,emailsdata,title,t.options[t.selectedIndex].text,a.options[a.selectedIndex].text,type);
if (res.data.success) { setvalidate((prev)=>({ ...prev, status: true,modalstatus:false, message: res.data.message,color:'success',icon:'success' }));
        let newarray=alldata.map((item,index)=>{ return (appno.includes(item[2]) ?  {...item,[57]:'sent'} : item) });
     //   changedata(newarray);
}
else {setvalidate((validate)=>({...validate,status:true,modalstatus:true,message:res.data.errors.error}));}
if(type=='send')
{
setTimeout(()=>{closeemailsendbox(false)},1000);
}
    }
      }
      useEffect(()=>{
        document.querySelector('table').classList.add("table","table-bordered","table-hover");
        fetchlist('1');
      },[])
      
return (
    <>
    <Snackbar open={validate.status} autoHideDuration={6000} onClose={handleClose}>

<MuiAlert elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
</Snackbar>
            <div className="modal fade filing-form show" id="filing-form-modal" tabIndex="-1" role="dialog" aria-labelledby="edit-modal-label" style={{"display":"block","padding-left": "17px"}}>
    <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
            <form className="form-horizontal filing-form_data">
            <div className="modal-header d-flex align-items-center">
                                <h4 className="modal-title" id="myLargeModalLabel">
                                  Total Filtered Record {emailsdata.length}
                                </h4>
                                <button onClick={()=>{fn(false)}} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                <div className="modal-body custom-table">
                    <Suspense fallback={<Loading/>}> 
                                    <TableVirtuoso 
      components={{className:"koushal"}}
      style={{ height: 300 }}
      data={emailsdata}
      fixedHeaderContent={() => (
        <tr> 

 <th><div className="headers">APPLN.NO.</div></th>
 <th><div className="headers">Title</div></th>
 <th><div className="headers">DEADLINE - 30 mth</div></th>
 <th><div className="headers">DEADLINE - 31 mth</div></th>
 <th><div className="headers">Email-id</div></th>
 <th><div className="headers">APPLICANT NAME</div></th>
 <th><div className="headers">Contact Person Name</div></th>
        </tr>
      )}
      itemContent={(index, user) => (
        <>
 <td  className="column-value">{user[2]}</td>
 <td  className="column-value">{user[1]}</td>
 <td  className="column-value">{user[5]}</td>
 <td  className="column-value">{user[6]}</td>
 <td  className="column-value">{user[11]}</td>
 <td  className="column-value">{user[7]}</td>
 <td  className="column-value">{user[10]}</td>
 </>
      )} 
      
    />
    </Suspense>
    <div className="mb-3 text-center d-md-flex align-items-center mt-3  align-content-md-between gap-3">
    <input type="text" class="form-control" id="crontitle" placeholder="Enter Tile"/>
    <select id="templateid" className="form-select">
                              <option value="">Choose Format</option>
                              {templatelist.map((item,index)=>{
                                return(
                                  <option value={item['id']}>{item['title']}</option>
                                )
                              })}
                                {/* <option value="1">First Email</option>
                                <option value="2">Agent First Email</option>
                                <option value="3">Agent First Email Reminder</option>
                                <option value="6">Individual Email Reminder</option>
                                <option value="transfer">Transfer</option>
                                <option value="assigned">Assigned</option> */}
                              </select>
                              <select id="chooseaccount" className="form-select">
                              <option value="">Choose Account</option>
                              {
                                accounts.map((e,i)=>{
                                 return <option value={e.account}>{e.name}</option>;
                                })
                              }

                              </select>
                                  <button onClick={(e)=>choosetype(e,'send')} className="btn btn-light-info text-info font-medium" type="submit">
                                  <i id='send' class="ti ti-refresh hide"></i>Submit
                                  </button>
                                  <button onClick={(e)=>choosetype(e,'preview')} className="btn btn-light-info text-info font-medium" type="submit">
                                  <i id='preview' class="ti ti-refresh hide"></i> Preview
                                  </button>
                                </div>
</div>
</form>
        </div>
    </div>
</div>
    </>
)
}
export default Emailbox