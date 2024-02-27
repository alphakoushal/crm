import React,{useState,memo,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { BrowserRouter, Routes, Route,Link,useNavigate, json } from "react-router-dom";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
const Headerblank = React.memo(() =>{
  const navigate=useNavigate(); 
  let auth= localStorage.getItem("user"); 
  auth =(auth!='' ? JSON.parse(auth) : '')
  const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:'',inprocess:false});


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
useEffect(()=>{
  return()=>{ 
     setTimeout(() => {
      setvalidate(()=>({...validate,status:false}));
      //show.state=false;
     }, 1000);
  }
},[])


    function signout()
    {
localStorage.setItem('user','')
navigate("/");
window.location.reload();
    }


    const showuserprofile = () =>{
      let ps=document.querySelector('.user-profile');
      (ps.classList.contains('show') ? ps.classList.remove('show') : ps.classList.add('show'));
    }
    return(
        <>
                    <Snackbar open={validate.status} autoHideDuration={1000}>

<MuiAlert elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
</Snackbar>
        <header className="app-header fixed-header"> 
          <nav className="navbar navbar-expand-lg navbar-light">
            <ul className="navbar-nav quick-links d-none d-lg-flex">
              <li className="nav-item dropdown hover-dd d-none d-lg-block">
                <a className="nav-link" href="#" data-bs-toggle="dropdown">Dashboard<span className="mt-1"><i className="ti ti-chevron-down"></i></span></a>
                <div className="dropdown-menu dropdown-menu-nav dropdown-menu-animate-up py-0">
                  <div className="row">
                    <div className="col-12">
                      <div className=" ps-7 pt-7">
                        <div className="border-bottom">
                          <div className="row">
                            
                            <div className="col-3">
                              <div className="position-relative">
                                
                                <Link to="/dashboard" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Patent</h6>
                                    <span className="fs-2 d-block text-dark">Dashboard</span>
                                  </div>
                                </Link>
                                <Link to="/analytic" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Analytic</h6>
                                    <span className="fs-2 d-block text-dark">Dashboard</span>
                                  </div>
                                </Link>
                                <Link to="/templates" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Templates</h6>
                                    <span className="fs-2 d-block text-dark">Dashboard</span>
                                  </div>
                                </Link>
                                <Link to="/templates-list" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Templates List</h6>
                                    <span className="fs-2 d-block text-dark">Dashboard</span>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
            <div className="collapse navbar-collapse justify-content-end show" id="navbarNav">
              <div className="d-flex align-items-center justify-content-between">
                <a href="#" className="nav-link d-flex d-lg-none align-items-center justify-content-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilenavbar" aria-controls="offcanvasWithBothOptions">
                  <i className="ti ti-align-justified fs-7"></i>
                </a>
                <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                  <li onClick={showuserprofile} className="nav-item dropdown">
                    <a className="nav-link pe-0 show" href="#" id="drop1" data-bs-toggle="dropdown" aria-expanded="true">
                      <div className="d-flex align-items-center">
                        <div className="user-profile-img">
                          <img src={"../crm/assets/images/profile/"+(auth.gender=='f' ? 'user-2' : 'user-1')+".jpg"} className="rounded-circle" width="35" height="35" alt=""/>
                        </div>
                      </div>
                    </a>
                    <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up user-profile" aria-labelledby="drop1" data-bs-popper="static">
                      <div className="profile-dropdown position-relative" data-simplebar="init"><div className="simplebar-wrapper" style={{"margin": "0px"}}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{"right": "0px","bottom": "0px"}}><div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content" style={{"height": "auto","overflow": "hidden scroll"}}><div className="simplebar-content" style={{"padding": "0px"}}>
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

export default Headerblank;