import React,{useState} from "react";
import { updatestyle } from "../../reducers/Style";
import { useDispatch,useSelector } from "react-redux";
function Style({st})
{
const dispatch= useDispatch();
const style =useSelector((state)=>state.crmstyle.value);
    function changefont(v)
{
    //cf(v);
    dispatch(updatestyle([v,'fontsize']));
}
function wraptext(v)
{
  dispatch(updatestyle([(v==1 ? {'style':'white-space:nowrap;overflow:hidden;width:100px;max-width:100px','active':v} : {style:'','active':v}),'wrap']));

}
    function showmodal()
    {
        document.querySelector('.customizer').classList.add('show');

    }
    function closemodal()
    {
        document.querySelector('.customizer').classList.remove('show');

    }
const styls="td{"+style.wrap.style+"}td,.headers,th,table input{font-size:"+style.fontsize+" !important} .small,.small input{width:60px;max-width:60px}";
    return(
        <>
        <style>
{styls}
</style>
<button onClick={()=>showmodal()} className="btn btn-primary p-3 rounded-circle d-flex align-items-center justify-content-center customizer-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
    <i className="ti ti-settings fs-7" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Settings"></i>
  </button>
        <div className="offcanvas offcanvas-end customizer" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" data-simplebar="init" aria-modal="true" role="dialog"><div className="simplebar-wrapper" style={{"margin": "0px"}}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{"right": "0px","bottom": "0px"}}><div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content" style={{"height": "100%","overflow":"hidden scroll"}}><div className="simplebar-content" style={{"padding": "0px"}}>
    <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
      <h4 className="offcanvas-title fw-semibold" id="offcanvasExampleLabel">Settings</h4>
      <button onClick={()=>closemodal()}  type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div className="offcanvas-body p-4">
      <div className="theme-option pb-4">
        <h6 className="fw-semibold fs-4 mb-1">Fonts</h6>
        <div className="d-flex align-items-center gap-3 my-3">
          
<select className="form-select" onChange={(e)=>changefont(e.target.value)}>
{['1px','2px','3px','4px','5px','6px','7px','8px','9px','10px'].map((e)=>{

return <option selected={style.fontsize==e ? true : false} value={e}>{e}</option>;
})}
</select>
          <a href="javascript:void(0)" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2 dark-theme text-dark">
            <i className="ti ti-moon fs-7 "></i>
            <span className="text-dark">Dark</span>
          </a>
        </div>
      </div>
      <div className="theme-direction pb-4">
        <h6 className="fw-semibold fs-4 mb-1">Content Wrap</h6>
        <div className="d-flex align-items-center gap-3 my-3">
          <a onClick={()=>wraptext(1)} href="#" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2">
            <i className={"ti ti-text-direction-ltr fs-6 "+(style.wrap.active==1 ? " text-primary" : "text-dark")}></i>
            <span className="text-dark">Wrap</span>
          </a>
          <a onClick={()=>wraptext(2)} href="#" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2">
            <i className={"ti ti-text-direction-ltr fs-6 "+(style.wrap.active==2 ? "text-primary" : "text-dark")}></i>
            <span className="text-dark">No wrap</span>
          </a>
        </div>
      </div>

    </div>
  </div></div></div></div><div className="simplebar-placeholder" style={{"width": "auto","height": "1173px"}}></div></div><div className="simplebar-track simplebar-horizontal" style={{"visibility": "hidden"}}><div className="simplebar-scrollbar" style={{"width": "0px", "display": "none"}}></div></div><div className="simplebar-track simplebar-vertical" style={{"visibility": "visible"}}><div className="simplebar-scrollbar" style={{"height": "56px","transform": "translate3d(0px, 0px, 0px)","display": "block"}}></div></div></div>
        </>

    )

}

export default Style;