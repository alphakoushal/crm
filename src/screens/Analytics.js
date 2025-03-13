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
import Emailbox from "../component/modals/Emailprocess";
import Dupeemailprocess from "../component/modals/Dupeemailprocess";
import Cronlist from "../component/modals/cron-list";
import ResizableColumn2 from "../component/Resize-two";
import Dexie from 'dexie'
function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
   let filtered=[];
const Dashboard =() =>{
    const [d,sd]=useState([]); const [d2,gd]=useState([]);
    const [defaultdata,setdefaultdata]=useState({totalpages: [] , profilebar:{status:false,email:''},opencronbox:false,opendupesendmailbox:false,opensendmailbox:false,sortDown:true,showcurrencytab:false,countrydata:[],agentdupedata:[],dupedata:[],applicantstatusdata:[],cio:[],callstatus:[],emailstatus:[],agentgendata:[],gendata:[],monthdata:[]});
      const [columns, setColumns] = useState([{"width":110,"css":"","type":"","key":"First Name"},{"width":110,"css":"","type":"","key":"Last Name"},{"width":110,"css":"","type":"","key":"Firm Name"},{"width":110,"css":"","type":"","key":"Designation"},{"width":110,"css":"","type":"","key":"Field"},{"width":110,"css":"","type":"","key":"Phone"},{"width":110,"css":"","type":"","key":"Place"},{"width":110,"css":"","type":"","key":"Email ID"},{"width":110,"css":"","type":"","key":"Domain"},{"width":110,"css":"","type":"","key":"Linkedin"},{"width":110,"css":"","type":"","key":"First Email"},{"width":110,"css":"","type":"","key":"Second Email"},{"width":110,"css":"","type":"","key":"Third Email"},{"width":110,"css":"","type":"","key":"Fourth Email"}]);

      const handleResize = (index, width) => {
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          newColumns[index].width = width;
          return newColumns;
        });
      };
   const [showeditmodal, updateeditmodal] = useState({state:false,data:{}}); 
    const countries=useRef([]); 
    const offset=useRef({limit:0,page:0}); 
    const processing =useRef(false);
    const months=useRef([]); 
    const platform =useRef('analytics');
    const auth= JSON.parse(localStorage.getItem("user")); 
    const valued=useSelector((state)=>state.userdata.value);
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
"recordlimit":(auth.type=='1' ? 10000 : 0),
"posttype":"local-analytic-data",
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
const callpages = (e,type) =>{
  let sheet=document.querySelector('.sheet.active').getAttribute('id');
 let user=document.querySelector('#username'), pages=document.querySelector('#pages').value, recordlimit =document.querySelector('#recordlimit').value;
 user = user??{value:auth.userid}
 if (type=='limit')
 {

   loaddata({...formdata1,sheet:sheet,recordlimit:recordlimit,accounttype:(user.value=='All' ? 2 : 1 ),offset: 1,anuationuser_uniqueid: (user.value=='' ? auth.userid : user.value )});
 }
 else
 {
    loaddata({...formdata1,sheet:sheet,recordlimit:recordlimit,accounttype:1,offset: (pages=='' ? 1 : pages),anuationuser_uniqueid: (user.value=='' ? auth.userid : user.value )});
}
}
const calluser = (e,type) =>{
  let sheet=document.querySelector('.sheet.active').getAttribute('id');
  let user=document.querySelector('#username').value, recordlimit =document.querySelector('#recordlimit').value;

     loaddata({...formdata1,sheet:sheet,recordlimit:recordlimit,accounttype:(user=='All' ? 2 : 1),offset:1,anuationuser_uniqueid:(user=='' ? auth.userid : user)});

 }
   const loaddata =  useCallback  ( async (formdata,refreshmode='') =>
    {
      document.querySelector('.sheet.active').classList.remove('active');
      document.querySelector('#'+(formdata.sheet??'current')).classList.add('active');
      let abortc= new AbortController();
      let {signal}=abortc;
    processing.current=true;
     let datas={};
        document.querySelector('.ti-refresh').classList.add('rotate');document.querySelector('.body-wrapper1').classList.add('loader');
        data = await Fetchdata.Analyticdata(formdata,signal).then(response=>{return response;}).finally(()=>{document.querySelector('.ti-refresh').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');});
        if(data.data.success)
        {
          datas =data.data.data;
          processing.current=false;
          setdefaultdata((prev)=>({...prev,totalpages: new Array(data.data.totalpage).fill(0).map((_, index) => index + 1)}))
        }
        else
        {
          processing.current=false;datas=[];
        }

       sd(datas);
       gd(datas);
       dispatch(userprofileupdate(datas.length));
        document.querySelector('table').classList.add("table","table-bordered","table-hover");
      
    });
   useEffect(()=>{

    loaddata(formdata);
  },[]);
   const showmailbox = () =>{
   if(document.querySelector('#mailtypeaccount').value!='')
   {
    setdefaultdata((prev)=>({...prev,opensendmailbox:true}))
   }
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
    document.querySelector('.cell-value').innerHTML=(i=='11' && e.target.tagName=='TD'  ? e.target.getElementsByTagName('span')[0].innerHTML : (i=='2' && e.target.tagName=='TD' ? e.target.getElementsByTagName('a')[0].innerHTML : e.target.innerHTML));
    }
    else if(e.detail==2 && i=='11')
    {
      showprofilesidebar(e,e.target.getElementsByTagName('span')[0].innerHTML,e.target.parentNode.children[9].innerHTML);
      
    }
    else if(e.detail==2 && i=='25')
    {
        let formdata ={
            "publication_value": e.target.closest('tr').querySelectorAll('td')[1].innerText,
    "email": e.target.closest('tr').querySelectorAll('td')[12].innerText,
    "domain": e.target.closest('tr').querySelectorAll('td')[13].innerText,
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
  navigator.clipboard.writeText([...new Set(copy.map((item)=>{if(item[index]!='' && item[index]!=null){return  item[index]; } else { return false}}))].toString())
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
    setdefaultdata({totalpages:[],profilebar:{status:false,email:''},opencronbox:false,opendupesendmailbox:false,opensendmailbox:false,sortDown:true,showcurrencytab:false,countrydata:[],agentdupedata:[],dupedata:[],applicantstatusdata:[],cio:[],callstatus:[],emailstatus:[],agentgendata:[],gendata:[],monthdata:[]});
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
    {defaultdata.opensendmailbox ? <Emailbox page='ip' platform={platform} alldata={d} changedata={changedata} closeemailsendbox={closeemailsendbox} emailsdata={d.slice(0, document.querySelector('#totalsending').value)} fn={closeemailsendbox}></Emailbox> : <></>}
    {defaultdata.opendupesendmailbox ? <Dupeemailprocess page='ip' platform={platform} alldata={d} changedata={changedata} closedupeemailsendbox={closedupeemailsendbox} emailsdata={d} fn={closedupeemailsendbox}></Dupeemailprocess> : <></>}
    {defaultdata.opencronbox ? <Cronlist platform={platform} closecronbox={closecronbox}></Cronlist> : <></>}
    <div className="container-fluid bootstrap-table body-wrapper1">
        <div className="fixed-table-container fixed-height d-flex">
        <ul style={{'width': '100%','left': '0','zIndex':'9','background':'white'}} className="breadcrumb">
            <li className="col-2"> 
              <input disabled className="form-control cell-name"/>
            </li>
            <li className="col-10" >
              <pre style={{'height':'40px'}} className="form-control cell-value"></pre>
            </li>
          </ul>
        <Suspense fallback={<Loading />}>
        <TableVirtuoso 
      components={{className:"koushal"}}
      data={d}
      fixedHeaderContent={() => (
        <>
               <tr>
          <th></th>
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
<th><div  className="headers">Sr. no</div></th>
<th style={{  background: 'white', position: 'sticky', left: 0, zindex: 1  }}><div className="headers">Firstname <i className="ti ti-sort-ascending" onClick={()=>{sortdata(0)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(0,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Lastname <i className="ti ti-sort-ascending" onClick={()=>{sortdata(1)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(1,e.target.value)} type='text'></input></th>
<th style={{  background: 'white'}}><div className="headers">Firm name <i className="ti ti-sort-ascending" onClick={()=>{sortdata(2)}}></i></div><input className="filter" onKeyUp={(e)=>filterdata(2,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Designation <i className="ti ti-sort-ascending" onClick={()=>{sortdata(3)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(3,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Field <i className="ti ti-sort-ascending" onClick={()=>{sortdata(4)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(4,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Phone <i className="ti ti-sort-ascending" onClick={()=>{sortdata(5)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(5,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Place <i className="ti ti-sort-ascending" onClick={()=>{sortdata(6)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(6,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Email <i className="ti ti-sort-ascending" onClick={()=>{sortdata(7)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(7,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Domain <i className="ti ti-sort-ascending" onClick={()=>{sortdata(8)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(8,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Linkedin <i className="ti ti-sort-ascending" onClick={()=>{sortdata(9)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(9,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">First Email <i className="ti ti-sort-ascending" onClick={()=>{sortdata(10)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(10,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Second Email <i className="ti ti-sort-ascending" onClick={()=>{sortdata(11)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(11,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Third Email <i className="ti ti-sort-ascending" onClick={()=>{sortdata(12)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(12,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Fourth Email <i className="ti ti-sort-ascending" onClick={()=>{sortdata(13)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(13,e.target.value)} type='text'></input></th>
 
 </tr>
 </>
      )}
      itemContent={(index, user) => (
        
        <>
<td >{(offset.current.limit*(offset.current.page-1)) + (index+1)}</td>
<td onClick={(e)=>{pickvalue(e,0)}} className="column-value" style={{  }}>{user[0]}</td>
<td onClick={(e)=>{pickvalue(e,1)}} className="column-value" style={{  }}>{user[1]}</td>
<td onClick={(e)=>{pickvalue(e,2)}} className="column-value" style={{  }}>{user[2]}</td>
<td onClick={(e)=>{pickvalue(e,3)}} className="column-value" style={{  }}>{user[3]}</td>
<td onClick={(e)=>{pickvalue(e,4)}} className="column-value" style={{  }}>{user[4]}</td>
<td onClick={(e)=>{pickvalue(e,5)}} className="column-value" style={{  }}>{user[5]}</td>
<td onClick={(e)=>{pickvalue(e,6)}} className="column-value" style={{  }}>{user[6]}</td>
<td onClick={(e)=>{pickvalue(e,7)}} className="column-value" style={{  }}>{user[7]}</td>
<td onClick={(e)=>{pickvalue(e,8)}} className="column-value" style={{  }}>{user[8]}</td>
<td onClick={(e)=>{pickvalue(e,9)}} className="column-value" style={{  }}>{user[9]}</td>
<td onClick={(e)=>{pickvalue(e,10)}} className="column-value" style={{  }}>{user[10]}</td>
<td onClick={(e)=>{pickvalue(e,11)}} className="column-value" style={{  }}>{user[11]}</td>
<td onClick={(e)=>{pickvalue(e,12)}} className="column-value" style={{  }}>{user[12]}</td>
<td onClick={(e)=>{pickvalue(e,13)}} className="column-value" style={{  }}>{user[13]}</td>
</>
      )} 
      
    />
    </Suspense>
    <div className="footable-pagination-wrapper text-center fixed d-inline-grid"><div className="divider"><span id='current' className="active sheet" onClick={()=>loaddata({...formdata,'sheet':'current'})}>Current</span><span id='statussheet' className={`sheet`} onClick={()=>loaddata({...formdata,'sheet':'statussheet'})}>Status Sheet</span><span className={`sheet`} id='exhausted' onClick={()=>loaddata({...formdata,'sheet':'exhausted'})}>Exhausted</span><span className={`sheet`} id='converted' onClick={()=>loaddata({...formdata,'sheet':'converted'})}>Converted</span><span className={`sheet`} id='pipeline' onClick={()=>loaddata({...formdata,'sheet':'pipeline'})}>Pipeline</span><span className={`sheet`} id='dnc' onClick={()=>loaddata({...formdata,'sheet':'dnc'})}>Dnc</span></div><span className="label label-default"><span className="text-white">Total Filtered Record {valued}</span></span><div className="divider text-start d-flex">
    {
     <>
      <span>
      <select className="form-select bg-white height-28 padding-filter" id='recordlimit' onChange={(e)=>{callpages(e,'limit')}}> <option value=''> Limit</option>
     {
      [10,100,500,1000,2000,3000,5000,7000,10000].map((item,key)=> <option key={key} value={item}>{item}</option>)
     }
      </select></span>
      {
      (auth.type=='2') ?
    <span>
      <select className="form-select bg-white height-28 padding-filter" id='username' onChange={(e)=>{calluser(e,'username')}}><option value='All'>All User</option>
      {
     defaultvalue.usernames.map((item,key) => {
      return <option key={key} value={item.key} >{item.name}</option>; 
      })
      }
      </select></span>
      : <></>
}
      <span>
      <select className="form-select bg-white height-28 padding-filter" id='pages' onChange={(e)=>{callpages(e,'pages')}}><option value=''> Select page</option>
      {
      defaultdata.totalpages.map((item,key)=>{ return <option key={key} value={item} >{'Page '+item}</option>; })
      }
      </select></span>
    </>
}

</div></div>
    </div>
    </div>
    <Uploadsidebar/>
    {defaultdata.profilebar.status ? <Sidebarprofile closebar={closebar} type={defaultdata.profilebar.type} email={defaultdata.profilebar.email}/> : <></>}
</div>
</>
    )
}

export default Dashboard;