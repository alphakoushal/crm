import React,{useEffect, useMemo,useState,useRef,memo,Suspense,lazy,useCallback} from "react";
import Sidebar from "../component/Sidemenu";
import Header from "../component/Header";
import Fetchdata from "../services/fetchdata";
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch,useSelector } from "react-redux";
import { userprofileupdate } from "../reducers/Userdata";
import Uploadsidebar from "../component/Uploadsidebar";
import Commentmodal from "../component/modals/comments";
import Uploaddata from "../services/uploaddata";
import Style from "../component/style/style";
import Editmodal from "../component/modals/Editmodal";
import OutlinedInput from '@mui/material/OutlinedInput';
import { callstatus, emailstatus} from '../constant/Constant.js';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Sidebarprofile from "../component/modals/Sidebarprofile";
import { constant } from "lodash";
function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
   let filtered=[];
const Dashboard =() =>{
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
        data = await Fetchdata.fetchdata(formdata).then(response=>{return response;}).finally(()=>{document.querySelector('.ti-refresh').classList.remove('rotate');document.querySelector('.body-wrapper1').classList.remove('loader');});
        data =data.data.data;
       sd(data);
       gd(data);
       dispatch(userprofileupdate(data.length));
        document.querySelector('table').classList.add("table","table-bordered","table-hover");
    }
   useEffect(()=>{loaddata(formdata);},[]);

function returndata(collection,value,key)
{
  value=(value!='' && value !=null ? value.toLowerCase(): '');
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
    console.log(sv);
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
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 50,
    },
  },
};
const names = [
{'key':'1','value':'Pipeline'},
{'key':'2','value':'Failed'},
{'key':'3','value':'Rejection'},
{'key':'4','value':'Reciprocity'},
{'key':'5','value':'Ooo'},
{'key':'6','value':'Converted'},
{'key':'7','value':'Response'},
{'key':'8','value':'Dnc'},
{'key':'9','value':'Dupe'},
{'key':'10','value':'Exhausted'},
  ];
  const callnames = [{'key':'1','value':'Ni'},
  {'key':'2','value':'Lb'},
  {'key':'3','value':'Voice mail'},
  {'key':'4','value':'Invalid no'},
  {'key':'5','value':'Email sent'},
  {'key':'6','value':'Cb'},
  {'key':'7','value':'Ringing'},
  {'key':'8','value':'Dnc'}
    ];
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
 
