import React,{useState,memo } from "react";
import { useDispatch,useSelector } from "react-redux";
import { BrowserRouter, Routes, Route,Link,useNavigate, json } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import commentprocess from "../services/commentservice";
import Uploaddata from "../services/uploaddata";
import Addmodal from "./modals/addmodal";
const Header = React.memo(({clearfilters,refreshdata,formdatas,showcurrencies}) =>{
  console.log('header change');
  const navigate=useNavigate(); 
  let auth= localStorage.getItem("user"); 
  auth =(auth!='' ? JSON.parse(auth) : '')
  const [openemailbox, setOpen] = useState(false);
  const [opencallbox, setOpencall] = useState(false);const [openfollowbox, setOpenfollow] = useState(false);
  const [openaddbox, setaddbox] = useState(false);
const [status,setstatus] =useState();
const [callstatus,setcallstatus] =useState();
const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  lineHeight: 1.5;
  padding: 12px;
  borderRadius: 12px 12px 0 12px;
`,
);
const addentry = ()=>{
  setaddbox(true);
}
const closeaddbox = ()=>{
  setaddbox(false);
}
  const handleClickOpen = function (e) {
    e.preventDefault();
    setOpen(true);
  };
  const callboxevent = function (e) {
    e.preventDefault();
    setOpencall(true);
  };
  const followboxevent = function (e) {
    e.preventDefault();
    setOpenfollow(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClosecall = () => {
    setOpencall(false);
  };
  const handleClosefollow = () => {
    setOpenfollow(false);
  };
    const valued=useSelector((state)=>state.userdata.value);
    const [d,sd]=useState('hi');
    function showsidebar()
    {
        document.querySelector('.uploadsidebar').classList.add('show');
    }
    function signout()
    {
localStorage.setItem('user','')
navigate("/");
window.location.reload();
    }
    async function submitemailform()
    {
      let clientObject={};
      let appno=document.querySelectorAll('.appno');
      appno.forEach((e,index)=>{
        if(e.checked)
        {
clientObject[e.value] = {
  "index": index,
  "firstemail": e.closest('tr').querySelectorAll('td')[20].innerText,
  "followup": e.closest('tr').querySelectorAll('td')[21].innerText,
  "date": document.querySelector('#name').value,
  "status": status,
  "comment": document.querySelector('#textarea').value,
  "domain":e.closest('tr').querySelectorAll('td')[12].innerText,
  "email":e.closest('tr').querySelectorAll('td')[11].innerText,
  "status_type": 'email'
};
        }
      })

      var salesdata = {
        "email_comment_data": JSON.stringify(clientObject),
        "type": 'email_comment_react'
    };
    if(Object.keys(clientObject).length>=1)
    {
   let res= await commentprocess.updatecomments(salesdata).then((response)=>{return response});
   console.log(res);
    }
    else
    {
      console.log('choose row');
    }
    }
    async function submitcallform()
    {
      let clientObject={};
      let appno=document.querySelectorAll('.appno');
      appno.forEach((e,index)=>{
        if(e.checked)
        {
clientObject[e.value] = {
  "index": index,
  "firstemail": e.closest('tr').querySelectorAll('td')[20].innerText,
  "followup": e.closest('tr').querySelectorAll('td')[21].innerText,
  "date": document.querySelector('#calldate').value,
  "status": callstatus,
  "comment": document.querySelector('#calltextarea').value,
  "domain":e.closest('tr').querySelectorAll('td')[12].innerText,
  "email":e.closest('tr').querySelectorAll('td')[11].innerText,
  "status_type": 'call'
};
        }
      })

      var salesdata = {
        "call_comment_data": JSON.stringify(clientObject),
        "type": 'call_comment_react'
    };
    if(Object.keys(clientObject).length>=1)
    {
   let res= await commentprocess.updatecomments(salesdata).then((response)=>{return response});
   console.log(res);
    }
    else
    {
      console.log('choose row');
    }
    }
    async function emailformat()
    {
      let appno=document.querySelectorAll('.appno'); let apppush=[];
      appno.forEach((value,key)=>{
        let obj={'app':value.value,'senton':'','mailformat':''};
        apppush.push(obj);
      })
      let formdata={
        'type':'emailformat',
        'data':'',
        'apps':JSON.stringify(apppush)
      }
      const res = Uploaddata.emailformat(formdata).then((resposne)=>{return resposne});
      console.log(res);
    }
    const showuserprofile = () =>{
      let ps=document.querySelector('.user-profile');
      (ps.classList.contains('show') ? ps.classList.remove('show') : ps.classList.add('show'));
    }
    return(
        <>
        {openaddbox ? <Addmodal fn={closeaddbox}></Addmodal> : <></>}
         <Dialog open={openemailbox} onClose={handleClose}>
        <DialogTitle>Email Comments</DialogTitle>
        <DialogContent>
          <div className="row pt-3">
            <div className="col-md-6">
        <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Email status</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={status}
    label="Email status"
    onChange={(event)=>setstatus(event.target.value)}
  >
    <MenuItem value={1}>Pipeline</MenuItem>
    <MenuItem value={2}>Failed</MenuItem>
    <MenuItem value={3}>Rejection</MenuItem>
    <MenuItem value={4}>Reciprocity</MenuItem>
    <MenuItem value={5}>Ooo</MenuItem>
    <MenuItem value={6}>Converted</MenuItem>
    <MenuItem value={7}>Response</MenuItem>
    <MenuItem value={8}>Dnc</MenuItem>
    <MenuItem value={9}>Dupe</MenuItem>
    <MenuItem value={10}>Exhausted</MenuItem>
  </Select>
</FormControl>
</div>
<div className="col-md-6">
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="date"
            fullWidth
            variant="standard"
          />
          </div>
          <div className="col-md-12 pt-3">
              <StyledTextarea
      aria-label="Description"
      minRows={3}
      id="textarea"
      placeholder="Description"
    />
    </div>
    </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submitemailform}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={opencallbox} onClose={handleClosecall}>
        <DialogTitle>Call Comments</DialogTitle>
        <DialogContent>
          <div className="row pt-3">
            <div className="col-md-6">
        <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Call status</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={callstatus}
    label="Email status"
    onChange={(event)=>setcallstatus(event.target.value)}
  >
    <MenuItem value={1}>Ni</MenuItem>
    <MenuItem value={2}>Lb</MenuItem>
    <MenuItem value={3}>Voice mail</MenuItem>
    <MenuItem value={4}>Invalid no</MenuItem>
    <MenuItem value={5}>Email sent</MenuItem>
    <MenuItem value={6}>Cb</MenuItem>
    <MenuItem value={7}>Ringing</MenuItem>
    <MenuItem value={8}>Dnc</MenuItem>
    <MenuItem value={9}>Dupe</MenuItem>
    <MenuItem value={10}>Exhausted</MenuItem>
  </Select>
</FormControl>
</div>
<div className="col-md-6">
          <TextField
            autoFocus
            margin="dense"
            id="calldate"
            type="date"
            fullWidth
            variant="standard"
          />
          </div>
          <div className="col-md-12 pt-3">
              <StyledTextarea
      aria-label="Description"
      minRows={3}
      id="calltextarea"
      placeholder="Description"
    />
    </div>
    </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosecall}>Cancel</Button>
          <Button onClick={submitcallform}>Submit</Button>
        </DialogActions>
      </Dialog>


        <header className="app-header fixed-header"> 
          <nav className="navbar navbar-expand-lg navbar-light">
            <ul className="navbar-nav">
              <li className="nav-item d-none d-lg-block">
                <a className="nav-link nav-icon-hover" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  <i className="ti ti-search"></i>
                </a>
              </li>
            </ul>
            <ul className="navbar-nav quick-links d-none d-lg-flex">
              <li className="nav-item dropdown hover-dd d-none d-lg-block">
                <a className="nav-link" href="javascript:void(0)" data-bs-toggle="dropdown">Dashboard<span className="mt-1"><i className="ti ti-chevron-down"></i></span></a>
                <div className="dropdown-menu dropdown-menu-nav dropdown-menu-animate-up py-0">
                  <div className="row">
                    <div className="col-12">
                      <div className=" ps-7 pt-7">
                        <div className="border-bottom">
                          <div className="row">
                            <div className="col-6">
                              <div className="position-relative">
                                <Link to="./dashboard" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Patent</h6>
                                    <span className="fs-2 d-block text-dark">New messages arrived</span>
                                  </div>
                                </Link>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="position-relative">
                                <Link to="./analytic" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Analytic</h6>
                                    <span className="fs-2 d-block text-dark">New messages arrived</span>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center py-3">
                          <div className="col-8">
                            <a className="fw-semibold text-dark d-flex align-items-center lh-1 text-decoration-none" href="#"><i className="ti ti-help fs-6 me-2"></i>Frequently Asked Questions</a>
                          </div>
                          <div className="col-4">
                            <div className="d-flex justify-content-end pe-4">
                              <button className="btn btn-primary">Check {d}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="nav-item dropdown-hover d-none d-lg-block">
                <a onClick={(e)=>handleClickOpen(e)} className="nav-link" href="#"><i className="ti ti ti-mail"></i> Email Comment</a>
              </li>
              <li className="nav-item dropdown-hover d-none d-lg-block">
                <a onClick={(e)=>callboxevent(e)} className="nav-link" href="#"><i className="ti ti-phone-call"></i> Call Comment</a>
              </li>
              <li className="nav-item dropdown-hover d-none d-lg-block">
                <a onClick={(e)=>followboxevent(e)} className="nav-link" href="#"><i className="ti ti-brand-hipchat"></i> Followup</a>
              </li>
              <li className="nav-item dropdown-hover d-none d-lg-block">
                <a onClick={(e)=>addentry(e)} className="nav-link" href="#"><i className="ti ti-brand-hipchat"></i> Add Application</a>
              </li>
            </ul> 
            <div className="d-block d-lg-none">
              <img src="../crm/assets/images/logos/dark-logo.svg" className="dark-logo" width="180" alt=""/>
              <img src="../crm/assets/images/logos/light-logo.svg" className="light-logo" width="180" alt="" style={{"display": "none"}}/>
            </div>
            <button className="navbar-toggler p-0 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="p-2">
                <i className="ti ti-dots fs-7"></i>
              </span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <div className="d-flex align-items-center justify-content-between">
                <a href="javascript:void(0)" className="nav-link d-flex d-lg-none align-items-center justify-content-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilenavbar" aria-controls="offcanvasWithBothOptions">
                  <i className="ti ti-align-justified fs-7"></i>
                </a>
                <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
               <li>
               <select onChange={()=>{emailformat()}} id="templateid" className="form-select">
                              <option value="">Choose Format</option>
                                <option value="1">Format One</option>
                                <option value="2">Format 2</option>
                                <option value="3">Format 3</option>
                              </select>
               </li>
                <li onClick={()=>clearfilters()} className="nav-item">
                    <a className="nav-link notify-badge nav-icon-hover" href="javascript:void(0)" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-eraser"></i>               
                    </a>
                  </li>
                <li onClick={()=>showcurrencies()} className="nav-item">
                    <a className="nav-link notify-badge nav-icon-hover" href="javascript:void(0)" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-zoom-money"></i>               
                    </a>
                  </li>
                  <li onClick={()=>showsidebar()} className="nav-item">
                    <a className="nav-link notify-badge nav-icon-hover" href="javascript:void(0)" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-menu-2"></i>               
                    </a>
                  </li>
                  <li onClick={()=>refreshdata(formdatas)} className="nav-item">
                    <a className="nav-link notify-badge nav-icon-hover" href="javascript:void(0)" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-refresh"></i>               
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link notify-badge nav-icon-hover" to="https://www.anuation.com/oldcrm/employee/auth/reactauth/export-excel.php">  <i className="ti ti-cloud-download"></i>  </Link>

                  </li>
                  <li onClick={showuserprofile} className="nav-item dropdown">
                    <a className="nav-link pe-0 show" href="javascript:void(0)" id="drop1" data-bs-toggle="dropdown" aria-expanded="true">
                      <div className="d-flex align-items-center">
                        <div className="user-profile-img">
                          <img src={"../crm/assets/images/profile/"+(auth.gender=='f' ? 'user-2' : 'user-1')+".jpg"} className="rounded-circle" width="35" height="35" alt=""/>
                        </div>
                      </div>
                    </a>
                    <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up user-profile" aria-labelledby="drop1" data-bs-popper="static">
                      <div className="profile-dropdown position-relative" data-simplebar="init"><div className="simplebar-wrapper" style={{"margin": "0px"}}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{"right": "0px","bottom": "0px"}}><div className="simplebar-content-wrapper" tabindex="0" role="region" aria-label="scrollable content" style={{"height": "auto","overflow": "hidden scroll"}}><div className="simplebar-content" style={{"padding": "0px"}}>
                        <div className="py-3 px-7 pb-0">
                          <h5 className="mb-0 fs-5 fw-semibold">User Profile</h5>
                        </div>
                        <div className="d-flex align-items-center py-9 mx-7 border-bottom">
                          <img src={"../crm/assets/images/profile/"+(auth.gender=='f' ? 'user-2' : 'user-1')+".jpg"} className="rounded-circle" width="80" height="80" alt=""/>
                          <div className="ms-3">
                            <h5 className="mb-1 fs-3">{auth?.name}</h5>
                            {/* <span className="mb-1 d-block text-dark">Designer</span> */}
                            <p className="mb-0 d-flex text-dark align-items-center gap-2">
                              <i className="ti ti-mail fs-4"></i> {auth?.email}
                            </p>
                          </div>
                        </div>
                        <div className="d-grid py-4 px-7 pt-8">
                          <a onClick={()=>signout()} className="btn btn-outline-primary"><i  className="ti ti-logout"></i>    Log Out</a>
                        </div>
                      </div></div></div></div><div className="simplebar-placeholder" style={{"width":"auto","height":"601px"}}></div></div><div className="simplebar-track simplebar-horizontal" style={{"visibility": "hidden"}}><div className="simplebar-scrollbar" style={{"width": "0px","display": "none"}}></div></div><div className="simplebar-track simplebar-vertical" style={{"visibility": "visible"}}><div className="simplebar-scrollbar" style={{"height": "146px","display": "block","transform": "translate3d(0px, 0px, 0px)"}}></div></div></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        </>
    )
})

export default Header;