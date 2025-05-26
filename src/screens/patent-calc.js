import React, { useState, useEffect, useRef } from "react";
import Toast from "../component/New-toast";
import { defaultvalue, API_URL } from "../constant/Constant";
import Headerblank from "../component/Header-blank";
import Fetchdata from "../services/fetchdata";
import Uploaddata from "../services/uploaddata";
import "../component/style/calcost.css";
import { useSearchParams } from "react-router-dom";
const Patentcalculator = ({ updatevalue, calcstate }) => {
  let coststage = [
    { value: "IP Type Selection" },
    { value: "Country Selection" },
    { value: "Stages Selection" },
    { value: "Detailed Report" },
  ];
  let service = ["Patent", "Trademark", "Design"];
  let detailservice = ["Filing", "Examination", "Granting", "Annuity"];
  let applicantstatus = [
    { name: "Large", key: "3" },
    { name: "Small", key: "2" },
    { name: "Micro", key: "1" },
  ];
  let applicantstatusnumber = { 1: "", 2: "s", 3: "l" };
  let applicantstatusvalue = { 1: "Micro", 2: "Small", 3: "Large" };
  const auth = JSON.parse(localStorage.getItem("user"));
  const [getdata, setdata] = useState([]);
  const [tab, settab] = useState("tab1");
  const [countrytab, setcountrytab] = useState("");
  const currenttrans = useRef([]);
  const [currenttrans1, updatecurrenttrans1] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [validate, setvalidate] = useState({
    status: false,
    color: "error",
    icon: "error",
    message: "",
    file: "",
  });
  const [qtab, setqtab] = useState("");
  const [query, setQuery] = useState("");
  const [formuladata, setformuladata] = useState({
    defaultentity: "",
    defaultfilling: false,
    defaultexamination: false,
    defaultgranting: false,
    defaultannuity: false,
    ref: "",
    breakup: "no",
    appno: "ES2022/070522",
    applicant: "Koushal sethi",
    p: "12",
    c: "12",
    fl: "ger",
    i: "ES",
    pr: "1",
    word: 20,
    char: 10,
    as: "",
    country: [],
  });
  const updatedata = (k, value) => {
    setformuladata((prev) => ({ ...prev, [k]: value }));
  };
  const lowerQuery = query.toLowerCase();
  const createpdf = async () => {
    let createpdf = await Uploaddata.createpdf({
      matter: "1",
      userid: auth.userid,
      data: JSON.stringify(formuladata),
      country: JSON.stringify(getdata),
      posttype: "createpdf",
      id: searchParams.get("id"),
    }).then((response) => {
      return response;
    });
    if (createpdf.data.success) {
      setvalidate((prev) => ({
        ...prev,
        file: createpdf.data.file,
        status: true,
        message: `${createpdf.data.message} ${createpdf.data.file}`,
        color: "success",
        icon: "success",
      }));
    } else {
      setvalidate((prev) => ({
        ...prev,
        file: "",
        status: false,
        message: createpdf.errors.error,
        color: "error",
        icon: "error",
      }));
    }
  };
  const handleClose = () => {
    setvalidate((prev) => ({
      ...prev,
      file: "",
      status: false,
      message: ``,
      color: "success",
      icon: "success",
    }));
  };
  const getcost = (c, s, ser) => {
    let costs = [];
    let cost = 0;
    let total = 0;
    getdata.map((item) => {
      if (item.country == c) {
        let parts = JSON.parse(item.data);
        s.map((status) => {
          ser.map((keys) => {
            if (parts["part" + keys].length > 0 && "part" + keys != "part5") {
              if (keys == 1) {
                cost =
                  cost +
                  returncostoverall(
                    parts["part" + keys],
                    status,
                    "part" + keys
                  );
              }
            }
          });
          costs[status] = cost;
          total = total + cost;
          cost = 0;
        });
        costs["total"] = total;
        total = 0;
      }
    });
    return costs;
  };
  const returncostoverall = (parts, s, partkey) => {
    let cost = 0;
    let filterisa = parts.filter((items) => items["i"] == formuladata.i);

    if (partkey == "part1") {
      parts = filterisa.length > 0 ? filterisa : [parts[parts.length - 1]];
      parts.map((item, index) => {
        let t = s == "" ? "m" : s;
        if (s != "pro" && s != "trans" && item[`${s == "" ? "m" : s}c`] != "") {
          // standard cost
          cost = cost + parseInt(item[`${s == "" ? "m" : s}c`]);
        }
        if (
          s != "pro" &&
          s != "trans" &&
          parseInt(formuladata["p"]) > parseInt(item["p"]) &&
          item["p"] != "" &&
          item[`pc${s}`] != ""
        ) {
          //page cost
          cost =
            cost +
            (parseInt(formuladata["p"]) - parseInt(item["p"])) *
              parseInt(item[`pc${s}`]);
        }
        if (
          s != "pro" &&
          s != "trans" &&
          parseInt(formuladata["c"]) > parseInt(item["c"]) &&
          item["c"] != "" &&
          item[`cc${s}`] != ""
        ) {
          // claim cost
          cost =
            cost +
            (parseInt(formuladata["c"]) - parseInt(item["c"])) *
              parseInt(item[`cc${s}`]);
        }
        if (
          s != "pro" &&
          s != "trans" &&
          parseInt(formuladata["pr"]) > parseInt(item["pr"]) &&
          item["pr"] != "" &&
          item[`prc${s}`] != ""
        ) {
          // priority cost
          cost =
            cost +
            (parseInt(formuladata["pr"]) - parseInt(item["pr"])) *
              parseInt(item[`prc${s}`]);
        }
        if (s == "pro" && item[`${s}`] != "") {
          // pro cost
          cost = cost + parseInt(item[`${s}`]);
        }
        if (s == "trans" && formuladata["word"] != "" && item[`${s}`] != "") {
          // trans cost
          cost =
            cost + parseInt(formuladata["word"]) * parseFloat(item[`${s}`]);
        }
      });
    } else {
      parts.map((item, index) => {
        let t = s == "" ? "m" : s;
        if (s != "pro" && s != "trans" && item[`${s == "" ? "m" : s}c`] != "") {
          // standard cost
          cost = cost + parseInt(item[`${s == "" ? "m" : s}c`]);
        }
        if (
          s != "pro" &&
          s != "trans" &&
          parseInt(formuladata["p"]) > parseInt(item["p"]) &&
          item["p"] != "" &&
          item[`pc${s}`] != ""
        ) {
          //page cost
          cost =
            cost +
            (parseInt(formuladata["p"]) - parseInt(item["p"])) *
              parseInt(item[`pc${s}`]);
        }
        if (
          s != "pro" &&
          s != "trans" &&
          parseInt(formuladata["c"]) > parseInt(item["c"]) &&
          item["c"] != "" &&
          item[`cc${s}`] != ""
        ) {
          // claim cost
          cost =
            cost +
            (parseInt(formuladata["c"]) - parseInt(item["c"])) *
              parseInt(item[`cc${s}`]);
        }
        if (
          s != "pro" &&
          s != "trans" &&
          parseInt(formuladata["pr"]) > parseInt(item["pr"]) &&
          item["pr"] != "" &&
          item[`prc${s}`] != ""
        ) {
          // priority cost
          cost =
            cost +
            (parseInt(formuladata["pr"]) - parseInt(item["pr"])) *
              parseInt(item[`prc${s}`]);
        }
        if (s == "pro" && item[`${s}`] != "") {
          // pro cost
          cost = cost + parseInt(item[`${s}`]);
        }
        if (s == "trans" && formuladata["word"] != "" && item[`${s}`] != "") {
          // trans cost
          cost =
            cost + parseInt(formuladata["word"]) * parseFloat(item[`${s}`]);
        }
      });
    }
    return cost;
  };
  const get_stored_quotation = async (id) => {
    let getstoredvaue = await Fetchdata.pctaxiosrequest({
      userid: auth.userid,
      posttype: "fetchstoredquotation",
      id: searchParams.get("id"),
    }).then((response) => {
      return response;
    });
    if (getstoredvaue.data.success) {
      const details = JSON.parse(getstoredvaue.data.data.details);
      setformuladata((prev) => ({
        ...prev,
        ["word"]: details.word,
        country: details.country,
        appno: details.appno ?? "",
        applicant: details.applicant ?? "",
        p: details.p ?? "",
        c: details.c ?? "",
        fl: details.fl ?? "",
        i: details.i ?? "",
        pr: details.pr ?? "",
        char: details.char ?? "",
        breakup: details.breakup ?? "no",
      }));
    } else {
      console.log("failed");
    }
  };
  const getcountrydata = async () => {
    let fetchcountry = await Fetchdata.fetchcountry({
      matter: "1",
      posttype: "fetchcountry",
      country: formuladata.country
        .map((item) => "'" + item.value + "'")
        .toString(),
    }).then((response) => {
      return response;
    });
    if (fetchcountry.data.success) {
      setdata(fetchcountry.data.data);
    } else {
      setdata([]);
    }
  };
  useEffect(() => {
    currenttrans.current = [];
  });
  useEffect(() => {
    if (tab == "tab1") {
      get_stored_quotation(searchParams.get("id"));
    }
  }, []);
  useEffect(() => {
    if (tab == "tab4") {
      if (formuladata.country.length > 0) {
        getcountrydata();
      }
    }
  }, [tab]);
  const checkexist = (code) => {
    let exist = false;
    formuladata.country.map((item) => {
      if (item.value == code) {
        exist = true;
      }
    });
    return exist;
  };
  const pushvalue = (e, val) => {
    if (e.target.checked) {
      setformuladata((prev) => ({
        ...prev,
        ["country"]: [
          ...prev.country,
          { value: val, service: [1], entity: "3" },
        ],
      }));
    } else {
      setformuladata((prev) => ({
        ...prev,
        ["country"]: prev.country.filter((item, index) => item.value !== val),
      }));
    }
  };
  const pushcountryentity = (e, c, cindex) => {
    let nested = { ...formuladata };
    nested["country"][cindex]["entity"] = e.target.value;
    setformuladata(nested);
  };
  const pushcountryentitywithglobal = (k, value) => {
    let nested = { ...formuladata };
    nested["defaultentity"] = value;
    nested["country"].map((item, index) => {
      nested["country"][index]["entity"] = value;
    });
    setformuladata(nested);
  };
  const pushcountryservicewithglobal = (e, indexvalue) => {
    if (e.target.checked) {
      let nested = { ...formuladata };
      nested["country"].map((item, index) => {
        nested["country"][index]["service"] = [
          ...new Set([...nested["country"][index]["service"], indexvalue + 1]),
        ];
      });

      setformuladata(nested);
    } else {
      let nested = { ...formuladata };
      nested["country"].map((item, index) => {
        nested["country"][index]["service"] = nested["country"][index][
          "service"
        ].filter((item, inx) => item !== indexvalue + 1);
      });

      setformuladata(nested);
    }
  };
  const pushcountryaction = (e, c, cindex, index) => {
    if (e.target.checked) {
      let nested = { ...formuladata };
      nested["country"][cindex]["service"] = [
        ...nested["country"][cindex]["service"],
        index + 1,
      ];
      setformuladata(nested);
    } else {
      let nested = { ...formuladata };
      nested["country"][cindex]["service"] = nested["country"][cindex][
        "service"
      ].filter((item, inx) => item !== index + 1);
      setformuladata(nested);
    }
  };
  const changetab = (tab) => {
    if ("tab" + tab != "tab4") {
      setdata([]);
    }
    settab("tab" + tab);
  };
  const changequotetab = (tab) => {
    if (tab == qtab) {
      setqtab("");
    } else {
      setqtab(tab);
    }
  };
  const changecountyrtab = (tab) => {
    if ("tab" + tab == countrytab) {
      setcountrytab("");
    } else {
      setcountrytab("tab" + tab);
    }
  };

  const returntranscost = (from, to, word, chars, pages) => {
    let gettranscost = defaultvalue.transcost.filter(
      (item) => item.from == from && item.to == to
    );
    let totalcost = 0;
    if (gettranscost.length > 0) {
      totalcost =
        (gettranscost[0].type == "word"
          ? parseFloat(word)
          : gettranscost[0].type == "char"
          ? parseFloat(chars)
          : gettranscost[0].type == "page"
          ? parseFloat(pages)
          : parseFloat(word)) *
          parseFloat(gettranscost[0].cost) +
        150;
      let ob = { lng: to, cost: totalcost };
      let f = currenttrans.current.filter((item) => item.lng == to);
      if (f.length > 0) {
        totalcost = "Already Mentioned";
      } else {
        currenttrans.current.push(ob);
      }
    }
    return totalcost;
  };

  return (
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
                        {coststage.map((value, index) => {
                          return (
                            <li
                              key={index}
                              className={`step${index + 1} ${
                                tab == "tab" + (index + 1) ? "active" : ""
                              }`}
                            >
                              <a
                                onClick={() => {
                                  changetab(index + 1);
                                }}
                                key={index}
                                className="active-tab"
                              >
                                {value.value}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div
                      className="activetab-1 ps-3 pe-3"
                      style={{ display: `${tab == "tab1" ? "block" : "none"}` }}
                    >
                      <div className="main-radio">
                        {service.map((value, index) => {
                          return (
                            <>
                              <input
                                onChange={() => updatevalue(index + 1)}
                                key={index}
                                checked={calcstate === index + 1}
                                type="radio"
                                id={`tab${index}`}
                                name={`tab${index}`}
                              />
                              <label htmlFor="tab1" className="me-3">
                                {value}
                              </label>
                            </>
                          );
                        })}
                      </div>
                      <article className="on">
                        <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0">
                          <div className="card-body px-4 py-3">
                            <div className="row align-items-center">
                              <div className="col-9">
                                <h4 className="fw-semibold mb-8">
                                  {" "}
                                  Application Information
                                </h4>
                                <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb">
                                    <li
                                      className="breadcrumb-item"
                                      aria-current="page"
                                    >
                                      Get Quotation
                                    </li>
                                  </ol>
                                </nav>
                              </div>
                              <div className="col-3">
                                <div className="text-center mb-n5">
                                  <img
                                    src="https://www.anuation.com/crm/assets/icons/svg/icon-dd-chat.svg"
                                    alt="modernize-img"
                                    className="img-fluid mb-n4"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card">
                          <div className="card-body row">
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText1"
                                className="form-label col-sm-6 col-form-label"
                              >
                                Client Name
                              </label>
                              <div className="col-sm-6">
                                <input
                                  type="text"
                                  value={formuladata.applicant}
                                  onChange={(e) => {
                                    updatedata("applicant", e.target.value);
                                  }}
                                  className="form-control"
                                  placeholder="Client Name"
                                />
                              </div>
                              <div className="col-sm-3"></div>
                            </div>
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText1"
                                className="form-label col-sm-6 col-form-label"
                              >
                                Patent Application
                              </label>
                              <div className="col-sm-6">
                                <input
                                  type="text"
                                  value={formuladata.appno}
                                  onChange={(e) => {
                                    updatedata("appno", e.target.value);
                                  }}
                                  className="form-control"
                                  placeholder="Patent Application"
                                />
                              </div>
                              <div className="col-sm-3"></div>
                            </div>
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText1"
                                className="form-label col-sm-6 col-form-label"
                              >
                                Publication Language
                              </label>
                              <div className="col-sm-6">
                                <select
                                  onChange={(e) =>
                                    updatedata("fl", e.target.value)
                                  }
                                  className="form-select w-auto"
                                >
                                  <option value="">Choose Option</option>
                                  {defaultvalue.filinglang.map(
                                    (item, index) => {
                                      return (
                                        <option
                                          key={index}
                                          Selected={
                                            formuladata["fl"] == item.code
                                              ? "Selected"
                                              : false
                                          }
                                          value={item.code}
                                        >
                                          {item.value}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                              <div className="col-sm-3"></div>
                            </div>
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText1"
                                className="form-label col-sm-6 col-form-label"
                              >
                                Total Number of Pages
                              </label>
                              <div className="col-sm-6">
                                <input
                                  type="text"
                                  value={formuladata.p}
                                  onChange={(e) => {
                                    updatedata("p", e.target.value);
                                  }}
                                  className="form-control"
                                  placeholder="Total Number of Pages"
                                />
                              </div>
                              <div className="col-sm-3"></div>
                            </div>
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText2"
                                className="form-label col-sm-6 col-form-label"
                              >
                                Total Number of Claims
                              </label>
                              <div className="col-sm-6">
                                <input
                                  type="text"
                                  value={formuladata.c}
                                  onChange={(e) => {
                                    updatedata("c", e.target.value);
                                  }}
                                  className="form-control"
                                  placeholder="Total Number of Claims"
                                />
                              </div>
                              <div className="col-sm-3"></div>
                            </div>
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText30"
                                className="form-label col-sm-6 col-form-label"
                              >
                                Priority
                              </label>
                              <div className="col-sm-6">
                                <div className="input-group border rounded-1">
                                  <input
                                    type="text"
                                    value={formuladata.pr}
                                    onChange={(e) => {
                                      updatedata("pr", e.target.value);
                                    }}
                                    className="form-control border-0"
                                    placeholder="Priority"
                                  />
                                </div>
                                <div className="col-sm-3"></div>
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText30"
                                className="form-label col-sm-6 col-form-label"
                              >
                                ISA
                              </label>
                              <div className="col-sm-6">
                                <div className="input-group border rounded-1">
                                  <input
                                    type="text"
                                    value={formuladata.i}
                                    onChange={(e) => {
                                      updatedata("i", e.target.value);
                                    }}
                                    className="form-control border-0"
                                    placeholder="ISA"
                                  />
                                </div>
                                <div className="col-sm-3"></div>
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText30"
                                className="form-label col-sm-6 col-form-label"
                              >
                                Total words
                              </label>
                              <div className="col-sm-6">
                                <div className="input-group border rounded-1">
                                  <input
                                    type="text"
                                    value={formuladata.word}
                                    onChange={(e) => {
                                      updatedata("word", e.target.value);
                                    }}
                                    className="form-control border-0"
                                    placeholder="Total Words"
                                  />
                                </div>
                                <div className="col-sm-3"></div>
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText30"
                                className="form-label col-sm-6 col-form-label"
                              >
                                Total Character
                              </label>
                              <div className="col-sm-6">
                                <div className="input-group border rounded-1">
                                  <input
                                    type="text"
                                    value={formuladata.char}
                                    onChange={(e) => {
                                      updatedata("char", e.target.value);
                                    }}
                                    className="form-control border-0"
                                    placeholder="Total Character"
                                  />
                                </div>
                                <div className="col-sm-3"></div>
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center col-6">
                              <label
                                htmlFor="exampleInputText1"
                                className="form-label col-sm-6 col-form-label"
                              >
                                Break-up Cost
                              </label>
                              <div className="col-sm-6">
                                <select
                                  onChange={(e) =>
                                    updatedata("breakup", e.target.value)
                                  }
                                  className="form-select w-auto"
                                >
                                  <option value="">Choose Option</option>
                                  <option
                                    Selected={
                                      formuladata["breakup"] == "yes"
                                        ? "Selected"
                                        : false
                                    }
                                    value="yes"
                                  >
                                    Yes
                                  </option>
                                  <option
                                    Selected={
                                      formuladata["breakup"] == "no"
                                        ? "Selected"
                                        : false
                                    }
                                    value="no"
                                  >
                                    No
                                  </option>
                                </select>
                              </div>
                              <div className="col-sm-3"></div>
                            </div>
                          </div>
                        </div>
                      </article>
                      <div className="mt-3">
                        <button
                          className="btn btn-primary float-end next-btn"
                          onClick={() => {
                            changetab("2");
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    <div
                      className="activetab-2  ps-3 pe-3"
                      style={{ display: `${tab == "tab2" ? "block" : "none"}` }}
                    >
                      <article className="on mt-0">
                        <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0">
                          <div className="card-body px-4 py-3">
                            <div className="row align-items-center">
                              <div className="col-9">
                                <h4 className="fw-semibold mb-8">
                                  {" "}
                                  Country Selection
                                </h4>
                                <nav aria-label="breadcrumb">
                                  <ol
                                    className="breadcrumb"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <li
                                      className="breadcrumb-item"
                                      aria-current="page"
                                    >
                                      Get Quotation
                                    </li>
                                  </ol>
                                </nav>
                              </div>
                              <div className="col-3">
                                <form class="position-relative ">
                                  <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    type="text"
                                    class="form-control search-chat py-2 ps-5 bg-white"
                                    placeholder="Search Country"
                                  />

                                  <i class="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card">
                          <div className="card-body p-0">
                            <div className="row">
                              <div className="col-md-12">
                                {defaultvalue.continent_country.map(
                                  (value, index) => {
                                    const [continent, countries] =
                                      Object.entries(value)[0];
                                    const filtered = countries.filter(
                                      (country) =>
                                        country.name
                                          .toLowerCase()
                                          .includes(lowerQuery) ||
                                        country.code
                                          .toLowerCase()
                                          .includes(lowerQuery)
                                    );
                                    if (filtered.length === 0) return null;
                                    return (
                                      <div
                                        key={index}
                                        className="accordion"
                                        id="regularAccordionRobots"
                                      >
                                        <div className="accordion-item">
                                          <h2
                                            id="regularHeadingSix"
                                            className="accordion-header"
                                          >
                                            <button
                                              className="accordion-button"
                                              type="button"
                                              onClick={() => {
                                                changecountyrtab(index + 1);
                                              }}
                                              data-bs-toggle="collapse"
                                              data-bs-target="#regularCollapseSix"
                                              aria-expanded="true"
                                              aria-controls="regularCollapseSix"
                                            >
                                              {Object.keys(value)[0]}
                                            </button>
                                          </h2>
                                          <div
                                            id="regularCollapseSix"
                                            className={`accordion-collapse collapse ${
                                              countrytab ==
                                                "tab" + (index + 1) ||
                                              lowerQuery !== ""
                                                ? "show"
                                                : ""
                                            }`}
                                            aria-labelledby="regularHeadingSix"
                                            data-bs-parent="#regularAccordionRobots"
                                          >
                                            <div className="accordion-body p-2">
                                              <div className="row">
                                                {filtered.map((val, ind) => {
                                                  return (
                                                    <div
                                                      key={ind}
                                                      className="col-md-3"
                                                    >
                                                      <div className="form-check me-3 py-2">
                                                        <input
                                                          checked={checkexist(
                                                            val.code
                                                          )}
                                                          onChange={(e) => {
                                                            pushvalue(
                                                              e,
                                                              val.code
                                                            );
                                                          }}
                                                          className="form-check-input"
                                                          type="checkbox"
                                                          value={val.code}
                                                          id={`country${val.code}`}
                                                        />
                                                        <label
                                                          className="form-check-label"
                                                          htmlFor={`country${val.code}`}
                                                        >
                                                          {val.name}
                                                        </label>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                      <div className="mt-3">
                        <button
                          className="btn btn-primary float-end next-btn"
                          onClick={() => {
                            changetab("3");
                          }}
                        >
                          Next
                        </button>
                        <button
                          className="btn bg-danger-subtle text-danger float-start back-btn"
                          onClick={() => {
                            changetab("1");
                          }}
                        >
                          Previous
                        </button>
                      </div>
                    </div>

                    <div
                      className="activetab-3  ps-3 pe-3"
                      style={{ display: `${tab == "tab3" ? "block" : "none"}` }}
                    >
                      <article className="on mt-0">
                        <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0">
                          <div className="card-body px-4 py-3">
                            <div className="row align-items-center">
                              <div className="col-9">
                                <h4 className="fw-semibold mb-8">
                                  {" "}
                                  Stages Selection
                                </h4>
                                <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb">
                                    <li
                                      className="breadcrumb-item"
                                      aria-current="page"
                                    >
                                      Get Quotation
                                    </li>
                                  </ol>
                                </nav>
                              </div>
                              <div className="col-3">
                                <div className="text-center mb-n5">
                                  <img
                                    src="https://www.anuation.com/crm/assets/icons/svg/icon-dd-chat.svg"
                                    alt="modernize-img"
                                    className="img-fluid mb-n4"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="card">
                          <div class="card-body">
                            <div class="d-flex mb-3 align-items-center">
                              <h4 class="card-title mb-0">Default Values</h4>
                            </div>
                            {detailservice.map((item, index) => {
                              return (
                                <div class="form-check form-check-inline">
                                  <input
                                    onChange={(e) => {
                                      pushcountryservicewithglobal(e, index);
                                    }}
                                    class="form-check-input"
                                    type="checkbox"
                                    id={`inlineCheckbox${index}`}
                                    value={index}
                                  />
                                  <label
                                    class="form-check-label"
                                    for={`inlineCheckbox${index}`}
                                  >
                                    {item}
                                  </label>
                                </div>
                              );
                            })}

                            <div class="form-check form-check-inline">
                              <select
                                onChange={(e) => {
                                  pushcountryentitywithglobal(
                                    "defaultentity",
                                    e.target.value
                                  );
                                }}
                                className="form-select"
                              >
                                <option>Choose Your Option</option>
                                {applicantstatus.map((value, index) => {
                                  return (
                                    <option
                                      Selected={
                                        formuladata["defaultentity"] ==
                                        value["key"]
                                          ? "Selected"
                                          : false
                                      }
                                      key={value["key"]}
                                      value={value["key"]}
                                    >
                                      {" "}
                                      {value["name"]}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="accordion" id="regularAccordionRobots">
                          {formuladata.country.map(
                            (countryvalue, countryindex) => {
                              return (
                                <div
                                  key={countryindex}
                                  className="accordion-item"
                                >
                                  <h2
                                    id="regularHeadingNine"
                                    className="accordion-header"
                                  >
                                    <button
                                      onClick={(it) => {
                                        changequotetab(
                                          "tab" + countryvalue.value
                                        );
                                      }}
                                      className="accordion-button"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#regularCollapseNine"
                                      aria-expanded="true"
                                      aria-controls="regularCollapseNine"
                                    >
                                      {
                                        defaultvalue.countriescode[
                                          countryvalue.value
                                        ].name
                                      }
                                    </button>
                                  </h2>
                                  <div
                                    id="regularCollapseNine"
                                    className={`accordion-collapse collapse ${
                                      qtab == "tab" + countryvalue.value
                                        ? "show"
                                        : ""
                                    }`}
                                    aria-labelledby="regularHeadingNine"
                                    data-bs-parent="#regularAccordionRobots"
                                  >
                                    <div className="accordion-body p-2">
                                      <div className="">
                                        <div className="div_option">
                                          <div className="row align-items-center">
                                            <label
                                              htmlFor="exampleInputText3"
                                              className="form-label col-sm-5 col-form-label"
                                            >
                                              Entity
                                            </label>
                                            <div className="col-sm-7">
                                              <select
                                                onChange={(e) => {
                                                  pushcountryentity(
                                                    e,
                                                    countryvalue.value,
                                                    countryindex
                                                  );
                                                }}
                                                className="form-select"
                                              >
                                                <option>
                                                  Choose Your Option
                                                </option>
                                                {applicantstatus.map(
                                                  (value, index) => {
                                                    return (
                                                      <option
                                                        Selected={
                                                          countryvalue[
                                                            "entity"
                                                          ] == value["key"] ||
                                                          value["key"] ==
                                                            formuladata[
                                                              "defaultentity"
                                                            ]
                                                            ? "Selected"
                                                            : false
                                                        }
                                                        key={value["key"]}
                                                        value={value["key"]}
                                                      >
                                                        {" "}
                                                        {value["name"]}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                              </select>
                                            </div>
                                            <div className="col-sm-3"></div>
                                          </div>
                                        </div>
                                        {detailservice.map((item, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className="form-check me-3 py-2"
                                            >
                                              <input
                                                checked={
                                                  countryvalue.service.includes(
                                                    index + 1
                                                  )
                                                    ? true
                                                    : ""
                                                }
                                                onChange={(e) => {
                                                  pushcountryaction(
                                                    e,
                                                    countryvalue.value,
                                                    countryindex,
                                                    index
                                                  );
                                                }}
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                id={`${countryvalue.value}${index}`}
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor={`${countryvalue.value}${index}`}
                                              >
                                                {item}
                                              </label>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </article>
                      <div className="mt-3  ps-3 pe-3">
                        <button
                          className="btn btn-primary float-end next-btn"
                          onClick={() => {
                            changetab("4");
                          }}
                        >
                          Next
                        </button>
                        <button
                          className="btn bg-danger-subtle text-danger float-start back-btn"
                          onClick={() => {
                            changetab("2");
                          }}
                        >
                          Previous
                        </button>
                      </div>
                    </div>

                    <div
                      className="activetab-4  ps-3 pe-3"
                      style={{ display: `${tab == "tab4" ? "block" : "none"}` }}
                    >
                      <article className="on mt-0">
                        <div className="card bg-info-subtle shadow-none position-relative overflow-hidden mb-0">
                          <div className="card-body px-4 py-3">
                            <div className="row align-items-center">
                              <div className="col-9">
                                <h4 className="fw-semibold mb-8">
                                  {" "}
                                  Detailed Report
                                </h4>
                                <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb">
                                    <li
                                      className="breadcrumb-item"
                                      aria-current="page"
                                    >
                                      Get Quotation
                                    </li>
                                  </ol>
                                </nav>
                              </div>
                              <div className="col-3">
                                <div className="text-center mb-n5">
                                  <img
                                    src="https://www.anuation.com/crm/assets/icons/svg/icon-dd-chat.svg"
                                    alt="modernize-img"
                                    className="img-fluid mb-n4"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="accordion" id="regularAccordionRobots">
                          <div className="accordion-item mt-3">
                            <h2
                              id="regularHeadingTen"
                              className="accordion-header"
                            >
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#regularCollapseTen"
                                aria-expanded="false"
                                aria-controls="regularCollapseTen"
                              >
                                Initial Information
                              </button>
                            </h2>
                            <div
                              id="regularCollapseTen"
                              className="accordion-collapse collapse show"
                              aria-labelledby="regularHeadingTen"
                              data-bs-parent="#regularAccordionRobots"
                            >
                              <div className="accordion-body p-2">
                                <div className="accordion-body pt-0 pb-0 ps-3 row">
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText1"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      Applicant
                                    </label>
                                    <div className="col-sm-6">
                                      <input
                                        type="text"
                                        onChange={(e) => {
                                          updatedata(
                                            "applicant",
                                            e.target.value
                                          );
                                        }}
                                        className="form-control"
                                        value={formuladata.applicant}
                                      />
                                    </div>
                                    <div className="col-sm-3"></div>
                                  </div>
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText1"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      Patent Application
                                    </label>
                                    <div className="col-sm-6">
                                      <input
                                        type="text"
                                        onChange={(e) => {
                                          updatedata("appno", e.target.value);
                                        }}
                                        className="form-control"
                                        value={formuladata.appno}
                                      />
                                    </div>
                                    <div className="col-sm-3"></div>
                                  </div>
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText1"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      Publication Language
                                    </label>
                                    <div className="col-sm-6">
                                      <select
                                        onChange={(e) =>
                                          updatedata("fl", e.target.value)
                                        }
                                        className="form-select w-auto"
                                      >
                                        <option value="">Choose Option</option>
                                        {defaultvalue.filinglang.map(
                                          (item, index) => {
                                            return (
                                              <option
                                                key={index}
                                                Selected={
                                                  formuladata["fl"] == item.code
                                                    ? "Selected"
                                                    : false
                                                }
                                                value={item.code}
                                              >
                                                {item.value}
                                              </option>
                                            );
                                          }
                                        )}
                                      </select>
                                    </div>
                                    <div className="col-sm-3"></div>
                                  </div>
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText1"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      Total Number of Pages
                                    </label>
                                    <div className="col-sm-6">
                                      <input
                                        type="text"
                                        onChange={(e) => {
                                          updatedata("p", e.target.value);
                                        }}
                                        className="form-control"
                                        value={formuladata.p}
                                      />
                                    </div>
                                    <div className="col-sm-3"></div>
                                  </div>
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText2"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      Total Number of Claims
                                    </label>
                                    <div className="col-sm-6">
                                      <input
                                        type="text"
                                        onChange={(e) => {
                                          updatedata("c", e.target.value);
                                        }}
                                        className="form-control"
                                        value={formuladata.c}
                                      />
                                    </div>
                                    <div className="col-sm-3"></div>
                                  </div>
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText30"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      Priority
                                    </label>
                                    <div className="col-sm-6">
                                      <div className="input-group border rounded-1">
                                        <input
                                          type="text"
                                          onChange={(e) => {
                                            updatedata("pr", e.target.value);
                                          }}
                                          className="form-control border-0"
                                          value={formuladata.pr}
                                        />
                                      </div>
                                      <div className="col-sm-3"></div>
                                    </div>
                                  </div>
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText30"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      ISA
                                    </label>
                                    <div className="col-sm-6">
                                      <div className="input-group border rounded-1">
                                        <input
                                          type="text"
                                          onChange={(e) => {
                                            updatedata("i", e.target.value);
                                          }}
                                          className="form-control border-0"
                                          value={formuladata.i}
                                        />
                                      </div>
                                      <div className="col-sm-3"></div>
                                    </div>
                                  </div>
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText30"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      Total words
                                    </label>
                                    <div className="col-sm-6">
                                      <div className="input-group border rounded-1">
                                        <input
                                          type="text"
                                          onChange={(e) => {
                                            updatedata("word", e.target.value);
                                          }}
                                          className="form-control border-0"
                                          value={formuladata.word}
                                        />
                                      </div>
                                      <div className="col-sm-3"></div>
                                    </div>
                                  </div>
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText30"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      Total Character
                                    </label>
                                    <div className="col-sm-6">
                                      <div className="input-group border rounded-1">
                                        <input
                                          type="text"
                                          onChange={(e) => {
                                            updatedata("char", e.target.value);
                                          }}
                                          className="form-control border-0"
                                          value={formuladata.char}
                                        />
                                      </div>
                                      <div className="col-sm-3"></div>
                                    </div>
                                  </div>
                                  <div className="mb-4 row align-items-center col-6">
                                    <label
                                      htmlFor="exampleInputText1"
                                      className="form-label col-sm-6 col-form-label"
                                    >
                                      Break-up Cost
                                    </label>
                                    <div className="col-sm-6">
                                      <select
                                        onChange={(e) =>
                                          updatedata("breakup", e.target.value)
                                        }
                                        className="form-select w-auto"
                                      >
                                        <option value="">Choose Option</option>
                                        <option
                                          Selected={
                                            formuladata["breakup"] == "yes"
                                              ? "Selected"
                                              : false
                                          }
                                          value="yes"
                                        >
                                          Yes
                                        </option>
                                        <option
                                          Selected={
                                            formuladata["breakup"] == "no"
                                              ? "Selected"
                                              : false
                                          }
                                          value="no"
                                        >
                                          No
                                        </option>
                                      </select>
                                    </div>
                                    <div className="col-sm-3"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-item mt-3">
                            <h2
                              id="regularHeading11"
                              className="accordion-header"
                            >
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#regularCollapse11"
                                aria-expanded="false"
                                aria-controls="regularCollapse11"
                              >
                                Combined Quotation to file the patent
                                application
                              </button>
                            </h2>
                            <div
                              id="regularCollapse11"
                              className="accordion-collapse collapse show"
                              aria-labelledby="regularHeading11"
                              data-bs-parent="#regularAccordionRobots"
                            >
                              <div className="accordion-body pt-0 pb-0 ps-3">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th scope="col" className="odd-color">
                                          Country
                                        </th>
                                        <th scope="col" className="even-color">
                                          Entity
                                        </th>
                                        <th scope="col" className="odd-color">
                                          Filling Language
                                        </th>
                                        <th scope="col" className="even-color">
                                          Stages
                                        </th>
                                        {formuladata["breakup"] == "yes" ? (
                                          <>
                                            <th
                                              scope="col"
                                              className="odd-color"
                                            >
                                              Official fee{" "}
                                            </th>
                                            <th
                                              scope="col"
                                              className="even-color"
                                            >
                                              Professional fee
                                            </th>
                                            <th
                                              scope="col"
                                              className="even-color"
                                            >
                                              Total
                                            </th>
                                          </>
                                        ) : (
                                          <>
                                            <th
                                              scope="col"
                                              className="even-color"
                                            >
                                              Cost
                                            </th>
                                          </>
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {tab == "tab4" && getdata.length > 0 ? (
                                        formuladata.country.map(
                                          (item, index) => {
                                            let stages = item.service.filter(
                                              (item) => {
                                                return item == 1;
                                              }
                                            );
                                            let filterc = getdata.filter(
                                              (fi) => {
                                                return fi.country == item.value;
                                              }
                                            );
                                            if (filterc.length > 0) {
                                              let parseddata = JSON.parse(
                                                filterc[0].data
                                              );

                                              let returncost = getcost(
                                                item.value,
                                                [
                                                  applicantstatusnumber[
                                                    item.entity == ""
                                                      ? "1"
                                                      : item.entity
                                                  ],
                                                  "pro",
                                                ],
                                                stages
                                              );
                                              return (
                                                <tr key={index}>
                                                  <th scope="row">
                                                    {
                                                      defaultvalue
                                                        .countriescode[
                                                        item.value
                                                      ].name
                                                    }
                                                  </th>
                                                  <th scope="row">
                                                    {
                                                      applicantstatusvalue[
                                                        item.entity
                                                      ]
                                                    }
                                                  </th>
                                                  <th scope="row">
                                                    {
                                                      defaultvalue
                                                        .filinglangcode[
                                                        parseddata.part5[0].fl
                                                      ]
                                                    }
                                                  </th>
                                                  <td>
                                                    {stages
                                                      .map(
                                                        (item) =>
                                                          detailservice[
                                                            item - 1
                                                          ]
                                                      )
                                                      .toString()}
                                                  </td>
                                                  {formuladata["breakup"] ==
                                                  "yes" ? (
                                                    <>
                                                      <td>
                                                        {
                                                          defaultvalue
                                                            .filinglangcurr[
                                                            parseddata.part5[0]
                                                              .curr
                                                          ]
                                                        }{" "}
                                                        {returncost[
                                                          applicantstatusnumber[
                                                            item.entity == ""
                                                              ? "1"
                                                              : item.entity
                                                          ]
                                                        ] ?? "0"}
                                                      </td>
                                                      <td>
                                                        {
                                                          defaultvalue
                                                            .filinglangcurr[
                                                            parseddata.part5[0]
                                                              .curr
                                                          ]
                                                        }{" "}
                                                        {returncost["pro"] ??
                                                          "0"}
                                                      </td>
                                                      <td>
                                                        {
                                                          defaultvalue
                                                            .filinglangcurr[
                                                            parseddata.part5[0]
                                                              .curr
                                                          ]
                                                        }{" "}
                                                        {returncost["total"] ??
                                                          "0"}
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <td>
                                                        {
                                                          defaultvalue
                                                            .filinglangcurr[
                                                            parseddata.part5[0]
                                                              .curr
                                                          ]
                                                        }{" "}
                                                        {returncost["total"] ??
                                                          "0"}
                                                      </td>
                                                    </>
                                                  )}
                                                </tr>
                                              );
                                            }
                                          }
                                        )
                                      ) : (
                                        <></>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-item mt-3">
                            <h2
                              id="regularHeading11"
                              className="accordion-header"
                            >
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#regularCollapse11"
                                aria-expanded="false"
                                aria-controls="regularCollapse11"
                              >
                                Combined Translation Fee to file the patent
                                application
                              </button>
                            </h2>
                            <div
                              id="regularCollapse11"
                              className="accordion-collapse collapse show"
                              aria-labelledby="regularHeading11"
                              data-bs-parent="#regularAccordionRobots"
                            >
                              <div className="accordion-body pt-0 pb-0 ps-3">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th scope="col" className="odd-color">
                                          Filling Language
                                        </th>
                                        <th scope="col" className="even-color">
                                          Stages
                                        </th>
                                        <th scope="col" className="odd-color">
                                          Translation fee
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {tab == "tab4" && getdata.length > 0 ? (
                                        formuladata.country.map(
                                          (item, index) => {
                                            let stages = item.service.filter(
                                              (item) => {
                                                return item == 1;
                                              }
                                            );
                                            let filterc = getdata.filter(
                                              (fi) => {
                                                return fi.country == item.value;
                                              }
                                            );
                                            if (filterc.length > 0) {
                                              let parseddata = JSON.parse(
                                                filterc[0].data
                                              );

                                              let returncost = getcost(
                                                item.value,
                                                [
                                                  applicantstatusnumber[
                                                    item.entity == ""
                                                      ? "1"
                                                      : item.entity
                                                  ],
                                                  "pro",
                                                  "trans",
                                                ],
                                                stages
                                              );
                                              let transcost = returntranscost(
                                                formuladata.fl !=
                                                  parseddata.part5[0].fl
                                                  ? formuladata.fl != "eng" &&
                                                    parseddata.part5[0].fl !=
                                                      "eng"
                                                    ? "eng"
                                                    : formuladata.fl
                                                  : "",
                                                parseddata.part5[0].fl,
                                                formuladata.word,
                                                formuladata.char,
                                                formuladata.p
                                              );
                                              if (
                                                typeof transcost != "string"
                                              ) {
                                                return (
                                                  <tr key={index}>
                                                    <th scope="row">
                                                      {
                                                        defaultvalue
                                                          .filinglangcode[
                                                          parseddata.part5[0].fl
                                                        ]
                                                      }
                                                    </th>
                                                    <td>
                                                      {stages
                                                        .map(
                                                          (item) =>
                                                            detailservice[
                                                              item - 1
                                                            ]
                                                        )
                                                        .toString()}
                                                    </td>
                                                    <td>
                                                      {typeof transcost ==
                                                      "string"
                                                        ? ""
                                                        : defaultvalue
                                                            .filinglangcurr[
                                                            parseddata.part5[0]
                                                              .curr
                                                          ]}{" "}
                                                      {transcost}
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            }
                                          }
                                        )
                                      ) : (
                                        <></>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card">
                          <div className="card-body">
                            <div class="d-md-flex align-items-center mb-9">
                              <div class="mt-4 mt-md-0">
                                <ul
                                  class="nav nav-tabs ms-auto d-flex align-items-center flex-wrap gap-6"
                                  role="tablist"
                                >
                                  {formuladata.country.map((item, index) => {
                                    return (
                                      <li class="nav-item" role="presentation">
                                        <a
                                          onClick={(it) => {
                                            changequotetab(
                                              "tabreport" + item.value
                                            );
                                          }}
                                          class={`nav-link rounded ${
                                            "tabreport" + item.value == qtab
                                              ? "active show"
                                              : "btn bg-danger-subtle  ms-6 px-4"
                                          }`}
                                          data-bs-toggle="tab"
                                          href="#home"
                                          role="tab"
                                          aria-selected="true"
                                        >
                                          <span>
                                            {" "}
                                            {
                                              defaultvalue.countriescode[
                                                item.value
                                              ].name
                                            }{" "}
                                            Quotation
                                          </span>
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                            <div className="tab-content mt-3">
                              {formuladata.country.map((item, index) => {
                                let filterc = getdata.filter((fi) => {
                                  return fi.country == item.value;
                                });
                                if (filterc.length > 0) {
                                  let parseddata = JSON.parse(filterc[0].data);
                                  let f = currenttrans.current.filter(
                                    (item) => item.lng == parseddata.part5[0].fl
                                  );
                                  return (
                                    <div
                                      className={`tab-pane ${
                                        "tabreport" + item.value == qtab
                                          ? "active show"
                                          : ""
                                      }`}
                                    >
                                      <p className="card-subtitle">
                                        Type of Entity:{" "}
                                        <b>
                                          {applicantstatusvalue[item.entity]}
                                        </b>
                                      </p>
                                      <p className="card-subtitle">
                                        Filing Language:{" "}
                                        <b>
                                          {
                                            defaultvalue.filinglangcode[
                                              parseddata.part5[0].fl
                                            ]
                                          }
                                        </b>
                                      </p>
                                      {formuladata.fl !=
                                      parseddata.part5[0].fl ? (
                                        <p>
                                          Translation cost:{" "}
                                          <div className="d-flex align-items-center gap-2">
                                            <span className="fs-3">
                                              {formuladata.fl != "eng" &&
                                              parseddata.part5[0].fl != "eng"
                                                ? defaultvalue.filinglangcode[
                                                    "eng"
                                                  ]
                                                : defaultvalue.filinglangcode[
                                                    formuladata.fl
                                                  ]}
                                            </span>{" "}
                                            <span>
                                              <i className="ti ti-arrow-right text-success fs-4 position-relative"></i>
                                            </span>{" "}
                                            <span className="fs-3">
                                              {
                                                defaultvalue.filinglangcode[
                                                  parseddata.part5[0].fl
                                                ]
                                              }
                                            </span>
                                          </div>
                                          <b>{f.length > 0 ? f[0].cost : ""}</b>
                                        </p>
                                      ) : (
                                        <></>
                                      )}
                                      <div className="table-responsive">
                                        <table className="table mb-0">
                                          <thead>
                                            <tr>
                                              <th
                                                scope="col"
                                                className="even-color"
                                              >
                                                Description
                                              </th>
                                              <th
                                                scope="col"
                                                className="even-color"
                                              >
                                                Timeline
                                              </th>
                                              {formuladata["breakup"] ==
                                              "yes" ? (
                                                <>
                                                  <th
                                                    scope="col"
                                                    className="odd-color"
                                                  >
                                                    Official fee <br></br> (
                                                    {
                                                      defaultvalue
                                                        .filinglangcurr[
                                                        parseddata.part5[0].curr
                                                      ]
                                                    }
                                                    )
                                                  </th>
                                                  <th
                                                    scope="col"
                                                    className="even-color"
                                                  >
                                                    Professional fee <br></br> (
                                                    {
                                                      defaultvalue
                                                        .filinglangcurr[
                                                        parseddata.part5[0].curr
                                                      ]
                                                    }
                                                    )
                                                  </th>
                                                  <th
                                                    scope="col"
                                                    className="odd-color"
                                                  >
                                                    Total <br></br> (
                                                    {
                                                      defaultvalue
                                                        .filinglangcurr[
                                                        parseddata.part5[0].curr
                                                      ]
                                                    }
                                                    )
                                                  </th>
                                                </>
                                              ) : (
                                                <>
                                                  <th
                                                    scope="col"
                                                    className="odd-color"
                                                  >
                                                    Cost <br></br> (
                                                    {
                                                      defaultvalue
                                                        .filinglangcurr[
                                                        parseddata.part5[0].curr
                                                      ]
                                                    }
                                                    )
                                                  </th>
                                                </>
                                              )}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {tab == "tab4" &&
                                            getdata.length > 0 ? (
                                              item.service.map((i, ind) => {
                                                if (i == 1) {
                                                  let filterisa = parseddata[
                                                    "part1"
                                                  ].filter(
                                                    (items) =>
                                                      items["i"] ==
                                                      formuladata.i
                                                  );
                                                  let parts =
                                                    filterisa.length > 0
                                                      ? filterisa
                                                      : [
                                                          parseddata["part1"][
                                                            parseddata["part1"]
                                                              .length - 1
                                                          ],
                                                        ];
                                                  return (
                                                    <>
                                                      {parts.map(
                                                        (parti, index1) => {
                                                          let returncost =
                                                            returncostoverall(
                                                              [parti],
                                                              applicantstatusnumber[
                                                                item.entity ==
                                                                ""
                                                                  ? "1"
                                                                  : item.entity
                                                              ],
                                                              "part" + i
                                                            );
                                                          const regex =
                                                            /[^0-9.]/;
                                                          let total =
                                                            regex.test(
                                                              parti.pro
                                                            ) && parti.pro != ""
                                                              ? parti.pro ?? 0
                                                              : parseInt(
                                                                  returncost ??
                                                                    0
                                                                ) +
                                                                parseInt(
                                                                  parti.pro !=
                                                                    ""
                                                                    ? parti.pro
                                                                    : 0
                                                                );
                                                          return (
                                                            <tr key={index1}>
                                                              <td className="text-wrap width-240">
                                                                {parti.desc}
                                                              </td>
                                                              <td className="text-wrap width-240">
                                                                {parti.time ??
                                                                  ""}
                                                              </td>
                                                              {formuladata[
                                                                "breakup"
                                                              ] == "yes" ? (
                                                                <>
                                                                  <td>
                                                                    {" "}
                                                                    {returncost}
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {parti.pro ??
                                                                      ""}
                                                                  </td>
                                                                  <td>
                                                                    {total ?? 0}
                                                                  </td>
                                                                </>
                                                              ) : (
                                                                <>
                                                                  <td>
                                                                    {total ?? 0}
                                                                  </td>
                                                                </>
                                                              )}
                                                            </tr>
                                                          );
                                                        }
                                                      )}
                                                    </>
                                                  );
                                                } else {
                                                  return (
                                                    <>
                                                      {parseddata[
                                                        "part" + i
                                                      ].map((parti, index1) => {
                                                        let returncost =
                                                          returncostoverall(
                                                            [parti],
                                                            applicantstatusnumber[
                                                              item.entity == ""
                                                                ? "1"
                                                                : item.entity
                                                            ],
                                                            "part" + i
                                                          );
                                                        const regex = /[^0-9.]/;
                                                        let total =
                                                          regex.test(
                                                            parti.pro
                                                          ) && parti.pro != ""
                                                            ? parti.pro ?? 0
                                                            : parseInt(
                                                                returncost ?? 0
                                                              ) +
                                                              parseInt(
                                                                parti.pro != ""
                                                                  ? parti.pro
                                                                  : 0
                                                              );
                                                        return (
                                                          <tr key={index1}>
                                                            <td className="text-wrap width-240">
                                                              {parti.desc}
                                                            </td>
                                                            <td className="text-wrap width-240">
                                                              {parti.time ?? ""}
                                                            </td>
                                                            {formuladata[
                                                              "breakup"
                                                            ] == "yes" ? (
                                                              <>
                                                                <td>
                                                                  {" "}
                                                                  {returncost}
                                                                </td>
                                                                <td>
                                                                  {" "}
                                                                  {parti.pro ??
                                                                    ""}
                                                                </td>
                                                                <td>
                                                                  {total ?? 0}
                                                                </td>
                                                              </>
                                                            ) : (
                                                              <>
                                                                <td>
                                                                  {total ?? 0}
                                                                </td>
                                                              </>
                                                            )}
                                                          </tr>
                                                        );
                                                      })}
                                                    </>
                                                  );
                                                }
                                              })
                                            ) : (
                                              <></>
                                            )}
                                            {formuladata.fl !=
                                            parseddata.part5[0].fl ? (
                                              <tr>
                                                <td>Translation cost </td>
                                                <td
                                                  className="text-end"
                                                  colSpan={
                                                    formuladata["breakup"] ==
                                                    "yes"
                                                      ? 3
                                                      : 1
                                                  }
                                                >
                                                  <div className="d-flex align-items-center gap-2">
                                                    <span className="fs-3">
                                                      {formuladata.fl !=
                                                        "eng" &&
                                                      parseddata.part5[0].fl !=
                                                        "eng"
                                                        ? defaultvalue
                                                            .filinglangcode[
                                                            "eng"
                                                          ]
                                                        : defaultvalue
                                                            .filinglangcode[
                                                            formuladata.fl
                                                          ]}
                                                    </span>{" "}
                                                    <span>
                                                      <i className="ti ti-arrow-right text-success fs-4 position-relative"></i>
                                                    </span>{" "}
                                                    <span className="fs-3">
                                                      {
                                                        defaultvalue
                                                          .filinglangcode[
                                                          parseddata.part5[0].fl
                                                        ]
                                                      }
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <b>
                                                    {f.length > 0
                                                      ? f[0].cost
                                                      : ""}
                                                  </b>
                                                </td>
                                              </tr>
                                            ) : (
                                              <></>
                                            )}
                                            {/* {(formuladata.fl!=parseddata.part5[0].fl ? <tr><td>Translation cost </td><td className="text-end" colSpan={3}><div className="d-flex align-items-center gap-2"><span className="fs-3">{defaultvalue.filinglangcode[formuladata.fl]}</span>  <span><i className="ti ti-arrow-right text-success fs-4 position-relative"></i></span> {(formuladata.fl!='eng' && parseddata.part5[0].fl!='eng' ? <><span className="fs-3">English</span> <span><i className="ti ti-arrow-right text-success fs-4 position-relative"></i></span></> : <></>)}<span className="fs-3">{defaultvalue.filinglangcode[parseddata.part5[0].fl]}</span></div></td><td><b>{returntranscost((formuladata.fl!='eng' && parseddata.part5[0].fl!='eng' ? 'eng' : formuladata.fl),parseddata.part5[0].fl,formuladata.word)}</b></td></tr> : <></>)} */}
                                          </tbody>
                                        </table>
                                        <p>
                                          <br></br>
                                        </p>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: filterc[0].pointers,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      </article>
                      <div className="mt-3">
                        <button
                          className="btn btn-primary float-end next-btn mx-1"
                          onClick={() => {
                            createpdf();
                          }}
                        >
                          Final
                        </button>
                        {validate.file && validate.file != "" ? (
                          <a
                            target="_blank"
                            href={`${API_URL}employee/auth/${validate.file}`}
                            className="btn btn-primary float-end next-btn"
                          >
                            View
                          </a>
                        ) : (
                          <></>
                        )}
                        <button
                          className="btn bg-danger-subtle text-danger float-start back-btn"
                          onClick={() => {
                            changetab("3");
                          }}
                        >
                          Previous
                        </button>
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
  );
};
export default Patentcalculator;
