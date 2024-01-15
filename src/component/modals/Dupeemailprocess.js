import React,{Suspense,useEffect,useState,useContext} from "react";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Uploaddata from "../../services/uploaddata";
import Fetchdata from "../../services/fetchdata";
import { costs,standard,defaultvalue } from "../../constant/Constant";

const Dupeemailprocess = ({fn,emailsdata,closedupeemailsendbox,changedata,alldata})=>{
  let auth= localStorage.getItem("user"); 
  const [newdupedata,setdupedata]=useState([]);
  const [templatelist,settemplate]=useState([]);

 useEffect(()=>{
    getdupedata(emailsdata);
 },[])
 const fetchlist = async (type) =>{
  let data=await Fetchdata.fetchtemplate({'type':type}).then((response)=>{ return response});
  settemplate(data.data.data);
    }

 function getdupedata(emailsdata){
    let dupedata=[];
    let res = emailsdata.map((e)=>{
      let incost = costs.IN.apply({'c':'IN','as':e[8],'ci':e[9],'pages':e[14],'claim':e[15],'priority':e[16],'co':e[3],'isa':e[18],'standard':standard});

        if(e[12]!=='' && e[12]!='n/a')
        {
          if(e[54]=='Email')//FOR GENERIC DATA
          {
            let find=dupedata.findIndex((e1)=>{return e1[7].trim()===e[11].trim()});
            if(find>-1)
            {
              if(dupedata[find][2].split(',,').length<=1)
              {
                dupedata[find][1]=`${e[11]},,${dupedata[find][1]}`//email
                dupedata[find][2]=`${e[2]},,${dupedata[find][2]}`//app
                dupedata[find][3]=`${e[1]},,${dupedata[find][3]}`//title
                dupedata[find][4]=`${e[7]},,${dupedata[find][4]}`//applicant name
                dupedata[find][6]=`${e[10]},,${dupedata[find][6]}`//contact person name
                dupedata[find][5]=`${e[5]},,${dupedata[find][5]}`//Deadline
                dupedata[find][8]=`${e[6]},,${dupedata[find][8]}`//Deadline 31
                dupedata[find][9]=`${incost},,${dupedata[find][9]}`//in cost

              }
              else{}
            }
            else if(emailsdata.filter((e1)=>{return e1[11].trim()===e[11].trim()}).length>1)
            {
                dupedata.push([e[12].trim(),e[11].trim(),e[2].trim(),e[1].trim(),e[7].trim(),e[5].trim(),e[10].trim(),e[11].trim(),e[6].trim(),incost]);
            }
          }
          else{
          let find=dupedata.findIndex((e1)=>{return e1[0]===e[12]});
        if(find>-1)
        {
            dupedata[find][1]=`${e[11]},,${dupedata[find][1]}`//email
            dupedata[find][2]=`${e[2]},,${dupedata[find][2]}`//app
            dupedata[find][3]=`${e[1]},,${dupedata[find][3]}`//title
            dupedata[find][4]=`${e[7]},,${dupedata[find][4]}`//applicant name
            dupedata[find][6]=`${e[10]},,${dupedata[find][6]}`//contact person name
            dupedata[find][5]=`${e[5]},,${dupedata[find][5]}`//Deadline
            dupedata[find][8]=`${e[6]},,${dupedata[find][8]}`//Deadline
            dupedata[find][9]=`${incost},,${dupedata[find][9]}`//in cost
        }
        else if(emailsdata.filter((e1)=>{return e1[12]===e[12]}).length>1)
        {
            dupedata.push([e[12],e[11],e[2],e[1],e[7],e[5],e[10],e[11],e[6],incost]);
        }
      }
    }
    })
    setdupedata(dupedata.slice(0,document.querySelector('#totalsending').value));
 }
  auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
  let accounts =(defaultvalue.accounts[auth.userid]!==undefined ? defaultvalue.accounts[auth.userid] : Object.values(defaultvalue.accounts).flat());
    const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:'',modalstatus:true});
    async function emailformat(t,a,emailsdata,title,template,account,type)
    {
      let appno=document.querySelectorAll('.appno'); let apppush=[];
      let formdata={
        'type':'emailformat',
        'data':'',
        't':t,
        'preview':type,
        'templatename':template,
        'account':account,
        'title':title,
        'userid':auth.userid,
        'dupeprocess':'yes',
        'a':a,
        'totalapp':emailsdata.length,
        'apps':JSON.stringify(emailsdata.map((val)=>{return {'domain':val[0],'email_id':val[1],'application_no':val[2],'title':val[3],'contact_person':val[6],'deadline_30_month':val[5],'deadline_31_month':val[8],'applicant_name':val[4],'incost':val[9]}}))

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
     let appno =newdupedata.reduce((all,item)=> {return all.concat(item[2].split(',,'));},[]);
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
const res =await emailformat(t.value,a.value,newdupedata,title,t.options[t.selectedIndex].text,a.options[a.selectedIndex].text,type);
if (res.data.success) { setvalidate((prev)=>({ ...prev, status: true,modalstatus:false, message: res.data.message,color:'success',icon:'success' })) 
        let newarray=alldata.map((item,index)=>{ return (appno.includes(item[2]) ?  {...item,[57]:'sent'} : item) });
     //   changedata(newarray);
}
else {setvalidate((validate)=>({...validate,status:true,modalstatus:true,message:res.data.errors.error}));}
if(type=='send')
{
setTimeout(()=>{closedupeemailsendbox(false)},1000);
}
    }
      }
      useEffect(()=>{
        document.querySelector('table').classList.add("table","table-bordered","table-hover");
        fetchlist('2');
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
                                  Total Filtered Record {newdupedata.length}
                                </h4>
                                <button onClick={()=>{fn(false)}} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                <div className="modal-body custom-table">
                    <Suspense fallback={<Loading/>}> 
                                    <TableVirtuoso 
      components={{className:"koushal"}}
      style={{ height: 300 }}
      data={newdupedata}
      fixedHeaderContent={() => (
        <tr> 

 <th className="small"><div className="headers">Email id</div></th>
 <th className="small"><div className="headers">Contact Person</div></th>
 <th className="small"><div className="headers">Applicant</div></th>
 <th className="small"><div className="headers">App</div></th>
 <th className="small"><div className="headers">Title</div></th>
 <th className="small"><div className="headers">Deadline 30</div></th>
 <th className="small"><div className="headers">Deadline 31</div></th>
 <th className="small"><div className="headers">In cost</div></th>
        </tr>
      )}
      itemContent={(index, user) => (
        <>
        <td  className="column-value small text-break">{user[1]}</td>
        <td  className="column-value small text-break">{user[6]}</td>
        <td  className="column-value small text-break">{user[4]}</td>
        <td  className="column-value small text-break">{user[2]}</td>
        <td  className="column-value small text-break">{user[3]}</td>
        <td  className="column-value small text-break">{user[5]}</td>
        <td  className="column-value small text-break">{user[8]}</td>
        <td  className="column-value small text-break">{user[9]}</td>
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
                                <option value="5">Individual Dupe Email</option>
                                <option value="9">Individual Dupe Reminder Email</option>
                                <option value="transfer">Transfer</option>
                                <option value="assigned">Assigned</option>
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
                                    Submit
                                  </button>
                                  <button onClick={(e)=>choosetype(e,'preview')} className="btn btn-light-info text-info font-medium" type="submit">
                                    Preview
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
export default Dupeemailprocess