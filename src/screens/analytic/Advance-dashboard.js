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
import Header from "../../component/Header";
import Fetchdata from "../../services/fetchdata";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch, useSelector } from "react-redux";
import { userprofileupdate, profilesidebar } from "../../reducers/Userdata";
import Uploadsidebar from "../../component/modals/Analytics/Uploadsidebar.js";
import Commentmodal from "../../component/modals/comments";
import Uploaddata from "../../services/uploaddata";
import Style from "../../component/style/style";
import Clock from "../../component/Clock.js";
import AnalyticEditmodal from "../../component/modals/AnalyticEditmodal.js";
import OutlinedInput from "@mui/material/OutlinedInput";
import Filterinput from "../component/Filterinput.js";
import Filterselect from "../component/Filterselect.js";
import {
  callstatus,
  emailstatus,
  costs,
  standard,
  tablesetting,
  defaultvalue,
} from "../../constant/Constant.js";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AnalyticEmailbox from "../../component/modals/Analytics/Unique-email-cron-modal.js";
import Cronlist from "../../component/modals/cron-list.js";
import ResizableColumn2 from "../../component/Resize-two.js";
import Pivotprocess from "../../component/modals/Pivot.js";
function Loading() {
  return <h2>🌀 Loading...</h2>;
}
let filtered = [];
const Advancedashboard = () => {
  const [d, sd] = useState([]);
  const [d2, gd] = useState([]);
  const [defaultdata, setdefaultdata] = useState({
    totalpages: [],
    profilebar: { status: false, email: "" },
    opencronbox: false,
    opensendmailbox: false,
    sortDown: true,
    showcurrencytab: false,
    countrydata: [],
    agentdupedata: [],
    dupedata: [],
    applicantstatusdata: [],
    cio: [],
    callstatus: [],
    emailstatus: [],
    agentgendata: [],
    gendata: [],
    monthdata: [],
  });
  const [columns, setColumns] = useState([
    { width: 140, css: "", type: "", key: "First Name" },
    { width: 110, css: "", type: "", key: "Last Name" },
    { width: 110, css: "", type: "", key: "Company" },
    { width: 110, css: "", type: "", key: "Designation" },
    { width: 110, css: "", type: "", key: "Field/Expertise" },
    { width: 110, css: "", type: "", key: "Technology" },
    { width: 110, css: "", type: "", key: "Contact Info of" },
    { width: 110, css: "", type: "", key: "Company Type" },
    { width: 110, css: "", type: "", key: "Email ID" },
    { width: 110, css: "", type: "", key: "Web Domain" },
    { width: 110, css: "", type: "", key: "Phone No" },
    { width: 110, css: "", type: "", key: "Alt Phone No." },
    { width: 110, css: "", type: "", key: "City" },
    { width: 110, css: "", type: "", key: "Country" },
    { width: 110, css: "", type: "", key: "Linkedin Profile" },
    { width: 110, css: "", type: "", key: "Email Date" },
    { width: 110, css: "", type: "", key: "Follow up" },
    { width: 110, css: "", type: "", key: "Next Follow up" },
    { width: 110, css: "", type: "", key: "Email Status" },
    { width: 110, css: "", type: "", key: "Call Date" },
    { width: 110, css: "", type: "", key: "Call Status" },
    { width: 110, css: "", type: "", key: "Comments" },
    { width: 110, css: "", type: "", key: "Assigned to" },
    { width: 110, css: "", type: "", key: "Last Name Sent Account" },
    { width: 110, css: "", type: "", key: "Last Email Sent Account" },
    { width: 110, css: "", type: "", key: "Account History" },
    { width: 110, css: "", type: "", key: "Cron Status" },
  ]);
  const handleResize = (index, width) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      newColumns[index].width = width;
      return newColumns;
    });
  };
  const [showeditmodal, updateeditmodal] = useState({ state: false, data: {} });
  const countries = useRef([]);
  const offset = useRef({ limit: 0, page: 0 });
  const processing = useRef(false);
  const months = useRef([]);
  const platform = useRef("analytics");
  const auth = JSON.parse(localStorage.getItem("user"));
  const valued = useSelector((state) => state.userdata.value);
  const pivotmodalstate = useSelector((state) => state.crmstyle.pivot);
  const dispatch = useDispatch();
  useEffect(() => {
    clearfilter();
  }, []);

  let data = {};
  let formdata1 = {
    type: "value",
    file_refresh: "comment",
    offset: "1",
    w_id: "",
    anuationuser_uniqueid: auth.userid,
    accounttype: auth.type,
    org: auth.org,
    recordlimit: auth.type == "1" ? 10000 : 0,
    posttype: "local-analytic-data",
    email: "",
    domain: "",
    platform: platform.current,
    company: "",
    phone: "",
    c_p_f: "",
    applicant: "",
    cio: "",
    deadline: "",
  };

  let formdata = useMemo(() => {
    return formdata1;
  }, [formdata1]);

  const changedata = useCallback((data, modal = "") => {
    sd(data);
    gd(data);
    if (modal == "editmodal") {
      updateeditmodal((prev) => ({ ...prev, state: false }));
    }
  });
  const callpages = (e, type) => {
    let sheet = document.querySelector(".sheet.active").getAttribute("id");
    let user = document.querySelector("#username"),
      pages = document.querySelector("#pages").value,
      recordlimit = document.querySelector("#recordlimit").value;
    user = user ?? { value: auth.userid };
    if (type == "limit") {
      loaddata({
        ...formdata1,
        sheet: sheet,
        recordlimit: recordlimit,
        accounttype: user.value == "All" ? 2 : 1,
        offset: 1,
        anuationuser_uniqueid: user.value == "" ? auth.userid : user.value,
      });
    } else {
      loaddata({
        ...formdata1,
        sheet: sheet,
        recordlimit: recordlimit,
        accounttype: 1,
        offset: pages == "" ? 1 : pages,
        anuationuser_uniqueid: user.value == "" ? auth.userid : user.value,
      });
    }
  };
  const calluser = (e, type) => {
    let sheet = document.querySelector(".sheet.active").getAttribute("id");
    let user = document.querySelector("#username").value,
      recordlimit = document.querySelector("#recordlimit").value;

    loaddata({
      ...formdata1,
      sheet: sheet,
      recordlimit: recordlimit,
      accounttype: user == "All" ? 2 : 1,
      offset: 1,
      anuationuser_uniqueid: user == "" ? auth.userid : user,
    });
  };
  const loaddata = useCallback(async (formdata, refreshmode = "") => {
    document.querySelector(".sheet.active").classList.remove("active");
    document
      .querySelector("#" + (formdata.sheet ?? "current"))
      .classList.add("active");
    let abortc = new AbortController();
    let { signal } = abortc;

    processing.current = true;
    formdata.advance = true;
    let datas = {};
    document.querySelector(".ti-refresh").classList.add("rotate");
    document.querySelector(".body-wrapper1").classList.add("loader");
    data = await Fetchdata.Analyticdata(formdata, signal)
      .then((response) => {
        return response;
      })
      .finally(() => {
        document.querySelector(".ti-refresh").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
      });
    if (data.data.success) {
      datas = data.data.data;
      if (formdata.initialload) {
        countries.current = data.data.country;
      }
      processing.current = false;
      setdefaultdata((prev) => ({
        ...prev,
        totalpages: new Array(data.data.totalpage)
          .fill(0)
          .map((_, index) => index + 1),
      }));
    } else {
      processing.current = false;
      datas = [];
    }

    sd(datas);
    gd(datas);
    dispatch(userprofileupdate(datas.length));
    document
      .querySelector("table")
      .classList.add("table", "table-bordered", "table-hover");
  });
  useEffect(() => {
    loaddata({ ...formdata, initialload: true });
  }, []);
  const showmailbox = () => {
    if (document.querySelector("#mailtypeaccount").value != "") {
      setdefaultdata((prev) => ({ ...prev, opensendmailbox: true }));
    }
  };
  const showdupemailbox = () => {
    setdefaultdata((prev) => ({ ...prev, opendupesendmailbox: true }));
  };
  const showcronbox = () => {
    setdefaultdata((prev) => ({ ...prev, opencronbox: true }));
  };
  const closecronbox = () => {
    setdefaultdata((prev) => ({ ...prev, opencronbox: false }));
  };
  const closeemailsendbox = () => {
    setdefaultdata((prev) => ({ ...prev, opensendmailbox: false }));
  };
  const closedupeemailsendbox = () => {
    setdefaultdata((prev) => ({ ...prev, opendupesendmailbox: false }));
  };
