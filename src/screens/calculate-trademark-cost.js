import React,{useState,useEffect, useRef} from "react";
import Toast from "../component/New-toast";
import { defaultvalue } from "../constant/Constant";
import Headerblank from "../component/Header-blank";
import Fetchdata from "../services/fetchdata";
import Uploaddata from "../services/uploaddata";
import '../component/style/calcost.css'
const Calculatetradecost = () =>{
let coststage=[{'value':"IP Type Selection"},{'value':"Country Selection"},{'value':"Stages Selection"},{'value':"Detailed Report"}]
let service = ['Trademark'];
let detailservice = ['Filing','Examination','Granting','Annuity'];
let applicantstatus = [{'name':'Large','key':'3'},{'name':'Small','key':'2'}];
let applicantstatusnumber = {'2':'s','3':'l'};
let applicantstatusvalue = {'2':'Small','3':'Large'};
const [getdata,setdata]=useState([]);
const [tab,settab]=useState('tab1');
const [countrytab,setcountrytab]=useState('');
const currenttrans=useRef([]);
const [currenttrans1,updatecurrenttrans1]=useState([]);
const [validate,setvalidate]=useState({status:false,color:'error',icon:'error',message:'',file:''});
const [qtab,setqtab]=useState('');
const [formuladata,setformuladata]=useState({'ref':'','breakup':'no','appno':'ES2022/070522','applicant':'Koushal sethi','c':'12','as':'','country':[]});
const updatedata = (k,value) =>{
    setformuladata((prev)=>({...prev,[k]:value}))
}
const createpdf = async () =>{
    let createpdf = await Uploaddata.createpdf({'data':JSON.stringify(formuladata),'country':JSON.stringify(getdata),'posttype':'createpdf'}).then((response)=>{return response;});
    if(createpdf.data.success)
    {
        setvalidate((prev)=>({...prev,file:createpdf.data.file,status:true,message:`${createpdf.data.message} ${createpdf.data.file}`,color:'success',icon:'success'}))
    }
    else
    {
    setvalidate((prev)=>({...prev,file:'',status:false,message:createpdf.errors.error,color:'error',icon:'error'}))
}
}
const handleClose = () =>{
    setvalidate((prev)=>({...prev,file:'',status:false,message:``,color:'success',icon:'success'}))

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
if(keys==1)
{
    console.log(returncostoverall(parts['part'+keys],status,('part'+keys)),status);
                cost = cost + returncostoverall(parts['part'+keys],status,('part'+keys));
}
        }
       })
       costs[(status=='' ? 'pro' : status)]=cost;
       total = total + cost;
       cost=0;
    })
    costs['total']=total;
    total=0;
    }
    })
    return costs;
}
const returncostoverall = (parts,s,partkey) =>{
    let cost=0; 
    if(partkey=='part1')
    {
        parts.map((item,index)=>{
            let t = (s=='' ? 'm' : s);
             if(item[`${(s=='' ? 'm' : s)}c`]!='')// standard cost
             {     
          cost = cost + parseInt(item[`${(s=='' ? 'm' : s)}c`]);
             } 
             if(parseInt(formuladata['c'])>parseInt(item['c']) && item['c']!='' && item[`cc${s}`]!='') //page cost
             {
             cost = cost + ((parseInt(formuladata['c'])-parseInt(item['c']))*parseInt(item[`cc${s}`]));
             }
             
     })
    }
    else
{
    parts.map((item,index)=>{
       let t = (s=='' ? 'm' : s);
        if(item[`${(s=='' ? 'm' : s)}c`]!='')// standard cost
        {        
     cost = cost + parseInt(item[`${(s=='' ? 'm' : s)}c`]);
        } 
        if(parseInt(formuladata['c'])>parseInt(item['c']) && item['c']!='' && item[`cc${s}`]!='') //page cost
        {
        cost = cost + ((parseInt(formuladata['c'])-parseInt(item['c']))*parseInt(item[`cc${s}`]));
        }
})
}
return cost;
}

