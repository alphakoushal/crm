import React,{useEffect, useMemo,useState,useRef,memo,Suspense,lazy,useCallback} from "react";
import Sidebar from "../component/Sidemenu";
import Header from "../component/Header";
import Fetchdata from "../services/fetchdata";
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch,useSelector } from "react-redux";
import { userprofileupdate } from "../reducers/Userdata";
import ErrorBoundary from "../component/Errorboundary";
import Uploadsidebar from "../component/Uploadsidebar";
import Commentmodal from "../component/modals/comments";
import Uploaddata from "../services/uploaddata";
import Style from "../component/style/style";
import Editmodal from "../component/modals/Editmodal";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Sidebarprofile from "../component/modals/Sidebarprofile";
function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
  let filtered=[];
const Analytic =() =>{
    const [d,sd]=useState([]); const [d2,gd]=useState([]);
     const [profilebar,setprofilebar] =useState({status:false,email:''});
    const [sortDown, setSortDown] = useState(true); 
    const [emailstatusdata,setemail]=useState([]);const [callstatusdata,setcall]=useState([]);
    const [showcurrencytab,setcurrency]=useState(false);
    const [showeditmodal, updateeditmodal] = useState({state:false,data:{}}); 
    //const ref=useRef(false); 
    const auth= JSON.parse(localStorage.getItem("user")); 
    const valued=useSelector((state)=>state.userdata.value);
    const dispatch=useDispatch();
    const Width =useRef(160);
 useEffect(()=>{
    clearfilter();
 },[])

    let data={}; 
    let formdata1={
        "type": "value",
"file_refresh": "comment",
"offset": "1",
"w_id": "",
"anuationuser_uniqueid":auth.userid,
"accounttype":auth.type,
"org":auth.org,
"email": "",
"domain": "",
"company": "", 
"phone": "",
"c_p_f":"", 
"applicant":"", 
"cio":"", 
"deadline":"" 
    }

let formdata =useMemo(()=>{return formdata1},[formdata1])
    async function loaddata(formdata)
    {
        document.querySelector('.ti-refresh').classList.add('rotate');document.querySelector('.body-wrapper1').classList.add('loader');
        data = await Fetchdata.Analyticdata(formdata).then(response=>{return response;}).finally(()=>{document.querySelector('.ti-refresh').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');});
        data =data.data.data;
       sd(data);
       gd(data);
       dispatch(userprofileupdate(data.length));
        document.querySelector('table').classList.add("table","table-bordered","table-hover");
    }
   useEffect(()=>{loaddata(formdata);},[]);

function returndata(collection,value,key)
{
    value=(value!='' && value !=null ? value.toString().toLowerCase(): '')
let t=-1;
    for(let i=0;i<collection.length;i++)
    {
        if(key==23 || key==24)
        {
            if(value==collection[i])
    {
       t= 0;
    } 
        }
        else
        {
           
    if(value.indexOf(collection[i])>-1)
    {
       t= 0;
       
    }
    }
}

    return t;
}
function filterdata(index,value)
{
let i=0;
   // let sel='';
    // if(typeof(value.value)=='array')
    // {
    //     for(let option of value.options)
    //     {
    //         sel +=(option.selected ? option.value+',' : '');
       
    //     }  
    // }
    //value=typeof(value.value)=='array' ? sel.slice(0,-1) : value;
let filters=document.querySelectorAll('.filter');

let obj={'key':index,'value':value};

if(filtered.length==0)
{
    if(value!='')
    {
    filtered.push(obj);

    }
}
else
{
const ind=filtered.findIndex((e)=>{ return e.key==index});
if(ind>-1)
{

    if(value=='')
    {
        filtered.splice(ind, 1);
    }
    else
    {
        filtered[ind].value= value;
    }
    
    
}
else
{
    if(value!='')
    {
    filtered.push(obj);

    }
}
}
let copy = d2;//[...d2];

filtered.forEach((e)=>{

    var sv=e.value; 
     
if(sv=='')
{
    copy=copy.filter((f)=>{return f[e.key].toLowerCase().indexOf('')>-1});

}
else
{
    sv=(sv!=='' ? sv.toLowerCase().split(',') : '');
    copy=copy.filter((f)=>{return returndata(sv,f[e.key],e.key)>-1;});
}
i++;
}) 
if(filtered.length==i){sd(copy);dispatch(userprofileupdate(copy.length));}
}
async function pickvalue(e,i)
{
    if(e.detail==1)
    {
        console.log(e.target.childNodes[0].data);
    document.querySelector('.cell-name').value=document.querySelectorAll('.custom-table table thead tr th')[i].querySelector('.headers').innerText;
    document.querySelector('.cell-value').value=e.target.innerHTML;
    }
    else 
    {
    
    }
}
async function editinfo(state,app='')
{
    if(state)
    {
const getdata=await Fetchdata.geteditdata({"publication_value":app,'type':"editdata"}).then((response)=>{return response});
updateeditmodal({state:state,data:getdata.data.data});
    }
    else
    {
        updateeditmodal({state:state,data:''});
    }

}
function pushdata(event,w)
{
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
}
function sortdata(index=0)
{
    const copy = [...d];
if(sortDown)
{
copy.sort((a, b) =>  -(a[index] > b[index])); 
}
else
{
    copy.sort((a, b) =>  -(a[index] < b[index]));

}
setSortDown((prev)=> !prev)
sd(copy);
}
const clearfilter =useCallback(()=>
{
    filtered=[]; 
    let d=document.querySelectorAll('.filter');
    setemail([]);setcall([]);
    d.forEach((e)=>{
        e.value='';
    })
    sd(d2);
    dispatch(userprofileupdate(d2.length));
},[showcurrencytab]);
const showcurrency = useCallback(()=>
{
   setcurrency((prev)=>(prev ? false : true));
},[showcurrencytab]);
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 5;


   const closebar = () =>{
    
    setprofilebar((prev)=>( {...prev,status:false,email:''} ));
    if(document.querySelector('i.profilefetch.show'))
    {
      document.querySelector('i.profilefetch.show').classList.replace('show','hide')
    }
   }
   const removeduplicate = (comment)=>{
   let comments=(comment!='' ? comment.split('=') : []);
   
   comments.shift();
   return comments.filter((c,i,a)=>{return (a.indexOf(c)==i && c!='')}).join('\r\n\r\n');
}
    return( 
<>
 
<div className={"body-wrapper1 custom-table "}>
    <Style></Style>

    <Header except={true} clearfilters={clearfilter} refreshdata={loaddata} formdatas={formdata} showcurrencies={showcurrency}></Header>
   
    <div className="container-fluid bootstrap-table">
        <div className="fixed-table-container fixed-height d-flex">
        <ul style={{'width': '100%','left': '0','zIndex':'9','background':'white'}} className="breadcrumb">
            <li className="col-2">
              <input disabled className="form-control cell-name"/>
            </li>
            <li className="col-10" >
              <textarea style={{'height':'40px'}} className="form-control cell-value"></textarea>
            </li>
          </ul>
        <Suspense fallback={<Loading />}>
    <TableVirtuoso 
      components={{className:"koushal"}}
      data={d}
      fixedHeaderContent={() => (
        <tr> 

<th style={{  background: 'white', position: 'sticky', left: 0, zindex: 1 }}><div className="headers">Firm name. <i className="ti ti-sort-ascending" onClick={()=>{sortdata(0)}}></i></div><input className="filter" onKeyUp={(e)=>filterdata(0,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Firstname <i className="ti ti-sort-ascending" onClick={()=>{sortdata(1)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(1,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Lastname <i className="ti ti-sort-ascending" onClick={()=>{sortdata(2)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(2,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Email <i className="ti ti-sort-ascending" onClick={()=>{sortdata(3)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(3,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Domain <i className="ti ti-sort-ascending" onClick={()=>{sortdata(4)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(4,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Phone <i className="ti ti-sort-ascending" onClick={()=>{sortdata(5)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(5,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Linkedin <i className="ti ti-sort-ascending" onClick={()=>{sortdata(6)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(6,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Designation <i className="ti ti-sort-ascending" onClick={()=>{sortdata(7)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(7,e.target.value)} type='text'></input></th>
 </tr>
      )}
      itemContent={(index, user) => (
        
        <>
<td onClick={(e)=>{pickvalue(e,0)}} className="column-value" style={{  }}>{user[0]}</td>
<td onClick={(e)=>{pickvalue(e,1)}} className="column-value" style={{  }}>{user[1]}</td>
<td onClick={(e)=>{pickvalue(e,2)}} className="column-value" style={{  }}>{user[2]}</td>
<td onClick={(e)=>{pickvalue(e,3)}} className="column-value" style={{  }}>{user[3]}</td>
<td onClick={(e)=>{pickvalue(e,4)}} className="column-value" style={{  }}>{user[4]}</td>
<td onClick={(e)=>{pickvalue(e,5)}} className="column-value" style={{  }}>{user[5]}</td>
<td onClick={(e)=>{pickvalue(e,6)}} className="column-value" style={{  }}>{user[6]}</td>
<td onClick={(e)=>{pickvalue(e,7)}} className="column-value" style={{  }}>{user[7]}</td>
</>
      )} 
      
    />
    </Suspense>
    <div className="footable-pagination-wrapper text-center fixed"><div className="divider"></div><span className="label label-default"><span className="text-white">Total Filtered Record {valued}</span></span></div>
    </div>
    </div>
    <Uploadsidebar/>
    {profilebar.status ? <Sidebarprofile closebar={closebar} email={profilebar.email}/> : <></>}
</div>
</>
    )
}

export default Analytic;