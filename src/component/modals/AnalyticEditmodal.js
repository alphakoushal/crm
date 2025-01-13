import React, { useState, useEffect } from "react";
import Uploaddata from "../../services/uploaddata";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import moment from 'moment'
import { useFetcher } from "react-router-dom";
const AnalyticEditmodal = function ({ show, fn ,changedata,alldata}) {
    let other=JSON.parse(show.data.details);
    other={...other,color:other?.color ?? "#ffffff"};
    console.log(other);
    const [data, updatedata] = useState({ 'lastname':other?.lastname,'phone':other?.phone,'field':other?.field,'cio':other?.cio,'website':other?.website,'firmname':other?.firmname,'technology':other?.technology,'companytype':other?.companytype,'designation':other?.designation,'linkedin':other?.linkedin,'altphn':other?.altphn,'additionalemail':other?.additionalemail,'country':other?.country,'city':other?.city,'email': other?.emailid,'firstname': other?.firstname, 'status': false, 'message': ''});
  const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:''});
    useEffect(() => {
        updatedata({  'lastname':other?.lastname,'phone':other?.phone,'field':other?.field,'cio':other?.cio,'website':other?.website,'firmname':other?.firmname,'technology':other?.technology,'companytype':other?.companytype,'designation':other?.designation,'linkedin':other?.linkedin,'altphn':other?.altphn,'additionalemail':other?.additionalemail,'country':other?.country,'city':other?.city,'email': other?.emailid,'firstname': other?.firstname, 'status': false, 'message': ''});
    }, [show.data]);
    useEffect(()=>{
        return()=>{ 
           setTimeout(() => {
            setvalidate(()=>({...validate,status:false}));
            show.state=false;
           }, 1000);
        }
    },[])
    function updatestate(value, key) {
      //  updatedata({ ...data, [key]: value });
      console.log(value, key);
        updatedata((data)=>({...data,[key]: value}));
    }
    function validatedata(e,app)
    {
        e.preventDefault();
        if(data.email=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Enter email'}));
        }
        else if(data.firstname=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Enter firstname'}));
        }
        else{
            setvalidate((validate)=>({...validate,status:false,message:''}));

            updateinfo(app); 
        }

    }
    async function updateinfo(app) {
        let email = document.querySelector('#emailid').value;
        let status = await Uploaddata.updateanalyticinfo({ ...data, 'posttype':'updateanalyticinfo','type': 'updateanalyticinfo', 'email': email }).then((response) => { return response; })
        if (status.data.success) { setvalidate((prev)=>({ ...prev, status: true, message: status.data.message,color:'success',icon:'success' }));

     }
        else
        {
       setvalidate((prev)=>({ ...prev, status: true, message: status.data.errors.error,color:'error',icon:'error' }))     
        }
    }
    return (
        <>
            <Snackbar open={validate.status} autoHideDuration={1000}>

                <MuiAlert elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
            </Snackbar>
            {show.state ?
                <div className="modal fade filing-form show" id="filing-form-modal" tabIndex="-1" role="dialog" aria-labelledby="edit-modal-label" style={{ "display": "block", "padding-left": "17px" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                        <div className="modal-header d-flex align-items-center">
                                <h4 className="modal-title" id="myLargeModalLabel">
                                  
                                </h4>
                                <button onClick={() => { fn(false) }} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                            <form className="form-horizontal filing-form_data">

                                <div className="modal-body">
                                    
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="">
                                                <div className="">

                                                    <div className="row">
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Firstname:</label>

                                                            <div className="col-sm-12 error_field_group" id="weblink-group">
                                                                <input type="text" className="form-control validate-field" id="firstname" value={data.firstname} onChange={(e) => (updatestate(e.target.value, 'firstname'))} name="Firstname" placeholder="Firstname" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Lastname:</label>

                                                            <div className="col-sm-12 error_field_group" id="weblink-group">
                                                                <input type="text" className="form-control validate-field" id="lastname" value={data.lastname} onChange={(e) => (updatestate(e.target.value, 'lastname'))} name="lastname" placeholder="lastname" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Company:</label>

                                                            <div className="col-sm-12 error_field_group" id="weblink-group">
                                                                <input type="text" className="form-control validate-field" id="firmname" value={data.firmname} onChange={(e) => (updatestate(e.target.value, 'firmname'))} name="firmname" placeholder="firmname" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Designation:</label>

                                                            <div className="col-sm-12 error_field_group" id="weblink-group">
                                                                <input type="text" className="form-control validate-field" id="designation" value={data.designation} onChange={(e) => (updatestate(e.target.value, 'designation'))} name="designation" placeholder="designation" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Field/Expertise:</label>

                                                            <div className="col-sm-12 error_field_group" id="field-group">
                                                                <input type="text" className="form-control validate-field" id="field" value={data.field} onChange={(e) => (updatestate(e.target.value, 'field'))} name="field" placeholder="field" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Technology:</label>

                                                            <div className="col-sm-12 error_field_group" id="field-group">
                                                                <input type="text" className="form-control validate-field" id="technology" value={data.technology} onChange={(e) => (updatestate(e.target.value, 'technology'))} name="technology" placeholder="technology" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">CIO:</label>

                                                            <div className="col-sm-12 error_field_group" id="field-group">
                                                                <select  onChange={(e)=>{updatestate(e.target.value,'cio')}} className="form-control restrictedinput validate-field" data-field="select" data-field-name="CONTACT_INFO_OF" data-error="please select CONTACT INFO OF" id="CONTACT_INFO_OF" name="CONTACT_INFO_OF">
                                                                    <option value="">CONTACT INFO OF</option>
                                                                    <option selected={ data.cio=='Individual' ? true: false }  value="Individual">Individual</option>
                                                                    <option selected={ data.cio=='Agent' ? true: false } value="Agent">Agent</option>
                                                                    <option selected={ data.cio=='Both - Individual & Agent' ? true: false } value="Both - Individual & Agent">Both - Individual & Agent</option>
                                                                    </select>
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Company Type:</label>

                                                            <div className="col-sm-12 error_field_group" id="field-group">
                                                            <select  onChange={(e)=>{updatestate(e.target.value,'companytype')}} className="form-control restrictedinput validate-field" data-field="select"  id="companytype" name="companytype">
                                                                    <option value="">Choose Companytype</option>
                                                                    <option selected={ data.companytype=='Small' ? true: false }  value="Small">Small</option>
                                                                    <option selected={ data.companytype=='Large' ? true: false } value="Large">Large</option>
                                                                    </select>
                                                                </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Phone:</label>

                                                            <div className="col-sm-12 error_field_group" id="field-group">
                                                                <input type="text" className="form-control validate-field" id="phone" value={data.phone} onChange={(e) => (updatestate(e.target.value, 'phone'))} name="phone" placeholder="phone" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Website:</label>

                                                            <div className="col-sm-12 error_field_group" id="field-group">
                                                                <input type="text" className="form-control validate-field" id="website" value={data.website} onChange={(e) => (updatestate(e.target.value, 'website'))} name="website" placeholder="website" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Country:</label>

                                                            <div className="col-sm-12 error_field_group" id="weblink-group">
                                                                <input type="text" className="form-control validate-field" id="country" value={data.country} onChange={(e) => (updatestate(e.target.value, 'country'))} name="Country" placeholder="Country" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">City:</label>

                                                            <div className="col-sm-12 error_field_group" id="weblink-group">
                                                                <input type="text" className="form-control validate-field" id="city" value={data.city} onChange={(e) => (updatestate(e.target.value, 'city'))} name="city" placeholder="City" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Email-id:</label>

                                                            <div className="col-sm-12 error_field_group" id="emailid-group">
                                                                <input type="text" disabled className="form-control validate-field" id="emailid" value={data.email} name="Email id" placeholder="Email id" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="weblink">Additional Email-id:</label>

                                                            <div className="col-sm-12 error_field_group" id="Additional-group">
                                                                <input type="text" className="form-control validate-field" id="additional" value={data.additionalemail} onChange={(e) => (updatestate(e.target.value, 'additionalemail'))} name="Additional Email id" placeholder="Additional Email id" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="altphn">Alt Phone:</label>

                                                            <div className="col-sm-12 error_field_group" id="altphn-group">
                                                                <input type="text" className="form-control validate-field" id="altphn" value={data.altphn} onChange={(e) => (updatestate(e.target.value, 'altphn'))} name="altphn" placeholder="Alternate Phone Number" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="altphn">Linkedin:</label>

                                                            <div className="col-sm-12 error_field_group" id="linkedin-group">
                                                                <input type="text" className="form-control validate-field" id="linkedin" value={data.linkedin} onChange={(e) => (updatestate(e.target.value, 'linkedin'))} name="linkedin" placeholder="Linkedin" />
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="row">
                                                        <div className="mb-3 text-center">
                                  <button onClick={(e) => { validatedata(e,show.data.email_id) }} className="btn btn-light-info text-info font-medium" type="submit">
                                    Update
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
                : <></>}
        </>
    )
}

export default AnalyticEditmodal;