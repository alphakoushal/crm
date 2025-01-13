import React,{useEffect, useMemo,useState,useRef,memo,Suspense,lazy,useCallback} from "react";
import Header from "../component/Header";
import Fetchdata from "../services/fetchdata";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch,useSelector } from "react-redux";
import { userprofileupdate } from "../reducers/Userdata";
import Uploadsidebar from "../component/Uploadsidebar";
import Commentmodal from "../component/modals/comments";
import Uploaddata from "../services/uploaddata";
import Style from "../component/style/style";
import Editmodal from "../component/modals/Editmodal";
import OutlinedInput from '@mui/material/OutlinedInput';
import { callstatus, emailstatus,costs,standard,tablesetting,defaultvalue} from '../constant/Constant.js';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Sidebarprofile from "../component/modals/Sidebarprofile";
import TransferEmailbox from "../component/modals/Transferunique.js";
import TransferDupeemailprocess from "../component/modals/Transferdupe.js";
import Pivotprocess from "../component/modals/Pivot.js";
import Cronlist from "../component/modals/cron-list";
import ResizableColumn2 from "../component/Resize-two";
function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
   let filtered=[];
const Freshdata =() =>{
    const [d,sd]=useState([]); const [d2,gd]=useState([]);
    const [defaultdata,setdefaultdata]=useState({profilebar:{status:false,email:''},opencronbox:false,opendupesendmailbox:false,opensendmailbox:false,sortDown:true,showcurrencytab:false,countrydata:[],agentdupedata:[],dupedata:[],applicantstatusdata:[],cio:[],callstatus:[],emailstatus:[],agentgendata:[],gendata:[],monthdata:[]});
      const [columns, setColumns] = useState([{"width":110,"css":"","type":"","key":"APPLN.NO."},{"width":110,"css":"","type":"","key":"Title"},{"width":110,"css":"","type":"select","key":"COUNTRY"},{"width":110,"css":"","type":"","key":"PRIOTITY DATE"},{"width":110,"css":"","type":"","key":"DEADLINE - 30 mth"},{"width":110,"css":"","type":"","key":"DEADLINE - 31 mth"},{"width":110,"css":"","type":"","key":"APPLICANT NAME"},{"width":110,"css":"","type":"","key":"Unique/Dupe"},{"width":110,"css":"","type":"","key":"Gen/Non Gen"},{"width":110,"css":"","type":"","key":"Applicant Status"},{"width":110,"css":"","type":"","key":"CONTACT INFO OF"},{"width":110,"css":"","type":"","key":"CONTACT PERSON"},{"width":110,"css":"","type":"","key":"EMAIL ID"},{"width":110,"css":"","type":"","key":"Domain"},{"width":110,"css":"","type":"","key":"PH. NO."},{"width":110,"css":"","type":"","key":"Pages"},{"width":110,"css":"","type":"","key":"Claim"},{"width":110,"css":"","type":"","key":"Priority"},{"width":110,"css":"","type":"","key":"Drawings"},{"width":110,"css":"","type":"","key":"ISR"},{"width":110,"css":"","type":"","key":"REF. NO."},{"width":110,"css":"","type":"","key":"First Email Date"},{"width":110,"css":"","type":"","key":"FollowUp date"},{"width":110,"css":"","type":"","key":"Next Follow Up"},{"width":110,"css":"","type":"","key":"Pct App Status"},{"width":110,"css":"","type":"","key":"Email Status"},{"width":110,"css":"","type":"","key":"Call Status"},{"width":110,"css":"","type":"","key":"Comment"},{"width":110,"css":"","type":"","key":"Agent name"},{"width":110,"css":"","type":"","key":"Agent Email Id"},{"width":110,"css":"","type":"","key":"Agent Domain"},{"width":110,"css":"","type":"","key":"Agent Phone"},{"width":110,"css":"","type":"","key":"Previous Email Status"},{"width":110,"css":"","type":"","key":"Company"},{"width":110,"css":"","type":"cost","key":"IN "},{"width":110,"css":"","type":"cost","key":"CA "},{"width":110,"css":"","type":"cost","key":"CN "},{"width":110,"css":"","type":"cost","key":"JP "},{"width":110,"css":"","type":"cost","key":"AU "},{"width":110,"css":"","type":"cost","key":"BR "},{"width":110,"css":"","type":"cost","key":"US "},{"width":110,"css":"","type":"cost","key":"KR "},{"width":110,"css":"","type":"cost","key":"EP "},{"width":110,"css":"","type":"cost","key":"RU "},{"width":110,"css":"","type":"cost","key":"MX "},{"width":110,"css":"","type":"cost","key":"MY "},{"width":110,"css":"","type":"cost","key":"PH "},{"width":110,"css":"","type":"cost","key":"TH "},{"width":110,"css":"","type":"cost","key":"ID "},{"width":110,"css":"","type":"cost","key":"NZ "},{"width":110,"css":"","type":"cost","key":"ZA "},{"width":110,"css":"","type":"cost","key":"VN "},{"width":110,"css":"","type":"cost","key":"SG "},{"width":110,"css":"","type":"cost","key":"CO "},{"width":110,"css":"","type":"","key":"Month"},{"width":110,"css":"","type":"","key":"Sent on"},{"width":110,"css":"","type":"","key":"Cron Status"},{"width":110,"css":"","type":"","key":"Assigned"},{"width":110,"css":"","type":"","key":"Agent Unique/Dupe"},{"width":110,"css":"","type":"","key":"Agent Gen/Non Gen"}]);
       const handleResize = (index, width) => {
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          newColumns[index].width = width;
          return newColumns;
        });
      };
   const [showeditmodal, updateeditmodal] = useState({state:false,data:{}}); 
    const countries=useRef([]); 
    const processing =useRef(false);
    const months=useRef([]); 
    const platform =useRef('anuation');
    const auth= JSON.parse(localStorage.getItem("user")); 
    const valued=useSelector((state)=>state.userdata.value);
    const pivotmodalstate =useSelector((state)=>state.crmstyle.pivot);
    const dispatch=useDispatch();
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
"posttype":"local-fresh-data",
"email": "",
"domain": "",
"platform":platform.current,
"company": "", 
"phone": "",
"c_p_f":"", 
"applicant":"", 
"cio":"", 
"deadline":"" 
    }

