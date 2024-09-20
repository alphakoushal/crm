import React,{Suspense,useEffect,useState,useContext} from "react";
import { Link } from "react-router-dom";
import Headerblank from "../component/Header-blank";
import { defaultvalue } from "../constant/Constant";

const Countrylist = () =>{
  const [countrytab,setcountrytab]=useState('');
  const [mattertype,setmattertype] =useState('1');
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
    const settype = (e)=>{
        setmattertype(e.target.value);
    }
    return (
        <>
        <Headerblank except={false}></Headerblank>
        <div className={"body-wrapper1 custom-table "}>   
    <div className="container-fluid bootstrap-table">
        <div className="fixed-table-container fixed-height d-flex">
<div className="row custom-table">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                    <div className="mb-3 mb-sm-0">
                      <h4 className="card-title fw-semibold">Country List</h4>
                      <p className="card-subtitle mb-0">Add details</p>
                    </div>
                    <select onChange={(e)=>{settype(e)}} id='mattertype' className="form-select w-auto">
                      <option value="">Choose Type</option>
                      <option value="1">Patent</option>
                      <option value="2">Trademark</option>
                      <option value="3">Design</option>
                    </select>
                  </div>
                  <div className="card">
                                            <div className="card-body p-0">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        {
                                                            defaultvalue.continent_country.map((value,index)=>{
                                                        return <div className="accordion" id="regularAccordionRobots">
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
                                                                                return <div className="col-md-3">            
                                                           <div className="form-check me-3 py-2">
                                                                                
                                                                                <label className="form-check-label" for="flexCheckDefault">
                                                                                <Link to={"/edit-country-formula?id="+val.code+"&matter="+mattertype}>{val.name}</Link>
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
                </div>
              </div>
            </div>
          </div>
          </div></div></div>
        </>
    )
}

export default Countrylist;