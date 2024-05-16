import React,{useState,useEffect} from "react";
import Toast from "../component/New-toast";
import { defaultvalue } from "../constant/Constant";
import Headerblank from "../component/Header-blank";
import Fetchdata from "../services/fetchdata";
import '../component/style/calcost.css'
const Calculatecost = () =>{
let coststage=[{'value':"IP Type Selection"},{'value':"Country Selection"},{'value':"Stages Selection"},{'value':"Detailed Report"}]
let service = ['Patent'];
let detailservice = ['Filing','Examination','Granting','Annuity'];
let applicantstatus = ['Micro','Small','Large'];
let applicantstatusnumber = {'1':'','2':'s','3':'l'};
let applicantstatusvalue = {'1':'Micro','2':'Small','3':'Large'};
const [getdata,setdata]=useState([]);
const [tab,settab]=useState('tab1');
const [countrytab,setcountrytab]=useState('');
const [qtab,setqtab]=useState('');
const [formuladata,setformuladata]=useState({'p':'','c':'','i':'','pr':'','word':20,'as':'','country':[]});
const updatedata = (k,value) =>{
    setformuladata((prev)=>({...prev,[k]:value}))
}
const getcost = (c,s,ser) =>{
    let costs =[];let cost=0;let total=0;
    getdata.map((item)=>{
        if(item.country==c)
        {
        let parts=JSON.parse(item.data);
        s.map((status)=>{
       ser.map((keys)=>{
        if(parts['part'+keys].length>0 && 'part'+keys!='part5')
        {

                cost = cost + returncostoverall(parts['part'+keys],status);
        }
       })
       costs[status]=cost;
       total = total + cost;
       cost=0;
    })
    costs['total']=total;
    total=0;
    }
    })
    return costs;
}
const returncostoverall = (parts,s) =>{
    let cost=0;
    parts.map((item,index)=>{
       let t = (s=='' ? 'm' : s);
        if(s!='pro' && s!='trans' && item[`${(s=='' ? 'm' : s)}c`]!='')// standard cost
        {        
     cost = cost + parseInt(item[`${(s=='' ? 'm' : s)}c`]);
        }
        if(s!='pro' && s!='trans' && parseInt(formuladata['p'])>parseInt(item['p']) && item['p']!='' && item[`pc${s}`]!='') //page cost
        {
        cost = cost + ((parseInt(formuladata['p'])-parseInt(item['p']))*parseInt(item[`pc${s}`]));
        }
        if(s!='pro' && s!='trans' && parseInt(formuladata['c'])>parseInt(item['c']) && item['c']!='' && item[`cc${s}`]!='') // claim cost
        {
           cost = cost + ((parseInt(formuladata['c'])-parseInt(item['c']))*parseInt(item[`cc${s}`]));
        }
        if(s!='pro' && s!='trans' && parseInt(formuladata['pr'])>parseInt(item['pr']) && item['pr']!='' && item[`prc${s}`]!='') // priority cost
        {
            
            cost = cost + ((parseInt(formuladata['pr'])-parseInt(item['pr']))*parseInt(item[`prc${s}`]));
        }
        if(s=='pro' && item[`${s}`]!='') // pro cost
        {
            cost = cost + parseInt(item[`${s}`]);
        }
        if(s=='trans' && formuladata['word']!='' && item[`${s}`]!='') // trans cost
        {
            cost = cost + (parseInt(formuladata['word']) * parseFloat(item[`${s}`]));
        }
})
return cost;
}

const getcountrydata = async() => {
    let fetchcountry=await Fetchdata.fetchcountry({'posttype':'fetchcountry',country:formuladata.country.map((item)=>"'"+item.value+"'").toString()}).then((response)=>{return response});
    if(fetchcountry.data.success)
    {

        setdata(fetchcountry.data.data);
    }
    else
    {
        setdata([]);
    }
}
useEffect(()=>{
if(tab=='tab4')
{
  if(formuladata.country.length>0)
  {

      getcountrydata();
  }
}
},[tab])
const pushvalue = (e,val) =>{
if(e.target.checked)
{
    setformuladata((prev)=>({...prev,['country']:[...prev.country,{'value':val,'service':[],'entity':''}]})) 
}
else
{
    setformuladata((prev)=>({...prev,['country']:prev.country.filter((item,index)=>item.value!==val)})) 
}
}
const pushcountryentity = (e,c,cindex) =>{

    let nested ={...formuladata};
    nested['country'][cindex]['entity'] = e.target.value;
    setformuladata(nested);

}
const pushcountryaction = (e,c,cindex,index) =>{
    if(e.target.checked)
{
    let nested ={...formuladata};
    nested['country'][cindex]['service'] = [...nested['country'][cindex]['service'],index+1];
    setformuladata(nested);
}
else
{
    let nested ={...formuladata};
    nested['country'][cindex]['service'] = nested['country'][cindex]['service'].filter((item,inx)=>item!==index+1);
    setformuladata(nested);

}
}
const changetab = (tab) =>{
    if('tab'+tab!='tab4')
    {
        setdata([]);
    }
settab('tab'+tab);
}
const changequotetab = (tab) =>{
    if(tab==qtab)
    {
        setqtab('');
    }
    else
    {
        setqtab(tab);
    }
    }
const changecountyrtab = (tab) =>{
    if('tab'+tab==countrytab)
    {
        setcountrytab('');
    }
    else
    {
    setcountrytab('tab'+tab);
    }
    }
return(
        <>
        <div className={"body-wrapper1 custom-table "}>  
        <Headerblank></Headerblank>
        <div class="container">
            <div class="row">
                <div class="div_1">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-2">
                                <div class="quotation_leftpanel">
                                    <ul>
                                        {
                                            coststage.map((value,index)=>{
                                               return <li  class={`step${index+1} checked ${(tab=='tab'+(index+1) ? 'active' : '')}`}>
                                                <a onClick={()=>{changetab(index+1)}} key={index}   class="active-tab">{value.value}</a>
                                            </li>
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-10">
                                <div class="activetab-1 ps-3 pe-3" style={{'display':`${tab=='tab1' ? 'block' : 'none'}`}}>
                                    <div class="main-radio">
                                        {
                                            service.map((value,index)=>{
return <>
<input type="radio" id={`tab${index}`} name="tab" checked/>
                                        <label for="tab1" class="me-3">{value}</label></>
                                            })
                                        }
                                    </div>
                                    <article class="on">
                                        <div class="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0" >
                                            <div class="card-body px-4 py-3">
                                                <div class="row align-items-center">
                                                    <div class="col-9">
                                                        <h4 class="fw-semibold mb-8"> Application Information</h4>
                                                        <nav aria-label="breadcrumb">
                                                            <ol class="breadcrumb">
                                                                <li class="breadcrumb-item" aria-current="page" >Get
                                                                    Quotation</li>
                                                            </ol>
                                                        </nav>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="text-center mb-n5">
                                                            <img src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/breadcrumb/ChatBc.png" alt="modernize-img" class="img-fluid mb-n4"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card">

                                            <div class="card-body">
                                                <div class="mb-4 row align-items-center">
                                                    <label for="exampleInputText1" class="form-label col-sm-5 col-form-label">Total Number of
                                                        Pages</label>
                                                    <div class="col-sm-4">
                                                        <input type="text" onChange={(e)=>{updatedata('p',e.target.value)}} class="form-control" placeholder="Total Number of Pages"/>
                                                    </div>
                                                    <div class="col-sm-3"></div>
                                                </div>
                                                <div class="mb-4 row align-items-center">
                                                    <label for="exampleInputText2" class="form-label col-sm-5 col-form-label">Total Number of
                                                        Claims</label>
                                                    <div class="col-sm-4">
                                                        <input type="text" onChange={(e)=>{updatedata('c',e.target.value)}} class="form-control" placeholder="Total Number of Claims"/>
                                                    </div>
                                                    <div class="col-sm-3"></div>
                                                </div>
                                                <div class="mb-4 row align-items-center">
                                                    <label for="exampleInputText30" class="form-label col-sm-5 col-form-label">Priority</label>
                                                    <div class="col-sm-4">
                                                        <div class="input-group border rounded-1">
                                                            <input type="text" onChange={(e)=>{updatedata('pr',e.target.value)}} class="form-control border-0" placeholder="Priority"/>

                                                        </div>
                                                        <div class="col-sm-3"></div>
                                                    </div>
                                                </div>
                                                <div class="mb-4 row align-items-center">
                                                    <label for="exampleInputText30" class="form-label col-sm-5 col-form-label">ISA
                                                    </label>
                                                    <div class="col-sm-4">
                                                        <div class="input-group border rounded-1">
                                                            <input type="text" onChange={(e)=>{updatedata('i',e.target.value)}} class="form-control border-0" placeholder="ISA"/>

                                                        </div>
                                                        <div class="col-sm-3"></div>
                                                    </div>
                                                </div>
                                                <div class="mb-4 row align-items-center">
                                                    <label for="exampleInputText30" class="form-label col-sm-5 col-form-label">Total words
                                                    </label>
                                                    <div class="col-sm-4">
                                                        <div class="input-group border rounded-1">
                                                            <input type="text" onChange={(e)=>{updatedata('word',e.target.value)}} class="form-control border-0" placeholder="Total Words"/>

                                                        </div>
                                                        <div class="col-sm-3"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                    <div class="mt-3">
                                        <button class="btn btn-primary float-end next-btn" onClick={()=>{changetab('2')}}>Next</button>
                                    </div>
                                </div>
                                
                                <div class="activetab-2  ps-3 pe-3" style={{'display':`${tab=='tab2' ? 'block' : 'none'}`}}>
                                    <article class="on mt-0">
                                        <div class="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0" >

                                            <div class="card-body px-4 py-3">
                                                <div class="row align-items-center">
                                                    <div class="col-9">
                                                        <h4 class="fw-semibold mb-8"> Country Selection</h4>
                                                        <nav aria-label="breadcrumb">
                                                            <ol class="breadcrumb" style={{"display": "flex","align-items": "center"}}>

                                                                <li class="breadcrumb-item" aria-current="page">Get
                                                                    Quotation</li>
                                                            </ol>
                                                        </nav>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="text-center mb-n5">
                                                            <img src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/breadcrumb/ChatBc.png" alt="modernize-img" class="img-fluid mb-n4"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card">
                                            <div class="card-body p-0">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        {
                                                            defaultvalue.continent_country.map((value,index)=>{
                                                        return <div class="accordion" id="regularAccordionRobots">
                                                            <div class="accordion-item">
                                                                <h2 id="regularHeadingSix" class="accordion-header">
                                                                    <button class="accordion-button" type="button" onClick={()=>{changecountyrtab(index+1)}} data-bs-toggle="collapse" data-bs-target="#regularCollapseSix" aria-expanded="true" aria-controls="regularCollapseSix">
                                                                        {Object.keys(value)[0]}
                                                                    </button>
                                                                </h2>
                                                                <div id="regularCollapseSix" class={`accordion-collapse collapse ${countrytab=='tab'+(index+1) ? 'show' : ''}`} aria-labelledby="regularHeadingSix" data-bs-parent="#regularAccordionRobots">
                                                                    <div class="accordion-body p-2">

                                                                        <div class="row">
                                                                            {
                                                                               value[Object.keys(value)[0]].map((val,ind)=>{
                                                                                return <div class="col-md-3">            
                                                           <div class="form-check me-3 py-2">
                                                                                <input onChange={(e)=>{pushvalue(e,val.code)}} class="form-check-input" type="checkbox" value={val.code} id={`country${val.code}`}/>
                                                                                <label class="form-check-label" for={`country${val.code}`}>
                                                                                {val.name}
                                                                                </label>
                                                                            </div>
                                                                            </div>
                                                                               })
                                                                            }


                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                    <div class="mt-3">
                                        <button class="btn btn-primary float-end next-btn" onClick={()=>{changetab('3')}}>Next</button>
                                        <button class="btn bg-danger-subtle text-danger float-start back-btn" onClick={()=>{changetab('1')}}>Previous</button>
                                    </div>
                                </div>

                                <div class="activetab-3  ps-3 pe-3" style={{'display':`${tab=='tab3' ? 'block' : 'none'}`}}>
                                    <article class="on mt-0">

                                        <div class="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0" >
                                            <div class="card-body px-4 py-3">
                                                <div class="row align-items-center">
                                                    <div class="col-9">
                                                        <h4 class="fw-semibold mb-8"> Stages Selection</h4>
                                                        <nav aria-label="breadcrumb">
                                                            <ol class="breadcrumb">

                                                                <li class="breadcrumb-item" aria-current="page" >Get
                                                                    Quotation</li>
                                                            </ol>
                                                        </nav>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="text-center mb-n5">
                                                            <img src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/breadcrumb/ChatBc.png" alt="modernize-img" class="img-fluid mb-n4"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="accordion" id="regularAccordionRobots">

{
    formuladata.country.map((countryvalue,countryindex)=>{
        return <div class="accordion-item">
        <h2 id="regularHeadingNine" class="accordion-header">
            <button onClick={(it)=>{changequotetab('tab'+countryvalue.value)}} class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#regularCollapseNine" aria-expanded="true" aria-controls="regularCollapseNine">
               {countryvalue.value}
            </button>
        </h2>
        <div id="regularCollapseNine" class={`accordion-collapse collapse ${(qtab=='tab'+countryvalue.value ? 'show' : '')}`} aria-labelledby="regularHeadingNine" data-bs-parent="#regularAccordionRobots">
            <div class="accordion-body p-2">
                <div class="">
                    <div class="div_option">
                        <div class="row align-items-center">
                            <label for="exampleInputText3" class="form-label col-sm-5 col-form-label">Entity</label>
                            <div class="col-sm-7">
                                <select onChange={(e)=>{pushcountryentity(e,countryvalue.value,countryindex)}} class="form-select">
                                    <option>Choose Your Option</option>
                                    {
                                                                applicantstatus.map((value,index)=>{
                                                                    return <option key ={index} value={index+1}> {value}</option>
                                                                })
                                                            }
                                </select>
                            </div>
                            <div class="col-sm-3"></div>
                        </div>
                    </div>
                    {
                        detailservice.map((item,index)=>{
                            return <div class="form-check me-3 py-2">
                            <input onChange={(e)=>{pushcountryaction(e,countryvalue.value,countryindex,index)}} class="form-check-input" type="checkbox" value="" id={`${countryvalue.value}${index}`} />
                            <label class="form-check-label" for={`${countryvalue.value}${index}`}>
                                {item}
                            </label>
                        </div>
                        })
                    }

                </div>


            </div>
        </div>
    </div>
    })
}
    

                                            

                                        </div>
                                    </article>
                                    <div class="mt-3  ps-3 pe-3">
                                        <button class="btn btn-primary float-end next-btn" onClick={ () =>{changetab('4')}}>Next</button>
                                        <button class="btn bg-danger-subtle text-danger float-start back-btn" onClick={ () =>{changetab('2')}}>Previous</button>
                                    </div>
                                </div>


                                <div class="activetab-4  ps-3 pe-3" style={{'display':`${tab=='tab4' ? 'block' : 'none'}`}}>
                                    <article class="on mt-0">

                                        <div class="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0" >
                                            <div class="card-body px-4 py-3">
                                                <div class="row align-items-center">
                                                    <div class="col-9">
                                                        <h4 class="fw-semibold mb-8">  Detailed Report</h4>
                                                        <nav aria-label="breadcrumb">
                                                            <ol class="breadcrumb">

                                                                <li class="breadcrumb-item" aria-current="page" >Get
                                                                    Quotation</li>
                                                            </ol>
                                                        </nav>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="text-center mb-n5">
                                                            <img src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/breadcrumb/ChatBc.png" alt="modernize-img" class="img-fluid mb-n4"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="accordion" id="regularAccordionRobots">


                                            <div class="accordion-item">
                                                <h2 id="regularHeadingTen" class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#regularCollapseTen" aria-expanded="false" aria-controls="regularCollapseTen">
                                                        Initial Information
                                                    </button>
                                                </h2>
                                                <div id="regularCollapseTen" class="accordion-collapse collapse show" aria-labelledby="regularHeadingTen" data-bs-parent="#regularAccordionRobots" >
                                                    <div class="accordion-body p-2">
                                                        <div class="accordion-body pt-0 pb-0 ps-3">

                                                            <div class="mb-4 row align-items-center">
                                                                <label for="exampleInputText1" class="form-label col-sm-5 col-form-label">Total
                                                                    Number
                                                                    of Pages</label>
                                                                <div class="col-sm-4">
                                                                    <input type="text" class="form-control" onChange={(e)=>{updatedata('p',e.target.value)}} value={formuladata.p} />
                                                                </div>
                                                                <div class="col-sm-3"></div>
                                                            </div>
                                                            <div class="mb-4 row align-items-center">
                                                                <label for="exampleInputText2" class="form-label col-sm-5 col-form-label">Total
                                                                    Number of Claims</label>
                                                                <div class="col-sm-4">
                                                                    <input type="text" class="form-control" value={formuladata.c} onChange={(e)=>{updatedata('c',e.target.value)}}/>
                                                                </div>
                                                                <div class="col-sm-3"></div>
                                                            </div>
                                                            <div class="mb-4 row align-items-center">
                                                                <label for="exampleInputText30" class="form-label col-sm-5 col-form-label">Priority</label>
                                                                <div class="col-sm-4">
                                                                    <div class="input-group border rounded-1">
                                                                        <input type="text" class="form-control border-0" value={formuladata.pr} onChange={(e)=>{updatedata('pr',e.target.value)}}/>

                                                                    </div>
                                                                    <div class="col-sm-3"></div>
                                                                </div>
                                                            </div>
                                                            <div class="mb-4 row align-items-center">
                                                                <label for="exampleInputText30" class="form-label col-sm-5 col-form-label">ISA
                                                                </label>
                                                                <div class="col-sm-4">
                                                                    <div class="input-group border rounded-1">
                                                                        <input type="text" class="form-control border-0" value={formuladata.i} onChange={(e)=>{updatedata('i',e.target.value)}}/>

                                                                    </div>
                                                                    <div class="col-sm-3"></div>
                                                                </div>
                                                            </div>
                                                            <div class="mb-4 row align-items-center">
                                                                <label for="exampleInputText30" class="form-label col-sm-5 col-form-label">Total words
                                                                </label>
                                                                <div class="col-sm-4">
                                                                    <div class="input-group border rounded-1">
                                                                        <input type="text" class="form-control border-0" value={formuladata.word} onChange={(e)=>{updatedata('word',e.target.value)}}/>

                                                                    </div>
                                                                    <div class="col-sm-3"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="accordion-item">
                                                <h2 id="regularHeading11" class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#regularCollapse11" aria-expanded="false" aria-controls="regularCollapse11">
                                                    Combined Detailed Report
                                                    </button>
                                                </h2>
                                                <div id="regularCollapse11" class="accordion-collapse collapse show" aria-labelledby="regularHeading11" data-bs-parent="#regularAccordionRobots" >

                                                    <div class="accordion-body pt-0 pb-0 ps-3">

                                                        <div class="table-responsive">
                                                            <div class="table-id">
                                                            </div>
                                                            <div class="table-id">
                                                            </div>
                                                            <table class="table mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col" class="odd-color">Country</th>
                                                                        <th scope="col" class="odd-color">Entity</th>
                                                                        <th scope="col" class="even-color">Stages</th>
                                                                        <th scope="col" class="odd-color">Official fee
                                                                        </th>
                                                                        <th scope="col" class="even-color">Professional fee
                                                                        </th>
                                                                        <th scope="col" class="even-color">Trans fee
                                                                        </th>
                                                                        <th scope="col" class="odd-color">Total</th>
                                                                        <th scope="col" class="even-color">Get Detail
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        (tab=='tab4' && getdata.length>0 ? 
                                                                    formuladata.country.map((item,index)=>{
                                                                       
                                                                        let returncost =getcost(item.value,[applicantstatusnumber[item.entity],'pro','trans'],item.service);
                                                                        return <tr>
                                                                        <th scope="row">{item.value}</th>
                                                                        <th scope="row">{applicantstatusvalue[item.entity]}</th>

                                                                        <td>{item.service.map((item)=>detailservice[item-1]).toString()}</td>
                                                                        <td>{returncost[applicantstatusnumber[item.entity]]??'0'}</td>
                                                                        <td>{returncost['pro']??'0'}</td>
                                                                        <td>{returncost['trans']??'0'}</td>

                                                                        <td>{returncost['total']??'0'}</td>
                                                                        <td><a href="#" class="badge bg-warning-subtle text-warning">Detail</a>
                                                                        </td>
                                                                    </tr>
                                                                    }) : <></>)
                                                                    }

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {
    formuladata.country.map((item,index)=>{
                                            return <div class="accordion-item">
                                                <h2 id="regularHeading11" class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#regularCollapse11" aria-expanded="false" aria-controls="regularCollapse11">
                                                    {item.value} Detailed Report
                                                    </button>
                                                </h2>
                                                <div id="regularCollapse11" class="accordion-collapse collapse show" aria-labelledby="regularHeading11" data-bs-parent="#regularAccordionRobots" >

                                                    <div class="accordion-body pt-0 pb-0 ps-3">

                                                        <div class="table-responsive">
                                                            <div class="table-id">
                                                            </div>
                                                            <div class="table-id">
                                                            </div>
                                                            <table class="table mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col" class="even-color">Stages</th>
                                                                        <th scope="col" class="odd-color">Official fee
                                                                        </th>
                                                                        <th scope="col" class="even-color">Professional fee
                                                                        </th>
                                                                        <th scope="col" class="even-color">Trans fee
                                                                        </th>
                                                                        <th scope="col" class="odd-color">Total</th>
                                                                        <th scope="col" class="even-color">Get Detail
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        (tab=='tab4' && getdata.length>0 ? 
                                                                        item.service.map((i,ind)=>{
                                                                       
                                                                        let returncost =getcost(item.value,[applicantstatusnumber[item.entity],'pro','trans'],[i]);
                                                                        return <tr>
                                                                        <td>{detailservice[i-1]}</td>
                                                                        <td>{returncost[applicantstatusnumber[item.entity]]??'0'}</td>
                                                                        <td>{returncost['pro']??'0'}</td>
                                                                        <td>{returncost['trans']??'0'}</td>

                                                                        <td>{returncost['total']??'0'}</td>
                                                                        <td><a href="#" class="badge bg-warning-subtle text-warning">Detail</a>
                                                                        </td>
                                                                    </tr>
                                                                    }) : <></>)
                                                                    }

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
    })
                                            }
                                        </div>

                                    </article>
                                    <div class="mt-3">
                                        <button class="btn btn-primary float-end next-btn" onclick="showSuccessPopup()">Final</button>
                                        <button class="btn bg-danger-subtle text-danger float-start back-btn" onClick={()=>{changetab('3')}}>Previous</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </div>
        </>
    )
}
export default Calculatecost;