function serverfilterdata(index, value, keys = {}) {
    console.log(index, value, keys);
     loaddata({ ...formdata, countrydata: value });
}
  function filterdata(index, value, keys = {}) {
    let i = 0;
    let filters = document.querySelectorAll(".filter");
    index =
      Object.keys(keys).length > 0 && keys.key == "timezone"
        ? "timezone"
        : index;
    let obj = { key: index, value: value };

    if (filtered.length == 0) {
      if (value != "") {
        filtered.push(obj);
      }
    } else {
      const ind = filtered.findIndex((e) => {
        return e.key == index;
      });
      if (ind > -1) {
        if (value == "") {
          filtered.splice(ind, 1);
        } else {
          filtered[ind].value = value;
        }
      } else {
        if (value != "") {
          filtered.push(obj);
        }
      }
    }
    let copy = d2; //[...d2];
    filtered.forEach((e) => {
      var sv = e.value;

      if (sv == "") {
        copy = copy.filter((f) => {
          return f[e.key].toLowerCase().indexOf("") > -1;
        });
      } else {
        sv = sv !== "" ? sv.toLowerCase().split(",") : "";
        copy = copy.filter((f) => {
          return tablesetting.returndataanalytic(sv, f[e.key], e.key) > -1;
        });
      }
      i++;
    });
    if (filtered.length == i) {
      sd(copy);
      dispatch(userprofileupdate(copy.length));
    }
  }
  function timezone(code) {
    code =
      code != "N/A" &&
      code != "" &&
      typeof code != "undefined" &&
      typeof code == "string"
        ? code?.split(" ")
        : "";
    let timezone =
      code.length >= 2 &&
      typeof defaultvalue.timezone[code[0]] !== "undefined" &&
      defaultvalue.timezone[code[0]].timezone !== ""
        ? defaultvalue.timezone[code[0]].timezone
        : "Asia/Kolkata";
    return timezone;
  }
  async function pickvalue(e, i, ni, key) {
    console.log(e, i, ni, key);
    e.stopPropagation();
    if (e.detail == 1) {
      document.querySelector(".cell-name").value = key.key;
      document.querySelector(".cell-value").innerHTML =
        i == "8" && e.target.tagName == "TD"
          ? e.target.getElementsByTagName("span")[0].innerHTML
          : i == "2" && e.target.tagName == "TD"
          ? e.target.getElementsByTagName("a")[0].innerHTML
          : e.target.innerHTML;
    } else if (e.detail == 2 && i == "8") {
      showprofilesidebar(
        e,
        e.target.getElementsByTagName("span")[0].innerHTML,
        "email"
      );
    } else if (e.detail == 2 && i == "21") {
      let formdata = {
        publication_value: e.target.closest("tr").querySelectorAll("td")[1]
          .innerText,
        email: e.target.closest("tr").querySelectorAll("td")[12].innerText,
        domain: e.target.closest("tr").querySelectorAll("td")[13].innerText,
        type: "3",
        table: "ip",
      };
      const fetchcomment = await Uploaddata.fetchcomment(formdata).then(
        (response) => {
          return response;
        }
      );
      document.querySelector("#add-contact").classList.add("show");
      document.querySelector("#add-contact").style.display = "block";
      document.querySelector("#add-contact .modal-body").innerHTML =
        fetchcomment.data;
    }
  }
  async function editinfo(state, app = "") {
    if (state) {
      const getdata = await Fetchdata.geteditdata({
        publication_value: app,
        type: "editanalyticdata",
      }).then((response) => {
        return response;
      });
      updateeditmodal({ state: state, data: getdata.data.data });
    } else {
      updateeditmodal({ state: state, data: "" });
    }
  }
  function pushdata(event, w) {
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
  }
  function sortdata(event, index = 0, key = {}) {
    console.log(event, index);
    const copy = [...d];
    if (event.detail == 1) {
      if (defaultdata.sortDown) {
        copy.sort(
          (a, b) =>
            -(
              (typeof a[index] == "number" ? a[index] : a[index]?.trim()) >
              (typeof b[index] == "number" ? b[index] : b[index]?.trim())
            )
        );
      } else {
        copy.sort(
          (a, b) =>
            -(
              (typeof a[index] == "number" ? a[index] : a[index]?.trim()) <
              (typeof b[index] == "number" ? b[index] : b[index]?.trim())
            )
        );
      }
      setdefaultdata((prev) => ({ ...prev, sortDown: !prev.sortDown }));
      sd(copy);
    } else {
      navigator.clipboard.writeText(
        [
          ...new Set(
            copy.map((item) => {
              if (item[index] != "" && item[index] != null) {
                return item[index];
              } else {
                return false;
              }
            })
          ),
        ].toString()
      );
    }
  }
  const clearfilter = useCallback(() => {
    filtered = [];
    let d = document.querySelectorAll(".filter");
    d.forEach((e) => {
      e.value = "";
    });
    sd(d2);
    setdefaultdata({
      totalpages: [],
      profilebar: { status: false, email: "" },
      opencronbox: false,
      opensendmailbox: false,
      sortDown: true,
      showcurrencytab: false,
      countrydata: [],
      agentdupedata: [],
      dupedata: [],
      applicantstatusdata: [],
      cio: [],
      callstatus: [],
      emailstatus: [],
      agentgendata: [],
      gendata: [],
      monthdata: [],
    });
    dispatch(userprofileupdate(d2.length));
  }, [d]);
  const showcurrency = useCallback(() => {
    setdefaultdata((prev) => ({
      ...prev,
      showcurrencytab: prev.showcurrencytab ? false : true,
    }));
  }, [defaultdata.showcurrencytab]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 5;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 50,
      },
    },
  };

  const handlechange = (e) => {
    //setemail(e.target.value)
    setdefaultdata((prev) => ({ ...prev, emailstatus: e.target.value }));
    filterdata(18, e.target.value.toString());
  };
  const handlecio = (e) => {
    setdefaultdata((prev) => ({ ...prev, cio: e.target.value }));
    //setcio(e.target.value);
    filterdata(6, e.target.value.toString());
  };
  const handleapplicant = (e) => {
    // setapplicant(e.target.value)
    setdefaultdata((prev) => ({
      ...prev,
      applicantstatusdata: e.target.value,
    }));
    filterdata(8, e.target.value.toString());
  };
  const handledupe = (e) => {
    //setdupe(e.target.value)
    setdefaultdata((prev) => ({ ...prev, dupedata: e.target.value }));
    filterdata(53, e.target.value.toString());
  };
  const handleagentdupe = (e) => {
    setdefaultdata((prev) => ({ ...prev, agentdupedata: e.target.value }));
    filterdata(61, e.target.value.toString());
  };
  const handlecountry = (e) => {
    if (e.target.value.includes("all")) {
      //setcountry(countries.current)
      setdefaultdata((prev) => ({ ...prev, countrydata: countries.current }));
      serverfilterdata(13, countries.current.toString());
    } else if (e.target.value.includes("unall")) {
      //setcountry([])
      setdefaultdata((prev) => ({ ...prev, countrydata: [] }));
      serverfilterdata(13, [].toString());
    } else {
      // setcountry(e.target.value)
      setdefaultdata((prev) => ({ ...prev, countrydata: e.target.value }));
      serverfilterdata(13, e.target.value.toString());
    }
  };
  const handlemonthdata = (e) => {
    if (e.target.value.includes("all")) {
      //  setmonth(months.current)
      setdefaultdata((prev) => ({ ...prev, monthdata: e.target.value }));
      filterdata(55, months.current.toString());
    } else if (e.target.value.includes("unall")) {
      //setmonth([])
      setdefaultdata((prev) => ({ ...prev, monthdata: [] }));
      filterdata(55, [].toString());
    } else {
      //  setmonth(e.target.value)
      setdefaultdata((prev) => ({ ...prev, monthdata: e.target.value }));
      filterdata(55, e.target.value.toString());
    }
  };
  const handlegen = (e) => {
    //setgen(e.target.value)
    setdefaultdata((prev) => ({ ...prev, gendata: e.target.value }));
    filterdata(54, e.target.value.toString());
  };
  const handleagentgen = (e) => {
    setdefaultdata((prev) => ({ ...prev, agentgendata: e.target.value }));
    filterdata(62, e.target.value.toString());
  };
  const handlecallchange = (e) => {
    // setcall(e.target.value);
    setdefaultdata((prev) => ({ ...prev, callstatus: e.target.value }));
    filterdata(20, e.target.value.toString());
  };
  const showprofilesidebar = (i, v, v1) => {
    if (document.querySelector("i.profilefetch.show")) {
      document
        .querySelector("i.profilefetch.show")
        .classList.replace("show", "hide");
    }
    i.target.querySelector("i").classList.replace("hide", "show");

    //setprofilebar((prev)=>( {...prev,status:true,email:v} ));
    dispatch(profilesidebar({ status: true, email: v, type: v1 }));
  };
  const closebar = () => {
    setdefaultdata((prev) => ({
      ...prev,
      profilebar: { status: false, email: "" },
    }));

    //setprofilebar((prev)=>( {...prev,status:false,email:''} ));
    if (document.querySelector("i.profilefetch.show")) {
      document
        .querySelector("i.profilefetch.show")
        .classList.replace("show", "hide");
    }
  };
  const removeduplicate = (comment) => {
    let comments = comment != "" ? comment.split("=") : [];

    comments.shift();
    return comments
      .filter((c, i, a) => {
        return a.indexOf(c) == i && c != "";
      })
      .join("\r\n\r\n");
  };
  function getColumnLetter(columnNumber) {
    let dividend = columnNumber;
    let columnName = "";
    let modulo;

    while (dividend > 0) {
      modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - modulo) / 26);
    }

    return columnName;
  }
  return (
    <>
      <div className={" custom-table "}>
        {showeditmodal.state == true ? (
          <AnalyticEditmodal
            alldata={d2}
            changedata={changedata}
            show={showeditmodal}
            fn={editinfo}
          ></AnalyticEditmodal>
        ) : (
          <></>
        )}
        <Commentmodal />
        <Style></Style>
        <Header
          platform={platform}
          changedata={changedata}
          except={true}
          completedata={d2}
          alldata={d}
          showmailbox={showmailbox}
          showdupemailbox={showdupemailbox}
          showcronbox={showcronbox}
          clearfilters={clearfilter}
          refreshdata={loaddata}
          formdatas={formdata}
          showcurrencies={showcurrency}
        ></Header>
        {defaultdata.opensendmailbox ? (
          <AnalyticEmailbox
            page="ip"
            filtered={filtered}
            platform={platform}
            alldata={d}
            changedata={changedata}
            closeemailsendbox={closeemailsendbox}
            emailsdata={d.slice(
              0,
              document.querySelector("#totalsending").value
            )}
            fn={closeemailsendbox}
          ></AnalyticEmailbox>
        ) : (
          <></>
        )}
        {pivotmodalstate ? (
          <Pivotprocess
            page="freshdata"
            platform={platform}
            alldata={d}
            column="58"
          ></Pivotprocess>
        ) : (
          <></>
        )}

        {defaultdata.opencronbox ? (
          <Cronlist platform={platform} closecronbox={closecronbox}></Cronlist>
        ) : (
          <></>
        )}
        <div className="container-fluid bootstrap-table body-wrapper1">
          <div className="fixed-table-container fixed-height d-flex">
            <ul
              style={{
                width: "100%",
                left: "0",
                zIndex: "9",
                background: "white",
              }}
              className="breadcrumb"
            >
              <li className="col-2">
                <input disabled className="form-control cell-name" />
              </li>
              <li className="col-10">
                <textarea
                  disabled
                  style={{ height: "40px" }}
                  className="form-control cell-value"
                ></textarea>
              </li>
            </ul>
            <Suspense fallback={<Loading />}>
              <TableVirtuoso
                components={{ className: "koushal" }}
                data={d}
                fixedHeaderContent={() => (
                  <>
                    <tr>
                      <th></th>
                      {columns.map((column, index) => (
                        <ResizableColumn2
                          key={column.key}
                          width={column.width}
                          type={column.type}
                          costtab={defaultdata.showcurrencytab}
                          getColumnLetter={getColumnLetter}
                          index={index}
                          onResize={(width) => handleResize(index, width)}
                        >
                          {column.key}
                        </ResizableColumn2>
                      ))}
                    </tr>
                    <tr>
                      <th>
                        <div className="headers">Sr. no</div>
                      </th>
                      <Filterinput
                        fieldname={"First Name"}
                        id={"0"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Last Name"}
                        id={"1"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Company"}
                        id={"2"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Designation"}
                        id={"3"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Field/Expertise"}
                        id={"4"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Technology"}
                        id={"5"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterselect
                        defaultv={defaultvalue.contactinfostatus}
                        values={defaultdata.cio}
                        event={handlecio}
                        fieldname={"Contact Info of"}
                        id={"6"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterselect>

                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Company Type
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 7);
                            }}
                          ></i>{" "}
                        </div>

                        <FormControl sx={{ m: 0, width: "100%" }}>
                          <Select
                            labelId="up-multiple-name-label"
                            id="up-multiple-name"
                            value={defaultdata.dupedata}
                            multiple
                            onChange={handledupe}
                            label="Age"
                          >
                            {defaultvalue.dupestatus.map((name) => (
                              <MenuItem key={name.key} value={name.key}>
                                {name.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </th>
                      <Filterinput
                        fieldname={"Email ID"}
                        id={"8"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Additional Email ID"}
                        id={"27"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Web Domain"}
                        id={"9"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Phone No"}
                        id={"10"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Alt Phone No."}
                        id={"11"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"City"}
                        id={"12"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Country{" "}
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 13);
                            }}
                          ></i>{" "}
                        </div>
                        <FormControl sx={{ m: 0, width: "100px" }}>
                          <Select
                            labelId="up-multiple-name-label"
                            id="up-multiple-name"
                            value={defaultdata.countrydata}
                            onChange={handlecountry}
                            label="Age"
                          >
                            <MenuItem key="_blank" value="_blank">
                              Blank
                            </MenuItem>
                            <MenuItem key="all" value="all">
                              Check All
                            </MenuItem>
                            <MenuItem key="unall" value="unall">
                              Uncheck All
                            </MenuItem>
                            {countries.current.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </th>
                      <Filterinput
                        fieldname={"Timezone"}
                        id={"13"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Linkedin Profile"}
                        id={"14"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"First Email Date"}
                        id={"15"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"FollowUp date"}
                        id={"16"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Next Follow Up"}
                        id={"17"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Email Status
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 18);
                            }}
                          ></i>{" "}
                        </div>

                        <FormControl sx={{ m: 0, width: "150px" }}>
                          <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={defaultdata.emailstatus}
                            onChange={handlechange}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                          >
                            {defaultvalue.analyticnames.map((name) => (
                              <MenuItem key={name.key} value={name.key}>
                                {name.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Call Date
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 19);
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata(19, e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Call Status
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 20);
                            }}
                          ></i>{" "}
                        </div>
                        <FormControl sx={{ m: 0, width: "150px" }}>
                          <Select
                            labelId="call-name-label"
                            id="call-name"
                            multiple
                            value={defaultdata.callstatus}
                            onChange={handlecallchange}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                          >
                            {defaultvalue.analyticcallnames.map((name) => (
                              <MenuItem key={name.key} value={name.key}>
                                {name.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </th>
                      <Filterinput
                        fieldname={"Comment"}
                        id={"21"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Assigned to"}
                        id={"26"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Last Name Sent Account"}
                        id={"22"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Last Email Sent Account"}
                        id={"23"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Account History"}
                        id={"24"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                      <Filterinput
                        fieldname={"Cron status"}
                        id={"25"}
                        filterdata={filterdata}
                        sortdata={sortdata}
                      ></Filterinput>
                    </tr>
                  </>
                )}
                itemContent={(index, user) => (
                  <>
                    <td>
                      {offset.current.limit * (offset.current.page - 1) +
                        (index + 1)}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 2, 0, { key: "First Name" });
                      }}
                      className="column-value"
                      style={{
                        background: user[0],
                        position: "sticky",
                        left: 0,
                        zIndex: 1,
                      }}
                    >
                      <img
                        className="flagwidth"
                        src={`https://www.anuation.com/crm/assets/flags/${user[13].toLowerCase()}.png`}
                      />
                      <a
                        target="blank"
                        href={
                          "https://patentscope.wipo.int/search/en/detail.jsf?docId=" +
                          user[0]
                        }
                      >
                        {user[0]}
                      </a>
                      <i
                        onClick={() => {
                          editinfo(true, user[29]);
                        }}
                        style={{
                          position: "absolute",
                          top: "1px",
                          right: "5px",
                          background: "#5d87ff",
                          width: "14px",
                          height: "14px",
                          display: "flex",
                          lineHeight: "14px",
                          borderRadius: "50%",
                          color: "white",
                          justifyContent: "center",
                        }}
                        className="ti ti-edit"
                      ></i>
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 1, 1, { key: "Second Name" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[1]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 3, 2, { key: "Company" });
                      }}
                      className="column-value small"
                      style={{}}
                    >
                      {user[2]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 4, 3, { key: "Designation" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[3]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 5, 4, { key: "Field/Expertise" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[4]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 6, 5, { key: "Technology" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[5]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 7, 6, { key: "Contact Info of" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[6]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 54, 8, { key: "Company Type" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[7]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 8, 9, { key: "EMAIL ID" });
                      }}
                      className={`cursor-pointer text-primary column-value align-items-center 
                        `}
                      style={{}}
                    >
                      <i className="ti ti-refresh rotate hide profilefetch"></i>
                      <span className="email-id">{user[8]}</span>
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 27, 9, { key: "Additional Email ID" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[27]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 9, 10, { key: "Web Domain" });
                      }}
                      className={`column-value ${
                        tablesetting.countred(user[9], 9, d) &&
                        typeof user[9] != "undefined" &&
                        user[9] != ""
                          ? "red-dupe"
                          : ""
                      }`}
                      style={{}}
                    >
                      {user[9]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 10, 11, { key: "Phone No" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[10]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 11, 12, { key: "Alt Phone No." });
                      }}
                      className={`cursor-pointer text-primary column-value align-items-center ${
                        tablesetting.countred(user[11], 11, d) && user[11] != ""
                          ? "red-dupe"
                          : ""
                      }`}
                      style={{}}
                    >
                      <i className="ti ti-refresh rotate hide profilefetch"></i>
                      <span className="email-id">{user[11]}</span>
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 12, 13, { key: "City" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[12]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 13, 14, { key: "Country" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[13]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 13, 14, { key: "Timezone" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      <Clock country={user[13]} timezone={timezone(user[10])} />
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 13, 14, { key: "Linkedin Profile" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[14]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 14, 15, { key: "First Email Date" });
                      }}
                      className="column-value small"
                      style={{}}
                    >
                      {user[15]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 15, 16, { key: "FollowUp date" });
                      }}
                      className="column-value small"
                      style={{}}
                    >
                      {user[16]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 16, 17, { key: "Next Follow Up" });
                      }}
                      className="column-value small"
                      style={{}}
                    >
                      {user[17]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 20, 21, { key: "Email Status" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {emailstatus[user[18]] ?? ""}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 21, 22, { key: "Call Date" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[19]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 22, 23, { key: "Call Status" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {callstatus[user[20]] ??
                        (user[20] != "_blank" ? user[20] : "")}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 21, 27, { key: "Comment" });
                      }}
                      className="column-value"
                      style={{}}
                      dangerouslySetInnerHTML={{
                        __html: removeduplicate(user[21]),
                      }}
                    />
                    <td
                      onClick={(e) => {
                        pickvalue(e, 26, 26, { key: "Assigned to" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[26] ?? ""}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 22, 26, { key: "Last name Sent Account" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[22] ?? ""}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 23, 26, {
                          key: "Last Email Sent Account",
                        });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[23] ?? ""}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 25, 27, { key: "Account History" });
                      }}
                      className="column-value"
                      style={{}}
                      dangerouslySetInnerHTML={{
                        __html: removeduplicate(user[24] ?? ""),
                      }}
                    />
                    <td
                      onClick={(e) => {
                        pickvalue(e, 25, 26, { key: "Cron status" });
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user[25] ?? ""}
                    </td>
                  </>
                )}
              />
            </Suspense>
            <div className="footable-pagination-wrapper text-center fixed d-inline-grid">
              <div className="divider text-start ps-sm-1">
                <span
                  id="current"
                  className="active sheet"
                  onClick={() => loaddata({ ...formdata, sheet: "current" })}
                >
                  Current
                </span>
              </div>
              <span className="label label-default">
                <span className="text-white">
                  Total Filtered Record {valued}
                </span>
              </span>
              <div className="divider text-start d-flex">
                {
                  <>
                    <span>
                      <select
                        className="form-select bg-white height-28 padding-filter"
                        id="recordlimit"
                        onChange={(e) => {
                          callpages(e, "limit");
                        }}
                      >
                        {" "}
                        <option value=""> Limit</option>
                        {[
                          10, 100, 500, 1000, 2000, 3000, 5000, 7000, 10000,
                        ].map((item, key) => (
                          <option key={key} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </span>
                    {auth.type == "2" ? (
                      <span>
                        <select
                          className="form-select bg-white height-28 padding-filter"
                          id="username"
                          onChange={(e) => {
                            calluser(e, "username");
                          }}
                        >
                          <option value="All">All User</option>
                          {defaultvalue.usernames.map((item, key) => {
                            return (
                              <option key={key} value={item.key}>
                                {item.name}
                              </option>
                            );
                          })}
                        </select>
                      </span>
                    ) : (
                      <></>
                    )}
                    <span>
                      <select
                        className="form-select bg-white height-28 padding-filter"
                        id="pages"
                        onChange={(e) => {
                          callpages(e, "pages");
                        }}
                      >
                        <option value=""> Select page</option>
                        {defaultdata.totalpages.map((item, key) => {
                          return (
                            <option key={key} value={item}>
                              {"Page " + item}
                            </option>
                          );
                        })}
                      </select>
                    </span>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
        <Uploadsidebar />
      </div>
    </>
  );
};

export default Advancedashboard;