const getcountrydata = async() => {
    let fetchcountry=await Fetchdata.fetchcountry({'matter':'2','posttype':'fetchcountry',country:formuladata.country.map((item)=>"'"+item.value+"'").toString()}).then((response)=>{return response});
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
    currenttrans.current=[];
})
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
    setformuladata((prev)=>({...prev,['country']:[...prev.country,{'value':val,'service':[1],'entity':'3'}]})) 
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
    
    const returntranscost = (from,to,word,chars,pages)=>{
        let gettranscost=defaultvalue.transcost.filter((item)=>item.from==from && item.to==to);
        let totalcost=0;
   if(gettranscost.length>0)
   {
    console.log(gettranscost);
       totalcost =((gettranscost[0].type=='word' ? parseFloat(word) : (gettranscost[0].type=='char' ? parseFloat(chars) : (gettranscost[0].type=='page' ? parseFloat(pages) : parseFloat(word))) ) * parseFloat(gettranscost[0].cost)) + 150;
       let ob ={'lng':to,'cost':totalcost}
       console.log(currenttrans.current);
       let f =currenttrans.current.filter((item)=>item.lng==to);
       if(f.length>0)
       {
        totalcost ='Already Mentioned';
       }
       else
       {
       currenttrans.current.push(ob);
       }
   }
return totalcost;
            }
            