let formdata =useMemo(()=>{return formdata1},[formdata1])

const changedata =  useCallback ( (data,modal='') =>{
  sd(data);
  gd(data);
  if(modal=='editmodal'){
    updateeditmodal((prev)=>({...prev,state:false}));
  }
})
   const loaddata =  useCallback  ( async (formdata,refreshmode='') =>
    {
      let abortc= new AbortController();
      let {signal}=abortc;
    processing.current=true;
     let datas={};
        document.querySelector('.ti-refresh').classList.add('rotate');document.querySelector('.body-wrapper1').classList.add('loader');
        data = await Fetchdata.freshdata(formdata,signal).then(response=>{return response;}).finally(()=>{document.querySelector('.ti-refresh').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');});
        if(data.data.success)
        {
          datas =data.data.data;
          countries.current=data.data.country;
          months.current=data.data.monthdata;
          processing.current=false;
        }
        else
        {
          processing.current=false;
        }

       sd(datas);
       gd(datas);
       dispatch(userprofileupdate(datas.length));
        document.querySelector('table').classList.add("table","table-bordered","table-hover");
      
    });
   useEffect(()=>{loaddata(formdata);},[]);
   const showmailbox = () =>{
    
    setdefaultdata((prev)=>({...prev,opensendmailbox:true}))

  }
  const showdupemailbox = () =>{
    setdefaultdata((prev)=>({...prev,opendupesendmailbox:true}))
  }
  const showcronbox = () =>{
    setdefaultdata((prev)=>({...prev,opencronbox:true}))
  }
  const closecronbox = () =>{
    setdefaultdata((prev)=>({...prev,opencronbox:false}))
  }
  const closeemailsendbox = () =>{
    setdefaultdata((prev)=>({...prev,opensendmailbox:false}))
  }
  const closedupeemailsendbox = () =>{
    setdefaultdata((prev)=>({...prev,opendupesendmailbox:false}))
  }


function filterdata(index,value)
{
  let updateassignedcolumn = [];

let i=0;
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
    copy=copy.filter((f)=>{return tablesetting.returndata(sv,f[e.key],e.key)>-1;});
  }
  i++;
}) 
if(filtered.length==i){sd(copy);dispatch(userprofileupdate(copy.length));}

}
async function pickvalue(e,i,ni)
{
  e.stopPropagation();
    if(e.detail==1)
    {
    document.querySelector('.cell-name').value=document.querySelectorAll('.custom-table table thead tr+tr th')[ni].querySelector('.headers').innerText;
    document.querySelector('.cell-value').value=(i=='11' && e.target.tagName=='TD'  ? e.target.getElementsByTagName('span')[0].innerHTML : (i=='2' && e.target.tagName=='TD' ? e.target.getElementsByTagName('a')[0].innerHTML : e.target.innerHTML));
    }
    else if(e.detail==2 && i=='11')
    {
      showprofilesidebar(e,e.target.getElementsByTagName('span')[0].innerHTML,e.target.parentNode.children[8].innerHTML);
      
    }
    else if(e.detail==2 && i=='25')
    {
        let formdata ={
            "publication_value": e.target.closest('tr').querySelectorAll('td')[0].innerText,
    "email": e.target.closest('tr').querySelectorAll('td')[10].innerText,
    "domain": e.target.closest('tr').querySelectorAll('td')[11].innerText,
    "type": "3"
        }
        const fetchcomment=await Uploaddata.fetchcomment(formdata).then(response=>{return response});
       document.querySelector('#add-contact').classList.add('show');
       document.querySelector('#add-contact').style.display="block";
       document.querySelector('#add-contact .modal-body').innerHTML=fetchcomment.data;
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
function sortdata(event,index=0)
{
    const copy = [...d];
    if(event.detail==1){
if(defaultdata.sortDown)
{
copy.sort((a, b) =>  -((typeof(a[index])=='number' ? a[index] : a[index].trim()) > (typeof(b[index])=='number' ? b[index] : b[index].trim()))); 
}
else
{
    copy.sort((a, b) =>  -((typeof(a[index])=='number' ? a[index] : a[index].trim()) < (typeof(b[index])=='number' ? b[index] : b[index].trim())));

}
setdefaultdata((prev)=> ({...prev,sortDown:!prev.sortDown}))
sd(copy);
}
else
{
  navigator.clipboard.writeText([...new Set(copy.map((item)=>{if(item[index]!='' && item[index]!=null){return  "'"+item[index]+"'"; } else { return false}}))].toString())
}
}
const clearfilter =useCallback(()=>
{
    filtered=[]; 
    let d=document.querySelectorAll('.filter');
    d.forEach((e)=>{
        e.value='';
    })
    sd(d2);
    setdefaultdata({profilebar:{status:false,email:''},opencronbox:false,opendupesendmailbox:false,opensendmailbox:false,sortDown:true,showcurrencytab:false,countrydata:[],agentdupedata:[],dupedata:[],applicantstatusdata:[],cio:[],callstatus:[],emailstatus:[],agentgendata:[],gendata:[],monthdata:[]});
    dispatch(userprofileupdate(d2.length));
},[d]);
const showcurrency = useCallback(()=>
{
  setdefaultdata((prev)=>({...prev,showcurrencytab:(prev.showcurrencytab ? false : true)}))
},[defaultdata.showcurrencytab]);
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 50,
    },
  },
};
  
  const handlechange = (e) =>{
   //setemail(e.target.value)
   setdefaultdata((prev)=>({...prev,emailstatus:e.target.value}))
   filterdata(23,e.target.value.toString())
  }
  const handlecio = (e) =>{
    setdefaultdata((prev)=>({...prev,cio:e.target.value}))
    //setcio(e.target.value);
    filterdata(9,e.target.value.toString())
   }
  const handleapplicant = (e) =>{
   // setapplicant(e.target.value)
    setdefaultdata((prev)=>({...prev,applicantstatusdata:e.target.value}))
    filterdata(8,e.target.value.toString())
   }
   const handledupe = (e) =>{
    //setdupe(e.target.value)
    setdefaultdata((prev)=>({...prev,dupedata:e.target.value}))
    filterdata(53,e.target.value.toString())
   }
   const handleagentdupe = (e) =>{
    setdefaultdata((prev)=>({...prev,agentdupedata:e.target.value}))
    filterdata(61,e.target.value.toString())
   }
   const handlecountry = (e) =>{
if(e.target.value.includes('all'))
{
    setdefaultdata((prev)=>({...prev,countrydata:e.target.value}))
    filterdata(3,countries.current.toString())
}
else if(e.target.value.includes('unall'))
{
    //setcountry([])
    setdefaultdata((prev)=>({...prev,countrydata:[]}))
    filterdata(3,[].toString())
}
else
{
  // setcountry(e.target.value)
  setdefaultdata((prev)=>({...prev,countrydata:e.target.value}))
    filterdata(3,e.target.value.toString())
}

   }
   const handlemonthdata = (e) =>{
    if(e.target.value.includes('all'))
    {
        setdefaultdata((prev)=>({...prev,monthdata:e.target.value}))
        filterdata(55,months.current.toString())
    }
    else if(e.target.value.includes('unall'))
    {
      setdefaultdata((prev)=>({...prev,monthdata:[]}))
        filterdata(55,[].toString())
    }
    else
    {
    //  setmonth(e.target.value)
      setdefaultdata((prev)=>({...prev,monthdata:e.target.value}))
        filterdata(55,e.target.value.toString())
    }
    
       }
   const handlegen = (e) =>{
    //setgen(e.target.value)
    setdefaultdata((prev)=>({...prev,gendata:e.target.value}))
    filterdata(54,e.target.value.toString())
   }
   const handleagentgen = (e) =>{
    setdefaultdata((prev)=>({...prev,agentgendata:e.target.value}))
    filterdata(62,e.target.value.toString())
   }
  const handlecallchange = (e) =>{
   // setcall(e.target.value);
    setdefaultdata((prev)=>({...prev,callstatus:e.target.value}))
    filterdata(24,e.target.value.toString())
   }
   const showprofilesidebar = (i,v,v1) =>{
    if(document.querySelector('i.profilefetch.show'))
    {
      document.querySelector('i.profilefetch.show').classList.replace('show','hide')
    }
    i.target.querySelector('i').classList.replace('hide','show')
   
    //setprofilebar((prev)=>( {...prev,status:true,email:v} ));
    setdefaultdata((prev)=>({...prev,profilebar:{status:true,email:v,type:v1}}))
   }
   const closebar = () =>{
    setdefaultdata((prev)=>({...prev,profilebar:{status:false,email:''}}))

    //setprofilebar((prev)=>( {...prev,status:false,email:''} ));
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
function getColumnLetter(columnNumber) {
  let dividend = columnNumber;
  let columnName = '';
  let modulo;

  while (dividend > 0) {
      modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnName;
}
    return( 
<>
 
<div className={" custom-table "}>
{showeditmodal.state==true ? <Editmodal alldata={d2} changedata={changedata} show={showeditmodal} fn={editinfo}></Editmodal> : <></> }
    <Commentmodal/>
    <Style></Style>
    <Header platform={platform} changedata={changedata}  except={true} completedata={d2} alldata={d} showmailbox={showmailbox} showdupemailbox={showdupemailbox} showcronbox={showcronbox}  clearfilters={clearfilter} refreshdata={loaddata} formdatas={formdata} showcurrencies={showcurrency}></Header>
    {defaultdata.opensendmailbox ? <TransferEmailbox page='freshdata' platform={platform} alldata={d} changedata={changedata} closeemailsendbox={closeemailsendbox} emailsdata={d.slice(0, document.querySelector('#totalsending').value)} fn={closeemailsendbox}></TransferEmailbox> : <></>}
    {defaultdata.opendupesendmailbox ? <TransferDupeemailprocess page='freshdata' platform={platform} alldata={d} changedata={changedata} closedupeemailsendbox={closedupeemailsendbox} emailsdata={d} fn={closedupeemailsendbox}></TransferDupeemailprocess> : <></>}
    {pivotmodalstate ? <Pivotprocess column='63' page='freshdata' platform={platform} alldata={d} ></Pivotprocess> : <></>}
    {defaultdata.opencronbox ? <Cronlist closecronbox={closecronbox}></Cronlist> : <></>}
    <div className="container-fluid bootstrap-table body-wrapper1">
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
        <>
         <tr>
          {columns.map((column, index) => (
                     <ResizableColumn2
                     key={column.key}
                     width={column.width}
                     type={column.type}
                     costtab={defaultdata.showcurrencytab}
                     getColumnLetter={getColumnLetter}
                     index ={index}
                     onResize={width => handleResize(index, width)}
                   >
                     {column.key}
                   </ResizableColumn2>
          ))}
        </tr>
        <tr> 

 <th style={{background: 'white', position: 'sticky', left: 0, zindex: 1 }}><div  className="headers">APPLN.NO. <i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,60)}}></i></div><input className="filter" onKeyUp={(e)=>filterdata(2,e.target.value)} type='text'></input></th>
