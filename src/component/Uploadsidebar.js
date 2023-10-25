import React,{useState,useRef} from "react";
import Uploaddata from "../services/uploaddata";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Uploadsidebar =() =>
{
  const [open, setOpen]=useState({'status':false,'message':''});
  const currentfetch=useRef(false);
  const auth =JSON.parse(localStorage.getItem('user'));
  function handleClose()
  {
    setOpen({'status':false,'message':''});
  }
  const createsheet = async () =>{
    if(currentfetch.current)
    {
      setOpen({'status':true,'message':'In process'})
    }
    else
    {
   let css= await Uploaddata.createssheet({type:'create_sheet',sheettype:'3'}).then((response)=>{return response});
   if(css.data.success) {currentfetch.current=false;document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':css.data.message})}
   else {currentfetch.current=false;document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':css.data.errors.error})}
  
    }
  }

  const updatepct = async () =>{
    if(currentfetch.current)
    {
      setOpen({'status':true,'message':'In process'})
    }
    else
    {
    let updatepct= await Uploaddata.updatepct({type:'updatepct'}).then((response)=>{return response});
    if(updatepct.data.success) {currentfetch.current=false;document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':updatepct.data.message})}
   else {currentfetch.current=false;document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':updatepct.data.errors.error})}
    }
  }
const uploadfile = async () =>{
    const formData = new FormData();
    let l =document.querySelector('#formFileSm').files;
    if(currentfetch.current)
    {
      setOpen({'status':true,'message':'In process'})
    }
    else if(l.length>0  && l[0].name.split('.').pop()!='xlsx')
    {
      setOpen({'status':true,'message':'Format Should be xlsx'})
    }
else if(l.length>0 )
{
  currentfetch.current=true;
    document.querySelector('.uploadfile').classList.add('rotate');document.querySelector('.body-wrapper1').classList.add('loader');
    formData.append('fileName', document.querySelector('#formFileSm').files[0].name);
    formData.append('document1', document.querySelector('#formFileSm').files[0]);
    formData.append('type', 'updatesheet');
    formData.append('auth', auth.userid);
    let rs=await Uploaddata.uploaddata(formData).then(response=>{return response})
   if(rs.data.success) {currentfetch.current=false;document.querySelector('.uploadfile').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':rs.data.message})}
   else {currentfetch.current=false;document.querySelector('.uploadfile').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':rs.data.errors.error})}
}
else
{
  setOpen({'status':true,'message':'Choose file'})
}
}
const uploadanalyticdata = async () =>{

  let l =document.querySelector('#uploadanalyticdata').files;
  if(currentfetch.current)
  {
    setOpen({'status':true,'message':'In process'})
  }
  else if(l.length>0  && l[0].name.split('.').pop()!='xlsx')
  {
    setOpen({'status':true,'message':'Format Should be xlsx'})
  }
  else if(l.length>0 )//
  {
    const formdata =new FormData();
    currentfetch.current=true;
    document.querySelector('.uploadanalyticdata').classList.add('rotate');document.querySelector('.body-wrapper1').classList.add('loader');
    formdata.append('filename',document.querySelector('#uploadanalyticdata').files[0].name);
    formdata.append('document1',document.querySelector('#uploadanalyticdata').files[0]);
    formdata.append('type','uploadanalyticdata');
    formdata.append('auth', auth);
 let rs= await Uploaddata.uploadanalyticdata(formdata).then((response)=> {return response}).catch((response)=>{return response});
 if(rs.data.success) {currentfetch.current=false;document.querySelector('.uploadanalyticdata').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':rs.data.message})}
   else {currentfetch.current=false;document.querySelector('.uploadanalyticdata').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':rs.data.errors.error})}

  }
  else
{
  setOpen({'status':true,'message':'Choose file'})
}
}
const assignfile = async () =>{
  let l =document.querySelector('#assignfile').files;
  let u =document.querySelector('#userid').value;
  console.log(u);
  if(currentfetch.current)
  {
    setOpen({'status':true,'message':'In process'})
  }
  else if(u=='' || typeof(u)=='undefined')
  {
    setOpen({'status':true,'message':'Enter Userid'})
  }
  else if(l.length>0  && l[0].name.split('.').pop()!='xlsx')
  {
    setOpen({'status':true,'message':'Format Should be xlsx'})
  }
  else if(l.length>0 )//
  {
    const formdata =new FormData();
    currentfetch.current=true;
    document.querySelector('.assignfile').classList.add('rotate');document.querySelector('.body-wrapper1').classList.add('loader');
    formdata.append('filename',document.querySelector('#assignfile').files[0].name);
    formdata.append('document1',document.querySelector('#assignfile').files[0]);
    formdata.append('type','assignsheet');
    formdata.append('auth', auth);
    formdata.append('s_assign_to',u);
 let rs= await Uploaddata.assignsheet(formdata).then((response)=> {return response});
 if(rs.data.success) {currentfetch.current=false;document.querySelector('.assignfile').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':rs.data.message})}
   else {currentfetch.current=false;document.querySelector('.assignfile').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');setOpen({'status':true,'message':rs.data.errors.error})}

  }
  else
{
  setOpen({'status':true,'message':'Choose file'})
}
}

const closebar = async() =>
{ 
  let exit=document.querySelector('.body-wrapper1').classList.contains('loader');
    if(!exit){document.querySelector('.uploadsidebar').classList.remove('show')}
}
    return(
<>
<Snackbar open={open.status} autoHideDuration={6000} onClose={handleClose}>

        <MuiAlert elevation={6}  variant="filled" >{open.message}</MuiAlert>
      </Snackbar>
<div className="offcanvas offcanvas-end shopping-cart uploadsidebar" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div className="offcanvas-header py-4">
        <h5 className="offcanvas-title fs-5 fw-semibold" id="offcanvasRightLabel">Assignment</h5>
        <a onClick={()=>closebar()} href="#" className="btn btn-outline-primary w-30">Close</a>
      </div>
      <div className="offcanvas-body h-100 px-4 pt-0" data-simplebar>
        {auth.type=='2' ? <>

      <div className="card card-body">
                  <div className="mb-3">
                    <label htmlFor="assignfile" className="form-label">Assign Sheet To Employee</label>
                  </div>
                  <div className="col-12">
                          <div className="d-md-flex align-items-center mt-0 align-content-md-between gap-3">
                            <div className="form-check p-0">
                              <select id="userid" className="form-select">
                              <option value="">Choose User</option>
                                <option value="191214150648429653">Kim (A016)</option>
                                <option value="191220121357187063">Ria (A007)</option>
                                <option value="231220121357187063">Mohini (A109)</option>
                              </select>
                    
                            </div>
                            <input className="form-control form-control-sm" id="assignfile" type="file"/>
                            <div className="ms-auto mt-3 mt-md-0">
                              <button onClick={()=>assignfile()} type="submit" className="btn btn-info font-medium rounded-pill px-4">
                                <div  className="d-flex align-items-center">
                                  Upload <i className="ti ti-refresh assignfile"></i>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                </div>

                <div className="card card-body">
                  <div className="mb-3">
                    <label htmlFor="assignfile" className="form-label">Upload Analytic Sheet</label>
                  </div>
                  <div className="col-12">
                          <div className="d-md-flex align-items-center mt-0 align-content-md-between gap-3">
                            <input className="form-control form-control-sm" id="uploadanalyticdata" type="file"/>
                            <div className="ms-auto mt-3 mt-md-0">
                              <button onClick={()=>uploadanalyticdata()} type="submit" className="btn btn-info font-medium rounded-pill px-4">
                                <div  className="d-flex align-items-center">
                                  Upload <i className="ti ti-refresh uploadanalyticdata"></i>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                </div>

                </>
:<></>}
                <div className="card card-body">
                  <div className="mb-3">
                    <label htmlFor="formFileSm" className="form-label">Update Current Sheet</label>
                  </div>
                  <div className="col-12">
                          <div className="d-md-flex align-items-center mt-0  align-content-md-between gap-3">
                            <div className="form-check p-0">
                              
                    <input className="form-control form-control-sm" id="formFileSm" type="file"/>
                            </div>
                            <div className="ms-auto mt-3 mt-md-0">
                              <button type="submit" className="btn btn-info font-medium rounded-pill px-4">
                                <div onClick={()=>uploadfile()} className="d-flex align-items-center">
                                  Upload <i className="ti ti-refresh uploadfile"></i>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                </div>
                {auth.type=='2' ? <>
                <div className="card card-body">
                  <div className="mb-3 d-flex">
                    <label htmlFor="formFileSm" className="form-label">Create Sheet</label>
                    <button type="submit" className="btn btn-info font-medium rounded-pill px-4 ms-auto">
                                <div onClick={()=>createsheet()} className="d-flex align-items-center">
                                  Create <i className="ti ti-refresh uploadfile"></i>
                                </div>
                              </button>
                  </div>
                  <div className="mb-3 d-flex">
                    <label htmlFor="formFileSm" className="form-label">Update Pct</label>
                    <button type="submit" className="btn btn-info font-medium rounded-pill px-4 ms-auto">
                                <div onClick={()=>updatepct()} className="d-flex align-items-center">
                                  Update PCT <i className="ti ti-refresh uploadfile"></i>
                                </div>
                              </button>
                  </div>
                </div></>
                :<></>}
      </div>
    </div>
</>
    )
}

export default Uploadsidebar;