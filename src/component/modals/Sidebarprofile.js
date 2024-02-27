import React,{useEffect, useMemo,useState,useRef,memo,Suspense,lazy,useCallback} from "react";
import Fetchdata from "../../services/fetchdata";
import Details from "./Details";
const Sidebarprofile = ({email,type,closebar}) =>{
const [clienthistory,sethistory]=useState({data:[],agent:0,converted:0,response:0,pipeline:0,pipeline:0});
const [currenttab,settab]=useState(0);
const loadcomment = (index) =>{
  settab(index);
}
async function gethistory(email,type){
  let d=await Fetchdata.fetchhistory({email:email,type:type}).then((Response)=>{return Response;});
 if(d.data.data.length>0)
 {
  let converted= d.data.data.map((item)=> ({'app':item[0],'comment':JSON.parse(item[2])['freshcomment'].map((item)=>item.comment_type)}));
console.log(converted);
  sethistory((prev)=>({...prev,domain:d.data.domain,data:d.data.data,converted:converted.filter((item)=> { return (item.comment.includes('6'))}).length,response:converted.filter((item)=> { return (item.comment.includes('7'))}).length,pipeline:converted.filter((item)=> { return (item.comment.includes('1'))}).length,agent:[...new Set(d.data.data.map((item)=>JSON.parse(item[3])['agent_name']))]}));
 // sethistory(d.data); 
  setTimeout(() => {
    document.querySelector('.profilesidebar').classList.add('show');
    if(document.querySelector('i.profilefetch.show'))
    {
      document.querySelector('i.profilefetch.show').classList.replace('show','hide')
    }
  }, 1000);
}
}
 useEffect(()=>{
  gethistory(email,type);
  
 },[]);
    return(
        <>
        {clienthistory.data.length>0 ? 
        <div className="offcanvas offcanvas-end profile-bar profilesidebar" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header py-4">
        <h5 className="offcanvas-title fs-5 fw-semibold" id="offcanvasRightLabel">Profile</h5>
        <a onClick={()=>closebar()} href="#" className="btn btn-outline-primary w-30">Close</a>
      </div>
          <div className="container-fluid">
          
          <div className="card pt-2">
            <div className="card-body p-0">
              <img src="https://www.anuationlabs.com/demo/main/dist/images/backgrounds/profilebg.jpg" alt="" id="scrollButton" className="img-fluid"/>

              <div className="row align-items-center">
                <div className="col-lg-4 order-lg-1 order-2">
                  <div className="d-flex align-items-center justify-content-around m-4">
                    <div className="text-center">
                      <i className="ti ti-file-description fs-6 d-block mb-2"></i>
                      <h4 className="mb-0 fw-semibold lh-1">{clienthistory.data.length}</h4>
                      <p className="mb-0 fs-2">Applications</p>
                    </div>

                    <div className="text-center">
                      <i className="ti ti-user-check fs-6 d-block mb-2"></i>
                      <h4 title={clienthistory.agent.join(', ')} className="mb-0 fw-semibold lh-1">{clienthistory.agent.length}</h4>
                      <p className="mb-0 fs-2">Agents</p>
                    </div>





                  </div>
                </div>
                <div className="col-lg-4 mt-n3 order-lg-2 order-1">
                  <div className="mt-n5">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <div className="linear-gradient d-flex align-items-center justify-content-center rounded-circle">
                        <div style={{'width':'100px'}} className="border border-4 border-white d-flex align-items-center justify-content-center rounded-circle overflow-hidden" >
                          <img src="https://www.anuationlabs.com/demo/main/dist/images/profile/user-1.jpg" alt="" className="w-100 h-100"/>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h5 className="fs-5 mb-0 fw-semibold">{clienthistory.domain}</h5>
                      {/* <p className="mb-0 fs-4">{clienthistory.domain}</p> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 order-last">
                  <div className="d-flex align-items-center justify-content-around m-4">
                    <div className="text-center">
                      <i className="ti ti-file-description fs-6 d-block mb-2"></i>
                      <h4 className="mb-0 fw-semibold lh-1">{clienthistory.converted}</h4>
                      <p className="mb-0 fs-2">Converted</p>
                    </div>

                    <div className="text-center">
                      <i className="ti ti-file-description fs-6 d-block mb-2"></i>
                      <h4 className="mb-0 fw-semibold lh-1">{clienthistory.pipeline}</h4>
                      <p className="mb-0 fs-2">Pipeline</p>
                    </div>
                    <div className="text-center">
                      <i className="ti ti-file-description fs-6 d-block mb-2"></i>
                      <h4 className="mb-0 fw-semibold lh-1">{clienthistory.response}</h4>
                      <p className="mb-0 fs-2">Response</p>
                    </div>




                  </div>
                </div>
              </div>

            </div>
          </div>
      
            <ul  className="nav nav-pills user-profile-tab  mt-2 bg-light-info rounded-2" id="pills-tab" role="tablist">
             {clienthistory.data.map( (item,index) => {
                return (<li className="nav-item" role="presentation">
                <button onClick={()=>loadcomment(index)} className={`nav-link position-relative rounded-0 ${index==currenttab ? 'active' : ''} d-flex align-items-center justify-content-center bg-transparent fs-3 py-6`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="true">

                  <span className="d-none d-md-block"><i className="ti ti-file-text"></i> {item[0]}</span>
                </button>
              </li>)
              })}
            </ul>

         {clienthistory.data.length>0 ? <Details data={clienthistory.data[currenttab]}></Details> : <></>}
          </div>
          </div>
 : <></>}
        </>
    )
}

export default Sidebarprofile;