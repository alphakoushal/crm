import React,{useState} from "react";
import Style from "../reducers/Style";
import Headerblank from "../component/Header-blank";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Uploaddata from "../services/uploaddata";
import DynamicTable from "../component/Dynamictable";
const Emailemplate =() =>{
    const [editorData, setEditorData] = useState('');
    const [tables, setTables] = useState([]);
    const [validate,setvalidate]=useState({'loader':'hide','loadermessage':'Submit',status:false,color:'error',icon:'error',message:''});
    let auth= localStorage.getItem("user"); 
    auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
    const handleEditorChange = (event, editor) => {
      const data = editor.getData();
  
      setEditorData(data);
    };
    const addTable = () => {
      const newTable = {
        title: `Table ${tables.length + 1}`,
        columns: ['Column 1', 'Column 2', 'Column 3'],
        rows: [[]],
      };
      setTables([...tables, newTable]);
    };
    const updateTable = (index, newRows,type) => {
      const updatedTables = [...tables];
      updatedTables[index][type] = newRows;
      setTables(updatedTables);
    };
    async function submittemplate()
    {
        let mail_subject=document.querySelector('#emailsubject').value;
        let template_type =document.querySelector('#templatetype').value; let client_type =document.querySelector('#clienttype').value;
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
        setvalidate((data)=>({...data,'loader': 'block','loadermessage':'Submitting'}));
        let formdata={
            'mail_body':editorData,
            'mail_subject':mail_subject,
            'template_type':template_type,
            'matter':'1',
            'userid':auth.userid,
            'client_type':client_type,
            'title':title,
            'tables':tables
            
          }
         let res =await Uploaddata.mailtemplate(formdata).then((resposne)=>{return resposne});
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
            <small className="border rounded me-1 mb-1 bg-light p-1">@title@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@application_no@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@email_id@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@applicant_name@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@deadline_30_month@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@deadline_31_month@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@incost@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@best@</small>


        </div>
                    <div className="card w-100">
                      <div className="row">
                    <div className="col-md-3">
                        <div className="form-floating mb-3">
                          <input type="text" className="form-control" id="emailtitle" placeholder="Enter Name here"/>
                          <label htmlFor="tb-fname">Title</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-floating mb-3">
                          <input type="text" className="form-control" id="emailsubject" placeholder="Enter Name here"/>
                          <label htmlFor="tb-fname">Email Subject</label>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-floating mb-3">
                        <select className="form-select mr-sm-2" id="clienttype">
                        <option defaultValue="">Choose...</option>
                        <option value="1">Agent</option>
                        <option value="2">Individual</option>
                        <option value="3">Both</option>
                      </select>
                          <label htmlFor="tb-email">Client Type</label>
                          
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-floating">
                        <select className="form-select mr-sm-2" id="templatetype">
                        <option defaultValue="">Choose...</option>
                        <option value="1">Individual</option>
                        <option value="2">Dupe</option>
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
                      </div>
</div>
              <div className="card w-100">
                    <div className="col-12">
                
                <div className="p-4 mt-n4 text-center">
                  <div className="position-relative mt-n4">
                  <button onClick={addTable} className="rounded-circle border border-3 border-white btn bg-primary-subtle text-primary  btn-sm" title="View Code"><i className="ti ti-circle-plus fs-5 d-flex"></i></button>

                  </div>
                  <div>
                    <h6 className="mb-0 fw-semibold mt-2">Add Tables</h6>
                  </div>
                  {tables.map((tableData, index) => (
        <DynamicTable
          key={index}
          tableData={tableData}
          updateTable={(newRows,type) => updateTable(index, newRows,type)}
        />
      ))}
                  
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
          </div></div></div>
</>
    );
}
export default Emailemplate;