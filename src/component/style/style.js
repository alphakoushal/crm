import React,{useState,useEffect,useRef} from "react";
import { updatestyle } from "../../reducers/Style";
//import { useDispatch,useSelector } from "react-redux";
function Style({st})
{
//const dispatch= useDispatch();
const [style,updatestyle] = useState({wrap:{'style':'white-space:nowrap;overflow:hidden;width:100px;max-width:100px','active':'1'},fontsize:'10px'});
//const headers=[{"value":"1","key":"App no"},{"value":"2","key":"Title"},{"value":"3","key":"COUNTRY"},{"value":"4","key":"PRIOTITY DATE"},{"value":"5","key":"DEADLINE - 30 mth"},{"value":"6","key":"DEADLINE - 31 mth"},{"value":"7","key":"APPLICANT NAME"},{"value":"8","key":"Unique/Dupe"},{"value":"9","key":"Gen/Non Gen"},{"value":"10","key":"Applicant Status"},{"value":"11","key":"CONTACT INFO OF"},{"value":"12","key":"CONTACT PERSON"},{"value":"13","key":"EMAIL ID"},{"value":"14","key":"Domain"},{"value":"15","key":"PH. NO."},{"value":"16","key":"Pages"},{"value":"17","key":"Claim"},{"value":"18","key":"Priority"},{"value":"19","key":"Drawings"},{"value":"20","key":"ISR"},{"value":"21","key":"REF. NO."},{"value":"22","key":"First Email Date"},{"value":"23","key":"FollowUp date"},{"value":"24","key":"Next Follow Up"},{"value":"25","key":"Pct App Status"},{"value":"26","key":"Email Status"},{"value":"27","key":"Call Status"},{"value":"28","key":"Comment"},{"value":"29","key":"Agent name"},{"value":"30","key":"Agent Email Id"},{"value":"31","key":"Agent Domain"},{"value":"32","key":"Agent Phone"},{"value":"33","key":"Previous Email Status"},{"value":"34","key":"Company"},{"value":"55","key":"Month"},{"value":"56","key":"Sent on"},{"value":"57","key":"Cron Status"},{"value":"58","key":"Assigned"},{"value":"59","key":"Agent Unique/Dupe"},{"value":"60","key":"Agent Gen/Non Gen"}];
let getstyle=localStorage.getItem('style');
let headers = [...document.querySelectorAll('thead tr th .headers')];
useEffect(()=>{
  console.log(headers.map((i,v)=>i.innerText));
  if(getstyle!=null)
  {
    updatestyle(JSON.parse(getstyle));
    localStorage.setItem('style',JSON.stringify(style));
  }
  else
  {

    localStorage.setItem('style',JSON.stringify(style));
  }
},[])

async function changefont(v)
{
  let getstyle= {...style,'fontsize':v};
  await localStorage.setItem('style',JSON.stringify(getstyle));
  updatestyle(getstyle);
}
async function hidecolumn(col,val)
{
let getstyle= {...style,[col]:(val=='' ? 'none !important' : '')};
await localStorage.setItem('style',JSON.stringify(getstyle));
updatestyle(getstyle);
}
async function wraptext(v)
{
  let getstyle= {...style,'wrap':(v==1 ? {'style':'white-space:nowrap;overflow:hidden;width:100px;max-width:100px','active':v} : {style:'','active':v})};
await localStorage.setItem('style',JSON.stringify(getstyle));
updatestyle(getstyle);
}
    function showmodal()
    {
        document.querySelector('.customizer').classList.add('show');

    }
    function closemodal()
    {
        document.querySelector('.customizer').classList.remove('show');

    }
const styls="table input[type='text1']{width:100%}th{position:relative}td{"+style.wrap.style+"}td,.headers,th,table input{font-size:"+style.fontsize+" !important}";
    return(
        <>
        <style>
{styls}
{[...Array(100)].fill().map((i,v)=>{
  return `td:nth-child(${v}){display:${style[v]?? ''}}th:nth-child(${v}){display:${style[v]?? ''}}`;
})}
</style>
<button onClick={()=>showmodal()} className="btn btn-primary p-3 rounded-circle d-flex align-items-center justify-content-center customizer-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
    <i className="ti ti-settings fs-7" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Settings"></i>
  </button>
        <div className="offcanvas offcanvas-end customizer" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" data-simplebar="init" aria-modal="true" role="dialog"><div className="simplebar-wrapper" style={{"margin": "0px"}}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{"right": "0px","bottom": "0px"}}><div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content" style={{"height": "100%","overflow":"hidden scroll"}}><div className="simplebar-content" style={{"padding": "0px"}}>
    <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
      <h4 className="offcanvas-title fw-semibold" id="offcanvasExampleLabel">Settings</h4>
      <button onClick={()=>closemodal()}  type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div className="offcanvas-body p-2">
      <div className="theme-option pb-2">
        <h6 className="fw-semibold fs-2 mb-2">Fonts</h6>
        <div className="d-flex align-items-center gap-3 my-1">
          
<select className="form-select" value={style.fontsize} onChange={(e)=>changefont(e.target.value)}>
{['1px','2px','3px','4px','5px','6px','7px','8px','9px','10px','11px','12px','13px','14px','15px','16px','17px','18px','19px','20px'].map((e,index)=>{

return <option key={index} defaultValue={style.fontsize==e ? e : ''} value={e}>{e}</option>;
})}
</select>
<a onClick={()=>wraptext(1)} href="#" className="rounded-2 p-2 customizer-box hover-img d-flex align-items-center gap-2">
            <i className={"ti ti-text-direction-ltr fs-6 "+(style.wrap.active==1 ? " text-primary" : "text-dark")}></i>
            <span className="text-dark">Wrap</span>
          </a>
          <a onClick={()=>wraptext(2)} href="#" className="rounded-2 p-2 customizer-box hover-img d-flex align-items-center gap-2">
            <i className={"ti ti-text-direction-ltr fs-6 "+(style.wrap.active==2 ? "text-primary" : "text-dark")}></i>
            <span className="text-dark">Nowrap</span>
          </a>
        </div>
      </div>
      <div className="theme-direction pb-4">
        <h6 className="fw-semibold fs-2 mb-2">Hide column</h6>
        <div className="d-flex flex-wrap gap-6">
                  {headers.map((i,v)=>{
                    v=v+1;
                   
                    if(i.classList.length==2 && i.classList[1]=='cost')
                    return false;
                    return  <div key={v}>
                      <input onChange={(e)=>hidecolumn(v,e.target.value)} type="checkbox" className="btn-check" id={`btn-check-${v}`} value={`${style[v] ??''}`} checked={`${(style[v] && style[v]=='none !important' ? 'checked' : '')}`} autoComplete="off"/>
                      <label className="btn btn-outline-info font-medium rounded-pill fs-1 p-1" htmlFor={`btn-check-${v}`}>{i.innerText}</label>
                    </div>;
                  })}
        </div>
      </div>
    </div>
  </div></div></div></div><div className="simplebar-placeholder" style={{"width": "auto","height": "1173px"}}></div></div><div className="simplebar-track simplebar-horizontal" style={{"visibility": "hidden"}}><div className="simplebar-scrollbar" style={{"width": "0px", "display": "none"}}></div></div><div className="simplebar-track simplebar-vertical" style={{"visibility": "visible"}}><div className="simplebar-scrollbar" style={{"height": "56px","transform": "translate3d(0px, 0px, 0px)","display": "block"}}></div></div></div>
        </>

    )

}

export default Style;