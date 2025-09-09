import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  memo,
  Suspense,
  lazy,
  useCallback,
} from "react";
import Header from "../../component/Header.js";
import {
  callstatus,
  emailstatus,
  costs,
  standard,
  tablesetting,
  defaultvalue,
} from "../../constant/Constant.js";
import Fetchipdata from "../../services/pct/index.js";
import moment from "moment";
import Uploaddata from "../../services/uploaddata.js";
import Fuse from "fuse.js";
const PctForm = () => {
  const platform = useRef("anuation");
  const [agentdata, setagentdata] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [data, updatedata] = useState({ status: false, message: "" });
  const [validate, setvalidate] = useState({
    status: false,
    color: "error",
    icon: "error",
    message: "",
    modalstatus: true,
  });
  const auth = JSON.parse(localStorage.getItem("user"));
  function deadlinedate(v) {
    document.querySelector("#d30").value = moment(v)
      .add(30, "M")
      .subtract(1, "d")
      .format("DD-MM-YYYY");
    document.querySelector("#d31").value = moment(v)
      .add(31, "M")
      .subtract(1, "d")
      .format("DD-MM-YYYY");
  }
  const handleSelect = (item) => {
    console.log(item);
    document.querySelector("#cf").value = item.firstname;
    document.querySelector("#cl").value = item.lastname;
    document.querySelector("#APPLICANT_NAME").value = item.name;
    document.querySelector("#email").value = item.email;
    setResults([]);
  };
  async function checkexist(e) {
    e.preventDefault();
    let app = document.querySelector("#Aplication_number").value;
    if (app == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter Application Number",
      }));
    } else {
      let formdata = { app: app };
      let fetched = await Fetchipdata.fetchapp(formdata).then((response) => {
        return response;
      });
      let d = document.querySelector(".app-check").classList;
      if (fetched.data.success) {
        setvalidate((validate) => ({
          ...validate,
          color: "error",
          icon: "error",
          status: true,
          message: "Application Number Already in record.",
        }));
        d.remove("BRX");
        d.add("ARK");
      } else {
        d.remove("ARK");
        d.add("BRX");
        setvalidate((prev) => ({
          ...prev,
          status: true,
          message: "Available to add",
          color: "success",
          icon: "success",
        }));
      }
    }
  }
  async function adddata(e) {
    e.preventDefault();
    let web = document.querySelector("#weblink").value;
    let app = document.querySelector("#Aplication_number").value;
    let invention_title = document.querySelector("#invention_title").value;
    let country_code = document.querySelector("#country_code").value;
    let APPLICANT_NAME = document.querySelector("#APPLICANT_NAME").value;
    let APPLICANT_STATUS = document.querySelector("#APPLICANT_STATUS").value;
    let PRIOTITY_DATE = document.querySelector("#PRIOTITY_DATE").value;
    let d30 = document.querySelector("#d30").value;
    let d31 = document.querySelector("#d31").value;
    let cf = document.querySelector("#cf").value;
    let cl = document.querySelector("#cl").value;
    let Company_Name = document.querySelector("#Company_Name").value;
    let email = document.querySelector("#email").value;
    let PHONE_NO = document.querySelector("#PHONE_NO").value;
    let CONTACT_INFO_OF = document.querySelector("#CONTACT_INFO_OF").value;
    let agent_Name = document.querySelector("#agent_Name").value;
    let agent_email_ID = document.querySelector("#agent_email_ID").value;
    let agent_PHONE_NO = document.querySelector("#agent_PHONE_NO").value;
    let PAGES = document.querySelector("#PAGES").value;
    let CLAIMS = document.querySelector("#CLAIMS").value;
    let PRIORITY = document.querySelector("#PRIORITY").value;
    let DRAWINGS = document.querySelector("#DRAWINGS").value;
    let ISR = document.querySelector("#ISR").value;
    let REFERENCE_NUMBER = document.querySelector("#REFERENCE_NUMBER").value;
    var formData = {
      s_assign_to: auth.userid,
      Restrict: "",
      publication_number: web,
      invention_title: invention_title,
      country_code: country_code,
      Aplication_number: app,
      CONTACT_PERSON_FIRST: cf,
      CONTACT_PERSON_Last_NAME: cl,
      Email_ID: email,
      PHONE_NO: PHONE_NO,
      a_p_h_n: agent_PHONE_NO,
      agent_name: agent_Name,
      agent_email_id: agent_email_ID,
      PRIOTITY_DATE: PRIOTITY_DATE,
      DEADLINE_30_month: d30,
      DEADLINE_31_month: d31,
      PAGES: PAGES,
      CLAIMS: CLAIMS,
      PRIORITY: PRIORITY,
      DRAWINGS: DRAWINGS,
      APPLICANT_NAME: APPLICANT_NAME,
      APPLICANT_STATUS: APPLICANT_STATUS,
      Company_Name: Company_Name,
      CONTACT_INFO_OF: CONTACT_INFO_OF,
      ISR: ISR,
      REFERENCE_NUMBER: REFERENCE_NUMBER,
      type: "add_pct",
    };
    if (web == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter Publication",
      }));
    } else if (invention_title == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter title",
      }));
    } else if (country_code == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter country code",
      }));
    } else if (email == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter email",
      }));
    } else if (app == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter application",
      }));
    } else if (REFERENCE_NUMBER == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter ref no",
      }));
    } else if (ISR == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter isr",
      }));
    } else if (DRAWINGS == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter drawing",
      }));
    } else if (PRIORITY == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter priority",
      }));
    } else if (CLAIMS == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter claim",
      }));
    } else if (PAGES == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter pages",
      }));
    } else if (agent_PHONE_NO == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter agent phone number",
      }));
    } else if (agent_email_ID == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter agent email",
      }));
    } else if (agent_Name == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter agent name",
      }));
    } else if (PHONE_NO == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter phone number",
      }));
    } else if (Company_Name == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter company name",
      }));
    } else if (cf == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter contact person first name",
      }));
    } else if (cl == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter contact person last name",
      }));
    } else if (d30 == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter 30 deadline",
      }));
    } else if (d31 == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter 31 deadline",
      }));
    } else if (PRIOTITY_DATE == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter priority date",
      }));
    } else if (APPLICANT_NAME == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter applicant name",
      }));
    } else if (CONTACT_INFO_OF == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter contact info of",
      }));
    } else if (APPLICANT_STATUS == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Enter applicant status",
      }));
    } else {
      let added = await Uploaddata.addpct(formData).then((response) => {
        return response;
      });
      if (added.data.success) {
        setvalidate((prev) => ({
          ...prev,
          status: true,
          modalstatus: false,
          message: added.data.message,
          color: "success",
          icon: "success",
        }));
      } else {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          modalstatus: true,
          message: added.data.errors.error,
        }));
      }
    }
  }
  const callagent = useCallback(async () => {
    const response = await Fetchipdata.fetchagent({ posttype: "getagent" }).then(
      (response) => {
        return response;
      }
    );
    console.log("Agent data fetched:", response.data);
    setagentdata(response.data.data);
  }, []);
  useEffect(() => {
    callagent();
  }, []);
  const fuse = useMemo(() => {
    return new Fuse(agentdata, {
      keys: ["name"], // or use a string array if it's flat
      threshold: 0.3,
    });
  }, [agentdata]);
  useEffect(() => {
    console.log("Query changed:", query, agentdata);
    const timer = setTimeout(() => {
      if (query.length > 0) {
        const result = fuse.search(query, { limit: 15 }).map((r) => r.item);
        setResults(result);
      } else {
        setResults([]);
      }
    }, 300); // debounce time

    return () => clearTimeout(timer);
  }, [query, fuse]);
  return (
    <div className={" custom-table "}>
      <Header
        platform={platform}
        changedata={() => {
          return false;
        }}
        showanalyticsidebar={() => {
          return false;
        }}
        except={true}
        completedata={[]}
        alldata={[]}
        showmailbox={() => {
          return false;
        }}
        showdupemailbox={() => {
          return false;
        }}
        showcronbox={() => {
          return false;
        }}
        clearfilters={() => {
          return false;
        }}
        refreshdata={() => {
          return false;
        }}
        formdatas={() => {
          return false;
        }}
        showcurrencies={() => {
          return false;
        }}
      ></Header>
      <div className="row">
        <div className="col-md-12">
          <div className="">
            <div className="">
              <div className="row">
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="weblink">
                    Weblink:
                  </label>

                  <div
                    className="col-sm-12 error_field_group"
                    id="weblink-group"
                  >
                    <input
                      type="text"
                      className="form-control validate-field"
                      id="weblink"
                      name="weblink"
                      placeholder="Weblink"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="Aplication_number">
                    Application No:
                  </label>
                  <div
                    className="col-sm-12 error_field_group position-relative"
                    id="Aplication_number-group"
                  >
                    <input
                      type="text"
                      className="date form-control Aplication_number validate-field"
                      id="Aplication_number"
                      name="Aplication_number"
                      placeholder="Aplication number"
                    />{" "}
                    <i
                      style={{ top: "12px", right: "-20px" }}
                      onClick={(e) => {
                        checkexist(e);
                      }}
                      class="ti ti-check position-absolute app-check fw-bolder"
                    ></i>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="invention_title">
                    Title:
                  </label>

                  <div
                    className="col-sm-12 error_field_group"
                    id="invention_title-group"
                  >
                    <input
                      type="text"
                      className="form-control validate-field"
                      id="invention_title"
                      name="invention_title"
                      placeholder="Title"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="country_code">
                    Country Code:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="country_code-group"
                  >
                    <input
                      type="text"
                      className="form-control country_code validate-field"
                      id="country_code"
                      name="country_code"
                      placeholder="country code"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="APPLICANT_NAME">
                    Applicant Name:
                  </label>
                  <div
                    className="col-sm-12 error_field_group position-relative"
                    id="APPLICANT_NAME-group"
                  >
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      onChange={(e) => setQuery(e.target.value)}
                      id="APPLICANT_NAME"
                      name="APPLICANT_NAME"
                      placeholder="APPLICANT NAME"
                    />
                    {results.length > 0 && (
                      <ul className="position-absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-auto">
                        {results.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => handleSelect(item)}
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="APPLICANT_STATUS">
                    Applicant Status:
                  </label>
                  <div
                    className="dropdown col-sm-12 error_field_group"
                    id="APPLICANT_STATUS-group"
                  >
                    <select
                      className="form-control restrictedinput validate-field"
                      id="APPLICANT_STATUS"
                      name="APPLICANT_STATUS"
                    >
                      <option value="">APPLICANT STATUS</option>
                      <option selected="" value="Small">
                        small
                      </option>
                      <option value="Large">large</option>{" "}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="PRIOTITY_DATE">
                    Priority Date:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="PRIOTITY_DATE-group"
                    style={{ zIndex: "98" }}
                  >
                    <input
                      type="date"
                      onChange={(e) => {
                        deadlinedate(e.target.value);
                      }}
                      autocomplete="off"
                      className="form-control restrictedinput validate-field"
                      id="PRIOTITY_DATE"
                      name="PRIOTITY_DATE"
                      placeholder="PRIOTITY DATE"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="deaddate">
                    Deadline (30 month):
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="DEADLINE_30_month-group"
                  >
                    <input
                      type="text"
                      className="form-control validate-field"
                      autocomplete="off"
                      id="d30"
                      placeholder="DEADLINE - 30 mth"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="deaddate">
                    Deadline (31 month):
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="DEADLINE_31_month-group"
                  >
                    <input
                      type="text"
                      className="form-control validate-field"
                      autocomplete="off"
                      id="d31"
                      placeholder="DEADLINE- 31 month"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="cntprsn">
                    Contact Person:
                  </label>
                  <div className="col-sm-12 error_field_group" id="cf-group">
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="cf"
                      name="cf"
                      placeholder="FIRST Name"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="cntprsn"></label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="CONTACT_PERSON_Last_NAME-group"
                  >
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="cl"
                      name="cl"
                      placeholder="LAST NAME"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="Company_Name">
                    Company:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="Company_Name-group"
                    style={{ zIndex: "99" }}
                  >
                    <input
                      className=" form-control"
                      id="Company_Name"
                      name="Company_Name"
                      type="text"
                      placeholder="Law Firm name"
                      autocomplete="off"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="Email_ID">
                    E-mail-ID:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="Email_ID-group"
                  >
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="email"
                      placeholder="Email ID"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="phnno">
                    Phone No:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="PHONE_NO-group"
                  >
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="PHONE_NO"
                      name="PHONE_NO"
                      placeholder="PHONE NO"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="CONTACT_INFO_OF">
                    Contact Info.:
                  </label>
                  <div
                    className="dropdown col-sm-12 error_field_group"
                    id="CONTACT_INFO_OF-group"
                  >
                    <select
                      className="form-control restrictedinput validate-field"
                      id="CONTACT_INFO_OF"
                      name="CONTACT_INFO_OF"
                    >
                      <option value="">CONTACT INFO OF</option>
                      <option selected="" value="Individual">
                        Individual
                      </option>
                      <option value="Agent">Agent</option>
                      <option value="Both - Individual & Agent">
                        Both - Individual & Agent
                      </option>{" "}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="agent_Name">
                    Agent Name:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="agent_Name-group"
                  >
                    <input
                      className="form-control"
                      id="agent_Name"
                      name="agent_Name"
                      type="text"
                      placeholder="Agent Name"
                      autocomplete="off"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="agent_email_ID">
                    Agent E-mail-ID:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="agent_email_ID-group"
                  >
                    <input
                      type="text"
                      className="form-control "
                      id="agent_email_ID"
                      name="agent_email_ID"
                      placeholder="Agent Email ID"
                    />
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <label className="col-sm-12" htmlFor="phnno">
                    Agent Phone No:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="agent_PHONE_NO-group"
                  >
                    <input
                      type="text"
                      className="form-control"
                      id="agent_PHONE_NO"
                      name="agent_PHONE_NO"
                      placeholder="Agent Phone No"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-2">
                  <label className="col-sm-12" htmlFor="PAGES">
                    Pages:
                  </label>
                  <div className="col-sm-12 error_field_group" id="PAGES-group">
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="PAGES"
                      name="PAGES"
                      placeholder="PAGES"
                    />
                  </div>
                </div>
                <div className="form-group col-md-2">
                  <label className="col-sm-12" htmlFor="claims">
                    Claims:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="CLAIMS-group"
                  >
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="CLAIMS"
                      name="CLAIMS"
                      placeholder="CLAIMS"
                    />
                  </div>
                </div>
                <div className="form-group col-md-2">
                  <label className="col-sm-12" htmlFor="priority">
                    Priority:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="PRIORITY-group"
                    style={{ left: "-8%" }}
                  >
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="PRIORITY"
                      name="PRIORITY"
                      placeholder="PRIORITY"
                    />
                  </div>
                </div>
                <div className="form-group col-md-2">
                  <label className="col-sm-12" htmlFor="drawings">
                    Drawings:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="DRAWINGS-group"
                  >
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="DRAWINGS"
                      name="DRAWINGS"
                      placeholder="DRAWINGS"
                    />
                  </div>
                </div>
                <div className="form-group col-md-2">
                  <label className="col-sm-12" htmlFor="isr">
                    ISR:
                  </label>
                  <div className="col-sm-12 error_field_group" id="ISR-group">
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="ISR"
                      name="ISR"
                      placeholder="__"
                    />
                  </div>
                </div>
                <div className="form-group col-md-2 mb-3">
                  <label className="col-sm-12" htmlFor="refno">
                    Ref No.:
                  </label>
                  <div
                    className="col-sm-12 error_field_group"
                    id="REFERENCE_NUMBER-group"
                    style={{ left: "-8%" }}
                  >
                    <input
                      type="text"
                      className="form-control restrictedinput validate-field"
                      id="REFERENCE_NUMBER"
                      name="REFERENCE_NUMBER"
                      placeholder="REFERENCE NUMBER"
                    />
                  </div>
                </div>
                <div className="mb-3 text-center">
                  <button
                    onClick={adddata}
                    className="btn btn-light-info text-info font-medium"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
      {/* Add form elements here */}
    </div>
  );
};
export default PctForm;
