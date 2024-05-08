import React,{useState,useEffect} from "react";
import Style from "../reducers/Style";
import Headerblank from "../component/Header-blank";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Uploaddata from "../services/uploaddata";
import Fetchdata from "../services/fetchdata";
import { useSearchParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import '../component/style/cost.css'
import { countBy } from "lodash";
const Editcountryformula =() =>{
    const [editorData, setEditorData] = useState('');
    const [restdata, setrestdata] = useState({'loader':'hide','loadermessage':'Update','title':'','subject':'','clienttype':'','templatetype':''});
    const [searchParams, setSearchParams] = useSearchParams();
    const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:''});
    const [count,setcount]=useState({'part5':[{'p':5,'c':10,'i':1,'pr':10}],'part1':[{'desc':'filing','p':'','c':'','pr':'','i':'','pc':'','cc':'','prc':'','ic':'','pcs':'','ccs':'','prcs':'','ics':'','pcl':'','ccl':'','prcl':'','icl':'','mc':'','sc':'','lc':'','pro':'','trans':''}],'part2':[{'desc':'filing','p':'','c':'','pr':'','i':'','pc':'','cc':'','prc':'','ic':'','pcs':'','ccs':'','prcs':'','ics':'','pcl':'','ccl':'','prcl':'','icl':'','mc':'','sc':'','lc':'','pro':'','trans':''}],'part3':[{'desc':'filing','p':'','c':'','pr':'','i':'','pc':'','cc':'','prc':'','ic':'','pcs':'','ccs':'','prcs':'','ics':'','pcl':'','ccl':'','prcl':'','icl':'','mc':'','sc':'','lc':'','pro':'','trans':''}],'part4':[{'desc':'filing','p':'','c':'','pr':'','i':'','pc':'','cc':'','prc':'','ic':'','pcs':'','ccs':'','prcs':'','ics':'','pcl':'','ccl':'','prcl':'','icl':'','mc':'','sc':'','lc':'','pro':'','trans':''}]});
    let auth= localStorage.getItem("user"); 
    auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
    const handleEditorChange = (event, editor) => {
      const data = editor.getData();
      setEditorData(data);
    };
    const addNewRow = (part) => {
        const newRow = {'desc':'filing','p':'','c':'','pr':'','i':'','pc':'','cc':'','prc':'','ic':'','pcs':'','ccs':'','prcs':'','ics':'','pcl':'','ccl':'','prcl':'','icl':'','mc':'','sc':'','lc':'','pro':'','trans':''}; 
        setcount({...count,[part]:[...count[part],newRow]});
   
      };
    const fetchtemps = async (id) =>{
        let data= await Fetchdata.fetchtemp({'id':id}).then((response)=>{ return response});
        data=data.data.data;
        if(data.success)
        {
        setEditorData(data.mail_body);
        setrestdata({'loader':'hide','loadermessage':'Update','title':data.title,'subject':data.subject,'templatetype':data.template_type,'clienttype':data.client_type});
          }
        }
