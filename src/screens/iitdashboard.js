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
function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
   let filtered=[];
const ITDashboard =() =>{
    const [d,sd]=useState([]); const [d2,gd]=useState([]);
     const [profilebar,setprofilebar] =useState({status:false,email:''});
    const [sortDown, setSortDown] = useState(true); 
    const [emailstatusdata,setemail]=useState([]);
    const [callstatusdata,setcall]=useState([]);
    const [showcurrencytab,setcurrency]=useState(false);
    const [showeditmodal, updateeditmodal] = useState({state:false,data:{}}); 
    const [opensendmailbox, setsendmailbox] = useState(false);
    const [opendupesendmailbox, setdupesendmailbox] = useState(false);
    const [opencronbox, setcronbox] = useState(false);
    const countries=useRef([]); 
    const processing =useRef(false);
    const months=useRef([]); 
    const platform =useRef('it');
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

const changedata =  useCallback ( (data) =>{
  sd(data);
  gd(data);
})
   const loaddata =  useCallback  ( async (formdata) =>
    {
      let abortc= new AbortController();
      let {signal}=abortc;
    if(processing.current)
    {
      abortc.abort();
    }
    processing.current=true;
     let datas={};
        document.querySelector('.ti-refresh').classList.add('rotate');document.querySelector('.body-wrapper1').classList.add('loader');
        data = await Fetchdata.fetchitdata(formdata,signal).then(response=>{return response;}).finally(()=>{document.querySelector('.ti-refresh').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');});
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
       dispatch(userprofileupdate(data.length));
        document.querySelector('table').classList.add("table","table-bordered","table-hover");
    });
   useEffect(()=>{loaddata(formdata);},[]);
   const showmailbox = () =>{
    setsendmailbox(true);
  }
  const showdupemailbox = () =>{
    setdupesendmailbox(true);
  }
  const showcronbox = () =>{
    setcronbox(true);
  }
  const closecronbox = () =>{
    setcronbox(false);
  }
  const closeemailsendbox = () =>{
    setsendmailbox(false);
  }
  const closedupeemailsendbox = () =>{
    setdupesendmailbox(false);
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
    console.log(sv,'check');
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
       // console.log(e.target.childNodes[0]);
    document.querySelector('.cell-name').value=document.querySelectorAll('.custom-table table thead tr th')[ni].querySelector('.headers').innerText;
    document.querySelector('.cell-value').value=(i=='11' && e.target.tagName=='TD'  ? e.target.getElementsByTagName('span')[0].innerHTML : (i=='2' && e.target.tagName=='TD' ? e.target.getElementsByTagName('a')[0].innerHTML : e.target.innerHTML));
    }
    else if(e.detail==2 && i=='11')
    {
      console.log(e.target);
      showprofilesidebar(e,e.target.getElementsByTagName('span')[0].innerHTML);
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
function sortdata(index=0)
{
  console.log(index);
    const copy = [...d];
if(sortDown)
{
copy.sort((a, b) =>  -((typeof(a[index])=='number' ? a[index] : a[index].trim()) > (typeof(b[index])=='number' ? b[index] : b[index].trim()))); 
}
else
{
    copy.sort((a, b) =>  -((typeof(a[index])=='number' ? a[index] : a[index].trim()) < (typeof(b[index])=='number' ? b[index] : b[index].trim())));

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
},[d]);
const showcurrency = useCallback(()=>
{
   setcurrency((prev)=>(prev ? false : true));
},[showcurrencytab]);
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
   setemail(e.target.value)
   filterdata(23,e.target.value.toString())
  }

  const handlecallchange = (e) =>{
    setcall(e.target.value);
    filterdata(24,e.target.value.toString())
   }
   const showprofilesidebar = (i,v) =>{
    if(document.querySelector('i.profilefetch.show'))
    {
      document.querySelector('i.profilefetch.show').classList.replace('show','hide')
    }
    i.target.querySelector('i').classList.replace('hide','show')
   
    setprofilebar((prev)=>( {...prev,status:true,email:v} ));
   }
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
 
<div className={" custom-table "}>
{showeditmodal.state==true ? <Editmodal show={showeditmodal} fn={editinfo}></Editmodal> : <></> }
    <Commentmodal/>
    <Style></Style>
    <Header platform={platform} changedata={changedata}  except={true} alldata={d} showmailbox={showmailbox} showdupemailbox={showdupemailbox} showcronbox={showcronbox}  clearfilters={clearfilter} refreshdata={loaddata} formdatas={formdata} showcurrencies={showcurrency}></Header>
    {opensendmailbox ? <Emailbox page='it' platform={platform} alldata={d} changedata={changedata} closeemailsendbox={closeemailsendbox} emailsdata={d.slice(0, document.querySelector('#totalsending').value)} fn={closeemailsendbox}></Emailbox> : <></>}
    {opendupesendmailbox ? <Dupeemailprocess page='it' platform={platform} alldata={d} changedata={changedata} closedupeemailsendbox={closedupeemailsendbox} emailsdata={d} fn={closedupeemailsendbox}></Dupeemailprocess> : <></>}
    {opencronbox ? <Cronlist closecronbox={closecronbox}></Cronlist> : <></>}
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
        <tr> 

<th style={{  background: 'white', position: 'sticky', left: 0, zindex: 1 }}><div className="headers">APPLN.NO. <i className="ti ti-sort-ascending" onClick={()=>{sortdata(2)}}></i></div><input className="filter" onKeyUp={(e)=>filterdata(2,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">CONTACT PERSON<i className="ti ti-sort-ascending" onClick={()=>{sortdata(10)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(10,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">EMAIL ID<i className="ti ti-sort-ascending" onClick={()=>{sortdata(11)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(11,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Domain<i className="ti ti-sort-ascending" onClick={()=>{sortdata(12)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(12,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">PH. NO.<i className="ti ti-sort-ascending" onClick={()=>{sortdata(13)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(13,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">First Email Date<i className="ti ti-sort-ascending" onClick={()=>{sortdata(20)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(20,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">FollowUp date<i className="ti ti-sort-ascending" onClick={()=>{sortdata(21)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(21,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Next Follow Up<i className="ti ti-sort-ascending" onClick={()=>{sortdata(22)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(22,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Email Status<i className="ti ti-sort-ascending" onClick={()=>{sortdata(23)}}></i> </div>

<FormControl sx={{ m: 0, width: 100 }}>
    
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={emailstatusdata}
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
<th style={{  background: 'white' }}><div className="headers">Call Status<i className="ti ti-sort-ascending" onClick={()=>{sortdata(24)}}></i> </div>
<FormControl sx={{ m: 0, width: 100 }}>
    
        <Select
          labelId="call-name-label"
          id="call-name"
          multiple
          value={callstatusdata}
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
<th style={{  background: 'white' }}><div className="headers">Comment<i className="ti ti-sort-ascending" onClick={()=>{sortdata(25)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(25,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Sent on<i className="ti ti-sort-ascending" onClick={()=>{sortdata(56)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(56,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Cron Status<i className="ti ti-sort-ascending" onClick={()=>{sortdata(57)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(57,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Assigned<i className="ti ti-sort-ascending" onClick={()=>{sortdata(58)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(58,e.target.value)} type='text'></input></th>

        </tr>
      )}
      itemContent={(index, user) => (
        
        <>
<td onClick={(e)=>{pickvalue(e,1,0)}} className="column-value" style={{  }}>{user['w_id']}</td>
<td onClick={(e)=>{pickvalue(e,2,1)}} className="column-value" style={{  }}>{user['cp']}</td>
<td  onClick={(e)=>{pickvalue(e,4,3)}} className={`cursor-pointer text-primary column-value d-flex align-items-center ${(tablesetting.countred(user['email'],'email',d) ? 'red-dupe' : '')}`} style={{  }}><i class="ti ti-refresh rotate hide profilefetch"></i><span className="email-id">{user['email']}</span></td>
<td  onClick={(e)=>{pickvalue(e,5,4)}} className="column-value" style={{  }}>{user['domain']}</td>
<td  onClick={(e)=>{pickvalue(e,6,5)}} className="column-value" style={{  }}>{user['p_h_n']}</td>
<td  onClick={(e)=>{pickvalue(e,6,5)}} className="column-value" style={{  }}>{user['firstemail']}</td>
<td  onClick={(e)=>{pickvalue(e,11,9)}} className="column-value" style={{  }}>{user['followup']}</td>
<td  onClick={(e)=>{pickvalue(e,12,10)}} className="column-value" style={{  }}>{user['nextfollowup']}</td>
<td  onClick={(e)=>{pickvalue(e,7,6)}} className="column-value" style={{  }}>{emailstatus[user['emailtype']] ?? ''}</td>
<td  onClick={(e)=>{pickvalue(e,8,7)}} className="column-value" style={{  }}>{callstatus[user['calltype']] ?? ''}</td>
<td onClick={(e)=>{pickvalue(e,9,8)}} className="column-value" style={{  }} dangerouslySetInnerHTML={{__html: removeduplicate(user['comment'])}} />
<td  onClick={(e)=>{pickvalue(e,14,12)}} className="column-value" style={{  }}>{user['senton']}</td>
<td  onClick={(e)=>{pickvalue(e,15,13)}} className="column-value" style={{  }}>{user['crondate']}</td>
<td  onClick={(e)=>{pickvalue(e,15,13)}} className="column-value" style={{  }}>{user['assigned']}</td>

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

export default ITDashboard;