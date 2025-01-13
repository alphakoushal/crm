import React, { useState,useEffect } from "react";
import Uploaddata from "../../../services/uploaddata";
import Fetchdata from "../../../services/fetchdata";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import moment from "moment";
const Addapplication = function({fn,state}){
const [data,updatedata]=useState({status:false,message:''});
const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:'',modalstatus:true});
const auth =JSON.parse(localStorage.getItem('user'));
useEffect(()=>{
    return ()=>{setTimeout(() => {
        fn(false);
    }, 1000);
       
    }
},[validate.modalstatus])
function handleClose()
{
   
}
function updatestate(value,key)
{

} 
async function checkexist(e)
{
    e.preventDefault();
    let app=document.querySelector('#Aplication_number').value;
    if(app=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Enter Application Number'}));
        }
        else
        {
    let formdata ={'app':app};
    let fetched=await Fetchdata.fetchapp(formdata).then((response)=>{ return response});
let d=document.querySelector('.app-check').classList;
    if(fetched.data.success)
{
    setvalidate((validate)=>({...validate,color:'error',icon:'error' ,status:true,message:'Application Number Already in record.'}));
    d.remove('BRX');d.add('ARK');
}
else
{
d.remove('ARK');d.add('BRX');
setvalidate((prev)=>({ ...prev,status:true, message: 'Available to add',color:'success',icon:'success' }))
}
}
}
async function adddata(e)
{
    e.preventDefault();
let web=document.querySelector('#weblink').value;
var formData = {'s_assign_to':auth.userid,'Restrict':'','type': 'add_pct'};
if(web=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Enter Publication'}));
        }
        else{
            let added=await Uploaddata.addpct(formData).then((response)=>{return response});
            if (added.data.success) { setvalidate((prev)=>({ ...prev, status: true,modalstatus:false, message: added.data.message,color:'success',icon:'success' })) }
            else {setvalidate((validate)=>({...validate,status:true,modalstatus:true,message:added.data.errors.error}));}
        }



}
    return(
        <>
<Snackbar open={validate.status} autoHideDuration={6000} onClose={handleClose}>

<MuiAlert elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
</Snackbar>
        <div className="modal fade filing-form show" id="filing-form-modal" tabIndex="-1" role="dialog" aria-labelledby="edit-modal-label" style={{"display":"block","padding-left": "17px"}}>
    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
            <form className="form-horizontal filing-form_data">
            <div className="modal-header d-flex align-items-center">
                                <h4 className="modal-title" id="myLargeModalLabel">
                                  
                                </h4>
                                <button onClick={()=>{fn(false)}} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                <div className="modal-body"> 
                         
        <div className="row">
                            <div className="col-md-12">
                            <div className="">
                            <div className="">
                                
                                    <div className="row">
                                            <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="weblink">Weblink:</label>

                                                <div className="col-sm-12 error_field_group" id="weblink-group">
                                                    <input type="text" className="form-control validate-field" id="weblink" name="weblink" placeholder="Weblink"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="Aplication_number">Application No:</label>
                                                <div className="col-sm-12 error_field_group position-relative" id="Aplication_number-group">
                                                    <input type="text" className="date form-control Aplication_number validate-field" id="Aplication_number" name="Aplication_number" placeholder="Aplication number"/> <i style={{'top':'12px','right':'-20px'}} onClick={(e)=>{checkexist(e)}} class="ti ti-check position-absolute app-check fw-bolder"></i>
                                                </div>
                                            </div>
                                           <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="invention_title">Title:</label>

                                                <div className="col-sm-12 error_field_group" id="invention_title-group">
                                                    <input type="text" className="form-control validate-field" id="invention_title" name="invention_title" placeholder="Title"/>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="row">
                                                                                        <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="country_code">Country Code:</label>
                                                <div className="col-sm-12 error_field_group" id="country_code-group">
                                                    <input type="text" className="form-control country_code validate-field" id="country_code" name="country_code" placeholder="country code"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="APPLICANT_NAME">Applicant Name:</label>
                                                <div className="col-sm-12 error_field_group" id="APPLICANT_NAME-group">
                                                    <input type="text" className="form-control restrictedinput validate-field" id="APPLICANT_NAME" name="APPLICANT_NAME" placeholder="APPLICANT NAME"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="APPLICANT_STATUS">Applicant Status:</label>
                                                <div className="dropdown col-sm-12 error_field_group" id="APPLICANT_STATUS-group">
                                                    <select className="form-control restrictedinput validate-field"  id="APPLICANT_STATUS" name="APPLICANT_STATUS">
                                                        <option value="">APPLICANT STATUS</option><option selected="" value="small">small</option><option value="large">large</option>                                                    </select>
                                                </div>
                                            </div>
                               
                                    </div>
                                    <div className="row">
                                    <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="cntprsn">Contact Person:</label>
                                                <div className="col-sm-12 error_field_group" id="cf-group">
                                                    <input type="text" className="form-control restrictedinput validate-field" id="cf" name="cf" placeholder="FIRST Name"/>
                                                </div>
                                            </div>
                                    <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="cntprsn"></label>
                                                <div className="col-sm-12 error_field_group" id="CONTACT_PERSON_Last_NAME-group">
                                                    <input type="text" className="form-control restrictedinput validate-field" id="cl" name="cl" placeholder="LAST NAME"/>
                                                </div>
                                            </div>
                                                  <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="Company_Name">Company:</label>
                                                <div className="col-sm-12 error_field_group" id="Company_Name-group" style={{"zIndex":"99"}}>
                                                    <input className=" form-control" id="Company_Name" name="Company_Name" type="text" placeholder="Law Firm name" autocomplete="off"/>
                                                  
                                                </div>
                                            </div>
                    
                                    </div>
                                    <div className="row">
                                    <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="Email_ID">E-mail-ID:</label>
                                                <div className="col-sm-12 error_field_group" id="Email_ID-group">
                                                    <input type="text" className="form-control restrictedinput validate-field" id="email" placeholder="Email ID"/>
                                                </div>
                                            </div>
                                    <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="phnno">Phone No:</label>
                                                <div className="col-sm-12 error_field_group" id="PHONE_NO-group">
                                                    <input type="text" className="form-control restrictedinput validate-field" id="PHONE_NO" name="PHONE_NO" placeholder="PHONE NO"/>
                                                </div>
                                            </div>
                                                        <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="CONTACT_INFO_OF">Contact Info.:</label>
                                                <div className="dropdown col-sm-12 error_field_group" id="CONTACT_INFO_OF-group">
                                                    <select className="form-control restrictedinput validate-field" id="CONTACT_INFO_OF" name="CONTACT_INFO_OF">
                                                        <option value="">CONTACT INFO OF</option><option selected="" value="Individual">Individual</option><option value="Agent">Agent</option><option value="Both - Individual & Agent">Both - Individual & Agent</option>                                                    </select>
                                                </div>
                                            </div>    
                                    </div>
                                      <div className="row">
                              <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="agent_Name">Agent Name:</label>
                                                <div className="col-sm-12 error_field_group" id="agent_Name-group">
                                                    <input className="form-control" id="agent_Name" name="agent_Name" type="text" placeholder="Agent Name" autocomplete="off"/>
                                                </div>
                                            </div>
                                    <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="agent_email_ID">Agent E-mail-ID:</label>
                                                <div className="col-sm-12 error_field_group" id="agent_email_ID-group">
                                                    <input type="text" className="form-control "  id="agent_email_ID" name="agent_email_ID" placeholder="Agent Email ID"/>
                                                </div>
                                            </div>
                                    <div className="form-group col-md-4">
                                                <label className="col-sm-12" htmlFor="phnno">Agent Phone No:</label>
                                                <div className="col-sm-12 error_field_group" id="agent_PHONE_NO-group">
                                                    <input type="text" className="form-control" id='agent_PHONE_NO' name="agent_PHONE_NO" placeholder="Agent Phone No"/>
                                                </div>
                                            </div>
                                    </div>    
                                    <div className="row">
                                            <div className="form-group col-md-2">
                                                <label className="col-sm-12" htmlFor="PAGES">Pages:</label>
                                                <div className="col-sm-12 error_field_group" id="PAGES-group">
                                                    <input type="text" className="form-control restrictedinput validate-field"  id="PAGES" name="PAGES" placeholder="PAGES"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label className="col-sm-12" htmlFor="claims">Claims:</label>
                                                <div className="col-sm-12 error_field_group" id="CLAIMS-group">
                                                    <input type="text" className="form-control restrictedinput validate-field" id="CLAIMS" name="CLAIMS" placeholder="CLAIMS"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label className="col-sm-12" htmlFor="priority">Priority:</label>
                                                <div className="col-sm-12 error_field_group" id="PRIORITY-group" style={{"left":"-8%"}}>
                                                    <input type="text" className="form-control restrictedinput validate-field" id="PRIORITY" name="PRIORITY" placeholder="PRIORITY"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label className="col-sm-12" htmlFor="drawings">Drawings:</label>
                                                <div className="col-sm-12 error_field_group" id="DRAWINGS-group">
                                                    <input type="text" className="form-control restrictedinput validate-field" id="DRAWINGS" name="DRAWINGS" placeholder="DRAWINGS"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label className="col-sm-12" htmlFor="isr">ISR:</label>
                                                <div className="col-sm-12 error_field_group" id="ISR-group">
                                                    <input type="text" className="form-control restrictedinput validate-field" id="ISR" name="ISR" placeholder="__"/>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-2 mb-3">
                                                <label className="col-sm-12" htmlFor="refno">Ref No.:</label>
                                                <div className="col-sm-12 error_field_group" id="REFERENCE_NUMBER-group" style={{"left":"-8%"}}>
                                                    <input type="text" className="form-control restrictedinput validate-field" id="REFERENCE_NUMBER" name="REFERENCE_NUMBER" placeholder="REFERENCE NUMBER"/>
                                                </div>
                                            </div>
                                            <div className="mb-3 text-center">
                                  <button onClick={adddata} className="btn btn-light-info text-info font-medium" type="submit">
                                    Submit
                                  </button>
                                </div>
                                    </div>

                                </div></div>
                            </div>                        </div>
                            </div>
</form>
        </div>
    </div>
</div>
       </>
    )
}

export default Addapplication;