return(
        <>
        <div className={"body-wrapper1 custom-table "}>  
        <Toast validate={validate} handleClose={handleClose}></Toast>
        <Headerblank></Headerblank>
        <div className="container">
            <div className="row">
                <div className="div_1">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-2">
                                <div className="quotation_leftpanel">
                                    <ul>
                                        {
                                            coststage.map((value,index)=>{
                                               return <li key={index}  className={`step${index+1} ${(tab=='tab'+(index+1) ? 'active' : '')}`}>
                                                <a onClick={()=>{changetab(index+1)}} key={index}   className="active-tab">{value.value}</a>
                                            </li>
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-10">
                                <div className="activetab-1 ps-3 pe-3" style={{'display':`${tab=='tab1' ? 'block' : 'none'}`}}>
                                    <div className="main-radio">
                                        {
                                            service.map((value,index)=>{
return <>
<input key={index} type="radio" id={`tab${index}`} name="tab" />
                                        <label htmlFor="tab1" className="me-3">{value}</label></>
                                            })
                                        }
                                    </div>
                                    <article className="on">
                                        <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0" >
                                            <div className="card-body px-4 py-3">
                                                <div className="row align-items-center">
                                                    <div className="col-9">
                                                        <h4 className="fw-semibold mb-8"> Application Information</h4>
                                                        <nav aria-label="breadcrumb">
                                                            <ol className="breadcrumb">
                                                                <li className="breadcrumb-item" aria-current="page" >Get
                                                                    Quotation</li>
                                                            </ol>
                                                        </nav>
                                                    </div>
                                                    <div className="col-3">
                                                        <div className="text-center mb-n5">
                                                            <img src="https://www.anuation.com/crm/assets/icons/svg/icon-dd-chat.svg" alt="modernize-img" className="img-fluid mb-n4"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">

                                            <div className="card-body row">
                                                <div className="mb-4 row align-items-center col-6">
                                                    <label htmlFor="exampleInputText1" className="form-label col-sm-6 col-form-label">Client Name</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" value={formuladata.applicant} onChange={(e)=>{updatedata('applicant',e.target.value)}} className="form-control" placeholder="Client Name"/>
                                                    </div>
                                                    <div className="col-sm-3"></div>
                                                </div>
                                                <div className="mb-4 row align-items-center col-6">
                                                    <label htmlFor="exampleInputText1" className="form-label col-sm-6 col-form-label">Patent Application</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" value={formuladata.appno} onChange={(e)=>{updatedata('appno',e.target.value)}} className="form-control" placeholder="Patent Application"/>
                                                    </div>
                                                    <div className="col-sm-3"></div>
                                                </div>
                                                <div className="mb-4 row align-items-center col-6">
                                                    <label htmlFor="exampleInputText30" className="form-label col-sm-6 col-form-label">Class</label>
                                                    <div className="col-sm-6">
                                                        <div className="input-group border rounded-1">
                                                            <input type="text" value={formuladata.c} onChange={(e)=>{updatedata('c',e.target.value)}} className="form-control border-0" placeholder="Priority"/>

                                                        </div>
                                                        <div className="col-sm-3"></div>
                                                    </div>
                                                </div>
                                                <div className="mb-4 row align-items-center col-6">
                                                    <label htmlFor="exampleInputText1" className="form-label col-sm-6 col-form-label">Break-up Cost</label>
                                                    <div className="col-sm-6">
                                                        <select  onChange={(e)=>updatedata('breakup',e.target.value)} className="form-select w-auto">
                      <option value=''>Choose Option</option>
                      <option Selected={formuladata['breakup']=='yes' ? 'Selected' : false} value='yes'>Yes</option>
                      <option Selected={formuladata['breakup']=='no' ? 'Selected' : false} value='no'>No</option>

                    </select>
                                                    </div>
                                                    <div className="col-sm-3"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                    <div className="mt-3">
                                        <button className="btn btn-primary float-end next-btn" onClick={()=>{changetab('2')}}>Next</button>
                                    </div>
                                </div>
                                
                                <div className="activetab-2  ps-3 pe-3" style={{'display':`${tab=='tab2' ? 'block' : 'none'}`}}>
                                    <article className="on mt-0">
                                        <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0" >

                                            <div className="card-body px-4 py-3">
                                                <div className="row align-items-center">
                                                    <div className="col-9">
                                                        <h4 className="fw-semibold mb-8"> Country Selection</h4>
                                                        <nav aria-label="breadcrumb">
                                                            <ol className="breadcrumb" style={{"display": "flex","alignItems": "center"}}>

                                                                <li className="breadcrumb-item" aria-current="page">Get
                                                                    Quotation</li>
                                                            </ol>
                                                        </nav>
                                                    </div>
                                                    <div className="col-3">
                                                        <div className="text-center mb-n5">
                                                            <img src="https://www.anuation.com/crm/assets/icons/svg/icon-dd-chat.svg" alt="modernize-img" className="img-fluid mb-n4"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-body p-0">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        {
                                                            defaultvalue.continent_country.map((value,index)=>{
                                                        return <div key={index} className="accordion" id="regularAccordionRobots">
                                                            <div className="accordion-item">
                                                                <h2 id="regularHeadingSix" className="accordion-header">
                                                                    <button className="accordion-button" type="button" onClick={()=>{changecountyrtab(index+1)}} data-bs-toggle="collapse" data-bs-target="#regularCollapseSix" aria-expanded="true" aria-controls="regularCollapseSix">
                                                                        {Object.keys(value)[0]}
                                                                    </button>
                                                                </h2>
                                                                <div id="regularCollapseSix" className={`accordion-collapse collapse ${countrytab=='tab'+(index+1) ? 'show' : ''}`} aria-labelledby="regularHeadingSix" data-bs-parent="#regularAccordionRobots">
                                                                    <div className="accordion-body p-2">

                                                                        <div className="row">
                                                                            {
                                                                               value[Object.keys(value)[0]].map((val,ind)=>{
                                                                                return <div key={ind} className="col-md-3">            
                                                           <div className="form-check me-3 py-2">
                                                                                <input onChange={(e)=>{pushvalue(e,val.code)}} className="form-check-input" type="checkbox" value={val.code} id={`country${val.code}`}/>
                                                                                <label className="form-check-label" htmlFor={`country${val.code}`}>
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
                                    <div className="mt-3">
                                        <button className="btn btn-primary float-end next-btn" onClick={()=>{changetab('3')}}>Next</button>
                                        <button className="btn bg-danger-subtle text-danger float-start back-btn" onClick={()=>{changetab('1')}}>Previous</button>
                                    </div>
                                </div>

                                <div className="activetab-3  ps-3 pe-3" style={{'display':`${tab=='tab3' ? 'block' : 'none'}`}}>
                                    <article className="on mt-0">

                                        <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0" >
                                            <div className="card-body px-4 py-3">
                                                <div className="row align-items-center">
                                                    <div className="col-9">
                                                        <h4 className="fw-semibold mb-8"> Stages Selection</h4>
                                                        <nav aria-label="breadcrumb">
                                                            <ol className="breadcrumb">

                                                                <li className="breadcrumb-item" aria-current="page" >Get
                                                                    Quotation</li>
                                                            </ol>
                                                        </nav>
                                                    </div>
                                                    <div className="col-3">
                                                        <div className="text-center mb-n5">
                                                            <img src="https://www.anuation.com/crm/assets/icons/svg/icon-dd-chat.svg" alt="modernize-img" className="img-fluid mb-n4"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion" id="regularAccordionRobots">

{
    formuladata.country.map((countryvalue,countryindex)=>{
        return <div key={countryindex} className="accordion-item">
        <h2 id="regularHeadingNine" className="accordion-header">
            <button onClick={(it)=>{changequotetab('tab'+countryvalue.value)}} className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#regularCollapseNine" aria-expanded="true" aria-controls="regularCollapseNine">
               {defaultvalue.countriescode[countryvalue.value].name}
            </button>
        </h2>
        <div id="regularCollapseNine" className={`accordion-collapse collapse ${(qtab=='tab'+countryvalue.value ? 'show' : '')}`} aria-labelledby="regularHeadingNine" data-bs-parent="#regularAccordionRobots">
            <div className="accordion-body p-2">
                <div className="">
                    <div className="div_option">
                        <div className="row align-items-center">
                            <label htmlFor="exampleInputText3" className="form-label col-sm-5 col-form-label">Entity</label>
                            <div className="col-sm-7">
                                <select onChange={(e)=>{pushcountryentity(e,countryvalue.value,countryindex)}} className="form-select">
                                    <option>Choose Your Option</option>
                                    {
                                                                applicantstatus.map((value,index)=>{
                                                                    return <option  Selected={countryvalue['entity']==(value['key']) ? 'Selected' : false} key ={value['key']} value={value['key']}> {value['name']}</option>
                                                                })
                                                            }
                                </select>
                            </div>
                            <div className="col-sm-3"></div>
                        </div>
                    </div>
                    {
                        detailservice.map((item,index)=>{
                            return <div key={index} className="form-check me-3 py-2">
                            <input checked={ countryvalue.service.includes((index+1)) ? true : ''}  onChange={(e)=>{pushcountryaction(e,countryvalue.value,countryindex,index)}} className="form-check-input" type="checkbox" value="" id={`${countryvalue.value}${index}`} />
                            <label className="form-check-label" htmlFor={`${countryvalue.value}${index}`}>
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
                                    <div className="mt-3  ps-3 pe-3">
                                        <button className="btn btn-primary float-end next-btn" onClick={ () =>{changetab('4')}}>Next</button>
                                        <button className="btn bg-danger-subtle text-danger float-start back-btn" onClick={ () =>{changetab('2')}}>Previous</button>
                                    </div>
                                </div>


                                <div className="activetab-4  ps-3 pe-3" style={{'display':`${tab=='tab4' ? 'block' : 'none'}`}}>
                                    <article className="on mt-0">

                                        <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0" >
                                            <div className="card-body px-4 py-3">
                                                <div className="row align-items-center">
                                                    <div className="col-9">
                                                        <h4 className="fw-semibold mb-8">  Detailed Report</h4>
                                                        <nav aria-label="breadcrumb">
                                                            <ol className="breadcrumb">

                                                                <li className="breadcrumb-item" aria-current="page" >Get
                                                                    Quotation</li>
                                                            </ol>
                                                        </nav>
                                                    </div>
                                                    <div className="col-3">
                                                        <div className="text-center mb-n5">
                                                            <img src="https://www.anuation.com/crm/assets/icons/svg/icon-dd-chat.svg" alt="modernize-img" className="img-fluid mb-n4"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion" id="regularAccordionRobots">


                                            <div className="accordion-item mt-3">
                                                <h2 id="regularHeadingTen" className="accordion-header">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#regularCollapseTen" aria-expanded="false" aria-controls="regularCollapseTen">
                                                        Initial Information
                                                    </button>
                                                </h2>
                                                <div id="regularCollapseTen" className="accordion-collapse collapse show" aria-labelledby="regularHeadingTen" data-bs-parent="#regularAccordionRobots" >
                                                    <div className="accordion-body p-2">
                                                        <div className="accordion-body pt-0 pb-0 ps-3 row">
                                                <div className="mb-4 row align-items-center col-6">
                                                    <label htmlFor="exampleInputText1" className="form-label col-sm-6 col-form-label">Applicant</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" onChange={(e)=>{updatedata('applicant',e.target.value)}} className="form-control" value={formuladata.applicant}/>
                                                    </div>
                                                    <div className="col-sm-3"></div>
                                                </div>
                                                <div className="mb-4 row align-items-center col-6">
                                                    <label htmlFor="exampleInputText1" className="form-label col-sm-6 col-form-label">Patent Application</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" onChange={(e)=>{updatedata('appno',e.target.value)}} className="form-control" value={formuladata.appno}/>
                                                    </div>
                                                    <div className="col-sm-3"></div>
                                                </div>
                                                <div className="mb-4 row align-items-center col-6">
                                                    <label htmlFor="exampleInputText30" className="form-label col-sm-6 col-form-label">Class</label>
                                                    <div className="col-sm-6">
                                                        <div className="input-group border rounded-1">
                                                            <input type="text" onChange={(e)=>{updatedata('c',e.target.value)}} className="form-control border-0" value={formuladata.c}/>

                                                        </div>
                                                        <div className="col-sm-3"></div>
                                                    </div>
                                                </div>
                                                <div className="mb-4 row align-items-center col-6">
                                                    <label htmlFor="exampleInputText1" className="form-label col-sm-6 col-form-label">Break-up Cost</label>
                                                    <div className="col-sm-6">
                                                        <select  onChange={(e)=>updatedata('breakup',e.target.value)} className="form-select w-auto">
                      <option value=''>Choose Option</option>
                      <option Selected={formuladata['breakup']=='yes' ? 'Selected' : false} value='yes'>Yes</option>
                      <option Selected={formuladata['breakup']=='no' ? 'Selected' : false} value='no'>No</option>

                    </select>
                                                    </div>
                                                    <div className="col-sm-3"></div>
                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item mt-3">
                                                <h2 id="regularHeading11" className="accordion-header">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#regularCollapse11" aria-expanded="false" aria-controls="regularCollapse11">
                                                    Combined  Quotation to file the patent application
                                                    </button>
                                                </h2>
                                                <div id="regularCollapse11" className="accordion-collapse collapse show" aria-labelledby="regularHeading11" data-bs-parent="#regularAccordionRobots" >

                                                    <div className="accordion-body pt-0 pb-0 ps-3">

                                                        <div className="table-responsive">
                                                            <table className="table mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col" className="odd-color">Country</th>
                                                                        <th scope="col" className="even-color">Entity</th>
                                                                        <th scope="col" className="even-color">Stages</th>
                                                                        {
                                                                            (formuladata['breakup']=='yes' ?
                                                                            <><th scope="col" className="odd-color">Official fee </th>
                                                                            <th scope="col" className="even-color">Professional fee</th>
                                                                            <th scope="col" className="even-color">Total</th></>
                                                                            :
                                                     <>
                                                     <th scope="col" className="even-color">Cost</th></>
                                                                            )
                                                                        }
                                                                        
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        (tab=='tab4' && getdata.length>0 ? 
                                                                    formuladata.country.map((item,index)=>{
                                                                        let stages=item.service.filter((item)=>{return item==1});
                                                                        let filterc=getdata.filter((fi)=>{return fi.country==item.value});
                                                                                if(filterc.length>0)
                                                                        {
                                                                            let parseddata=JSON.parse(filterc[0].data);
                                                                        
                                                                        let returncost =getcost(item.value,[applicantstatusnumber[item.entity],''],stages);                                                    
                                                                       return <tr key={index}>
                                                                        <th scope="row">{defaultvalue.countriescode[item.value].name}</th>
                                                                        <th scope="row">{applicantstatusvalue[item.entity]}</th>
                                                                        <td>{stages.map((item)=>detailservice[item-1]).toString()}</td>
                                                                        {
                                                                            (formuladata['breakup']=='yes' ?
                                                                            <>
                                                                            <td>{defaultvalue.filinglangcurr[parseddata.part5[0].curr]} {returncost[applicantstatusnumber[(item.entity=='' ? '1' : item.entity) ]]??'0'}</td>
                                                                        <td>{defaultvalue.filinglangcurr[parseddata.part5[0].curr]} {returncost['pro']??'0'}</td>
                                                                        <td>{defaultvalue.filinglangcurr[parseddata.part5[0].curr]} {returncost['total']??'0'}</td>
                                                                  
                                                                            </>
                                                                            :
                                                     <>
                                                                       <td>{defaultvalue.filinglangcurr[parseddata.part5[0].curr]} {returncost['total']??'0'}</td>
                                                                  
                                                     </>
                                                                            )
                                                                        }
                                                                         </tr>
                                                                                }})
                                                                     : <></>)
                                                                    }

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {
    formuladata.country.map((item,index)=>{
        let filterc=getdata.filter((fi)=>{return fi.country==item.value});
        if(filterc.length>0)
{
    let parseddata=JSON.parse(filterc[0].data);
    let f =currenttrans.current.filter((item)=>item.lng==parseddata.part5[0].fl);
                                            return <div className="accordion-item mt-3">
                                                <h2 id="regularHeading11" className="accordion-header">
                                                    <button onClick={(it)=>{changequotetab('tabreport'+item.value)}} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#regularCollapse11" aria-expanded="false" aria-controls="regularCollapse11">
                                                    {defaultvalue.countriescode[item.value].name} Quotation
                                                    </button>
                                                </h2>
                                                <div id="regularCollapse11" className={`py-0 accordion-collapse collapse ${'tabreport'+item.value==qtab ? 'show' : ''}`} aria-labelledby="regularHeading11" data-bs-parent="#regularAccordionRobots" >

                                                    <div className="accordion-body pt-0 pb-0 ps-3">
                                                    <p className="card-subtitle">Type of Entity: <b>{applicantstatusvalue[item.entity]}</b></p>
                                                        <div className="table-responsive">
                                                            <table className="table mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col" className="even-color">Description</th>
                                                                        <th scope="col" className="even-color">Timeline</th>
                                                                        {
                                                                            (formuladata['breakup']=='yes' ?
                                                                            <>
  <th scope="col" className="odd-color">Official fee <br></br> ({defaultvalue.filinglangcurr[parseddata.part5[0].curr]})</th>
                                                                        <th scope="col" className="even-color">Professional fee <br></br> ({defaultvalue.filinglangcurr[parseddata.part5[0].curr]})</th>
                                                                        <th scope="col" className="odd-color">Total <br></br> ({defaultvalue.filinglangcurr[parseddata.part5[0].curr]})</th>
                                                                  
                                                                            </>
                                                                            :
                                                     <>
                                                                        <th scope="col" className="odd-color">Cost <br></br> ({defaultvalue.filinglangcurr[parseddata.part5[0].curr]})</th>
                                                                                                                                      
                                                     </>
                                                                            )
                                                                        }
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        (tab=='tab4' && getdata.length>0 ? 
                                                                        
                                                                        item.service.map((i,ind) => {
                                                                                return (
                                                                                    <>
                                                                                      {
                                                                                        
                                                                                        parseddata['part'+i].map((parti,index1)=>{
                                                                                            let returncost =returncostoverall([parti],applicantstatusnumber[item.entity],('part'+i));
                                                                                            let returncostpro =returncostoverall([parti],'',('part'+i));
                                                                                            const regex = /[^0-9.]/;
                                                                                            let total=parseInt(returncost??0) + parseInt(returncostpro??0);
                                                                                        return <tr key={index1}>
                                                                                        <td className="text-wrap width-240">{parti.desc}</td>
                                                                                        <td className="text-wrap width-240">{parti.time??''}</td>
                                                                                        {
                                                                            (formuladata['breakup']=='yes' ?
                                                                            <>
                                                                                        <td> { returncost}</td>
                                                                                        <td> {returncostpro}</td>
                                                                                        <td>{total??0}</td>
                                                                            </>
                                                                            :
                                                     <>
                                                                                         <td>{total??0}</td>                                                                                 
                                                     </>
                                                                            )
                                                                        }

                                                                                    </tr>
                                                                                      })
                                                                                      }
                                                                                    </>
                                                                                )

                                                                          }): <></>)
                                                                    }
                                                                </tbody>
                                                            </table><p><br></br></p>
                                                            <div
        dangerouslySetInnerHTML={{ __html: filterc[0].pointers }}
      />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
 } })
                                            }
                                        </div>

                                    </article>
                                    <div className="mt-3">
                                        <button className="btn btn-primary float-end next-btn mx-1" onClick={()=>{createpdf()}}>Final</button>
                                        {validate.file && validate.file!='' ? <a target="_blank" href={`https://www.anuation.com/oldcrm/employee/auth/${validate.file}`} className="btn btn-primary float-end next-btn">View</a> : <></>}
                                        <button className="btn bg-danger-subtle text-danger float-start back-btn" onClick={()=>{changetab('3')}}>Previous</button>
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
export default Calculatetradecost;