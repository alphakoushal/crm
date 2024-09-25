import React, { useState, useEffect } from "react";
import Uploaddata from "../../services/uploaddata";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import moment from 'moment'
import { useFetcher } from "react-router-dom";
const Editmodal = function ({ show, fn ,changedata,alldata}) {
    let other=JSON.parse(show.data.otherdetail);
    other={...other,color:other?.color ?? "#ffffff"};
    const [data, updatedata] = useState({ 'email': show.data.email_id, 'app': show.data.appno, 'status': false, 'message': '','ref_no': other.ref_no,'isr':other.isr,'color':other.color,'drawing':other.drawing,'priority':other.priority,'claim':other.claim,'pages':other.pages,'a_p_h_n':other.a_p_h_n,'agent_email_id':other.agent_email_id,'agent_name':other.agent_name,'p_h_n':other.p_h_n,'company_name':other.company_name,'c_p_l':other.c_p_l,'c_p_f':other.c_p_f,'deadline_30_month':other.deadline_30_month,'deadline_31_month':other.deadline_30_month,'p_date':other.p_date,'APPLICANT_NAME':other.APPLICANT_NAME,'c_i_o':other.c_i_o,'applicant_status':other.applicant_status});
  const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:''});
    useEffect(() => {
        updatedata({ 'email': show.data.email_id, 'app': show.data.appno, 'status': false, 'message': '','ref_no': other.ref_no,'isr':other.isr,'color':other.color,'drawing':other.drawing,'priority':other.priority,'claim':other.claim,'pages':other.pages,'a_p_h_n':other.a_p_h_n,'agent_email_id':other.agent_email_id,'agent_name':other.agent_name,'p_h_n':other.p_h_n,'company_name':other.company_name,'c_p_l':other.c_p_l,'c_p_f':other.c_p_f,'deadline_30_month':other.deadline_30_month,'deadline_31_month':other.deadline_30_month,'p_date':other.p_date,'APPLICANT_NAME':other.APPLICANT_NAME,'c_i_o':other.c_i_o,'applicant_status':other.applicant_status});
    }, [show.data]);
    useEffect(()=>{
        document.querySelector('#PRIOTITY_DATE').value=data.p_date;
        deadlinedate(data.p_date, 'p_date'); 
        return()=>{ 
           setTimeout(() => {
            setvalidate(()=>({...validate,status:false}));
            show.state=false;
           }, 1000);
        }
    },[])
    function updatestate(value, key) {
      //  updatedata({ ...data, [key]: value });
        updatedata((data)=>({...data,[key]: value}));
    }
    function validatedata(e,app)
    {
        e.preventDefault();
        if(data.email=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Enter email1'}));
        }
        else if(data.app=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Enter application'}));
        }
        else if(data.ref_no=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter ref no'}));}
        else if(data.isr=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Enter isr'}));
        }
        else if(data.drawing=='')
        {setvalidate((prev)=>({...prev,status:true,message:'Enter drawings'}));}
        else if(data.priority=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter priority'}));}
        else if(data.claim=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter claim'}));}
        else if(data.pages=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter pages'}));}
        else if(data.a_p_h_n=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter agent phone number'}));}
        else if(data.agent_email_id=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter agent email'}));}
        else if(data.agent_name=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter agent name'}));}
        else if(data.p_h_n=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter phone number'}));}
        else if(data.company_name=='' && data.c_i_o!='Individual')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter company number'}));}
        else if(data.c_p_f=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter contact person first name'}));}
        else if(data.c_p_l=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter contact person last name'}));}
        else if(data.deadline_30_month=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter 30 deadline'}));}
        else if(data.deadline_31_month=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter 31 deadline'}));}
        else if(data.p_date=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter priority date'}));}
        else if(data.APPLICANT_NAME=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter applicant name'}));}
        else if(data.c_i_o=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter contact info of'}));}
        else if(data.applicant_status=='')
        {setvalidate((validate)=>({...validate,status:true,message:'Enter applicant status'}));}
        else{
            setvalidate((validate)=>({...validate,status:false,message:''}));

            updateinfo(app); 
        }

    }
    async function updateinfo(app) {
        let email = document.querySelector('#Email_ID').value;
        let status = await Uploaddata.updateinfo({ ...data, 'type': 'updateinfo', 'app': app }).then((response) => { return response; })
        if (status.data.success) { setvalidate((prev)=>({ ...prev, status: true, message: status.data.message,color:'success',icon:'success' }));
    let newarray=alldata.map((item,index)=>{ return (app==item[2] ?  {...item,[60]:data.color} : item) });
     changedata(newarray,'editmodal');
     }
        else
        {
       setvalidate((prev)=>({ ...prev, status: true, message: status.data.errors.error,color:'error',icon:'error' }))     
        }
    }


    function deadlinedate(v)
{
updatestate(v, 'p_date');
document.querySelector('#d30').value=moment(v).add(30, 'M').subtract(1, 'd').format('DD-MM-YYYY');
document.querySelector('#d31').value=moment(v).add(31, 'M').subtract(1, 'd').format('DD-MM-YYYY');
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
                                                            <label className="col-sm-12" htmlFor="weblink">Weblink:</label>

                                                            <div className="col-sm-12 error_field_group" id="weblink-group">
                                                                <input readOnly type="text" className="form-control validate-field" id="weblink" value={show.data.weblink} name="weblink" placeholder="Weblink" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="Aplication_number">Application No:</label>
                                                            <div className="col-sm-12 error_field_group" id="Aplication_number-group">
                                                                <input readOnly type="text" className="date form-control Aplication_number validate-field" value={show.data.appno} id="Aplication_number" name="Aplication_number" placeholder="Aplication number" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="invention_title">Title:</label>

                                                            <div className="col-sm-12 error_field_group" id="invention_title-group">
                                                                <input readOnly type="text" className="form-control validate-field" id="invention_title" value={other.title} name="invention_title" placeholder="Title" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="country_code">Country Code:</label>
                                                            <div className="col-sm-12 error_field_group" id="country_code-group">
                                                                <input readOnly type="text" className="form-control country_code validate-field" value={other.country} id="country_code" name="country_code" placeholder="country code" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="APPLICANT_NAME">Applicant Name:</label>
                                                            <div className="col-sm-12 error_field_group" id="APPLICANT_NAME-group">
                                                                <input type="text" className="form-control restrictedinput validate-field" id="APPLICANT_NAME" autoComplete="off" onChange={(e) => (updatestate(e.target.value, 'APPLICANT_NAME'))} value={data.APPLICANT_NAME} name="APPLICANT_NAME" placeholder="APPLICANT NAME" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="APPLICANT_STATUS">Applicant Status:</label>
                                                            <div className="dropdown col-sm-12 error_field_group" id="APPLICANT_STATUS-group">
                                                                <select onChange={(e)=>{updatestate(e.target.value,'applicant_status')}} className="form-control restrictedinput validate-field" id="APPLICANT_STATUS" name="APPLICANT_STATUS">
                                                                    <option value="">APPLICANT STATUS</option>
                                                                    <option selected={ data.applicant_status=='small' ? true: false } value="small">small</option>
                                                                    <option selected={ data.applicant_status.toLowerCase()=='large' ? true: false } value="large">large</option>                                                    </select>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="PRIOTITY_DATE">Priority Date:</label>
                                                            <div className="col-sm-12 error_field_group" id="PRIOTITY_DATE-group" style={{ "zIndex": "98" }}>
                                                                <input type="date" value={moment(data.p_date).format('YYYY-MM-DD')} onChange={(e)=>{deadlinedate(e.target.value)}} autoComplete="off" className="form-control restrictedinput validate-field"   id="PRIOTITY_DATE" name="PRIOTITY_DATE" placeholder="PRIOTITY DATE" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="deaddate">Deadline (30 month):</label>
                                                            <div className="col-sm-12 error_field_group" id="DEADLINE_30_month-group">
                                                                <input readonly="" type="text" className="form-control validate-field"  autoComplete="off" id="d30" placeholder="DEADLINE - 30 mth" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="deaddate">Deadline (31 month):</label>
                                                            <div className="col-sm-12 error_field_group" id="DEADLINE_31_month-group">
                                                                <input readonly="" type="text" className="form-control validate-field" data-field-name="DEADLINE_31_month" autoComplete="off" id="d31" placeholder="DEADLINE- 31 month" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="cntprsn">Contact Person:</label>
                                                            <div className="col-sm-12 error_field_group" id="CONTACT_PERSON_FIRST-group">
                                                                <input type="text" className="form-control restrictedinput validate-field" onChange={(e) => (updatestate(e.target.value, 'c_p_f'))} value={data.c_p_f} id="CONTACT_PERSON_FIRST" name="CONTACT_PERSON_FIRST" placeholder="FIRST Name" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="cntprsn">Contact Person Last</label>
                                                            <div className="col-sm-12 error_field_group" id="CONTACT_PERSON_Last_NAME-group">
                                                                <input type="text" className="form-control restrictedinput validate-field" onChange={(e) => (updatestate(e.target.value, 'c_p_l'))} value={data.c_p_l} id="CONTACT_PERSON_Last_NAME" name="CONTACT_PERSON_Last_NAME" placeholder="LAST NAME" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="Company_Name">Company:</label>
                                                            <div className="col-sm-12 error_field_group" id="Company_Name-group" style={{ "zIndex": "99" }}>
                                                                <input className=" form-control" id="Company_Name" onChange={(e) => (updatestate(e.target.value, 'company_name'))} value={data.company_name} name="Company_Name" type="text" placeholder="Law Firm name" autoComplete="off" />

                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="Email_ID">E-mail-ID:</label>
                                                            <div className="col-sm-12 error_field_group" id="Email_ID-group">
                                                                <input type="text" className="form-control restrictedinput validate-field" value={data.email} id="Email_ID" onChange={(e) => (updatestate(e.target.value, 'email'))} placeholder="Email ID" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="phnno">Phone No:</label>
                                                            <div className="col-sm-12 error_field_group" id="PHONE_NO-group">
                                                                <input type="text" className="form-control restrictedinput validate-field" onChange={(e) => (updatestate(e.target.value, 'p_h_n'))} value={data.p_h_n} id="PHONE_NO" name="PHONE_NO" placeholder="PHONE NO" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="CONTACT_INFO_OF">Contact Info.:</label>
                                                            <div className="dropdown col-sm-12 error_field_group" id="CONTACT_INFO_OF-group">
                                                                <select  onChange={(e)=>{updatestate(e.target.value,'c_i_o')}} className="form-control restrictedinput validate-field" data-field="select" data-field-name="CONTACT_INFO_OF" data-error="please select CONTACT INFO OF" id="CONTACT_INFO_OF" name="CONTACT_INFO_OF">
                                                                    <option value="">CONTACT INFO OF</option>
                                                                    <option selected={ data.c_i_o=='Individual' ? true: false }  value="Individual">Individual</option>
                                                                    <option selected={ data.c_i_o=='Agent' ? true: false } value="Agent">Agent</option>
                                                                    <option selected={ data.c_i_o=='Both - Individual & Agent' ? true: false } value="Both - Individual & Agent">Both - Individual & Agent</option>
                                                                    </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="agent_Name">Agent Name:</label>
                                                            <div className="col-sm-12 error_field_group" id="agent_Name-group">
                                                                <input className="form-control" onChange={(e) => (updatestate(e.target.value, 'agent_name'))} value={data.agent_name} id="agent_Name" name="agent_Name" type="text" placeholder="Agent Name" autoComplete="off" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="agent_email_ID">Agent E-mail-ID:</label>
                                                            <div className="col-sm-12 error_field_group" id="agent_email_ID-group">
                                                                <input type="text" className="form-control " value={data.agent_email_id} onChange={(e) => (updatestate(e.target.value, 'agent_email_id'))}  id="agent_email_ID" name="agent_email_ID" placeholder="Agent Email ID" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label className="col-sm-12" htmlFor="phnno">Agent Phone No:</label>
                                                            <div className="col-sm-12 error_field_group" id="agent_PHONE_NO-group">
                                                                <input type="text" className="form-control " value={data.a_p_h_n} onChange={(e) => (updatestate(e.target.value, 'a_p_h_n'))}  id="agent_PHONE_NO" name="agent_PHONE_NO" placeholder="Agent Phone No" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-md-2">
                                                            <label className="col-sm-12" htmlFor="PAGES">Pages:</label>
                                                            <div className="col-sm-12 error_field_group" id="PAGES-group">
                                                                <input type="text" className="form-control restrictedinput validate-field" value={data.pages} onChange={(e) => (updatestate(e.target.value, 'pages'))} id="PAGES" name="PAGES" placeholder="PAGES" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-2">
                                                            <label className="col-sm-12" htmlFor="claims">Claims:</label>
                                                            <div className="col-sm-12 error_field_group" id="CLAIMS-group">
                                                                <input type="text" className="form-control restrictedinput validate-field" onChange={(e) => (updatestate(e.target.value, 'claim'))} value={data.claim} id="CLAIMS" name="CLAIMS" placeholder="CLAIMS" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-2">
                                                            <label className="col-sm-12" htmlFor="priority">Priority:</label>
                                                            <div className="col-sm-12 error_field_group" id="PRIORITY-group" style={{ "left": "-8%" }}>
                                                                <input type="text" className="form-control restrictedinput validate-field" value={data.priority} onChange={(e) => (updatestate(e.target.value, 'priority'))} id="PRIORITY" name="PRIORITY" placeholder="PRIORITY" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-2">
                                                            <label className="col-sm-12" htmlFor="drawings">Drawings:</label>
                                                            <div className="col-sm-12 error_field_group" id="DRAWINGS-group">
                                                                <input type="text" className="form-control restrictedinput validate-field" onChange={(e) => (updatestate(e.target.value, 'drawing'))} value={data.drawing} id="DRAWINGS" name="DRAWINGS" placeholder="DRAWINGS" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-1">
                                                            <label className="col-sm-12" htmlFor="isr">ISR:</label>
                                                            <div className="col-sm-12 error_field_group" id="ISR-group">
                                                                <input type="text" className="form-control restrictedinput validate-field" onChange={(e) => (updatestate(e.target.value, 'isr'))} value={data.isr} id="ISR" name="ISR" placeholder="__" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-1">
                                                            <label className="col-sm-12" htmlFor="color">Color:</label>
                                                            <div className="col-sm-12 error_field_group" id="ISR-group">
                                                                <input type="color" className="form-control restrictedinput validate-field" onChange={(e) => (updatestate(e.target.value, 'color'))} value={data.color} id="color" name="color" placeholder="color" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-2 mb-3">
                                                            <label className="col-sm-12" htmlFor="refno">Ref No.:</label>
                                                            <div className="col-sm-12 error_field_group" id="REFERENCE_NUMBER-group" style={{ "left": "-8%" }}>
                                                                <input type="text" className="form-control restrictedinput validate-field" onChange={(e) => (updatestate(e.target.value, 'ref_no'))} value={data.ref_no} id="REFERENCE_NUMBER" name="REFERENCE_NUMBER" placeholder="REFERENCE NUMBER" />
                                                            </div>
                                                        </div>
                                                        <div className="mb-3 text-center">
                                  <button onClick={(e) => { validatedata(e,show.data.appno) }} className="btn btn-light-info text-info font-medium" type="submit">
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

export default Editmodal;