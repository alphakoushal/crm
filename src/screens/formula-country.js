import React,{Suspense,useEffect,useState,useContext} from "react";
import { Link } from "react-router-dom";
import Headerblank from "../component/Header-blank";
import { defaultvalue } from "../constant/Constant";

const Countrylist = () =>{
  const [countrytab,setcountrytab]=useState('');
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
                  <h5 className="mb-3">Country List</h5> 
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
                                                                                
                                                                                <label class="form-check-label" for="flexCheckDefault">
                                                                                <Link to={"/edit-country-formula?id="+val.code}>{val.name}</Link>
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