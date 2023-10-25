import React,{ ReactFragment,useRef } from "react";
import  Toasts  from '../component/Toast';
import AuthService from "../services/authservices";
import Authdata from "../reducers/Authdata";
import { Link,useNavigate } from 'react-router-dom';
const Login =function()
{
    const tooastref = useRef(null);
    const navigate =useNavigate();
    function loginauth()
    {
        
        let ecode=document.querySelector('#signin_code').value;let signin_password=document.querySelector('#signin_password').value;
        if(ecode==''){
            tooastref.current.errors('Please enter Code');
           }
           else if(signin_password==''){
            tooastref.current.errors('Please enter Password');
           }
           else
           {
            var logindata = {
                'signin_code': ecode,
                'signin_password': signin_password,
                'cordinate':JSON.stringify({ lat: 28.6358411, long: 77.0987502 }),
                'remember': '',
                'type': 'login'
            };
            AuthService.login(logindata).then(
                  (data) => {
                    if(data.data.message)
                    {
                        tooastref.current.errors(data.data.message);
                navigate("/#dashboard");
              window.location.reload();
                    }
                    else
                    {
                    tooastref.current.errors(data.data.errors.error);
                  }
                  },
                  (error) => {
                    const resMessage =
                      (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                      error.message ||
                      error.toString();
        console.log(resMessage);
                  }
                );
           }
    }
    return(
        <>
        <Toasts ref={tooastref}></Toasts>
  <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
      <div className="position-relative overflow-hidden radial-gradient min-vh-100">
        <div className="position-relative zIndex-5">
          <div className="row">
            <div className="col-xl-7 col-xxl-8">
              <a href="index.html" className="text-nowrap logo-img d-block px-4 py-9 w-100">
                <img src="https://www.anuation.com/public/assets//img/logo/2d_logo-01.png" width="180" alt=""/>
              </a>
              <div className="d-none d-xl-flex align-items-center justify-content-center" style={{"height": "calc(100vh - 80px)"}}>
                <img src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/backgrounds/login-security.svg" alt="" className="img-fluid" width="500"/>
              </div>
            </div>
            <div className="col-xl-5 col-xxl-4">
              <div className="authentication-login min-vh-100 bg-body row justify-content-center align-items-center p-4">
                <div className="col-sm-8 col-md-6 col-xl-9">
                  <h2 className="mb-3 fs-7 fw-bolder">Welcome to CRM</h2>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                      <input  type="email" className="form-control" id="signin_code" aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                      <input type="password" className="form-control" id="signin_password"/>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="form-check">
                        <input className="form-check-input primary" type="checkbox" value="" id="flexCheckChecked" checked/>
                        <label className="form-check-label text-dark" htmlFor="flexCheckChecked">
                          Remeber this Device
                        </label>
                      </div>
                      <a className="text-primary fw-medium" href="#">Forgot Password ?</a>
                    </div>
                    <a onClick={()=>{loginauth()}}href="#" className="btn btn-primary w-100 py-8 mb-4 rounded-2">Sign In</a>
                    {/* <div className="d-flex align-items-center justify-content-center">
                      <p className="fs-4 mb-0 fw-medium">New to CRM?</p>
                      <a className="text-primary fw-medium ms-2" href="#">Create an account</a>
                    </div> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>        
        </>
    )
}

export default Login;