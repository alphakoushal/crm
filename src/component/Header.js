import React,{useState,memo,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { BrowserRouter, Routes, Route,Link,useNavigate, json } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import commentprocess from "../services/commentservice";
import Addmodal from "./modals/addmodal";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { defaultvalue } from "../constant/Constant";
import { useOnlinestatus } from "../services/Online";
const Header = React.memo(({platform,alldata,changedata,completedata,showmailbox,showdupemailbox,showcronbox,clearfilters,refreshdata,formdatas,showcurrencies}) =>{
  const navigate=useNavigate(); 
  const isOnline = useOnlinestatus();
  let auth= localStorage.getItem("user"); 
  auth =(auth!='' ? JSON.parse(auth) : '');
  let accounts =(defaultvalue.accounts[auth.userid]!==undefined ? defaultvalue.accounts[auth.userid] :Object.values(defaultvalue.accounts).flat());
  const [openemailbox, setOpen] = useState({status:false,type:'',title:''});
  const [openfollowbox, setOpenfollow] = useState(false);
  const [openaddbox, setaddbox] = useState(false);
  const [validate,setvalidate]=useState({'loader':'hide','loadermessage':'Submit',status:false,color:'error',icon:'error',message:'',inprocess:false});
const [status,setstatus] =useState();

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  lineHeight: 1.5;
  padding: 12px;
  borderRadius: 12px 12px 0 12px;
`,
);
const addentry = ()=>{
  setaddbox(true);
}
useEffect(()=>{
  return()=>{ 
     setTimeout(() => {
      setvalidate(()=>({...validate,status:false}));
      //show.state=false;
     }, 1000);
  }
},[])
const closeaddbox = ()=>{
  setaddbox(false);
}
  const handleClickOpen = function (e,type,title) {
    e.preventDefault();
    setOpen({status:true,type:type,title:title});
  };
  const followboxevent = function (e) {
    e.preventDefault();
    setOpenfollow(true);
  };
  const handleClose = () => {
    setOpen({status:false,type:'',title:''});
  };

    const valued=useSelector((state)=>state.userdata.value);
    const [d,sd]=useState('hi');
    function showsidebar()
    {
        document.querySelector('.uploadsidebar').classList.add('show');
    }
    function signout()
    {
localStorage.setItem('user','')
navigate("/");
window.location.reload();
    }
    async function submitemailform(type)
    {
      let clientObject={};
     // let appno=document.querySelectorAll('.appno');
      let commentdate=document.querySelector('#name').value;
      let commenttext=document.querySelector('#textarea').value;
      let a=document.querySelector('#chooseaccount');
      let appno=document.querySelector('#allapp').value.split(',');
      if(validate.inprocess)
      {
          setvalidate((validate)=>({...validate,status:true,message:'Request In process'}));
      }
      else if(status=='' || typeof(status)=='undefined')
      {
          setvalidate((validate)=>({...validate,status:true,message:'Choose Status'}));
      }
      else if((commentdate=='' || typeof(commentdate)=='undefined') && type=='email_comment_react')
      {
          setvalidate((validate)=>({...validate,status:true,message:'Choose Date'}));
      }
      else if(a.value=='' || typeof(a)=='undefined')
      {
          setvalidate((validate)=>({...validate,status:true,message:'Choose Account type'}));
      }
      else if(appno=='' || typeof(appno)=='undefined' || appno.length<=0)
      {
          setvalidate((validate)=>({...validate,status:true,message:'Add Applications'}));
      }
      else if((commenttext=='' || typeof(commenttext)=='undefined') && status!='2')
      {
          setvalidate((validate)=>({...validate,status:true,message:'Add Description'}));
      }
      else
      {
      appno.forEach((e,index)=>{
        let getdata=alldata.filter((fv)=>{return fv[2]==e});
        if(getdata.length>0)
        {
clientObject[e] = {
  "index": index,
  "firstemail": getdata[0][20],//document.querySelector(`.appno[value='${e}']`).closest('tr').querySelectorAll('td')[21].innerText,
  "followup": getdata[0][21],//document.querySelector(`.appno[value='${e}']`).closest('tr').querySelectorAll('td')[22].innerText,
  "date": commentdate,
  "status": status,
  "addedby":a.options[a.selectedIndex].text,
  "comment": (status=='2' && type=='email_comment_react' ? 'failed' : commenttext),
  "domain":getdata[0][12],//document.querySelector(`.appno[value='${e}']`).closest('tr').querySelectorAll('td')[13].innerText,
  "email":getdata[0][11],//document.querySelector(`.appno[value='${e}']`).closest('tr').querySelectorAll('td')[12].innerText,
  "status_type": type
};
      }
      })

      var salesdata = {
        "email_comment_data": JSON.stringify(clientObject),
        "platform":platform.current,
        "type": type
    };
    if(Object.keys(clientObject).length>=1)
    {
      setvalidate((validate)=>({...validate,inprocess:true,loader:'block',loadermessage:'Submitting'}));
   let cstatus= await commentprocess.updatecomments(salesdata).then((response)=>{return response});
   if (cstatus.data.success) { setvalidate((prev)=>({ ...prev,loader:'hide',loadermessage:'Submit', status: true,inprocess:false, message: cstatus.data.message,color:'success',icon:'success' }));
   setOpen({status:false,type:'',title:''}); 
   if(type=='email_comment_react')
   {
    let newarray=completedata.map((item,index)=>{ return (appno.includes(item[2]) ?  {...item,[25]:item[25]+"="+commenttext,[58]:a.options[a.selectedIndex].text,[21]:commentdate,[23]:status,[22]:""} : item) });
    changedata(newarray);
   }
   else
   {
    let newarray=completedata.map((item,index)=>{ return (appno.includes(item[2]) ?  {...item,[25]:item[25]+"="+commenttext,[58]:a.options[a.selectedIndex].text,[21]:commentdate,[24]:status} : item) });
    changedata(newarray);
   }

  }
   else
   {
  setvalidate((prev)=>({ ...prev,loader:'hide',loadermessage:'Submit', status: true,inprocess:false, message: cstatus.data.errors.error,color:'error',icon:'error' }))     
   }

    }
    else
    {
      setvalidate((prev)=>({ ...prev, status: true,inprocess:false, message: 'PLease add Applications',color:'error',icon:'error' }))     

    }
    setTimeout(() => {
    setvalidate((prev)=>({...prev,status:false}));
    }, 1000);
  }
    }

    const showuserprofile = (e) =>{
      e.preventDefault();
      let ps=document.querySelector('.user-profile');
      (ps.classList.contains('show') ? ps.classList.remove('show') : ps.classList.add('show'));
    }
    return(
        <>
                    <Snackbar open={validate.status} autoHideDuration={1000}>

<MuiAlert elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
</Snackbar>
        {openaddbox ? <Addmodal fn={closeaddbox}></Addmodal> : <></>}
       
         <Dialog open={openemailbox.status} onClose={handleClose}>
        <DialogTitle>{openemailbox.title}</DialogTitle>
        <DialogContent>
          <div className="row pt-3">
            <div className="col-md-4">
        <FormControl fullWidth>
  {openemailbox.type=='email_comment_react' ? <>
  <InputLabel id="demo-simple-select-label">Email status</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={status}
    label="Email status"
    onChange={(event)=>setstatus(event.target.value)}
  >
    <MenuItem value={1}>Pipeline</MenuItem>
    <MenuItem value={2}>Failed</MenuItem>
    <MenuItem value={3}>Rejection</MenuItem>
    <MenuItem value={4}>Reciprocity</MenuItem>
    <MenuItem value={5}>Ooo</MenuItem>
    <MenuItem value={6}>Converted</MenuItem>
    <MenuItem value={7}>Response</MenuItem>
    <MenuItem value={8}>Dnc</MenuItem>
    <MenuItem value={9}>Dupe</MenuItem>
    <MenuItem value={10}>Exhausted</MenuItem>
    <MenuItem value={12}>Email Sent</MenuItem>
    <MenuItem value={13}>Not Responsive</MenuItem>
  </Select>
  </> :  
  <>
   <InputLabel id="demo-simple-select-label">Call status</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={status}
    label="Call status"
    onChange={(event)=>setstatus(event.target.value)}
  >
    <MenuItem value={1}>Ni</MenuItem>
    <MenuItem value={2}>Lb</MenuItem>
    <MenuItem value={3}>Voice mail</MenuItem>
    <MenuItem value={4}>Invalid no</MenuItem>
    <MenuItem value={5}>Email sent</MenuItem>
    <MenuItem value={6}>Cb</MenuItem>
    <MenuItem value={7}>Ringing</MenuItem>
    <MenuItem value={8}>Dnc</MenuItem>
    <MenuItem value={9}>Dupe</MenuItem>
    <MenuItem value={10}>Exhausted</MenuItem>
  </Select></>}
</FormControl>
</div>
<div className="col-md-4">
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="date"
            fullWidth
            variant="standard"
          />
          </div>
          <div className="col-md-4">
          <select id="chooseaccount" className="form-select">
                              <option value="">Choose Account</option>
                              {
                                accounts.map((e,i)=>{
                                 return <option key={i} value={e.account}>{e.name}</option>;
                                })
                              }

                              </select>
          </div>
          <div className="col-md-12 pt-3">
              <textarea
      aria-label="Description"
      rows={3}
      className="textarea"
      id="allapp"
      placeholder="Add comma Separated Application Number."
    />
    </div>
          <div className="col-md-12 pt-3">
              <textarea aria-label="Description" rows={3} className="textarea" id="textarea" placeholder="Description" />
    </div>
    </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>{submitemailform(openemailbox.type)}}>{validate.loadermessage} <i className={`ti ti-refresh rotate ms-2 ${validate.loader}`}></i></Button>
        </DialogActions>
      </Dialog>


        <header className="app-header fixed-header"> 
          <nav className="navbar navbar-expand-lg navbar-light">
            <ul className="navbar-nav quick-links d-none d-lg-flex">
              <li className="nav-item dropdown hover-dd d-none d-lg-block">
                <Link className="nav-link" data-bs-toggle="dropdown">Dashboard<span className="mt-1"><i className="ti ti-chevron-down"></i></span></Link>
                <div className="dropdown-menu dropdown-menu-nav dropdown-menu-animate-up py-0">
                  <div className="row">
                    <div className="col-12">
                      <div className=" ps-7 pt-7">
                        <div className="border-bottom">
                          <div className="row">
                            <div className="col-3">
                            <div className="position-relative">
                                
                                <Link to="/dashboard" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Patent</h6>
                                    <span className="fs-2 d-block text-dark">Dashboard</span>
                                  </div>
                                </Link>
                                <Link to="/analytic" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Analytic</h6>
                                    <span className="fs-2 d-block text-dark">Dashboard</span>
                                  </div>
                                </Link>
                                <Link to="/templates" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Templates</h6>
                                    <span className="fs-2 d-block text-dark">Dashboard</span>
                                  </div>
                                </Link>
                                <Link to="/templates-list" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Templates List</h6>
                                    <span className="fs-2 d-block text-dark">Dashboard</span>
                                  </div>
                                </Link>
                                {auth.type=='2' ? <>
                                <Link to="/countrylist" className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Country List</h6>
                                    <span className="fs-2 d-block text-dark">Dashboard</span>
                                  </div>
                                </Link>
                                </> : <></>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="nav-item dropdown hover-dd d-none d-lg-block">
                <Link className="nav-link" data-bs-toggle="dropdown">Comments<span className="mt-1"><i className="ti ti-chevron-down"></i></span></Link>
                <div className="dropdown-menu dropdown-menu-nav dropdown-menu-animate-up py-0">
                  <div className="row">
                    <div className="col-12">
                      <div className=" ps-7 pt-7">
                        <div className="border-bottom">
                          <div className="row">
                            <div className="col-6">
                              <div className="position-relative">
                                <Link onClick={(e)=>handleClickOpen(e,'email_comment_react','Email Comments')}  className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div  className="bg-light rounded-1 me-3 p-6 d-flex align-items-center justify-content-center">
                                    <img src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/icon-dd-chat.svg" alt="" className="img-fluid" width="24" height="24"/>
                                  </div>
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary"> Email Comment</h6>
                                    <span className="fs-2 d-block text-dark">Add New Email Comment</span>
                                  </div>
                                </Link>
                                <Link onClick={(e)=>handleClickOpen(e,'call_comment_react','Call Comments')} className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div  className="bg-light rounded-1 me-3 p-6 d-flex align-items-center justify-content-center">
                                    <img src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/icon-dd-chat.svg" alt="" className="img-fluid" width="24" height="24"/>
                                  </div>
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary"> Call Comment</h6>
                                    <span className="fs-2 d-block text-dark">Add New Call Comment</span>
                                  </div>
                                </Link>
                                <Link onClick={(e)=>followboxevent(e)} className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div  className="bg-light rounded-1 me-3 p-6 d-flex align-items-center justify-content-center">
                                    <img src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/icon-dd-chat.svg" alt="" className="img-fluid" width="24" height="24"/>
                                  </div>
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Followup</h6>
                                    <span className="fs-2 d-block text-dark">Update Followup</span>
                                  </div>
                                </Link>
                                <Link onClick={(e)=>addentry(e)} className="d-flex align-items-center pb-9 position-relative text-decoration-none text-decoration-none text-decoration-none text-decoration-none">
                                  <div  className="bg-light rounded-1 me-3 p-6 d-flex align-items-center justify-content-center">
                                    <img src="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/dist/images/svgs/icon-dd-chat.svg" alt="" className="img-fluid" width="24" height="24"/>
                                  </div>
                                  <div className="d-inline-block">
                                    <h6 className="mb-1 fw-semibold bg-hover-primary">Add Application</h6>
                                    <span className="fs-2 d-block text-dark">Add New application</span>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul> 
            <div className="collapse navbar-collapse justify-content-end show" id="navbarNav">
              <div className="d-flex align-items-center justify-content-between">
                <Link  className="nav-link d-flex d-lg-none align-items-center justify-content-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilenavbar" aria-controls="offcanvasWithBothOptions">
                  <i className="ti ti-align-justified fs-7"></i>
                </Link>
                <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
              <li>
              <div className="input-group">
                      <input type="text" className="form-control" id='totalsending' aria-label="Text input with dropdown button"/>
                      
                      <select id='mailtypeaccount' style={{'width':'38%','maxWidth':'38%'}} className="form-select"><option selected value=''>Choose Column</option><option value='1'>Email-ID</option><option  value='2'>EMAIL-ID2</option></select>
                    </div>
              </li>
                </ul>
              </div>
            </div>
            <div className="collapse justify-content-end show" id="navbarNav">
              <div className="d-flex align-items-center justify-content-between">
                <ul className="grid-col navbar-nav flex-row ms-auto align-items-center justify-content-center">
              <li title="Add Dupe Cron Task" onClick={()=>showdupemailbox()} className="nav-item">
                    <Link className="nav-link notify-badge nav-icon-hover" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-mail-fast"></i>               
                    </Link>
                  </li>
               <li title="Add Cron Task" onClick={()=>showmailbox()} className="nav-item">
                    <Link className="nav-link notify-badge nav-icon-hover"data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-mail"></i>               
                    </Link>
                  </li>
                  <li title="Cron job status" onClick={()=>showcronbox()} className="nav-item">
                    <Link className="nav-link notify-badge nav-icon-hover" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-calendar-time"></i>               
                    </Link>
                  </li>
                  <li title="Refresh Data" onClick={()=>refreshdata(formdatas,'hard')} className="nav-item">
                    <Link className="nav-link notify-badge nav-icon-hover" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-refresh"></i>               
                    </Link>
                  </li>

                  <li title="Clear Filter" onClick={()=>clearfilters()} className="nav-item">
                    <Link className="nav-link notify-badge nav-icon-hover" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-eraser"></i>               
                    </Link>
                  </li>
                <li title="Show currencies" onClick={()=>showcurrencies()} className="nav-item">
                    <Link className="nav-link notify-badge nav-icon-hover" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-zoom-money"></i>               
                    </Link>
                  </li>


                  <li title="Download file" className="nav-item">
                    <Link className="nav-link notify-badge nav-icon-hover" to={`https://www.anuation.com/oldcrm/employee/auth/reactauth/export-excel.php?userid=${auth.userid}`}>  <i className="ti ti-cloud-download"></i>  </Link>

                  </li>
                  <li title="Open sidebar" onClick={()=>showsidebar()} className="nav-item">
                    <Link className="nav-link notify-badge nav-icon-hover" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i  className="ti ti-menu-2"></i>               
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="collapse justify-content-end show" id="navbarNav">
              <div className="d-flex align-items-center justify-content-between">
                <Link  className="nav-link d-flex d-lg-none align-items-center justify-content-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilenavbar" aria-controls="offcanvasWithBothOptions">
                  <i className="ti ti-align-justified fs-7"></i>
                </Link>
                <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                <li  className="nav-item dropdown">
                    <Link onClick={(e)=>{showuserprofile(e)}} className="nav-link pe-0 show" id="drop1" data-bs-toggle="dropdown" aria-expanded="true">
                      <div className="d-flex align-items-center">
                        <div className="user-profile-img">
                          <img src={"../crm/assets/images/profile/"+(auth.gender=='f' ? 'user-2' : 'user-1')+".jpg"} className={`rounded-circle ${(isOnline ? 'border-green' : 'border-red')}`} width="35" height="35" alt=""/>
                        </div>
                      </div>
                    </Link>
                    <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up user-profile" aria-labelledby="drop1" data-bs-popper="static">
                      <div className="profile-dropdown position-relative" data-simplebar="init"><div className="simplebar-wrapper" style={{"margin": "0px"}}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div><div className="simplebar-mask"><div className="simplebar-offset" style={{"right": "0px","bottom": "0px"}}><div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content" style={{"height": "auto","overflow": "hidden scroll"}}><div className="simplebar-content" style={{"padding": "0px"}}>
                        <div className="py-3 px-7 pb-0">
                          <h5 className="mb-0 fs-5 fw-semibold">User Profile</h5>
                        </div>
                        <div className="d-flex align-items-center py-9 mx-7 border-bottom">
                          <img src={"../crm/assets/images/profile/"+(auth.gender=='f' ? 'user-2' : 'user-1')+".jpg"} className={`rounded-circle ${(isOnline ? 'border-green' : 'border-red')}`} width="80" height="80" alt=""/>
                          <div className="ms-3">
                            <h5 className="mb-1 fs-3">{auth?.name}</h5>
                            {/* <span className="mb-1 d-block text-dark">Designer</span> */}
                            <p className="mb-0 d-flex text-dark align-items-center gap-2">
                              <i className="ti ti-mail fs-4"></i> {auth?.email}
                            </p>
                          </div>
                        </div>
                        <div className="d-grid py-4 px-7 pt-8">
                          <Link onClick={()=>signout()} className="btn btn-outline-primary"><i  className="ti ti-logout"></i>    Log Out</Link>
                        </div>
                      </div></div></div></div><div className="simplebar-placeholder" style={{"width":"auto","height":"601px"}}></div></div><div className="simplebar-track simplebar-horizontal" style={{"visibility": "hidden"}}><div className="simplebar-scrollbar" style={{"width": "0px","display": "none"}}></div></div><div className="simplebar-track simplebar-vertical" style={{"visibility": "visible"}}><div className="simplebar-scrollbar" style={{"height": "146px","display": "block","transform": "translate3d(0px, 0px, 0px)"}}></div></div></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        </>
    )
})

export default Header;