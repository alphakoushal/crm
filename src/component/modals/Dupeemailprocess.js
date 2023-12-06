import React,{Suspense,useEffect,useState,useContext} from "react";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Uploaddata from "../../services/uploaddata";
const Dupeemailprocess = ({fn,emailsdata,closedupeemailsendbox})=>{
  let auth= localStorage.getItem("user"); 
  const [newdupedata,setdupedata]=useState([]);
 let accounts={'191214150648429653':[{name:'Meenu',account:4},{name:'Kim',account:5},{name:'Ojas',account:6},{name:'Naina',account:7}],'231220121357187063':[{name:'Mohini',account:8},{name:'Eva',account:9},{name:'Nancy',account:10}],'191220121357187063':[{name:'Amy',account:11},{name:'Anu',account:12},{name:'Neha',account:13},{name:'Ria',account:14},{name:'Divi',account:15},{name:'Priya',account:16}]}

 useEffect(()=>{
    getdupedata(emailsdata);
 },[])

 function getdupedata(emailsdata){
    let dupedata=[];
    let res = emailsdata.map((e)=>{
        if(e[12]!=='' && e[12]!='n/a')
        {
          if(e[54]=='Email')
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
              }
              else{}
            }
            else if(emailsdata.filter((e1)=>{return e1[11].trim()===e[11].trim()}).length>1)
            {
                dupedata.push([e[12].trim(),e[11].trim(),e[2].trim(),e[1].trim(),e[7].trim(),e[5].trim(),e[10].trim(),e[11].trim()]);
            }
          }
          else{
          let find=dupedata.findIndex((e1)=>{return e1[0]===e[12]});
          console.log(e[12]);
        if(find>-1)
        {
            dupedata[find][1]=`${e[11]},,${dupedata[find][1]}`//email
            dupedata[find][2]=`${e[2]},,${dupedata[find][2]}`//app
            dupedata[find][3]=`${e[1]},,${dupedata[find][3]}`//title
            dupedata[find][4]=`${e[7]},,${dupedata[find][4]}`//applicant name
            dupedata[find][6]=`${e[10]},,${dupedata[find][6]}`//contact person name
            dupedata[find][5]=`${e[5]},,${dupedata[find][5]}`//Deadline
        }
        else if(emailsdata.filter((e1)=>{return e1[12]===e[12]}).length>1)
        {
            dupedata.push([e[12],e[11],e[2],e[1],e[7],e[5],e[10],e[11]]);
        }
      }
    }
    })
    setdupedata(dupedata);
    console.log(dupedata);
 }
  auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
    const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:'',modalstatus:true});
    async function emailformat(t,a,emailsdata,title,template,account)
    {
      let appno=document.querySelectorAll('.appno'); let apppush=[];
      let formdata={
        'type':'emailformat',
        'data':'',
        't':t,
        'templatename':template,
        'account':account,
        'title':title,
        'userid':auth.userid,
        'dupeprocess':'yes',
        'a':a,
        'totalapp':emailsdata.length,
        'apps':JSON.stringify(emailsdata.map((val)=>{return [val[0],val[1],val[2],val[3],val[4],val[5],val[6]]}))
      }
     return Uploaddata.emailformat(formdata).then((resposne)=>{return resposne});
     }
    function Loading() {
        return <h2>🌀 Loading...</h2>;
      }
      function handleClose()
{
   
}
      async function choosetype(e){
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
const res =await emailformat(t.value,a.value,newdupedata.slice(0,document.querySelector('#totalsending').value),title,t.options[t.selectedIndex].text,a.options[a.selectedIndex].text);
if (res.data.success) { setvalidate((prev)=>({ ...prev, status: true,modalstatus:false, message: res.data.message,color:'success',icon:'success' })) }
else {setvalidate((validate)=>({...validate,status:true,modalstatus:true,message:res.data.errors.error}));}
setTimeout(()=>{closedupeemailsendbox(false)},1000);
    }
      }
      useEffect(()=>{
        document.querySelector('table').classList.add("table","table-bordered","table-hover");
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
                                  Total Filtered Record {newdupedata.slice(0,document.querySelector('#totalsending').value).length}
                                </h4>
                                <button onClick={()=>{fn(false)}} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                <div className="modal-body custom-table">
                    <Suspense fallback={<Loading/>}> 
                                    <TableVirtuoso 
      components={{className:"koushal"}}
      style={{ height: 300 }}
      data={newdupedata.slice(0,document.querySelector('#totalsending').value)}
      fixedHeaderContent={() => (
        <tr> 

 <th className="small"><div className="headers">Email id</div></th>
 <th className="small"><div className="headers">Contact Person</div></th>
 <th className="small"><div className="headers">Applicant</div></th>
 <th className="small"><div className="headers">App</div></th>
 <th className="small"><div className="headers">Title</div></th>
 <th className="small"><div className="headers">Deadline</div></th>
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
 </>
      )} 
      
    />
    </Suspense>
    <div className="mb-3 text-center d-md-flex align-items-center mt-3  align-content-md-between gap-3">
    <input type="text" class="form-control" id="crontitle" placeholder="Enter Tile"/>
    <select id="templateid" className="form-select">
                              <option value="">Choose Format</option>
                                <option value="5">Individual Dupe Email</option>
                              </select>
                              <select id="chooseaccount" className="form-select">
                              <option value="">Choose Account</option>
                              {
                                accounts[auth.userid].map((e,i)=>{
                                 return <option value={e.account}>{e.name}</option>;
                                })
                              }

                              </select>
                                  <button onClick={(e)=>choosetype(e)} className="btn btn-light-info text-info font-medium" type="submit">
                                    Submit
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