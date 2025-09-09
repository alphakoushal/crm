import React, { useState, useEffect, useRef, useMemo } from "react";
import Uploaddata from "../../../services/uploaddata";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import moment from "moment";
import { useFetcher } from "react-router-dom";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import Toast from "../../New-toast";
import { includes, set } from "lodash";
const Editmodal = function ({
  agentdata,
  show,
  fn,
  changedata,
  alldata,
  lawfirmdata,
  pagination,
}) {
  let other = JSON.parse(show.data.otherdetail);
  const containerRef = useRef(null);
  const inprocess = useRef(false);
  const [constraints, setConstraints] = useState(null);
  const [query, setQuery] = useState("");
  const [lawfirmquery, setlawfirmQuery] = useState("");
  const [results, setResults] = useState([]);
  const [lawfirmresults, setlawfirmResults] = useState([]);
  const wrapperRef = useRef(null);
  const wrapperAgentRef = useRef(null);
  other = { ...other, color: other?.color ?? "#ffffff" };
  const index_of_data = agentdata.filter((e) => {
    return e.name == other.APPLICANT_NAME;
  });
  const [data, updatedata] = useState({
    additional_email_id: other.additional_email_id ?? "N/A",
    additional_email_id_agent: other.additional_email_id_agent ?? "N/A",
    email: show.data.email_id,
    app: show.data.appno,
    status: false,
    message: "",
    ref_no: other.ref_no,
    isr: other.isr,
    color: other.color,
    drawing: other.drawing,
    priority: other.priority,
    claim: other.claim,
    pages: other.slpages1 ?? other.pages,
    slpages: other.slpages2??'',
    a_p_h_n: other.a_p_h_n ?? "N/A",
    agent_email_id: other.agent_email_id,
    agent_name: other.agent_name,
    p_h_n: other.p_h_n,
    p_h_n_code: other.p_h_n_code,
    company_name: other.company_name,
    c_p_l: other.c_p_l,
    firm_status: other.firm_status,
    c_p_f:
      other.c_p_f != ""
        ? other.c_p_f
        : index_of_data.length > 0
        ? index_of_data[0].firstname
        : "",
    deadline_30_month: other.deadline_30_month,
    deadline_31_month: other.deadline_30_month,
    p_date: other.p_date,
    APPLICANT_NAME: other.APPLICANT_NAME,
    c_i_o: other.c_i_o,
    remarks: other.remarks ?? "",
    info_gap_reason: other.info_gap_reason ?? "",
    applicant_status: other.applicant_status ?? "Large",
  });
  const [validate, setvalidate] = useState({
    status: false,
    color: "error",
    icon: "error",
    message: "",
  });
  useEffect(() => {
    updatedata({
      additional_email_id: other.additional_email_id ?? "N/A",
      additional_email_id_agent: other.additional_email_id_agent ?? "N/A",
      email:
        show.data.email_id != ""
          ? show.data.email_id
          : index_of_data.length > 0
          ? index_of_data[0].email
          : "",
      app: show.data.appno,
      status: false,
      message: "",
      ref_no: other.ref_no,
      isr: other.isr,
      color: other.color,
      drawing: other.drawing,
      priority: other.priority,
      claim: other.claim,
      pages: other.slpages1 ?? other.pages,
      slpages: other.slpages2??'',
      a_p_h_n: other.a_p_h_n ?? "N/A",
      agent_email_id: other.agent_email_id,
      agent_name: other.agent_name,
      p_h_n:
        other.p_h_n != ""
          ? other.p_h_n
          : index_of_data.length > 0
          ? index_of_data[0].contact
          : "",
      p_h_n_code: other.p_h_n_code,
      company_name: other.company_name,
      c_p_l:
        other.c_p_l != ""
          ? other.c_p_l
          : index_of_data.length > 0
          ? index_of_data[0].lastname
          : "",
      c_p_f:
        other.c_p_f != ""
          ? other.c_p_f
          : index_of_data.length > 0
          ? index_of_data[0].firstname
          : "",
      firm_status: other.firm_status,
      deadline_30_month: other.deadline_30_month,
      deadline_31_month: other.deadline_30_month,
      p_date: other.p_date,
      APPLICANT_NAME: other.APPLICANT_NAME,
      c_i_o: other.c_i_o,
      applicant_status:
        other.applicant_status != ""
          ? other.applicant_status
          : index_of_data.length > 0
          ? index_of_data[0].status
          : "Large",
      remarks: other.remarks ?? "",
      info_gap_reason: other.info_gap_reason ?? "",
    });
  }, [show.data]);
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setConstraints({
        top: -height / 2 + 50,
        bottom: height / 2 - 50,
        left: -width / 2 + 50,
        right: width / 2 - 50,
      });
    }
  }, [show]);
  useEffect(() => {
    const input = document.querySelector("#PRIOTITY_DATE");
    if (input) {
      input.value = data.p_date;
      deadlinedate(data.p_date, "p_date");
    }
    return () => {
      setTimeout(() => {
        setvalidate(() => ({ ...validate, status: false }));
        show.state = false;
      }, 1000);
    };
  }, []);
  function updatestate(value, key) {
    if (key == "APPLICANT_NAME") {
      setQuery(value);
      updatedata((data) => ({ ...data, [key]: value }));
    } else if (["c_p_f", "c_p_l", "agent_name"].includes(key)) {
      updatedata((data) => ({ ...data, [key]: capitalizeFirst(value) }));
    } else if (key == "company_name") {
      setlawfirmQuery(value);
      updatedata((data) => ({ ...data, [key]: value }));
    } else if (key == "c_i_o") {
      if (value == "Both - Individual & Agent") {
        updatedata((data) => ({
          ...data,
          [key]: value,
        }));
      } else if (value == "Individual") {
        updatedata((prev) => ({
          ...prev,
          [key]: value,
          agent_name: "N/A",
          company_name: "N/A",
          agent_email_id: "N/A",
          firm_status: "N/A",
          a_p_h_n: "N/A",
          c_p_f: data.c_p_f ?? "",
          c_p_l: data.c_p_l ?? "",
          p_h_n: data.p_h_n,
          email: data.email,
          isr: "",
        }));
      } else if (value == "Agent") {
        updatedata((data) => ({
          ...data,
          [key]: value,
          c_p_f: "N/A",
          c_p_l: "N/A",
          p_h_n: "N/A",
          email: "N/A",
          firm_status: "",
          drawing: "N/A",
          isr: "N/A",
          agent_name: "",
          company_name: "",
          agent_email_id: "",
          a_p_h_n: "",
        }));
      } else {
        updatedata((data) => ({ ...data, [key]: value }));
      }
    } else if (key == "ref_no") {
      updatedata((data) => ({ ...data, [key]: value.toUpperCase() }));
    } else {
      updatedata((data) => ({ ...data, [key]: value }));
    }
  }
  function validatedata(e, app) {
    e.preventDefault();
    if (inprocess.current == true) {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please wait, updating in process",
        color: "warning",
        icon: "info",
      }));
    } else if (data.info_gap_reason == "") {
      if (data.app == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter application",
        }));
      } else if (data.p_date == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter priority date",
        }));
      } else if (data.deadline_30_month == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter 30 deadline",
        }));
      } else if (data.deadline_31_month == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter 31 deadline",
        }));
      } else if (data.c_p_f == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter contact person first name",
        }));
      } else if (data.c_p_l == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter contact person last name",
        }));
      } else if (data.company_name == "" && data.c_i_o != "Individual") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          message: "Enter company name",
          icon: "error",
        }));
      } else if (data.email == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter email",
        }));
      } else if (data.p_h_n == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter phone number",
        }));
      } else if (data.APPLICANT_NAME == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter applicant name",
        }));
      } else if (data.c_i_o == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter contact info of",
        }));
      } else if (data.agent_name == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter agent name",
        }));
      } else if (data.agent_email_id == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter agent email",
        }));
      } else if (data.a_p_h_n == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter agent phone number",
        }));
      } else if (data.applicant_status == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter applicant status",
        }));
      } else if (data.ref_no == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter ref no",
        }));
      } else if (data.isr == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter ISA",
        }));
      } else if (data.drawing == "") {
        setvalidate((prev) => ({
          ...prev,
          status: true,
          icon: "error",
          message: "Enter drawings",
        }));
      } else if (data.priority == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter priority",
        }));
      } else if (data.claim == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter claim",
        }));
      } else if (data.pages == "") {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Enter pages",
        }));
      } else {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          icon: "error",
          message: "Updating the records",
        }));
        inprocess.current = true;
        updateinfo(app);
      }
    } else {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        icon: "error",
        message: "Updating the records",
      }));
      inprocess.current = true;
      updateinfo(app);
    }
  }
  async function updateinfo(app) {
    let email = document.querySelector("#Email_ID").value;
    try {
      let status = await Uploaddata.pctaxiosrequest({
        ...data,
        posttype: "updateinfo",
        app: app,
      }).then((response) => {
        return response;
      });
      if (status.data.success) {
        inprocess.current = false;
        setvalidate((prev) => ({
          ...prev,
          status: true,
          message: status.data.message,
          color: "success",
          icon: "success",
        }));
        let newarray = alldata.map((item, index) => {
          return app == item[2]
            ? {
                ...item,
                [60]: data.color,
                [4]: data.p_date,
                [7]: data.APPLICANT_NAME,
                [8]: data.applicant_status,
                [9]: data.c_i_o,
                [10]: data.c_p_f + "" + data.c_p_l,
              }
            : item;
        });

        // changedata(newarray, "editmodal");
      } else {
        inprocess.current = false;
        setvalidate((prev) => ({
          ...prev,
          status: true,
          message: status.data.errors.error,
          color: "error",
          icon: "error",
        }));
      }
    } catch (error) {
      inprocess.current = false;
      setvalidate((prev) => ({
        ...prev,
        status: true,
        message: "An error occurred while updating the data.",
        color: "error",
        icon: "error",
      }));
    }
  }
  function capitalizeFirst(str) {
    if (!str) return "";
    return str.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
  function deadlinedate(v) {
    updatestate(v, "p_date");
    const input30 = document.querySelector("#d30");
    const input31 = document.querySelector("#d31");
    let d30 = moment(v).add(30, "M").subtract(1, "d").format("DD-MM-YYYY");
    let d31 = moment(v).add(31, "M").subtract(1, "d").format("DD-MM-YYYY");
    input30.value = d30;
    input31.value = d31;
    if (moment(d30).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
      input30.classList.add("deadline-expired"); // Add your custom class
    } else {
      input30.classList.remove("deadline-expired");
    }
    if (moment(d31).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
      input31.classList.add("deadline-expired"); // Add your custom class
    } else {
      input31.classList.remove("deadline-expired");
    }
    updatestate(d30, "deadline_30_month");
    updatestate(d31, "deadline_31_month");
  }
  const handleSelect = (item) => {
    updatedata((data) => ({
      ...data,
      c_p_f: item.firstname,
      c_p_l: item.lastname,
      APPLICANT_NAME: item.name,
      email: item.email,
      p_h_n: item.contact,
      applicant_status: item.status,
      additional_email_id: item.alt_email,
      c_i_o: item.contact_info,
    }));
    setResults([]);
  };
  const selectlawfirm = (item) => {
    if(item.b_list && item.b_list.toLowerCase()=='yes'){
    alert('This lawfirm is blacklisted, please contact admin');
    }
    updatedata((data) => ({
      ...data,
      agent_name: item.agentname,
      agent_email_id: item.email,
      company_name: item.name,
      firm_status: item.status,
      additional_email_id_agent: item.alt_email,
    }));
    setlawfirmResults([]);
  };
  const fuse = useMemo(() => {
    return new Fuse(agentdata, {
      keys: ["name"], // or use a string array if it's flat
      threshold: 0.3,
      useExtendedSearch: true,
    });
  }, [agentdata]);
  const fuselawfirm = useMemo(() => {
    return new Fuse(lawfirmdata, {
      keys: ["name"], // or use a string array if it's flat
      threshold: 0.3,
       useExtendedSearch: true,
    });
  }, [lawfirmdata]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 0) {
        const result = fuse
          .search(`^"${query}"`, { limit: 15 })
          .map((r) => r.item);
        setResults(result);
      } else {
        setResults([]);
      }
    }, 300); // debounce time

    return () => clearTimeout(timer);
  }, [query, fuse]);

  useEffect(() => {
    const timerlawfirm = setTimeout(() => {
      if (lawfirmquery.length > 0) {
        const result = fuselawfirm
          .search(`^"${lawfirmquery}"`, { limit: 15 })
          .map((r) => r.item);

        setlawfirmResults(result);
      } else {
        setlawfirmResults([]);
      }
    }, 300); // debounce time

    return () => clearTimeout(timerlawfirm);
  }, [lawfirmquery, fuselawfirm]);

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData)
      .getData("text")
      .trim();
    let match = pasted.match(/^(\d{2})[.](\d{2})[.](\d{4})$/);

    if (match) {
      const [, dd, mm, yyyy] = match;
      let finaldate = `${yyyy}-${mm}-${dd}`;
      deadlinedate(finaldate);
    } else {
      alert("Please paste a valid date (DD-MM-YYYY)");
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setvalidate((prev) => ({
      ...prev,
      file: "",
      status: false,
      message: ``,
      color: "success",
      icon: "success",
    }));
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickAgentOutside(event) {
      if (
        wrapperAgentRef.current &&
        !wrapperAgentRef.current.contains(event.target)
      ) {
        setlawfirmResults([]); // Clear results when clicking outside
      }
    }
    document.addEventListener("mousedown", handleClickAgentOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickAgentOutside);
  }, []);
  return (
    <>
      <Toast validate={validate} handleClose={handleClose}></Toast>
      {show.state ? (
        <div
          ref={containerRef}
          className="modal fade filing-form show"
          id="filing-form-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="edit-modal-label"
          style={{ display: "block", "padding-left": "17px" }}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header d-flex align-items-center">
                <h4 className="modal-title" id="myLargeModalLabel"></h4>
                <button
                  onClick={() => {
                    fn(false);
                  }}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form className="form-horizontal filing-form_data">
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="">
                        <div className="">
                          <div className="row mb-2">
                            <div className="form-group col-md-4">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="weblink"
                              >
                                Weblink:
                              </label>

                              <div
                                className="col-sm-12 error_field_group"
                                id="weblink-group"
                              >
                                <input
                                  readOnly
                                  type="text"
                                  className="form-control validate-field fw-medium ANC"
                                  id="weblink"
                                  value={show.data.weblink}
                                  name="weblink"
                                  placeholder="Weblink"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-4">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="Aplication_number"
                              >
                                Application No:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="Aplication_number-group"
                              >
                                <input
                                  readOnly
                                  type="text"
                                  className="date form-control Aplication_number validate-field fw-medium ANC"
                                  value={show.data.appno}
                                  id="Aplication_number"
                                  name="Aplication_number"
                                  placeholder="Aplication number"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-4">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="invention_title"
                              >
                                Title:
                              </label>

                              <div
                                className="col-sm-12 error_field_group"
                                id="invention_title-group"
                              >
                                <input
                                  readOnly
                                  type="text"
                                  className="form-control validate-field fw-medium ANC"
                                  id="invention_title"
                                  value={other.title}
                                  name="invention_title"
                                  placeholder="Title"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="form-group col-md-4">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="country_code"
                              >
                                Country Code:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="country_code-group"
                              >
                                <input
                                  readOnly
                                  type="text"
                                  className="form-control country_code validate-field fw-medium ANC"
                                  value={other.country}
                                  id="country_code"
                                  name="country_code"
                                  placeholder="country code"
                                />
                              </div>
                            </div>
                            <div
                              ref={wrapperRef}
                              className="form-group col-md-4"
                            >
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="APPLICANT_NAME"
                              >
                                Applicant Name:
                              </label>
                              <div
                                className="col-sm-12 error_field_group position-relative"
                                id="APPLICANT_NAME-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  id="APPLICANT_NAME"
                                  autoComplete="off"
                                  onChange={(e) =>
                                    updatestate(
                                      e.target.value,
                                      "APPLICANT_NAME"
                                    )
                                  }
                                  value={data.APPLICANT_NAME}
                                  name="APPLICANT_NAME"
                                  placeholder="APPLICANT NAME"
                                />
                                {results.length > 0 && (
                                  <ul className="position-absolute z-3 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-auto">
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
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="APPLICANT_STATUS"
                              >
                                Applicant Status:
                              </label>
                              <div
                                className="dropdown col-sm-12 error_field_group"
                                id="APPLICANT_STATUS-group"
                              >
                                <select
                                  onChange={(e) => {
                                    updatestate(
                                      e.target.value,
                                      "applicant_status"
                                    );
                                  }}
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  id="APPLICANT_STATUS"
                                  name="APPLICANT_STATUS"
                                >
                                  <option value="">APPLICANT STATUS</option>
                                  <option
                                    selected={
                                      data.applicant_status.toLowerCase() ==
                                      "small"
                                        ? true
                                        : false
                                    }
                                    value="Small"
                                  >
                                    Small
                                  </option>
                                  <option
                                    selected={
                                      data.applicant_status.toLowerCase() ==
                                      "large"
                                        ? true
                                        : false
                                    }
                                    value="Large"
                                  >
                                    Large
                                  </option>{" "}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="PRIOTITY_DATE"
                              >
                                Priority Date:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="PRIOTITY_DATE-group"
                                style={{ zIndex: "98" }}
                              >
                                <input
                                  type="date"
                                  value={moment(data.p_date).format(
                                    "YYYY-MM-DD"
                                  )}
                                  onChange={(e) => {
                                    deadlinedate(e.target.value);
                                  }}
                                  onPaste={handlePaste}
                                  autoComplete="off"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  id="PRIOTITY_DATE"
                                  name="PRIOTITY_DATE"
                                  placeholder="PRIOTITY DATE"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="deaddate"
                              >
                                Deadline (30 month):
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="DEADLINE_30_month-group"
                              >
                                <input
                                  readonly=""
                                  type="text"
                                  className="form-control validate-field fw-medium ANC"
                                  autoComplete="off"
                                  id="d30"
                                  placeholder="DEADLINE - 30 mth"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="deaddate"
                              >
                                Deadline (31 month):
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="DEADLINE_31_month-group"
                              >
                                <input
                                  readonly=""
                                  type="text"
                                  className="form-control validate-field fw-medium ANC"
                                  data-field-name="DEADLINE_31_month"
                                  autoComplete="off"
                                  id="d31"
                                  placeholder="DEADLINE- 31 month"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="CONTACT_INFO_OF"
                              >
                                Contact Info.:
                              </label>
                              <div
                                className="dropdown col-sm-12 error_field_group"
                                id="CONTACT_INFO_OF-group"
                              >
                                <select
                                  onChange={(e) => {
                                    updatestate(e.target.value, "c_i_o");
                                  }}
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  data-field="select"
                                  data-field-name="CONTACT_INFO_OF"
                                  data-error="please select CONTACT INFO OF"
                                  id="CONTACT_INFO_OF"
                                  name="CONTACT_INFO_OF"
                                >
                                  <option value="">CONTACT INFO OF</option>
                                  <option
                                    selected={
                                      data.c_i_o == "Individual" ? true : false
                                    }
                                    value="Individual"
                                  >
                                    Individual
                                  </option>
                                  <option
                                    selected={
                                      data.c_i_o == "Agent" ? true : false
                                    }
                                    value="Agent"
                                  >
                                    Agent
                                  </option>
                                  <option
                                    selected={
                                      data.c_i_o == "Both - Individual & Agent"
                                        ? true
                                        : false
                                    }
                                    value="Both - Individual & Agent"
                                  >
                                    Both - Individual & Agent
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="refno"
                              >
                                Ref No.:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="REFERENCE_NUMBER-group"
                                style={{ left: "-8%" }}
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "ref_no")
                                  }
                                  value={data.ref_no.toUpperCase()}
                                  id="REFERENCE_NUMBER"
                                  name="REFERENCE_NUMBER"
                                  placeholder="REFERENCE NUMBER"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="cntprsn"
                              >
                                Contact Person:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="CONTACT_PERSON_FIRST-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "c_p_f")
                                  }
                                  value={data.c_p_f}
                                  id="CONTACT_PERSON_FIRST"
                                  name="CONTACT_PERSON_FIRST"
                                  placeholder="FIRST Name"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="cntprsn"
                              >
                                Contact Person Last
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="CONTACT_PERSON_Last_NAME-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "c_p_l")
                                  }
                                  value={data.c_p_l}
                                  id="CONTACT_PERSON_Last_NAME"
                                  name="CONTACT_PERSON_Last_NAME"
                                  placeholder="LAST NAME"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="Email_ID"
                              >
                                E-mail-ID:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="Email_ID-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  value={data.email}
                                  id="Email_ID"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "email")
                                  }
                                  placeholder="Email ID"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="phnno"
                              >
                                Phone No:
                              </label>
                              <div
                                className="col-sm-12 error_field_group d-flex"
                                id="PHONE_NO-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "p_h_n")
                                  }
                                  value={data.p_h_n}
                                  id="PHONE_NO"
                                  name="PHONE_NO"
                                  placeholder="PHONE NO"
                                />
                                <input
                                  type="text"
                                  style={{ width: "70px" }}
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "p_h_n_code")
                                  }
                                  value={data.p_h_n_code}
                                  id="p_h_n_code"
                                  name="p_h_n_code"
                                  placeholder="Code"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row mb-2">
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="Company_Name"
                              >
                                Law firm:
                              </label>
                              <div
                                ref={wrapperAgentRef}
                                className="col-sm-12 error_field_group position-relative"
                                id="Company_Name-group "
                                style={{ zIndex: "99" }}
                              >
                                <input
                                  type="text"
                                  className=" form-control validate-field fw-medium ANC"
                                  id="Company_Name"
                                  autoComplete="off"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "company_name")
                                  }
                                  value={data.company_name}
                                  name="Company_Name"
                                  placeholder="Law Firm name"
                                />
                                {lawfirmresults.length > 0 && (
                                  <ul className="position-absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-auto">
                                    {lawfirmresults.map((item, idx) => (
                                      <li
                                        key={idx}
                                        onClick={() => selectlawfirm(item)}
                                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                      >
                                        {item.name}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="agent_Name"
                              >
                                Agent Name:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="agent_Name-group"
                              >
                                <input
                                  className="form-control fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "agent_name")
                                  }
                                  value={data.agent_name}
                                  id="agent_Name"
                                  name="agent_Name"
                                  type="text"
                                  placeholder="Agent Name"
                                  autoComplete="off"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="agent_email_ID"
                              >
                                Agent E-mail-ID:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="agent_email_ID-group"
                              >
                                <input
                                  type="text"
                                  className="form-control fw-medium ANC"
                                  value={data.agent_email_id}
                                  onChange={(e) =>
                                    updatestate(
                                      e.target.value,
                                      "agent_email_id"
                                    )
                                  }
                                  id="agent_email_ID"
                                  name="agent_email_ID"
                                  placeholder="Agent Email ID"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="phnno"
                              >
                                Agent Phone No:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="agent_PHONE_NO-group"
                              >
                                <input
                                  type="text"
                                  className="form-control fw-medium ANC"
                                  value={data.a_p_h_n}
                                  onChange={(e) =>
                                    updatestate(e.target.value, "a_p_h_n")
                                  }
                                  id="agent_PHONE_NO"
                                  name="agent_PHONE_NO"
                                  placeholder="Agent Phone No"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="CONTACT_INFO_OF"
                              >
                                Law Firm Status.:
                              </label>
                              <div
                                className="dropdown col-sm-12 error_field_group"
                                id="firm_status-group"
                              >
                                <select
                                  onChange={(e) => {
                                    updatestate(e.target.value, "firm_status");
                                  }}
                                  className="form-control validate-field fw-medium ANC"
                                  data-field="select"
                                  data-field-name="firm_status"
                                  data-error="please select CONTACT INFO OF"
                                  id="firm_status"
                                  name="firm_status"
                                >
                                  <option value="">Firm Status</option>
                                  <option
                                    selected={
                                      data.firm_status == "N/A" ? true : false
                                    }
                                    value="N/A"
                                  >
                                    N/A
                                  </option>
                                  <option
                                    selected={
                                      data.firm_status == "Small" ? true : false
                                    }
                                    value="Small"
                                  >
                                    Small
                                  </option>
                                  <option
                                    selected={
                                      data.firm_status == "Medium"
                                        ? true
                                        : false
                                    }
                                    value="Medium"
                                  >
                                    Medium
                                  </option>
                                  <option
                                    selected={
                                      data.firm_status == "Large" ? true : false
                                    }
                                    value="Large"
                                  >
                                    Large
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="additional_email_id"
                              >
                                Additional E-mail-ID of Applicant:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="additional_email_id-group"
                              >
                                <input
                                  type="text"
                                  className="form-control fw-medium ANC"
                                  value={data.additional_email_id}
                                  onChange={(e) =>
                                    updatestate(
                                      e.target.value,
                                      "additional_email_id"
                                    )
                                  }
                                  id="additional_email_id"
                                  name="additional_email_id"
                                  placeholder="Additional Email ID"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="additional_email_id"
                              >
                                Additional E-mail-ID of Agent:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="additional_email_id_agent-group"
                              >
                                <input
                                  type="text"
                                  className="form-control fw-medium ANC"
                                  value={data.additional_email_id_agent}
                                  onChange={(e) =>
                                    updatestate(
                                      e.target.value,
                                      "additional_email_id_agent"
                                    )
                                  }
                                  id="additional_email_id_agent"
                                  name="additional_email_id_agent"
                                  placeholder="Additional Email ID of Agent"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="remarks"
                              >
                                Remarks:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="remarks-group"
                              >
                                <textarea
                                  rows={1}
                                  className="form-control fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "remarks")
                                  }
                                  id="remarks"
                                  name="remarks"
                                  placeholder="Remarks"
                                  value={data.remarks || ""}
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-3">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="remarks"
                              >
                                Reason for Missing Information:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="info_gap_reason-group"
                              >
                                <select
                                  onChange={(e) => {
                                    updatestate(
                                      e.target.value,
                                      "info_gap_reason"
                                    );
                                  }}
                                  className="form-control validate-field fw-medium ANC"
                                  data-field="select"
                                  data-field-name="info_gap_reason"
                                  data-error="Please select reason"
                                  id="info_gap_reason"
                                  name="info_gap_reason"
                                >
                                  <option value="">Reason</option>
                                  <option
                                    selected={
                                      data.info_gap_reason == "1" ? true : false
                                    }
                                    value="1"
                                  >
                                    Blacklist
                                  </option>
                                  <option
                                    selected={
                                      data.info_gap_reason == "2" ? true : false
                                    }
                                    value="2"
                                  >
                                    India
                                  </option>
                                  <option
                                    selected={
                                      data.info_gap_reason == "3" ? true : false
                                    }
                                    value="3"
                                  >
                                    Big firm
                                  </option>
                                  <option
                                    selected={
                                      data.info_gap_reason == "4" ? true : false
                                    }
                                    value="4"
                                  >
                                    Deadline Passed
                                  </option>
                                  <option
                                    selected={
                                      data.info_gap_reason == "5" ? true : false
                                    }
                                    value="5"
                                  >
                                    Other
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="slpages"
                              >
                                Sequence Lisitng Pages:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="slpages-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  value={data.slpages}
                                  onChange={(e) =>
                                    updatestate(e.target.value, "slpages")
                                  }
                                  id="slpages"
                                  name="slpages"
                                  placeholder="SL PAGES"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="PAGES"
                              >
                                Pages:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="PAGES-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  value={data.pages}
                                  onChange={(e) =>
                                    updatestate(e.target.value, "pages")
                                  }
                                  id="PAGES"
                                  name="PAGES"
                                  placeholder="PAGES"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="claims"
                              >
                                Claims:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="CLAIMS-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "claim")
                                  }
                                  value={data.claim}
                                  id="CLAIMS"
                                  name="CLAIMS"
                                  placeholder="CLAIMS"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="priority"
                              >
                                Priority:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="PRIORITY-group"
                                style={{ left: "-8%" }}
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  value={data.priority}
                                  onChange={(e) =>
                                    updatestate(e.target.value, "priority")
                                  }
                                  id="PRIORITY"
                                  name="PRIORITY"
                                  placeholder="PRIORITY"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-2">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="drawings"
                              >
                                Drawings:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="DRAWINGS-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "drawing")
                                  }
                                  value={data.drawing}
                                  id="DRAWINGS"
                                  name="DRAWINGS"
                                  placeholder="DRAWINGS"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-1">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="isr"
                              >
                                ISA:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="ISR-group"
                              >
                                <input
                                  type="text"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "isr")
                                  }
                                  value={data.isr}
                                  id="ISR"
                                  name="ISR"
                                  placeholder="__"
                                />
                              </div>
                            </div>
                            <div className="form-group col-md-1">
                              <label
                                className="col-sm-12 fw-semibold"
                                htmlFor="color"
                              >
                                Color:
                              </label>
                              <div
                                className="col-sm-12 error_field_group"
                                id="ISR-group"
                              >
                                <input
                                  type="color"
                                  className="form-control restrictedinput validate-field fw-medium ANC"
                                  onChange={(e) =>
                                    updatestate(e.target.value, "color")
                                  }
                                  value={data.color}
                                  id="color"
                                  name="color"
                                  placeholder="color"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="mb-3 text-center d-flex justify-content-between">
                              <button
                                onClick={(e) => {
                                  pagination({ ...show, action: "previous" });
                                }}
                                className="btn btn-light-info text-info font-medium focus"
                                type="button"
                              >
                                Previuos
                              </button>
                              <button
                                type="submit"
                                onClick={(e) => {
                                  validatedata(e, show.data.appno);
                                }}
                                class="btn btn-info font-medium rounded-pill px-4"
                              >
                                <div class="d-flex align-items-center">
                                  Update &nbsp;
                                  <i
                                    class={`ti ti-refresh uploadfile ${
                                      inprocess.current == true ? "rotate" : ""
                                    }`}
                                  ></i>
                                </div>
                              </button>
                              <button
                                onClick={(e) => {
                                  pagination({ ...show, action: "next" });
                                }}
                                className="btn btn-light-info text-info font-medium focus"
                                type="button"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Editmodal;