<th  style={{  background: 'white' }}><div  className="headers">Title <i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,1)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(1,e.target.value)} type='text'></input></th>
<th  style={{  background: 'white' }}><div className="headers">COUNTRY <i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,3)}}></i> </div>
<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="up-multiple-name-label"
          id="up-multiple-name"
          value={defaultdata.countrydata}
          multiple
          onChange={handlecountry}
          label="Age"
        >
           <MenuItem
              key='all'
              value='all'
            >
             Check All
            </MenuItem>
            <MenuItem
              key='unall'
              value='unall'
            >
             Uncheck All
            </MenuItem>
          {countries.current.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
</th>
<th style={{  background: 'white' }}><div className="headers">PRIOTITY DATE <i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,4)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(4,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">DEADLINE - 30 mth<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,5)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(5,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">DEADLINE - 31 mth<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,6)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(6,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">APPLICANT NAME<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,7)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(7,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Unique/Dupe<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,53)}}></i> </div>

<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="up-multiple-name-label"
          id="up-multiple-name"
          value={defaultdata.dupedata}
          multiple
          onChange={handledupe}
          label="Age"
        >
          
          {defaultvalue.dupestatus.map((name) => (
            <MenuItem
              key={name.key}
              value={name.key}
            >
              {name.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

</th>
<th style={{  background: 'white' }}><div className="headers">Gen/Non Gen<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,53)}}></i> </div>

<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={defaultdata.gendata}
          multiple
          onChange={handlegen}
        >
          {defaultvalue.genstatus.map((name) => (
            <MenuItem
              key={name.key}
              value={name.key}
            >
              {name.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

</th>
<th style={{  background: 'white' }}><div className="headers">Applicant Status<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,8)}}></i> </div>

<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={defaultdata.applicantstatusdata}
          onChange={handleapplicant}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {defaultvalue.applicantstatus.map((name) => (
            <MenuItem
              key={name.key}
              value={name.key}
            >
              {name.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

</th>
<th style={{  background: 'white' }}><div className="headers">CONTACT INFO OF<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,9)}}></i> </div>

<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={defaultdata.cio}
          onChange={handlecio}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {defaultvalue.contactinfostatus.map((name) => (
            <MenuItem
              key={name.key}
              value={name.key}
            >
              {name.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

</th><th style={{  background: 'white' }}><div className="headers">CONTACT PERSON<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,10)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(10,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">EMAIL ID<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,11)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(11,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Domain<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,12)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(12,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">PH. NO.<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,13)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(13,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">Pages<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,14)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(14,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">Claim<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,15)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(15,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">Priority<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,16)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(16,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">Drawings<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,17)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(17,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">ISR<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,18)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(18,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">REF. NO.<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,19)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(19,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">First Email Date<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,20)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(20,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">FollowUp date<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,21)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(21,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Next Follow Up<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,22)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(22,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Previous Status<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,52)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(52,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Email Status<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,23)}}></i> </div>

<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={defaultdata.emailstatus}
          onChange={handlechange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {defaultvalue.names.map((name) => (
            <MenuItem
              key={name.key}
              value={name.key}
            >
              {name.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

</th>
<th style={{  background: 'white' }}><div className="headers">Call Status<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,24)}}></i> </div>
<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="call-name-label"
          id="call-name"
          multiple
          value={defaultdata.callstatus}
          onChange={handlecallchange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {defaultvalue.callnames.map((name) => (
            <MenuItem
              key={name.key}
              value={name.key}
            >
              {name.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
</th>
<th style={{  background: 'white' }}><div className="headers">Comment<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,25)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(25,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Agent name<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,26)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(26,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Agent Email Id<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,27)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(27,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Agent Domain<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,28)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(28,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Agent Phone<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,29)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(29,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Previous Email Status<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,30)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(30,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Company<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,31)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(31,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">IN<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,32)}}></i> </div><input className="filter"  onKeyUp={(e)=>filterdata(32,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">CA<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,33)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(33,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">CN<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,34)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(34,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">JP<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,35)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(35,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">AU<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,36)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(36,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">BR<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,37)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(37,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">US<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,38)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(38,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">KR<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,39)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(39,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">EP<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,40)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(40,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">RU<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,41)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(41,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">MX<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,42)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(42,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">MY<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,43)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(43,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">PH<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,44)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(44,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">TH<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,45)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(45,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">ID<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,46)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(46,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">NZ<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,47)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(47,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">ZA<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,48)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(48,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">VN<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,49)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(49,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">SG<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,50)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(50,e.target.value)} type='text'></input></th>
<th className={(defaultdata.showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers cost">CO<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,51)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(51,e.target.value)} type='text'></input></th>
<th  style={{  background: 'white' }}><div className="headers">Month <i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,55)}}></i> </div>
<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="up-multiple-name-label"
          id="up-multiple-name"
          value={defaultdata.monthdata}
          multiple
          onChange={handlemonthdata}
          label="Age"
        >
           <MenuItem
              key='all'
              value='all'
            >
             Check All
            </MenuItem>
            <MenuItem
              key='unall'
              value='unall'
            >
             Uncheck All
            </MenuItem>
          {months.current.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
</th>
<th style={{  background: 'white' }}><div className="headers">Sent on<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,56)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(56,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Cron Status<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,57)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(57,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Prev Assigned<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,58)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(58,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">New Assigned<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,63)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(63,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Agent Unique/Dupe<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,61)}}></i> </div>

<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="up-multiple-name-label"
          id="up-multiple-name"
          value={defaultdata.agentdupedata}
          multiple
          onChange={handleagentdupe}
          label="Age"
        >
          
          {defaultvalue.dupestatus.map((name) => (
            <MenuItem
              key={name.key}
              value={name.key}
            >
              {name.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

</th>
<th style={{  background: 'white' }}><div className="headers">Agent Gen/Non Gen<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,62)}}></i> </div>

<FormControl sx={{ m: 0, width: '100%' }}>
    
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={defaultdata.agentgendata}
          multiple
          onChange={handleagentgen}
        >
          {defaultvalue.genstatus.map((name) => (
            <MenuItem
              key={name.key}
              value={name.key}
            >
              {name.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

</th>
<th style={{  background: 'white' }}><div className="headers">Assigned Value<i className="ti ti-sort-ascending" onClick={(e)=>{sortdata(e,64)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(64,e.target.value)} type='text'></input></th>

        </tr>
        </>
      )}
      itemContent={(index, user) => (
        <>
<td onClick={(e)=>{pickvalue(e,2,0)}} className="column-value" style={{ background:user[60], position: 'sticky', left: 0, zIndex: 1 }}><input className='appno' value={user[2]} onClick={(event)=>pushdata(event,user[2])} style={{'position':"absolute",'top':'18px','left':'0'}} type='checkbox'></input><a target="blank" href={"https://patentscope.wipo.int/search/en/detail.jsf?docId="+user[0]}>{user[2]}</a><i onClick={()=>{editinfo(true,user[2])}} style={{'position': 'absolute','top': '1px','right': '5px','background': '#5d87ff','width': '14px','height': '14px','display': 'flex','lineHeight': '14px','borderRadius': '50%','color': 'white','justifyContent': 'center'}} className="ti ti-edit"></i></td>
<td onClick={(e)=>{pickvalue(e,1,1)}} className="column-value" style={{  }}>{user[1]}</td>
<td onClick={(e)=>{pickvalue(e,3,2)}} className="column-value small" style={{  }}>{user[3]}</td>
<td onClick={(e)=>{pickvalue(e,4,3)}} className="column-value" style={{  }}>{user[4]}</td>
<td onClick={(e)=>{pickvalue(e,5,4)}} className="column-value" style={{  }}>{user[5]}</td>
<td onClick={(e)=>{pickvalue(e,6,5)}} className="column-value" style={{  }}>{user[6]}</td>
<td onClick={(e)=>{pickvalue(e,7,6)}} className="column-value" style={{  }}>{user[7]}</td>
<td onClick={(e)=>{pickvalue(e,53,7)}} className="column-value" style={{  }}>{user[53]}</td>
<td onClick={(e)=>{pickvalue(e,54,8)}} className="column-value" style={{  }}>{user[54]}</td>
<td onClick={(e)=>{pickvalue(e,8,9)}} className="column-value" style={{  }}>{user[8]}</td>
<td onClick={(e)=>{pickvalue(e,9,10)}} className="column-value" style={{  }}>{user[9]}</td> 
<td onClick={(e)=>{pickvalue(e,10,11)}} className="column-value" style={{  }}>{user[10]}</td>
<td  onClick={(e)=>{pickvalue(e,11,12)}} className={`cursor-pointer text-primary column-value align-items-center ${(tablesetting.countred(user[11],11,d) ? 'red-dupe' : '')}`} style={{  }}><i className="ti ti-refresh rotate hide profilefetch"></i><span className="email-id">{user[11]}</span></td>
<td  onClick={(e)=>{pickvalue(e,12,13)}} className="column-value" style={{  }}>{user[12]}</td>
<td  onClick={(e)=>{pickvalue(e,13,14)}} className="column-value" style={{  }}>{user[13]}</td>
<td  onClick={(e)=>{pickvalue(e,14,15)}} className="column-value small" style={{  }}>{user[14]}</td>
<td  onClick={(e)=>{pickvalue(e,15,16)}} className="column-value small" style={{  }}>{user[15]}</td>
<td  onClick={(e)=>{pickvalue(e,16,17)}} className="column-value small" style={{  }}>{user[16]}</td> 
<td  onClick={(e)=>{pickvalue(e,17,18)}} className="column-value small" style={{  }}>{user[17]}</td>
<td  onClick={(e)=>{pickvalue(e,18,19)}} className="column-value small" style={{  }}>{user[18]}</td> 
<td  onClick={(e)=>{pickvalue(e,19,20)}} className="column-value" style={{  }}>{user[19]}</td>
<td  onClick={(e)=>{pickvalue(e,20,21)}} className="column-value" style={{  }}>{user[20]}</td>
<td  onClick={(e)=>{pickvalue(e,21,22)}} className="column-value" style={{  }}>{user[21]}</td>
<td  onClick={(e)=>{pickvalue(e,22,23)}} className="column-value" style={{  }}>{user[22]}</td>
<td  onClick={(e)=>{pickvalue(e,23,24)}} className="column-value" style={{  }}>{user[52]}</td>
<td  onClick={(e)=>{pickvalue(e,23,25)}} className="column-value" style={{  }}>{emailstatus[user[23]] ?? ''}</td>
<td  onClick={(e)=>{pickvalue(e,24,26)}} className="column-value" style={{  }}>{callstatus[user[24]] ?? ''}</td>
<td onClick={(e)=>{pickvalue(e,25,27)}} className="column-value" style={{  }} dangerouslySetInnerHTML={{__html: removeduplicate(user[25])}} />
<td  onClick={(e)=>{pickvalue(e,26,28)}} className="column-value" style={{  }}>{user[26]}</td>
<td  onClick={(e)=>{pickvalue(e,27,29)}} className={`column-value ${(tablesetting.countred(user[27],27,d) ? 'red-dupe' : '')}`} style={{  }}>{user[27]}</td>
<td  onClick={(e)=>{pickvalue(e,28,30)}} className="column-value" style={{  }}>{user[28]}</td>
<td  onClick={(e)=>{pickvalue(e,29,31)}} className="column-value" style={{  }}>{user[29]}</td>
<td  onClick={(e)=>{pickvalue(e,30,32)}} className="column-value" style={{  }}>{user[30]}</td>
<td  onClick={(e)=>{pickvalue(e,31,33)}} className="column-value" style={{  }}>{user[31]}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,32,34)}}  style={{  }}>{costs.IN.apply({'appno':user[2],'c':'IN','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,33,35)}}  style={{  }}>{costs.CA.apply({'appno':user[2],'c':'CA','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,34,36)}}  style={{  }}>{costs.CN.apply({'appno':user[2],'c':'CN','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,35,37)}}  style={{  }}>{costs.JP.apply({'appno':user[2],'c':'JP','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,36,38)}}  style={{  }}>{costs.AU.apply({'appno':user[2],'c':'AU','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,37,39)}}  style={{  }}>{costs.BR.apply({'appno':user[2],'c':'BR','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,38,40)}}  style={{  }}>{costs.US.apply({'appno':user[2],'c':'US','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,39,41)}}  style={{  }}>{costs.KR.apply({'appno':user[2],'c':'KR','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,40,42)}}  style={{  }}>{costs.EP.apply({'appno':user[2],'c':'EP','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,41,43)}}  style={{  }}>{costs.RU.apply({'appno':user[2],'c':'RU','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,42,44)}}  style={{  }}>{costs.MX.apply({'appno':user[2],'c':'MX','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,43,45)}}  style={{  }}>{costs.MY.apply({'appno':user[2],'c':'MY','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,44,46)}}  style={{  }}>{costs.PH.apply({'appno':user[2],'c':'PH','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,45,47)}}  style={{  }}>{costs.TH.apply({'appno':user[2],'c':'TH','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,46,48)}}  style={{  }}>{costs.ID.apply({'appno':user[2],'c':'ID','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,47,49)}}  style={{  }}>{costs.NZ.apply({'appno':user[2],'c':'NZ','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,48,50)}}  style={{  }}>{costs.ZA.apply({'appno':user[2],'c':'ZA','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,49,51)}}  style={{  }}>{costs.VN.apply({'appno':user[2],'c':'VN','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,50,52)}}  style={{  }}>{costs.SG.apply({'appno':user[2],'c':'SG','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td className={"column-value"+(defaultdata.showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,51,53)}}  style={{  }}>{costs.CO.apply({'appno':user[2],'c':'CO','as':user[8],'ci':user[9],'pages':user[14],'claim':user[15],'priority':user[16],'co':user[3],'isa':user[18],'standard':standard})}</td>
<td  onClick={(e)=>{pickvalue(e,52,54)}} className="column-value" style={{  }}>{user[55]}</td>
<td  onClick={(e)=>{pickvalue(e,53,55)}} className="column-value" style={{  }}>{user[56]}</td>
<td  onClick={(e)=>{pickvalue(e,54,56)}} className="column-value" style={{  }}>{user[57]}</td>
<td  onClick={(e)=>{pickvalue(e,55,57)}} className="column-value" style={{  }}>{user[58]}</td>
<td  onClick={(e)=>{pickvalue(e,56,58)}} className="column-value" style={{  }}>{user[63]}</td>
<td  onClick={(e)=>{pickvalue(e,57,59)}} className="column-value" style={{  }}>{user[61]}</td>
<td  onClick={(e)=>{pickvalue(e,58,60)}} className="column-value" style={{  }}>{user[62]}</td>
<td  onClick={(e)=>{pickvalue(e,59,61)}} className="column-value" style={{  }}>{user[64]}</td>

        </>
      )} 
      
    />
    </Suspense>
    <div className="footable-pagination-wrapper text-center fixed"><span className="label label-default"><span className="text-white">Total Filtered Record {valued}</span></span></div>
    </div>
    </div>
    <Uploadsidebar/>
    {defaultdata.profilebar.status ? <Sidebarprofile closebar={closebar} type={defaultdata.profilebar.type} email={defaultdata.profilebar.email}/> : <></>}
</div>
</>
    )
}

export default Freshdata;