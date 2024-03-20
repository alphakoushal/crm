import React,{useState} from "react";
const Popup = ({popover}) =>{
    return (
      <div>
            <ul class="dropdown-menu show">
            {popover.value.split(',').map((item)=>{
              return (item.trim()!=='' && item.trim()!=='N/A' ? <li><a class="dropdown-item"><i class="ti ti-user text-muted me-1 fs-4"></i>{item} </a></li> : <></>)
            })}
                                          </ul>
    </div>
    )
}

export default Popup;