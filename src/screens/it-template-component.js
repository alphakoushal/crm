import React,{useState} from "react";
import Style from "../reducers/Style";
import Headerblank from "../component/Header-blank";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Uploaddata from "../services/uploaddata";
const ITEmailemplate =() =>{
    const [editorData, setEditorData] = useState('');
    const [validate,setvalidate]=useState({'loader':'hide','loadermessage':'Submit',status:false,color:'error',icon:'error',message:''});
    let auth= localStorage.getItem("user"); 
    auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
    const handleEditorChange = (event, editor) => {
      const data = editor.getData();
  
      setEditorData(data);
    };

    async function submittemplate()
    {
        let mail_subject=document.querySelector('#emailsubject').value;
        let templatetype=document.querySelector('#templatetype').value;
       let title=document.querySelector('#emailtitle').value;
       if(validate.loader=='block')
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
       else if(templatetype=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Choose Type'}));
       }
       else if(editorData=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Enter Mail body.'}));
       }
       else
       {
        setvalidate((data)=>({...data,'loader': 'block','loadermessage':'Submitting'}));
        let formdata={
            'mail_body':editorData,
            'mail_subject':mail_subject,
            'templatetype':templatetype,
            'userid':auth.userid,
            'matter':templatetype,
            'title':title
            
          }
         let res =await Uploaddata.ITmailtemplate(formdata).then((resposne)=>{return resposne});
         if (res.data.success) { setvalidate((prev)=>({ ...prev, status: true, message: res.data.message,color:'success',icon:'success' })) 
         document.querySelector('input').value='';
        }
else {setvalidate((validate)=>({...validate,status:true,message:res.data.errors.error,color:'error',icon:'error'}));}
setTimeout(()=>{},1000);
setvalidate((data)=>({...data,'loader': 'hide','loadermessage':'Submit'}));
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
                  <div className="d-flex border p-2" style={{'flexWrap': 'wrap'}}>
            <small className="border rounded me-1 mb-1 bg-light p-1">@contact_person@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@best@</small>


        </div>
                    <div className="row">
                    <div className="col-md-4">
                        <div className="form-floating mb-3">
                          <input type="text" className="form-control" id="emailtitle" placeholder="Enter Name here"/>
                          <label htmlFor="tb-fname">Title</label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-floating mb-3">
                          <input type="text" className="form-control" id="emailsubject" placeholder="Enter Name here"/>
                          <label htmlFor="tb-fname">Email Subject</label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-floating mb-3">
                        <select className="form-select mr-sm-2" id="templatetype">
                        <option defaultValue="">Choose...</option>
                        <option value="2">IT</option>
                        <option value="3">Audit</option>
                        <option value="4">Patent shelter</option>
                      </select>
                          <label htmlFor="tb-email">Template Type</label>
                          
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
                    data="<p>Hello from CKEditor&nbsp;5!</p>"
                    onReady={ editor => {
                    } }
                    onChange={handleEditorChange}
                    onBlur={ ( event, editor ) => {
                    } }
                    onFocus={ ( event, editor ) => {
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
                                {validate.loadermessage}
                                <i className={`ti ti-refresh rotate ms-2 ${validate.loader}`}></i>
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
export default ITEmailemplate;