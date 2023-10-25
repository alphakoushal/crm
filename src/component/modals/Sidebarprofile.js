import React,{useEffect, useMemo,useState,useRef,memo,Suspense,lazy,useCallback} from "react";
import Fetchdata from "../../services/fetchdata";
const Sidebarprofile = ({email,closebar}) =>{
const [clienthistory,sethistory]=useState([]);
async function gethistory(email){
  let d=await Fetchdata.fetchhistory({email:email}).then((Response)=>{return Response;});
  console.log(d.data.data);
 sethistory(d.data.data);
  setTimeout(() => {
    document.querySelector('.profilesidebar').classList.add('show');
    if(document.querySelector('i.profilefetch.show'))
    {
      document.querySelector('i.profilefetch.show').classList.replace('show','hide')
    }
  }, 1000);
}
 useEffect(()=>{
  console.log(email);
  gethistory(email);
  
 },[]);
    return(
        <>
        <div className="offcanvas offcanvas-end profile-bar profilesidebar" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header py-4">
        <h5 className="offcanvas-title fs-5 fw-semibold" id="offcanvasRightLabel">Profile</h5>
        <a onClick={()=>closebar()} href="#" className="btn btn-outline-primary w-30">Close</a>
      </div>
          <div className="card">
            <ul className="nav nav-pills user-profile-tab" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4 active" id="pills-account-tab" data-bs-toggle="pill" data-bs-target="#pills-account" type="button" role="tab" aria-controls="pills-account" aria-selected="true">
                  <i className="ti ti-user-circle me-2 fs-6"></i>
                  <span className="d-none d-md-block">Account</span> 
                </button>
              </li> 
              <li className="nav-item" role="presentation">
                <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-4" id="pills-notifications-tab" data-bs-toggle="pill" data-bs-target="#pills-notifications" type="button" role="tab" aria-controls="pills-notifications" aria-selected="false" tabindex="-1">
                  <i className="ti ti-bell me-2 fs-6"></i>
                  <span className="d-none d-md-block">Notifications</span> 
                </button>
              </li>
              
              
            </ul>
            <div className="card-body">
              <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade active show" id="pills-account" role="tabpanel" aria-labelledby="pills-account-tab" tabindex="0">
                  <div className="row">
                    <div className="col-12">
                      <div className="card w-100 position-relative overflow-hidden mb-0">
                        <div className="card-body p-4">
                          <h5 className="card-title fw-semibold">Application Details</h5>
                          <p className="card-subtitle mb-4">To change your personal detail , edit and save from here</p>
                          {clienthistory.map((v,i)=>{
                             return <p key={i}> {v[0]}</p>
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="pills-notifications" role="tabpanel" aria-labelledby="pills-notifications-tab" tabindex="0">
                  <div className="row justify-content-center">
                    <div className="col-lg-9">
                      <div className="card">
                        <div className="card-body p-4">
                          <h4 className="fw-semibold mb-3">Notification Preferences</h4>
                          <p>
                            Select the notificaitons ou would like to receive via email. Please note that you cannot opt out of receving service 
                            messages, such as payment, security or legal notifications.
                          </p>
                          <form className="mb-7">                            
                            <label for="exampleInputPassword1" className="form-label fw-semibold">Email Address*</label>
                            <input type="text" className="form-control" id="exampleInputtext" placeholder="" required=""/>
                            <p className="mb-0">Required for notificaitons.</p>
                          </form>
                          <div className="">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-light rounded-1 p-6 d-flex align-items-center justify-content-center">
                                  <i className="ti ti-article text-dark d-block fs-7" width="22" height="22"></i>
                                </div>
                                <div>
                                  <h5 className="fs-4 fw-semibold">Our newsletter</h5>
                                  <p className="mb-0">We'll always let you know about important changes</p>
                                </div>
                              </div>
                              <div className="form-check form-switch mb-0">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"/>
                              </div>
                            </div>
                            
                            
                            
                            
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-9">
                      <div className="card">
                        <div className="card-body p-4">
                          <h4 className="fw-semibold mb-3">Date &amp; Time</h4>
                          <p>Time zones and calendar display settings.</p> 
                          <div className="d-flex align-items-center justify-content-between mt-7">
                            <div className="d-flex align-items-center gap-3">
                              <div className="bg-light rounded-1 p-6 d-flex align-items-center justify-content-center">
                                <i className="ti ti-clock-hour-4 text-dark d-block fs-7" width="22" height="22"></i>
                              </div>
                              <div>
                                <p className="mb-0">Time zone</p>
                                <h5 className="fs-4 fw-semibold">(UTC + 02:00) Athens, Bucharet</h5>
                              </div>
                            </div>
                            <a className="text-dark fs-6 d-flex align-items-center justify-content-center bg-transparent p-2 fs-4 rounded-circle" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Download">
                              <i className="ti ti-download"></i>
                            </a>
                          </div> 
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12">
                      <div className="d-flex align-items-center justify-content-end gap-3">
                        <button className="btn btn-primary">Save</button>
                        <button className="btn btn-light-danger text-danger">Cancel</button>
                      </div>
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

export default Sidebarprofile;