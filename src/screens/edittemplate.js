import React,{useState,useEffect} from "react";
import Style from "../reducers/Style";
import Headerblank from "../component/Header-blank";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Uploaddata from "../services/uploaddata";
import Fetchdata from "../services/fetchdata";
import { useSearchParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
const Editemailemplate =() =>{
    const [editorData, setEditorData] = useState('');
    const [restdata, setrestdata] = useState({'loader':'hide','loadermessage':'Update','title':'','subject':'','clienttype':'','templatetype':''});
    const [searchParams, setSearchParams] = useSearchParams();
    const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:''});
    let auth= localStorage.getItem("user"); 
    auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
    const handleEditorChange = (event, editor) => {
      const data = editor.getData();
      console.log(data);
      setEditorData(data);
    };
    function updatestate(value, key) {
        setrestdata((data)=>({...data,[key]: value}));
      }
    const fetchtemps = async (id) =>{
        let data= await Fetchdata.fetchtemp({'id':id}).then((response)=>{ return response});
        data=data.data.data;
        setEditorData(data.mail_body);
        setrestdata({'loader':'hide','loadermessage':'Update','title':data.title,'subject':data.subject,'templatetype':data.template_type,'clienttype':data.client_type});
          }
useEffect(()=>{
  setrestdata((data)=>({...data,'loader': 'block','loadermessage':'Fetching'}));
  fetchtemps(searchParams.get("id"));
},[])
    async function submittemplate()
    {
        let mail_subject=document.querySelector('#emailsubject').value;
        let template_type =document.querySelector('#templatetype').value; let client_type =document.querySelector('#clienttype').value;
       let title=document.querySelector('#emailtitle').value;
       if(restdata.loader=='block')
       {
        setvalidate((validate)=>({...validate,status:true,message:'In process'}));

       }
       else if(title=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Enter title'}));
       }
       else if(mail_subject=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Enter Email Subject'}));
       }
       else if(template_type=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Choose Template Type'}));
       }
       else if(client_type=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Choose Client Type'}));
       }
       else if(editorData=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Enter Mail body.'}));
       }
       else
       {
        setrestdata((data)=>({...data,'loader': 'block','loadermessage':'Updating'}));
        let formdata={
            'mail_body':editorData,
            'mail_subject':mail_subject,
            'template_type':template_type,
            'userid':auth.userid,
            'client_type':client_type,
            'title':title,
            'uniqueid':searchParams.get("id")
            
          }
         let res =await Uploaddata.mailtemplate(formdata).then((resposne)=>{return resposne});
         if (res.data.success) { setvalidate((prev)=>({ ...prev, status: true, message: res.data.message,color:'success',icon:'success' })) }
else {setvalidate((validate)=>({...validate,status:true,message:res.data.errors.error,color:'error',icon:'error'}));}
setTimeout(()=>{},1000);
setrestdata((data)=>({...data,'loader': 'hide','loadermessage':'Update'}));
        }
    }
    return(
<>
<Snackbar open={validate.status} autoHideDuration={6000} >

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
                  <h5 className="mb-3">Email Template</h5>
                  <div className="d-flex border p-2" style={{'flex-wrap': 'wrap'}}>
            <small className="border rounded me-1 mb-1 bg-light p-1">@contact_person@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@title@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@application_no@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@email_id@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@applicant_name@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@deadline_30_month@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@deadline_31_month@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@incost@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@best@</small>


        </div>
                    <div className="row">
                    <div className="col-md-3">
                        <div className="form-floating mb-3">
                          <input type="text" className="form-control" id="emailtitle" onChange={(e) => (updatestate(e.target.value, 'title'))} value={restdata.title} placeholder="Enter Name here"/>
                          <label htmlFor="tb-fname">Title</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-floating mb-3">
                          <input type="text" className="form-control" id="emailsubject" onChange={(e) => (updatestate(e.target.value, 'subject'))} value={restdata.subject} placeholder="Enter Name here"/>
                          <label htmlFor="tb-fname">Email Subject</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-floating mb-3">
                        <select onChange={(e) => (updatestate(e.target.value, 'clienttype'))} className="form-select mr-sm-2" id="clienttype">
                        <option selected="">Choose...</option>
                        <option selected={restdata.clienttype=='1' ? 'selected' : ''} value="1">Agent</option>
                        <option selected={restdata.clienttype=='2' ? 'selected' : ''} value="2">Individual</option>
                        <option selected={restdata.clienttype=='3' ? 'selected' : ''} value="3">Both</option>
                      </select>
                          <label htmlFor="tb-email">Client Type</label>
                          
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-floating">
                        <select onChange={(e) => (updatestate(e.target.value, 'templatetype'))} className="form-select mr-sm-2" id="templatetype">
                        <option selected="">Choose...</option>
                        <option selected={restdata.templatetype=='1' ? 'selected' : ''} value="1">Individual</option>
                        <option selected={restdata.templatetype=='2' ? 'selected' : ''} value="2">Dupe</option>
                      </select>
                          <label htmlFor="tb-pwd">Template Type</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-md-flex align-items-center mt-3">
                          <div className="form-check">
                          <CKEditor
                    editor={ ClassicEditor }
                    config={ {
                        toolbar: ["undo","redo","|","heading","|","bold","italic","|","link","uploadImage","insertTable","blockQuote","mediaEmbed","|","bulletedList","numberedList","outdent","indent"]
                    } }
                    data={editorData}
                    onReady={ editor => {
                    } }
                    onChange={handleEditorChange}
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
                          </div>
                        
                        </div>
                      </div>
                      <div className="col-12 d-flex">
                      <div className="m-auto mt-3">
                            <button type="submit" className="btn btn-info font-medium rounded-pill px-4">
                              <div onClick={()=>{submittemplate()}} className="d-flex align-items-center">
                                <i className="ti ti-send me-2 fs-4"></i>
                                
                                {restdata.loadermessage} 
                                <i className={`ti ti-refresh rotate ms-2 ${restdata.loader}`}></i>
                              </div>
                            </button>
                          </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          </div></div></div>
</>
    );
}
export default Editemailemplate;