<div className={"body-wrapper1 custom-table "}>
{showeditmodal.state==true ? <Editmodal show={showeditmodal} fn={editinfo}></Editmodal> : <></> }
    <Commentmodal/>
    <Style></Style>
    <Header clearfilters={clearfilter} refreshdata={loaddata} formdatas={formdata} showcurrencies={showcurrency}></Header>
   
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

 <th style={{  background: 'white', position: 'sticky', left: 0, zindex: 1 }}><div className="headers">APPLN.NO. <i className="ti ti-sort-ascending" onClick={()=>{sortdata(2)}}></i></div><input className="filter" onKeyUp={(e)=>filterdata(2,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Title <i className="ti ti-sort-ascending" onClick={()=>{sortdata(1)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(1,e.target.value)} type='text'></input></th>
<th className='small' style={{  background: 'white' }}><div className="headers">COUNTRY <i className="ti ti-sort-ascending" onClick={()=>{sortdata(3)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(3,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">PRIOTITY DATE <i className="ti ti-sort-ascending" onClick={()=>{sortdata(4)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(4,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">DEADLINE - 30 mth<i className="ti ti-sort-ascending" onClick={()=>{sortdata(5)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(5,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">DEADLINE - 31 mth<i className="ti ti-sort-ascending" onClick={()=>{sortdata(6)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(6,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">APPLICANT NAME<i className="ti ti-sort-ascending" onClick={()=>{sortdata(7)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(7,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Applicant Status<i className="ti ti-sort-ascending" onClick={()=>{sortdata(8)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(8,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">CONTACT INFO OF<i className="ti ti-sort-ascending" onClick={()=>{sortdata(9)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(9,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">CONTACT PERSON<i className="ti ti-sort-ascending" onClick={()=>{sortdata(10)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(10,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">EMAIL ID<i className="ti ti-sort-ascending" onClick={()=>{sortdata(11)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(11,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Domain<i className="ti ti-sort-ascending" onClick={()=>{sortdata(12)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(12,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">PH. NO.<i className="ti ti-sort-ascending" onClick={()=>{sortdata(13)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(13,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">Pages<i className="ti ti-sort-ascending" onClick={()=>{sortdata(14)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(14,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">Claim<i className="ti ti-sort-ascending" onClick={()=>{sortdata(15)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(15,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">Priority<i className="ti ti-sort-ascending" onClick={()=>{sortdata(16)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(16,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">Drawings<i className="ti ti-sort-ascending" onClick={()=>{sortdata(17)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(17,e.target.value)} type='text'></input></th>
<th className="small" style={{  background: 'white' }}><div className="headers">ISR<i className="ti ti-sort-ascending" onClick={()=>{sortdata(18)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(18,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">REF. NO.<i className="ti ti-sort-ascending" onClick={()=>{sortdata(19)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(19,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">First Email Date<i className="ti ti-sort-ascending" onClick={()=>{sortdata(20)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(20,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">FollowUp date<i className="ti ti-sort-ascending" onClick={()=>{sortdata(21)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(21,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Next Follow Up<i className="ti ti-sort-ascending" onClick={()=>{sortdata(22)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(22,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Pct App Status<i className="ti ti-sort-ascending" onClick={()=>{sortdata(52)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(52,e.target.value)} type='text'></input></th>
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
          {names.map((name) => (
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
          {callnames.map((name) => (
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
<th style={{  background: 'white' }}><div className="headers">Agent name<i className="ti ti-sort-ascending" onClick={()=>{sortdata(26)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(26,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Agent Email Id<i className="ti ti-sort-ascending" onClick={()=>{sortdata(27)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(27,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Agent Domain<i className="ti ti-sort-ascending" onClick={()=>{sortdata(28)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(28,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Agent Phone<i className="ti ti-sort-ascending" onClick={()=>{sortdata(29)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(29,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Previous Email Status<i className="ti ti-sort-ascending" onClick={()=>{sortdata(30)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(30,e.target.value)} type='text'></input></th>
<th style={{  background: 'white' }}><div className="headers">Company<i className="ti ti-sort-ascending" onClick={()=>{sortdata(31)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(31,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">IN<i className="ti ti-sort-ascending" onClick={()=>{sortdata(32)}}></i> </div><input className="filter"  onKeyUp={(e)=>filterdata(32,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">CA<i className="ti ti-sort-ascending" onClick={()=>{sortdata(33)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(33,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">CN<i className="ti ti-sort-ascending" onClick={()=>{sortdata(34)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(34,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">JP<i className="ti ti-sort-ascending" onClick={()=>{sortdata(35)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(35,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">AU<i className="ti ti-sort-ascending" onClick={()=>{sortdata(36)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(36,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">BR<i className="ti ti-sort-ascending" onClick={()=>{sortdata(37)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(37,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">US<i className="ti ti-sort-ascending" onClick={()=>{sortdata(38)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(38,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">KR<i className="ti ti-sort-ascending" onClick={()=>{sortdata(39)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(39,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">EP<i className="ti ti-sort-ascending" onClick={()=>{sortdata(40)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(40,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">RU<i className="ti ti-sort-ascending" onClick={()=>{sortdata(41)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(41,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">MX<i className="ti ti-sort-ascending" onClick={()=>{sortdata(42)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(42,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">MY<i className="ti ti-sort-ascending" onClick={()=>{sortdata(43)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(43,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">PH<i className="ti ti-sort-ascending" onClick={()=>{sortdata(44)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(44,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">TH<i className="ti ti-sort-ascending" onClick={()=>{sortdata(45)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(45,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">ID<i className="ti ti-sort-ascending" onClick={()=>{sortdata(46)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(46,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">NZ<i className="ti ti-sort-ascending" onClick={()=>{sortdata(47)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(47,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">ZA<i className="ti ti-sort-ascending" onClick={()=>{sortdata(48)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(48,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">VN<i className="ti ti-sort-ascending" onClick={()=>{sortdata(49)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(49,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">SG<i className="ti ti-sort-ascending" onClick={()=>{sortdata(50)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(50,e.target.value)} type='text'></input></th>
<th className={(showcurrencytab ? '' : ' hiddencol')} style={{  background: 'white' }}><div className="headers">CO<i className="ti ti-sort-ascending" onClick={()=>{sortdata(51)}}></i> </div><input className="filter" onKeyUp={(e)=>filterdata(51,e.target.value)} type='text'></input></th>


        </tr>
      )}
      itemContent={(index, user) => (
        
        <>
 <td  className="column-value" style={{  background: 'white', position: 'sticky', left: 0, zIndex: 1 }}><input className='appno' value={user[2]} onClick={(event)=>pushdata(event,user[2])} style={{'position':"absolute",'top':'18px','left':'0'}} type='checkbox'></input><a onClick={(e)=>{pickvalue(e,2)}} target="blank" href={"https://patentscope.wipo.int/search/en/detail.jsf?docId="+user[0]}>{user[2]}</a><i onClick={()=>{editinfo(true,user[2])}} style={{'position': 'absolute','top': '1px','right': '5px','background': '#5d87ff','width': '14px','height': '14px','display': 'flex','lineHeight': '14px','borderRadius': '50%','color': 'white','justifyContent': 'center'}} className="ti ti-edit"></i></td>
<td onClick={(e)=>{pickvalue(e,1)}} className="column-value" style={{  }}>{user[1]}</td>
<td onClick={(e)=>{pickvalue(e,3)}} className="column-value small" style={{  }}>{user[3]}</td>
<td onClick={(e)=>{pickvalue(e,4)}} className="column-value" style={{  }}>{user[4]}</td>
<td onClick={(e)=>{pickvalue(e,5)}} className="column-value" style={{  }}>{user[5]}</td>
<td onClick={(e)=>{pickvalue(e,6)}} className="column-value" style={{  }}>{user[6]}</td>
<td onClick={(e)=>{pickvalue(e,7)}} className="column-value" style={{  }}>{user[7]}</td>
<td onClick={(e)=>{pickvalue(e,8)}} className="column-value" style={{  }}>{user[8]}</td>
<td onClick={(e)=>{pickvalue(e,9)}} className="column-value" style={{  }}>{user[9]}</td> 
<td onClick={(e)=>{pickvalue(e,10)}} className="column-value" style={{  }}>{user[10]}</td>
<td  onClick={(e)=>{showprofilesidebar(e,user[11])}} className="cursor-pointer text-decoration-underline text-primary column-value d-flex align-items-center" style={{  }}><i class="ti ti-refresh rotate hide profilefetch"></i>{user[11]}</td>
<td  onClick={(e)=>{pickvalue(e,12)}} className="column-value" style={{  }}>{user[12]}</td>
<td  onClick={(e)=>{pickvalue(e,13)}} className="column-value" style={{  }}>{user[13]}</td>
<td  onClick={(e)=>{pickvalue(e,14)}} className="column-value small" style={{  }}>{user[14]}</td>
<td  onClick={(e)=>{pickvalue(e,15)}} className="column-value small" style={{  }}>{user[15]}</td>
<td  onClick={(e)=>{pickvalue(e,16)}} className="column-value small" style={{  }}>{user[16]}</td> 
<td  onClick={(e)=>{pickvalue(e,17)}} className="column-value small" style={{  }}>{user[17]}</td>
<td  onClick={(e)=>{pickvalue(e,18)}} className="column-value small" style={{  }}>{user[18]}</td> 
<td  onClick={(e)=>{pickvalue(e,19)}} className="column-value" style={{  }}>{user[19]}</td>
<td  onClick={(e)=>{pickvalue(e,20)}} className="column-value" style={{  }}>{user[20]}</td>
<td  onClick={(e)=>{pickvalue(e,21)}} className="column-value" style={{  }}>{user[21]}</td>
<td  onClick={(e)=>{pickvalue(e,22)}} className="column-value" style={{  }}>{user[22]}</td>
<td  onClick={(e)=>{pickvalue(e,23)}} className="column-value" style={{  }}>{user[52]}</td>
<td  onClick={(e)=>{pickvalue(e,23)}} className="column-value" style={{  }}>{emailstatus[user[23]] ?? ''}</td>
<td  onClick={(e)=>{pickvalue(e,24)}} className="column-value" style={{  }}>{callstatus[user[24]] ?? ''}</td>
<td onClick={(e)=>{pickvalue(e,25)}} className="column-value" style={{  }} dangerouslySetInnerHTML={{__html: removeduplicate(user[25])}} />
<td  onClick={(e)=>{pickvalue(e,26)}} className="column-value" style={{  }}>{user[26]}</td>
<td  onClick={(e)=>{pickvalue(e,27)}} className="column-value" style={{  }}>{user[27]}</td>
<td  onClick={(e)=>{pickvalue(e,28)}} className="column-value" style={{  }}>{user[28]}</td>
<td  onClick={(e)=>{pickvalue(e,29)}} className="column-value" style={{  }}>{user[29]}</td>
<td  onClick={(e)=>{pickvalue(e,30)}} className="column-value" style={{  }}>{user[30]}</td>
<td  onClick={(e)=>{pickvalue(e,31)}} className="column-value" style={{  }}>{user[31]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,32)}}  style={{  }}>{user[32]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,33)}}  style={{  }}>{user[33]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,34)}}  style={{  }}>{user[34]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,35)}}  style={{  }}>{user[35]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,36)}}  style={{  }}>{user[36]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,37)}}  style={{  }}>{user[37]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,38)}}  style={{  }}>{user[38]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,39)}}  style={{  }}>{user[39]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,40)}}  style={{  }}>{user[40]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,41)}}  style={{  }}>{user[41]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,42)}}  style={{  }}>{user[42]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,43)}}  style={{  }}>{user[43]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,44)}}  style={{  }}>{user[44]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,45)}}  style={{  }}>{user[45]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,46)}}  style={{  }}>{user[46]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,47)}}  style={{  }}>{user[47]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,48)}}  style={{  }}>{user[48]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,49)}}  style={{  }}>{user[49]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,50)}}  style={{  }}>{user[50]}</td>
<td className={"column-value"+(showcurrencytab ? '' : ' hiddencol')}  onClick={(e)=>{pickvalue(e,51)}}  style={{  }}>{user[51]}</td>
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

export default Dashboard;