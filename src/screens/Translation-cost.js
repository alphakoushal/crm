import React, { useRef, useState, useCallback,useEffect } from "react";
import { Route } from "react-router-dom";
import Header from "../component/Header";
import { defaultvalue } from "../constant/Constant";
import Uploaddata from "../services/uploaddata";
import moment from "moment";
import { use } from "react";
const Translationcost = () => {
  const platform = useRef("ip");
  const [translation_Cost, updatetranslation_Cost] = useState([]);
  const translationcostinitialvalue = useRef({});
  const addCost = useCallback(async () => {
    let title = document.getElementById("has_title").value;
    let fromlang = document.getElementById("has_fromlanguage").value;
    let tolang = document.getElementById("has_tolanguage").value;
    let fillingtype = document.getElementById("has_fillingtype").value;
    let fillingcurrency = document.getElementById("has_fillingcurrency").value;
    let cost = document.getElementById("has_cost").value;
    let description = document.getElementById("has_description").value;
    if (fromlang === "Select Language" || fromlang === "") {
      alert("Please select from language");
      return false;
    } else if (tolang === "Select Language" || tolang === "") {
      alert("Please select to language");
      return false;
    } else if (fillingtype === "Select Type" || fillingtype === "") {
      alert("Please select type");
      return false;
    } else if (
      fillingcurrency === "Select Currency" ||
      fillingcurrency === ""
    ) {
      alert("Please select currency");
      return false;
    } else if (cost === "") {
      alert("Please enter cost");
      return false;
    } else {
      let transdetails = {
        from: fromlang,
        title: title,
        to: tolang,
        currency: fillingcurrency,
        cost: cost,
        description: description,
        type: fillingtype,
      };
      try{
      const result = await Uploaddata.pctaxiosrequest({
        posttype: "add-translation-cost",
        type: translationcostinitialvalue.current?.id ? "edit" : "add",
        id: translationcostinitialvalue.current?.id
          ? translationcostinitialvalue.current.id
          : "",
        data: JSON.stringify(transdetails),
      });
      if (result.data.success) {
        closeform();
        fetchdata();
        alert(
          translationcostinitialvalue.current?.id
            ? "Translation cost updated successfully"
            : "Translation cost added successfully"
        );
      }
      else
      {
        alert(result.data.errors.error);
      }
    }
    catch(err)
    {
      alert("Some error occured");      
    }
}
  }, []);
  const openform = useCallback((item={}) => {
   if(item?.id)
   {
    console.log("item", item);
    translationcostinitialvalue.current = item;
    document.getElementById("has_title").value=JSON.parse(item.details).title;
    document.getElementById("has_fromlanguage").value=JSON.parse(item.details).from;
    document.getElementById("has_tolanguage").value=JSON.parse(item.details).to;
    document.getElementById("has_fillingtype").value=JSON.parse(item.details).type;
    document.getElementById("has_fillingcurrency").value=JSON.parse(item.details).currency;
    document.getElementById("has_cost").value=JSON.parse(item.details).cost;
    document.getElementById("has_description").value=JSON.parse(item.details).description;
   }
   else
   {
    translationcostinitialvalue.current = {};
   }
    document.getElementById("addnotesmodal")?.classList.add("show");
    document.body.classList.add("modal-open");
    document.body.style.paddingRight = "0px";
    document.getElementById("addnotesmodal").style.display = "block";
    document.getElementById("addnotesmodal").style.backgroundColor =
      "rgba(0, 0, 0, 0.5)";
  }, []);
  const closeform = useCallback(() => {
    document.getElementById("addnotesmodal")?.classList.remove("show");
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = "0px";
    document.getElementById("addnotesmodal").style.display = "none";
  }, []);
  const fetchdata = useCallback( async() => {
    try{
    const result = await Uploaddata.pctaxiosrequest({
      posttype: "fetch-translation-cost",
      data: "",
    });
    if(result.data.success)
    {
    updatetranslation_Cost(result.data.data);
    }
}
catch(err)
{

}
  }, []);
  useEffect(() => {
    fetchdata();
  }, []);
  const languageSelection = useCallback((event,type)=>{
    const selectfrom = document.querySelector('#has_fromlanguage');
    const selectto = document.querySelector('#has_tolanguage');
const title=`${selectfrom.options[selectfrom.selectedIndex].text} to ${selectto.options[selectto.selectedIndex].text}`;
document.querySelector('#has_title').value=title; 
},[]);
  return (
    <div className="custom-table">
      <Header
        platform={platform}
        changedata={() => {}}
        showanalyticsidebar={() => {}}
        except={true}
        completedata={[]}
        alldata={[]}
        showmailbox={() => {}}
        showdupemailbox={() => {}}
        showcronbox={() => {}}
        clearfilters={() => {}}
        refreshdata={() => {}}
        formdatas={{}}
        showcurrencies={() => {}}
      ></Header>
      <div className="container-fluid">
        <ul className="nav nav-pills p-3 mb-3 rounded align-items-center card flex-row">
          <li className="nav-item">
            <a
              href="javascript:void(0)"
              className="
                      nav-link
                     gap-6
                      note-link
                      d-flex
                      align-items-center
                      justify-content-center
                      active
                      px-3 px-md-3
                    "
              id="all-category"
            >
              <i className="ti ti-list fill-white"></i>
              <span className="d-none d-md-block fw-medium">All Translation Cost</span>
            </a>
          </li>

          <li className="nav-item ms-auto">
            <a
              href="javascript:void(0)"
              className="btn btn-primary d-flex align-items-center px-3 gap-6"
              onClick={() => {
                openform();
              }}
            >
              <i className="ti ti-file fs-4"></i>
              <span className="d-none d-md-block fw-medium fs-3">
                Add Translation Cost
              </span>
            </a>
          </li>
        </ul>
        <div className="tab-content">
<div class="card w-100">
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table align-middle text-nowrap mb-0">
                      <thead>
                        <tr class="text-muted fw-semibold">
                          <th scope="col" class="ps-0">Title</th>
                          <th scope="col">Type</th>
                          <th scope="col">Cost</th>
                          <th scope="col">Added Date</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody class="border-top">
                         {translation_Cost.map((item, index) => (
                                                 <tr>
                          <td class="ps-0">
                            {JSON.parse(item.details).title}
                          </td>
                          <td>
                            <span class="badge fw-semibold py-1 w-85 bg-primary-subtle text-primary">{JSON.parse(item.details).type}</span>
                          </td>
                          <td>
                            <span class="badge fw-semibold py-1 w-85 bg-primary-subtle text-primary">{JSON.parse(item.details).cost}</span>
                          </td>
                          <td>
                            <p class="fs-3 text-dark mb-0">{moment(JSON.parse(item.other_details).addedon).format('DD MMMM YYYY')}</p>
                          </td>
                          <td>
                            <p class="fs-3 text-dark mb-0"> <i onClick={() => {
                openform(item);
              }} className="ti ti-edit fs-5 position-relative"></i></p>
                          </td>
                        </tr>
                        ))}
                        
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
        </div>
        <div
          className="modal fade"
          id="addnotesmodal"
          tabindex="-1"
          aria-labelledby="addnotesmodalTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0">
              <div className="modal-header text-bg-primary">
                <h6 className="modal-title text-white">Add Translation Cost</h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    closeform();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="notes-box">
                  <div className="notes-content">
                    <form action="javascript:void(0);" id="addnotesmodalTitle">
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <div className="note-title">
                            <label className="form-label">Title</label>
                            <input
                              type="text"
                              id="has_title"
                              className="form-control"
                              minlength="25"
                              placeholder="Add Translation Cost"
                            />
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="filling-language">
                            <label className="form-label">
                              Choose language From
                            </label>
                            <select
                              id="has_fromlanguage"
                              className="form-select"
                              aria-label="Default select example"
                              onChange={(e)=>{languageSelection(e,'from')}}
                            >
                              <option selected>Select Language</option>
                              {Object.keys(defaultvalue.filinglangcode).map(
                                (key, index) => (
                                  <option key={index} value={key}>
                                    {defaultvalue.filinglangcode[key]}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="filling-language">
                            <label className="form-label">
                              Choose language To
                            </label>
                            <select
                              id="has_tolanguage"
                              className="form-select"
                              aria-label="Default select example"
                              onChange={(e)=>{languageSelection(e,'to')}}
                            >
                              <option selected>Select Language</option>
                              {Object.keys(defaultvalue.filinglangcode).map(
                                (key, index) => (
                                  <option key={index} value={key}>
                                    {defaultvalue.filinglangcode[key]}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="filling-type">
                            <label className="form-label">Choose Type</label>
                            <select
                              id="has_fillingtype"
                              className="form-select"
                              aria-label="Default select example"
                            >
                              <option selected>Select Type</option>
                              <option value="word">Word</option>
                              <option value="page">Page</option>
                              <option value="char">Character</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="filling-currency">
                            <label className="form-label">
                              Choose Currency
                            </label>
                            <select
                              id="has_fillingcurrency"
                              className="form-select"
                              aria-label="Default select example"
                            >
                              <option selected>Select Currency</option>
                              <option value="USD">USD</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="note-title">
                            <label className="form-label">Cost</label>
                            <input
                              type="text"
                              id="has_cost"
                              className="form-control"
                              minlength="25"
                              placeholder="Add Cost"
                            />
                          </div>
                        </div>
                        <div className="col-md-12 mb-3">
                          <div className="note-description">
                            <label className="form-label">Description</label>
                            <textarea
                              id="has_description"
                              className="form-control"
                              minlength="60"
                              placeholder="Description"
                              rows="3"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-flex gap-6">
                  <button
                    onClick={() => {
                      closeform();
                    }}
                    className="btn bg-danger-subtle text-danger"
                    data-bs-dismiss="modal"
                  >
                    Discard
                  </button>
                  <button
                    id="btn-n-add"
                    onClick={() => {
                      addCost();
                    }}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Translationcost;
