import React,{ ReactFragment,useRef } from "react";
import  Toasts  from '../component/Toast';
import AuthService from "../services/authservices";
import Authdata from "../reducers/Authdata";
import { Link,useNavigate } from 'react-router-dom';
import config from "../constant/Import-detail-of-crm.js";
const Login =function()
{
    const tooastref = useRef(null);
    const navigate =useNavigate();
    function loginauth(e)
    {
        e.preventDefault();
        let ecode=document.querySelector('#signin_code').value;let signin_password=document.querySelector('#signin_password').value;
        if(ecode==''){
            tooastref.current.errors('Please enter Employee Code.');
           }
           else if(signin_password==''){
            tooastref.current.errors('Please enter your Password.');
           }
           else
           {
            var logindata = {
                'signin_code': ecode,
                'ecode': ecode,
                'signin_password': signin_password,
                'password': signin_password,
                'cordinate':JSON.stringify({ lat: 28.6358411, long: 77.0987502 }),
                'remember': '',
                'type': 'login'
            };
            AuthService.login(logindata).then(
                  (data) => {
                    if(data.data.message)
                    {
                        tooastref.current.errors(data.data.message);
                navigate("/");
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
                  }
                );
           }
    }
    return(
        <>
        <Toasts ref={tooastref}></Toasts>
      <div className="position-relative overflow-hidden radial-gradient min-vh-100 align-content-center">
        <div className="position-relative zIndex-5">
          <div class="d-flex align-items-center justify-content-center w-100">
        <div class="row justify-content-center w-100">
          <div class="col-md-8 col-lg-6 col-xxl-3 auth-card">
            <div class="card mb-0">
              <div class="card-body">
                <a href=".#" class="text-nowrap logo-img text-center d-block mb-5 w-100">
                  <img width="180" src="https://www.anuation.com/public/assets//img/logo/2d_logo-01.png" class="dark-logo" alt="Logo-Dark"/>
                </a>
                <div class="position-relative text-center my-4">
                  <p class="mb-0 fs-4 px-3 d-inline-block bg-body text-dark z-index-5 position-relative">Welcome to {config.name}
                  </p>
                  <span class="border-top w-100 position-absolute top-50 start-50 translate-middle"></span>
                </div>
                <form>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Username</label>
                    <input  type="email" className="form-control" id="signin_code" aria-describedby="emailHelp"/>
                  </div>
                  <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                     <input type="password" className="form-control" id="signin_password"/>
                  </div>
                  <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="form-check">
                      <input class="form-check-input primary" type="checkbox" value="" id="flexCheckChecked" checked=""/>
                      <label class="form-check-label text-dark" for="flexCheckChecked">
                        Remeber this Device
                      </label>
                    </div>
                    <a class="text-primary fw-medium" href="#">Forgot
                      Password ?</a>
                  </div>
                  <a onClick={(e)=>{loginauth(e)}} href="#" class="btn btn-primary w-100 py-8 mb-4 rounded-2">Sign In</a>
                  <div class="d-flex align-items-center justify-content-center">
                    <p class="fs-4 mb-0 fw-medium">New to {config.name}?</p>
                    <a class="text-primary fw-medium ms-2" href="#">Create an
                      account</a>
                  </div>
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