useEffect(()=>{
  setrestdata((data)=>({...data,'loader': 'block','loadermessage':'Fetching'}));
  fetchtemps(searchParams.get("id"));
},[])

 const  submitformula = async () => {
alert();
}
const returncost = (item,s) => {
    let cost=0;
if(count['part5'][0]['p']>item['p'] && item['p']!='')
{
cost = cost + ((count['part5'][0]['p']-parseInt(item['p']))*parseInt(item[`pc${s}`]));
}
if(count['part5'][0]['c']>item['c'] && item['c']!='')
{
    cost = cost + ((count['part5'][0]['c']-parseInt(item['c']))*parseInt(item[`cc${s}`]));
}
if(count['part5'][0]['pr']>item['pr'] && item['pr']!='')
{
    cost = cost + ((count['part5'][0]['pr']-parseInt(item['pr']))*parseInt(item[`prc${s}`]));
}
if(count['part5'][0]['i']>item['i'] && item['i']!='')
{
    cost = cost + ((count['part5'][0]['i']-parseInt(item['i']))*parseInt(item[`ic${s}`]));
}
console.log(cost);
return cost;
}
async function updatevalue(parent,key,value,index){
let nested ={...count};
    nested[parent][index] = {...nested[parent][index],[key]:value};
    setcount(nested);
}
    async function submittemplate() 
    {
        let mail_subject=document.querySelector('#emailsubject').value;
        let template_type =document.querySelector('#templatetype').value; let client_type =document.querySelector('#clienttype').value;
       let title=document.querySelector('#emailtitle').value;
       if(restdata.loader=='block')
       {
        setvalidate((validate)=>({...validate,status:true,message:'In process'}));

       }
       else if(title=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Enter title'}));
       }
       else if(mail_subject=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Enter Email Subject'}));
       }
       else if(template_type=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Choose Template Type'}));
       }
       else if(client_type=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Choose Client Type'}));
       }
       else if(editorData=='')
       {
        setvalidate((validate)=>({...validate,status:true,message:'Please Enter Mail body.'}));
       }
       else
       {
        setrestdata((data)=>({...data,'loader': 'block','loadermessage':'Updating'}));
        let formdata={
            'mail_body':editorData,
            'mail_subject':mail_subject,
            'template_type':template_type,
            'userid':auth.userid,
            'client_type':client_type,
            'title':title,
            'uniqueid':searchParams.get("id")
            
          }
         let res =await Uploaddata.mailtemplate(formdata).then((resposne)=>{return resposne});
         if (res.data.success) { setvalidate((prev)=>({ ...prev, status: true, message: res.data.message,color:'success',icon:'success' })) }
else {setvalidate((validate)=>({...validate,status:true,message:res.data.errors.error,color:'error',icon:'error'}));}
setTimeout(()=>{},1000);
setrestdata((data)=>({...data,'loader': 'hide','loadermessage':'Update'}));
        }
    }
    return(
<>
<Snackbar open={validate.status} autoHideDuration={6000} >

<MuiAlert elevation={6} variant="filled" color={validate.color} severity={validate.icon}>{validate.message}</MuiAlert>
</Snackbar>
<Headerblank except={false}></Headerblank>
<div className={"body-wrapper1 custom-table "}>   
    <div className="container-fluid bootstrap-table">
        <div className="fixed-table-container fixed-height d-flex">
<div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3">Email Template</h5>
                  <div className="d-flex border p-2" style={{'flex-wrap': 'wrap'}}>
            <small className="border rounded me-1 mb-1 bg-light p-1"><input value={count.part5[0]['p']} onChange={(e)=>updatevalue('part5','p',e.target.value,'0')} /></small>
            <small className="border rounded me-1 mb-1 bg-light p-1"><input value={count['part5'][0]['c']} onChange={(e)=>updatevalue('part5','c',e.target.value,'0')} /></small>
            <small className="border rounded me-1 mb-1 bg-light p-1"><input value={count['part5'][0]['pr']} onChange={(e)=>updatevalue('part5','pr',e.target.value,'0')} /></small>
            <small className="border rounded me-1 mb-1 bg-light p-1"><input value={count['part5'][0]['i']} onChange={(e)=>updatevalue('part5','i',e.target.value,'0')} /></small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@applicant_name@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@deadline_30_month@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@deadline_31_month@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@incost@</small>
            <small className="border rounded me-1 mb-1 bg-light p-1">@best@</small>


        </div>
                    <div className="row table-one pt-5 pb-5">
                    <div class="col-md-12">
                    <div class="d-flex justify-content-between mb-2">
                        <h2>FILING PHASE</h2>
                        <button onClick={()=>addNewRow('part1')} type="submit" class="btn btn-primary">
                            Add Row
                        </button>
                    </div>
                </div>
                    <table class="table" style={{"border-collapse": "separate","border-spacing":"0 1rem","margin-top": "-1rem","margin-bottom": "-1rem"}}>
                        <thead>
                            <tr>
                                <th class="r-1 text-center">S.No</th>
                                <th class="r-2 text-center">Description</th>
                                <th class="r-1 text-center">PCIO (Page,Claims,Isa,Others)</th>
                                <th class="r-2 text-center">Official Cost</th>
                                <th class="r-1 text-center">Professional Cost</th>
                                <th class="r-2 text-center">Translation Cost</th>
                            </tr>
                        </thead>
                        <tbody class="mt-2">
                            {count.part1.map((item,index) => {
                            return <tr id="addRow">
                                <td class="col-xs-2 text-center">{index+1}</td>
                                <td class="col-xs-6">
                                    <table className="table pb-0 mb-0">
                                        <tbody>
                                            <tr><td colSpan='4'><input class="form-control addPrefer" type="text" onChange={(e)=>{updatevalue('part1','desc',e.target.value,index)}}  /></td></tr>
                                        <tr>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">P:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','p',e.target.value,index)}}/>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">C:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','c',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">PR:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','pr',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">I:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','i',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </td>
                                <td class="col-xs-6">
                                    <table class="table pb-0 mb-0">
                                        <tbody>
                                        <tr>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','pc',e.target.value,index)}}/>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','cc',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','prc',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','ic',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','pcs',e.target.value,index)}}/>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','ccs',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','prcs',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','ics',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','pcl',e.target.value,index)}}/>
                                                </div>

                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','ccl',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','prcl',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex01">
                                                    <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                                                    <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part1','icl',e.target.value,index)}}/>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                </td>
                                <td class="col-xs-6">
                                    <table class="table2 table pb-0 mb-0">
                                        <tbody><tr>
                                            <td>
                                                <div class="h-table">
                                                    <p class="mb-0 text-center">Micro</p>
                                                    <div class="d-flex02">

                                                        <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part1','m',e.target.value,index)}}/>
                                                        <input class="form-control page-no3" type="text" value={returncost(item,'')} disabled="disabled"/>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="h-table">
                                                    <p class="mb-0 text-center">Small</p>
                                                    <div class="d-flex02">

                                                        <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part1','s',e.target.value,index)}}/>
                                                        <input class="form-control page-no3" type="text" value={returncost(item,'s')} disabled="disabled"/>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="h-table">
                                                    <p class="mb-0 text-center">Large</p>
                                                    <div class="d-flex02">

                                                        <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part1','l',e.target.value,index)}}/>
                                                        <input class="form-control page-no3" type="text" value={returncost(item,'l')} disabled="disabled"/>
                                                    </div>
                                                </div>
                                            </td>

                                        </tr>


                                    </tbody></table>
                                </td>
                                <td class="col-xs-6">
                                    <input class="form-control text-center addPrefer" type="text" onChange={(e)=>{updatevalue('part1','pro',e.target.value,index)}}/>
                                </td>
                                <td class="col-xs-6">
                                    <input class="form-control text-center addPrefer" type="text" onChange={(e)=>{updatevalue('part1','trans',e.target.value,index)}}/>
                                </td>


                            </tr>
                            })
                        }
                        </tbody>
                    </table>
                    <div class="col-md-12">
                    <div class="d-flex justify-content-between mb-2">
                        <h2>EXAMINATION PHASE</h2>
                        <button onClick={()=>addNewRow('part2')} type="submit" class="btn btn-primary">
                            Add Row
                        </button>
                    </div>
                </div>
                <table class="table" style={{"border-collapse": "separate","border-spacing":"0 1rem","margin-top": "-1rem","margin-bottom": "-1rem"}}>
<thead>
    <tr>
        <th class="r-1 text-center">S.No</th>
        <th class="r-2 text-center">Description</th>
        <th class="r-1 text-center">PCIO (Page,Claims,Isa,Others)</th>
        <th class="r-2 text-center">Official Cost</th>
        <th class="r-1 text-center">Professional Cost</th>
        <th class="r-2 text-center">Translation Cost</th>
    </tr>
</thead>
<tbody class="mt-2">
    {count.part2.map((item,index) => {
    return <tr id="addRow">
        <td class="col-xs-2 text-center">{index+1}</td>
        <td class="col-xs-6"><input class="form-control addPrefer" type="text" onChange={(e)=>{updatevalue('part2','desc',e.target.value,index)}}  /></td>
        <td class="col-xs-6">
            <table class="table pb-0 mb-0">
                <tbody><tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">P:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','p',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">C:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','c',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PR:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','pr',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">I:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','i',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','pc',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','cc',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','prc',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','ic',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','pcs',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','ccs',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','prcs',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','ics',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','pcl',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','ccl',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','prcl',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part2','icl',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
            </tbody></table>
        </td>
        <td class="col-xs-6">
            <table class="table2 table pb-0 mb-0">
                <tbody><tr>
                    <td>
                        <div class="h-table">
                            <p class="mb-0 text-center">Micro</p>
                            <div class="d-flex02">

                                <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part2','m',e.target.value,index)}}/>
                                <input class="form-control page-no3" type="text" value={returncost(item,'')} disabled="disabled"/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="h-table">
                            <p class="mb-0 text-center">Small</p>
                            <div class="d-flex02">

                                <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part2','s',e.target.value,index)}}/>
                                <input class="form-control page-no3" type="text" value={returncost(item,'s')} disabled="disabled"/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="h-table">
                            <p class="mb-0 text-center">Large</p>
                            <div class="d-flex02">

                                <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part2','l',e.target.value,index)}}/>
                                <input class="form-control page-no3" type="text" value={returncost(item,'l')} disabled="disabled"/>
                            </div>
                        </div>
                    </td>

                </tr>


            </tbody></table>
        </td>
        <td class="col-xs-6">
            <input class="form-control text-center addPrefer" type="text" onChange={(e)=>{updatevalue('part2','pro',e.target.value,index)}}/>
        </td>
        <td class="col-xs-6">
            <input class="form-control text-center addPrefer" type="text" onChange={(e)=>{updatevalue('part2','trans',e.target.value,index)}}/>
        </td>


    </tr>
    })
}
</tbody>
</table>
<div class="col-md-12">
                    <div class="d-flex justify-content-between mb-2">
                        <h2>GRANT PHASE</h2>
                        <button onClick={()=>addNewRow('part3')} type="submit" class="btn btn-primary">
                            Add Row
                        </button>
                    </div>
                </div>
                <table class="table" style={{"border-collapse": "separate","border-spacing":"0 1rem","margin-top": "-1rem","margin-bottom": "-1rem"}}>
<thead>
    <tr>
        <th class="r-1 text-center">S.No</th>
        <th class="r-2 text-center">Description</th>
        <th class="r-1 text-center">PCIO (Page,Claims,Isa,Others)</th>
        <th class="r-2 text-center">Official Cost</th>
        <th class="r-1 text-center">Professional Cost</th>
        <th class="r-2 text-center">Translation Cost</th>
    </tr>
</thead>
<tbody class="mt-2">
    {count.part3.map((item,index) => {
    return <tr id="addRow">
        <td class="col-xs-2 text-center">{index+1}</td>
        <td class="col-xs-6"><input class="form-control addPrefer" type="text" onChange={(e)=>{updatevalue('part3','desc',e.target.value,index)}}  /></td>
        <td class="col-xs-6">
            <table class="table pb-0 mb-0">
                <tbody><tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">P:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','p',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">C:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','c',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PR:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','pr',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">I:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','i',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','pc',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','cc',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','prc',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','ic',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','pcs',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','ccs',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','prcs',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','ics',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','pcl',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','ccl',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','prcl',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part3','icl',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
            </tbody></table>
        </td>
        <td class="col-xs-6">
            <table class="table2 table pb-0 mb-0">
                <tbody><tr>
                    <td>
                        <div class="h-table">
                            <p class="mb-0 text-center">Micro</p>
                            <div class="d-flex02">

                                <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part3','m',e.target.value,index)}}/>
                                <input class="form-control page-no3" type="text" value={returncost(item,'')} disabled="disabled"/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="h-table">
                            <p class="mb-0 text-center">Small</p>
                            <div class="d-flex02">

                                <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part3','s',e.target.value,index)}}/>
                                <input class="form-control page-no3" type="text" value={returncost(item,'s')} disabled="disabled"/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="h-table">
                            <p class="mb-0 text-center">Large</p>
                            <div class="d-flex02">

                                <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part3','l',e.target.value,index)}}/>
                                <input class="form-control page-no3" type="text" value={returncost(item,'l')} disabled="disabled"/>
                            </div>
                        </div>
                    </td>

                </tr>


            </tbody></table>
        </td>
        <td class="col-xs-6">
            <input class="form-control text-center addPrefer" type="text" onChange={(e)=>{updatevalue('part3','pro',e.target.value,index)}}/>
        </td>
        <td class="col-xs-6">
            <input class="form-control text-center addPrefer" type="text" onChange={(e)=>{updatevalue('part3','trans',e.target.value,index)}}/>
        </td>


    </tr>
    })
}
</tbody>
</table>
<div class="col-md-12">
                    <div class="d-flex justify-content-between mb-2">
                        <h2>ANNUITY PHASE</h2>
                        <button onClick={()=>addNewRow('part4')} type="submit" class="btn btn-primary">
                            Add Row
                        </button>
                    </div>
                </div>
                <table class="table" style={{"border-collapse": "separate","border-spacing":"0 1rem","margin-top": "-1rem","margin-bottom": "-1rem"}}>
<thead>
    <tr>
        <th class="r-1 text-center">S.No</th>
        <th class="r-2 text-center">Description</th>
        <th class="r-1 text-center">PCIO (Page,Claims,Isa,Others)</th>
        <th class="r-2 text-center">Official Cost</th>
        <th class="r-1 text-center">Professional Cost</th>
        <th class="r-2 text-center">Translation Cost</th>
    </tr>
</thead>
<tbody class="mt-2">
    {count.part4.map((item,index) => {
    return <tr id="addRow">
        <td class="col-xs-2 text-center">{index+1}</td>
        <td class="col-xs-6"><input class="form-control addPrefer" type="text" onChange={(e)=>{updatevalue('part4','desc',e.target.value,index)}}  /></td>
        <td class="col-xs-6">
            <table class="table pb-0 mb-0">
                <tbody><tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">P:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','p',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">C:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','c',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PR:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','pr',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">I:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','i',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','pc',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','cc',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','prc',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','ic',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','pcs',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','ccs',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','prcs',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','ics',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','pcl',e.target.value,index)}}/>
                        </div>

                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">CC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','ccl',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">PRC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','prcl',e.target.value,index)}}/>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex01">
                            <label for="example-text-input" class="col-md-2 p-0 col-form-label">IC:</label>
                            <input class="form-control page-no" type="text" onChange={(e)=>{updatevalue('part4','icl',e.target.value,index)}}/>
                        </div>
                    </td>
                </tr>
            </tbody></table>
        </td>
        <td class="col-xs-6">
            <table class="table2 table pb-0 mb-0">
                <tbody><tr>
                    <td>
                        <div class="h-table">
                            <p class="mb-0 text-center">Micro</p>
                            <div class="d-flex02">

                                <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part4','m',e.target.value,index)}}/>
                                <input class="form-control page-no3" type="text" value={returncost(item,'')} disabled="disabled"/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="h-table">
                            <p class="mb-0 text-center">Small</p>
                            <div class="d-flex02">

                                <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part4','s',e.target.value,index)}}/>
                                <input class="form-control page-no3" type="text" value={returncost(item,'s')} disabled="disabled"/>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="h-table">
                            <p class="mb-0 text-center">Large</p>
                            <div class="d-flex02">

                                <input class="form-control page-no2" type="text" onChange={(e)=>{updatevalue('part4','l',e.target.value,index)}}/>
                                <input class="form-control page-no3" type="text" value={returncost(item,'l')} disabled="disabled"/>
                            </div>
                        </div>
                    </td>

                </tr>


            </tbody></table>
        </td>
        <td class="col-xs-6">
            <input class="form-control text-center addPrefer" type="text" onChange={(e)=>{updatevalue('part4','pro',e.target.value,index)}}/>
        </td>
        <td class="col-xs-6">
            <input class="form-control text-center addPrefer" type="text" onChange={(e)=>{updatevalue('part4','trans',e.target.value,index)}}/>
        </td>


    </tr>
    })
}
</tbody>
</table>
                    <div class="col-12 d-flex"><div class="m-auto mt-3"><button type="submit" onClick={()=>submitformula()} class="btn btn-info font-medium rounded-pill px-4"><div class="d-flex align-items-center"><i class="ti ti-send me-2 fs-4"></i>Update<i class="ti ti-refresh rotate ms-2 hide"></i></div></button></div></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          </div></div></div>
</>
    );
}
export default Editcountryformula;