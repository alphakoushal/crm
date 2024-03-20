import React,{useEffect, useMemo,useState,useRef,memo,Suspense,lazy,useCallback} from "react";
import Fetchdata from "../../services/fetchdata";
import Details from "./Details";
import Toast from "../New-toast";
import Popup from "../Popup";
const Sidebarprofile = ({email,type,closebar}) =>{
const [clienthistory,sethistory]=useState({type:type,data:[],assigned:0,agent:0,converted:[],response:[],pipeline:[]});
const [currenttab,settab]=useState('');
const [currentsheet,setsheet]=useState(0);
const [searcheddata,setsearchdata]=useState([]);
const [openpopover,setpopver] = useState({show:false,e:{}})
const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:'',modalstatus:true});
const loadcomment = (index) =>{
  settab(index);
}
let timeout='';
const activatesheet = (sheet) =>{
  document.querySelector('.appsheet.active').classList.remove('active');
  document.querySelector('.sheet'+sheet).classList.add('active');
  setsheet(sheet);
  settab('');
}
const putvalue = (v) =>{
  document.querySelector('.hideresult').classList.add('hide');
  document.querySelector('#text-srh').value=v;
  callhistory();
}
const startsearching = (e) =>{
  let t= document.querySelector('#inputGroupSelect04').value; 
  let v= e.target.value;
  clearTimeout(timeout);
  if(t=='')
          {
              setvalidate((validate)=>({...validate,status:true,message:'Choose Type'}));
          }
          else if(v=='')
          {
            setvalidate((validate)=>({...validate,status:true,message:'Enter in input'}));
          }
          else
          {
            document.querySelector('.loader').classList.remove('hide');
           timeout= setTimeout( async ()=>{
              const data =await Fetchdata.fetchdomain({type:t,'posttype':'searchrecord','data':v}).then((response)=>{return response;});
             if(data.data.success)
             {
              setsearchdata(data.data.data);
             }
             else
             {
              setsearchdata([]);
             }
             document.querySelector('.loader').classList.add('hide');
            },1000);
            
}

}
async function callhistory()
{
let t= document.querySelector('#inputGroupSelect04').value;
let v= document.querySelector('#text-srh').value;
if(t=='')
        {
            setvalidate((validate)=>({...validate,status:true,message:'Choose Type'}));
        }
        else if(v=='')
        {
          setvalidate((validate)=>({...validate,status:true,message:'Enter in input'}));
        }
        else
        {
          setvalidate((validate)=>({...validate,status:false,message:'Choose Type'}));
gethistory(v,t)
        }
}
async function gethistory(email,type){
  document.querySelector('.loader').classList.remove('hide');
  let d=await Fetchdata.fetchhistory({email:email,type:type}).then((Response)=>{return Response;});
 if(d.data.data.length>0)
 {
  let commentdata= d.data.data.map((item)=> ({'app':item['apps'],'comment':(item['comment']!=='' && item['comment']!=null ? JSON.parse(item['comment'])['freshcomment'] : []).map((item)=>item.comment_type)}));
let converted = commentdata.map((item)=> {  if(item.comment[item.comment.length-1]=='6') { return item.app; }}).filter(item => item !== undefined);
let response = commentdata.map((item)=> {  if(item.comment[item.comment.length-1]=='7') { return item.app; }}).filter(item => item !== undefined);
let pipeline = commentdata.map((item)=> {  if(item.comment[item.comment.length-1]=='1') { return item.app; }}).filter(item => item !== undefined);

sethistory((prev)=>({...prev,type:type,domain:d.data.domain,data:d.data.data,converted:converted,response:response,pipeline:pipeline,assigned:[...new Set(d.data.data.map((item)=>item.user??''))].sort((a,b)=>{ return a-b;}).filter((item)=> item!='' && item!='N/A' ),agent:[...new Set(d.data.data.map((item)=>JSON.parse(item['other'])['agent_name']??'N/A'))].filter((item)=> item!='' && item!='N/A' )}));
 // sethistory(d.data); 
  setTimeout(() => {
    document.querySelector('.profilesidebar').classList.add('show');
    if(document.querySelector('i.profilefetch.show'))
    {
      document.querySelector('i.profilefetch.show').classList.replace('show','hide')
    }
  }, 1000);
}
else
{
  setTimeout(() => {
    if(document.querySelector('i.profilefetch.show'))
    {
      document.querySelector('i.profilefetch.show').classList.replace('show','hide')
    }
  }, 1000); 
  sethistory((prev)=>({...prev,type:type,domain:d.data.domain,data:d.data.data,converted:[],response:[],pipeline:[],agent:[],assigned:[]}));

}
document.querySelector('.loader').classList.add('hide');
}
 useEffect(()=>{
  gethistory(email,type);
  
 },[]);
    return(
      
        <div onClick={()=>setpopver((prev)=>({...prev,show:false}))} className="offcanvas offcanvas-end profile-bar profilesidebar" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
       <Toast validate={validate}></Toast>
       <div className="container-fluid">
      <div class="loader hide z-2"></div>
      <a style={{'right':'25px','top':'10px'}} onClick={()=>closebar()} class="position-absolute nav-link nav-icon-hover z-2" href="javascript:void(0)">
                <i class="ti ti-x fs-5"></i>
              </a>
       {clienthistory.data.length>0 ? <> 

          <div className="card ">
            <div className="card-body p-0">
              <img style={{'width':'100%','height':'100px'}} src="https://www.anuationlabs.com/demo/main/dist/images/backgrounds/profilebg.jpg" alt="" id="scrollButton" className="img-fluid"/>
              <div class="position-absolute col-4" style={{"bottom":"132px","right":"11px"}}>
                      <div class="input-group" style={{"background": "#fff","border-radius": "10px"}}>
                      <select style={{"max-width":"125px"}} class="form-select" id="inputGroupSelect04">
                        <option value='' selected="">Choose...</option>
                        <option value="domain">Domain</option>
                        <option value="email">Email</option>
                        <option value="patent">Application</option>
                        <option value="applicant">Applicant</option>
                      </select>
                      <input autoComplete="off" onClick={()=>{document.querySelector('.hideresult').classList.remove('hide')}} onKeyUp={(e)=>{startsearching(e)}} type="text" class="z-1 form-control search-chat py-2 ps-3 pe-5" id="text-srh" placeholder="Search"/>
                      <i onClick={()=>callhistory()} class="z-3 ti ti-search position-absolute top-50 end-0 translate-middle-y fs-6 text-dark pe-2"></i>
                      <ul class="hideresult" role="none" style={{'z-index':'9',"border-left": "2px solid #e2e2e2","position": "absolute","top": "35px","width": "68%","left": "32%","background": "white"}}>
                        {
                          searcheddata.map((item,index)=>{
                            return <li onClick={()=>{putvalue(item.appno)}} key={index} style={{"padding": "8px 10px","cursor": "pointer"}}>{item.appno}</li>;
                          })
                        }
                        </ul>
                    </div>
                  </div>
              <div className="row align-items-center">
                <div className="col-lg-4 order-lg-1 order-2">
                  <div className="d-flex align-items-center justify-content-around m-4">
                    <div className="text-center">
                      <img className="w-30 pb-2" src='../crm/assets/icons/patent.png' />
                      <h4 className="mb-0 fw-semibold lh-1">{clienthistory.data.length}</h4>
                      <p className="mb-0 fs-2">Applications</p>
                    </div>

                    <div className="text-center">
                    <img className="w-30 pb-2" src='../crm/assets/icons/agent.png'/>
                      <h4 title={clienthistory.agent.join(', ')} className="mb-0 fw-semibold lh-1">{clienthistory.agent.length}</h4>
                      <p onClick={(e)=>{e.stopPropagation();setpopver((prev)=>({...prev,show:!prev.show,e:e,value:clienthistory.agent.join(', ')}))}} className="mb-0 fs-2 position-relative">Agents <a className="position-absolute"><i class="ti ti-dots-vertical fs-4"></i></a></p>

                    </div>
                    <div className="text-center">
                    <img className="w-30 pb-2" src='../crm/assets/icons/agent.png'/>
                      <h4 title={clienthistory.assigned.join(', ')} className="mb-0 fw-semibold lh-1">{clienthistory.assigned.length}</h4>
                      <p onClick={(e)=>{e.stopPropagation();setpopver((prev)=>({...prev,show:!prev.show,e:e,value:clienthistory.assigned.join(', ')}))}} className="mb-0 fs-2 position-relative">Assigned <a className="position-absolute"><i class="ti ti-dots-vertical fs-4"></i></a></p>
                     {(openpopover.show ? <Popup popover={openpopover}></Popup> : <></>)}
                    </div>

 



                  </div>
                </div>
                <div className="col-lg-4 mt-n3 order-lg-2 order-1">
                  <div className="mt-n5">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <div className="d-flex align-items-center justify-content-center rounded-circle">
                        <div style={{'width':'100px'}} className="border border-4 border-white d-flex align-items-center justify-content-center rounded-circle overflow-hidden" >
                          <img src={`../crm/assets/icons/${clienthistory.type.toLowerCase()}.png`} alt="" className="w-100 h-100"/>
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
                    <img className="w-30 pb-2" src='../crm/assets/icons/converted.png'/>
                      <h4 className="mb-0 fw-semibold lh-1">{clienthistory.converted.length}</h4>
                      <p className="mb-0 fs-2">Converted</p>
                    </div>

                    <div className="text-center">
                    <img className="w-30 pb-2" src='../crm/assets/icons/pipeline.png'/>
                      <h4 className="mb-0 fw-semibold lh-1">{clienthistory.pipeline.length}</h4>
                      <p className="mb-0 fs-2">Pipeline</p>
                    </div>
                    <div className="text-center">
                    <img className="w-30 pb-2" src='../crm/assets/icons/response.png'/>
                      <h4 className="mb-0 fw-semibold lh-1">{clienthistory.response.length}</h4>
                      <p className="mb-0 fs-2">Response</p>
                    </div>




                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="d-md-flex align-items-center mb-9">
                    
                    <div class="mt-4 mt-md-0">
                      <ul class="nav nav-tabs" role="tablist">
                        <li class="nav-item" role="presentation">
                          <a onClick={()=>{activatesheet(0)}} class="sheet0 nav-link rounded active appsheet" data-bs-toggle="tab" role="tab" aria-selected="true">
                            <span>Current</span>
                          </a>
                        </li>
                        <li class="nav-item" role="presentation">
                          <a onClick={()=>{activatesheet(1)}} class="sheet1 nav-link rounded appsheet" data-bs-toggle="tab"  role="tab" aria-selected="false" tabindex="-1">
                            <span>Exhausted</span>
                          </a>
                        </li>
                        <li class="nav-item" role="presentation">
                          <a onClick={()=>{activatesheet(2)}} class="sheet2 nav-link rounded appsheet" data-bs-toggle="tab"  role="tab" aria-selected="false" tabindex="-1">
                            <span>Suggestions</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
            <ul  className="app-content nav nav-pills user-profile-tab  mt-2 bg-light-info rounded-2" id="pills-tab" role="tablist">
             {clienthistory.data.map( (item,index) => {
                return (
                (item['sheet']==currentsheet ? <li className="nav-item" role="presentation">
                <button data-index={index} onClick={()=>loadcomment(index+1)} className={`w-185 me-1 btn btn-outline-${(item['suggestion']=='yes' ? 'warning' : 'success')} position-relative ${index==(currenttab-1) ? 'active' : ''} d-flex align-items-center justify-content-center fs-3 py-2 mb-1`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="true">

                  <span className="d-none d-md-block"><img style={{width:'30px'}} src={`../crm/assets/images/${(item['user'] !='' && item['user']!=null ? item['user'] : 'patent')}.png`} data-src={`${(item['deadline']=='yes' ? '../crm/assets/icons/redpatent.png' : '../crm/assets/icons/patent.png')}`}/> {item['apps']} {clienthistory.response.includes(item['apps']) ? 'R' : ''} {clienthistory.converted.includes(item['apps']) ? 'C' : ''} {clienthistory.pipeline.includes(item['apps']) ? 'P' : ''}</span>
                </button>
              </li> : <></>))
              })}
            </ul>

         {clienthistory.data.length>0 && currenttab!='' ? <Details data={clienthistory.data[currenttab-1]}></Details> : <></>}
          </>
           : <> <div className="card ">
           <div className="card-body p-0">
             <img style={{'width':'100%','height':'100px'}} src="https://www.anuationlabs.com/demo/main/dist/images/backgrounds/profilebg.jpg" alt="" id="scrollButton" className="img-fluid"/>
             <div class="position-absolute col-4" style={{"bottom":"132px","right":"11px"}}>
                     <form class="from-s" style={{"background": "#fff","border-radius": "10px"}}>
                     <div class="input-group">
                     <select style={{"max-width":"125px"}} class="form-select" id="inputGroupSelect04">
                       <option value='' selected="">Choose...</option>
                       <option value="domain">Domain</option>
                       <option value="email">Email</option>
                       <option value="patent">Application</option>
                       <option value="applicant">Applicant</option>
                     </select>
                     <input autoComplete="off" onClick={()=>{document.querySelector('.hideresult').classList.remove('hide')}} onKeyUp={(e)=>{startsearching(e)}} type="text" class="z-1 form-control search-chat py-2 ps-3 pe-5" id="text-srh" placeholder="Search"/>
                      <i onClick={()=>callhistory()} class="z-3 ti ti-search position-absolute top-50 end-0 translate-middle-y fs-6 text-dark pe-2"></i>
                      <ul class="hideresult" role="none" style={{'z-index':'9',"border-left": "2px solid #e2e2e2","position": "absolute","top": "35px","width": "68%","left": "32%","background": "white"}}>
                        {
                          searcheddata.map((item,index)=>{
                            return <li onClick={()=>{putvalue(item.appno)}} key={index} style={{"padding": "8px 10px","cursor": "pointer"}}>{item.appno}</li>;
                          })
                        }
                        </ul> </div>
                      </form>
                 </div>
             <div className="row align-items-center">
               <div className="col-lg-4 order-lg-1 order-2">
                 <div className="d-flex align-items-center justify-content-around m-4">
                   <div className="text-center">
                     <img className="w-30 pb-2" src='../crm/assets/icons/patent.png' />
                     <h4 className="mb-0 fw-semibold lh-1">{clienthistory.data.length}</h4>
                     <p className="mb-0 fs-2">Applications</p>
                   </div>

                   <div className="text-center">
                   <img className="w-30 pb-2" src='../crm/assets/icons/agent.png'/>
                     <h4 title='' className="mb-0 fw-semibold lh-1">{clienthistory.agent.length}</h4>
                     <p className="mb-0 fs-2">Agents</p>
                   </div>
                   <div className="text-center">
                   <img className="w-30 pb-2" src='../crm/assets/icons/agent.png'/>
                     <h4 title='' className="mb-0 fw-semibold lh-1">{clienthistory.assigned.length}</h4>
                     <p className="mb-0 fs-2">Assigned</p>
                   </div>





                 </div>
               </div>
               <div className="col-lg-4 mt-n3 order-lg-2 order-1">
                 <div className="mt-n5">
                   <div className="d-flex align-items-center justify-content-center mb-2">
                     <div className="d-flex align-items-center justify-content-center rounded-circle">
                       <div style={{'width':'100px'}} className="border border-4 border-white d-flex align-items-center justify-content-center rounded-circle overflow-hidden" >
                         <img src={`../crm/assets/icons/${clienthistory.type.toLowerCase()}.png`} alt="" className="w-100 h-100"/>
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
                   <img className="w-30 pb-2" src='../crm/assets/icons/converted.png'/>
                     <h4 className="mb-0 fw-semibold lh-1">{clienthistory.converted.length}</h4>
                     <p className="mb-0 fs-2">Converted</p>
                   </div>

                   <div className="text-center">
                   <img className="w-30 pb-2" src='../crm/assets/icons/pipeline.png'/>
                     <h4 className="mb-0 fw-semibold lh-1">{clienthistory.pipeline.length}</h4>
                     <p className="mb-0 fs-2">Pipeline</p>
                   </div>
                   <div className="text-center">
                   <img className="w-30 pb-2" src='../crm/assets/icons/response.png'/>
                     <h4 className="mb-0 fw-semibold lh-1">{clienthistory.response.length}</h4>
                     <p className="mb-0 fs-2">Response</p>
                   </div>




                 </div>
               </div>
             </div>

           </div>
         </div>     <ul  className="nav nav-pills user-profile-tab  mt-2 bg-light-info rounded-2" id="pills-tab" role="tablist">
         <li className="nav-item" role="presentation">
                <button className={`me-1 btn position-relative d-flex align-items-center justify-content-center fs-3 py-2 mb-1`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="true">

                  <span className="d-none d-md-block"><img style={{width:'20px'}} src={`../crm/assets/icons/patent.png`}/> N/A </span>
                </button>
              </li>
            </ul></>}
           </div>
          </div>
    )
}

export default Sidebarprofile;