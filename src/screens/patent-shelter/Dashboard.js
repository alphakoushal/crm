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
import Fetchdata from "../../services/fetchdata";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch, useSelector } from "react-redux";
import { userprofileupdate,profilesidebar } from "../../reducers/Userdata";
import Uploadsidebar from "../../component/Uploadsidebar";
import Commentmodal from "../../component/modals/comments";
import Uploaddata from "../../services/uploaddata";
import Style from "../../component/style/style";
import Clock from "../../component/Clock.js";
import Editmodal from "../../component/modals/Editmodal";
import OutlinedInput from "@mui/material/OutlinedInput";
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
import Sidebarprofile from "../../component/modals/Sidebarprofile";
import PScronbox from "../../component/modals/patentshelter/Cronbox.js";
import Cronlist from "../../component/modals/cron-list";
import ResizableColumn2 from "../../component/Resize-two";
import Pivotprocess from "../../component/modals/Pivot.js";
function Loading() {
  return <h2>🌀 Loading...</h2>;
}
let filtered = [];
const Dashboard = ({service}) => {
  const [d, sd] = useState([]);
  const [d2, gd] = useState([]);
  const [defaultdata, setdefaultdata] = useState({
    totalpages: [],
    profilebar: { status: false, email: "" },
    opencronbox: false,
    opendupesendmailbox: false,
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
    { width: 140, css: "", type: "", key: "APPLN.NO." },
    { width: 110, css: "", type: "", key: "Title" },
    { width: 110, css: "", type: "", key: "APPLICANT NAME" },
    { width: 110, css: "", type: "", key: "Applicant Status" },
    { width: 110, css: "", type: "", key: "CONTACT INFO OF" },
    { width: 110, css: "", type: "", key: "CONTACT PERSON" },
    { width: 110, css: "", type: "", key: "EMAIL ID" },
    { width: 110, css: "", type: "", key: "Domain" },
    { width: 110, css: "", type: "", key: "PH. NO." },
    { width: 110, css: "", type: "", key: "First Email Date" },
    { width: 110, css: "", type: "", key: "FollowUp date" },
    { width: 110, css: "", type: "", key: "Next Follow Up" },
    { width: 110, css: "", type: "", key: "Email Status" },
    { width: 110, css: "", type: "", key: "Call Status" },
    { width: 110, css: "", type: "", key: "Comment" },
    { width: 110, css: "", type: "", key: "Sent on" },
    { width: 110, css: "", type: "", key: "Cron Status" },
    { width: 110, css: "", type: "", key: "Assigned" },
    { width: 110, css: "", type: "", key: "Email sent from" },
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
    const platform = useRef(service);
  const auth = JSON.parse(localStorage.getItem("user"));
  const valued = useSelector((state) => state.userdata.value);
  const pivotmodalstate = useSelector((state)=>state.crmstyle.pivot);
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
    service:service,
    anuationuser_uniqueid: auth.userid,
    accounttype: auth.type,
    org: auth.org,
    recordlimit: auth.type == "1" ? 10000 : 0,
    posttype: "ps-current-data",
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
    let datas = {};
    document.querySelector(".ti-refresh").classList.add("rotate");
    document.querySelector(".body-wrapper1").classList.add("loader");
    data = await Fetchdata.itaxiosrequest(formdata, signal)
      .then((response) => {
        return response;
      })
      .finally(() => {
        document.querySelector(".ti-refresh").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
      });
    if (data.data.success) {
      datas = data.data.data;
      countries.current = data.data.country;
      months.current = data.data.monthdata;
      processing.current = false;
      offset.current = {
        page: data.data.currentpage,
        limit: data.data.recordlimit,
      };
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
    loaddata(formdata);
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

  function filterdata(index, value,keys={}) {
    let i = 0;
    let filters = document.querySelectorAll(".filter");
    index =(Object.keys(keys).length>0 && keys.key=='timezone' ? 'timezone' : index);
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
          return tablesetting.returndata(sv, f[e.key], e.key) > -1;
        });
      }
      i++;
    });
    if (filtered.length == i) {
      sd(copy);
      dispatch(userprofileupdate(copy.length));
    }
  }

  async function pickvalue(e,key) {
    e.stopPropagation();
    console.log( e.target.getElementsByTagName("span"));
    if (e.detail == 1) {
      document.querySelector(".cell-name").value = key.key;
      document.querySelector(".cell-value").innerHTML =
      e.target.getElementsByTagName("span").length > 0
          ? e.target.getElementsByTagName("span")[0].innerHTML
          :  e.target.innerHTML;
    } else if (e.detail == 2 && key?.id == "emailid") {
      showprofilesidebar(
        e,
        e.target.getElementsByTagName("span")[0].innerHTML,
        e.target.parentNode.children[9].innerHTML
      );
    } else if (e.detail == 2 && key?.id == "comment") {
      let formdata = {
        publication_value: e.target.closest("tr").querySelectorAll("td")[1]
          .innerText,
        email: e.target.closest("tr").querySelectorAll("td")[12].innerText,
        domain: e.target.closest("tr").querySelectorAll("td")[13].innerText,
        type: "3",
        table:'ip'
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
        type: "editdata",
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
  function sortdata(event, index = 0,key={}) {
    const copy = [...d];
    if (event.detail == 1) {
      if (defaultdata.sortDown) {
        copy.sort(
          (a, b) =>
            -(
              (typeof a[index] == "number" ? a[index] : a[index].trim()) >
              (typeof b[index] == "number" ? b[index] : b[index].trim())
            )
        );
      } else {
        copy.sort(
          (a, b) =>
            -(
              (typeof a[index] == "number" ? a[index] : a[index].trim()) <
              (typeof b[index] == "number" ? b[index] : b[index].trim())
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
      opendupesendmailbox: false,
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
    filterdata('emailstatus', e.target.value.toString());
  };
  const handlecio = (e) => {
    setdefaultdata((prev) => ({ ...prev, cio: e.target.value }));
    //setcio(e.target.value);
    filterdata('cio', e.target.value.toString());
  };
  const handleapplicant = (e) => {
    // setapplicant(e.target.value)
    setdefaultdata((prev) => ({
      ...prev,
      applicantstatusdata: e.target.value,
    }));
    filterdata('applicant_status', e.target.value.toString());
  };



  const handlecallchange = (e) => {
    // setcall(e.target.value);
    setdefaultdata((prev) => ({ ...prev, callstatus: e.target.value }));
    filterdata('callstatus', e.target.value.toString());
  };
  const showprofilesidebar = (i, v, v1) => {
    if (document.querySelector("i.profilefetch.show")) {
      document
        .querySelector("i.profilefetch.show")
        .classList.replace("show", "hide");
    }
    i.target.querySelector("i").classList.replace("hide", "show");

    //setprofilebar((prev)=>( {...prev,status:true,email:v} ));
    dispatch(profilesidebar({ status: true, email: v, type: v1}));
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
          <Editmodal
            alldata={d2}
            changedata={changedata}
            show={showeditmodal}
            fn={editinfo}
          ></Editmodal>
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
          <PScronbox
            page="itdata"
            platform={platform}
            service={service}
            alldata={d}
            changedata={changedata}
            closeemailsendbox={closeemailsendbox}
            emailsdata={d.slice(
              0,
              document.querySelector("#totalsending").value
            )}
            fn={closeemailsendbox}
          ></PScronbox>
        ) : (
          <></>
        )}
        {defaultdata.opendupesendmailbox ? (
          <PScronbox
            page="itdata"
            platform={platform}
            alldata={d}
            changedata={changedata}
            closeemailsendbox={closedupeemailsendbox}
            emailsdata={d.slice(
              0,
              document.querySelector("#totalsending").value
            )}
            fn={closedupeemailsendbox}
          ></PScronbox>
        ) : (
          <></>
        )}
        {defaultdata.opencronbox ? (
          <Cronlist platform={platform} service={service} closecronbox={closecronbox}></Cronlist>
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
                      <th
                        style={{
                          background: "white",
                          position: "sticky",
                          left: 0,
                          zindex: 1,
                        }}
                      >
                        <div className="headers">
                          APPLN.NO.{" "}
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'appno');
                            }}
                          ></i>
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('appno', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Title{" "}
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'title');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('title', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          APPLICANT NAME
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'applicantname');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('applicantname', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Applicant Status
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'applicant_status');
                            }}
                          ></i>{" "}
                        </div>

                        <FormControl sx={{ m: 0, width: "100%" }}>
                          <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={defaultdata.applicantstatusdata}
                            onChange={handleapplicant}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                          >
                            {defaultvalue.applicantstatus.map((name) => (
                              <MenuItem key={name.key} value={name.key}>
                                {name.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          CONTACT INFO OF
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'cio');
                            }}
                          ></i>{" "}
                        </div>

                        <FormControl sx={{ m: 0, width: "100%" }}>
                          <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={defaultdata.cio}
                            onChange={handlecio}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                          >
                            {defaultvalue.contactinfostatus.map((name) => (
                              <MenuItem key={name.key} value={name.key}>
                                {name.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          CONTACT PERSON
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'cpf');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('cpf', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          EMAIL ID
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'emailid');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('emailid', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Domain
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'domain');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('domain', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          PH. NO.
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'p_h_n');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('p_h_n', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          First Email Date
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'firstemail');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('firstemail', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          FollowUp date
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'followupdate');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('followupdate', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Next Follow Up
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'nextfollowupdate');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('nextfollowupdate', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Email Status
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'emailstatus');
                            }}
                          ></i>{" "}
                        </div>

                        <FormControl sx={{ m: 0, width: "100%" }}>
                          <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={defaultdata.emailstatus}
                            onChange={handlechange}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                          >
                            {defaultvalue.names.map((name) => (
                              <MenuItem key={name.key} value={name.key}>
                                {name.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Call Status
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'callstatus');
                            }}
                          ></i>{" "}
                        </div>
                        <FormControl sx={{ m: 0, width: "100%" }}>
                          <Select
                            labelId="call-name-label"
                            id="call-name"
                            multiple
                            value={defaultdata.callstatus}
                            onChange={handlecallchange}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                          >
                            {defaultvalue.callnames.map((name) => (
                              <MenuItem key={name.key} value={name.key}>
                                {name.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Comment
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'comment');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('comment', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Sent on
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'senton');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('senton', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Cron Status
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'crondate');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('crondate', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Assigned
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'fromname');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('fromname', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                      <th style={{ background: "white" }}>
                        <div className="headers">
                          Assigned2
                          <i
                            className="ti ti-sort-ascending"
                            onClick={(e) => {
                              sortdata(e, 'username');
                            }}
                          ></i>{" "}
                        </div>
                        <input
                          className="filter"
                          onKeyUp={(e) => filterdata('username', e.target.value)}
                          type="text"
                        ></input>
                      </th>
                
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
                        pickvalue(e,{key:'APPLN.NO.'});
                      }}
                      className="column-value"
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 1,
                      }}
                    >
                      {/* <input className='appno' value={user[2]} onClick={(event)=>pushdata(event,user[2])} style={{'position':"absolute",'top':'18px','left':'0'}} type='checkbox'></input> */}
                      <img className='flagwidth' src={`https://www.anuation.com/crm/assets/flags/${user['country'].toLowerCase()}.png`}/>
                      <a
                        target="blank"
                        href={
                          "https://patentscope.wipo.int/search/en/detail.jsf?docId=" +
                          user['appno']
                        }
                      >
                        <span>{user['appno']}</span>
                      </a>
                      
                      <i
                        onClick={() => {
                          editinfo(true, user['appno']);
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
                        pickvalue(e,{key:'Title'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['title']}
                    </td>

                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'APPLICANT NAME'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['applicantname']}
                    </td>

                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'Applicant Status'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['applicant_status']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'CONTACT INFO OF'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['cio']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'CONTACT PERSON'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['cpf']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'EMAIL ID'});
                      }}
                      className={`cursor-pointer text-primary column-value align-items-center ${tablesetting.countred(user['emailid'], 'emailid', d) ? "red-dupe" : ""
                        }`}
                      style={{}}
                    >
                      <i className="ti ti-refresh rotate hide profilefetch"></i>
                      <span className="email-id">{user['emailid']}</span>
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'Domain'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['domain']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'PH. NO.'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['p_h_n']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'First Email Date'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['firstemail']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'FollowUp date'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['followupdate']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'Next Follow Up'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['nextfollowupdate']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, {key:'Email Status'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {emailstatus[user['emailstatus']] ?? ""}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'Call Status'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {callstatus[user['callstatus']] ?? ""}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'Comment'});
                      }}
                      className="column-value"
                      style={{}}
                      dangerouslySetInnerHTML={{
                        __html: removeduplicate(user['comment']),
                      }}
                    />

                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'Sent on'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['senton']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 54, 56,{key:'Cron Status'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['crondate']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'Assigned'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {defaultvalue.username[user['username']] ?? user['username']}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e,{key:'Assigned2'});
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user['fromemail']}
                    </td>
                  </>
                )}
              />
            </Suspense>
            <div className="footable-pagination-wrapper text-center fixed d-inline-grid">
              <div className="divider">
                <span
                  id="current"
                  className="active sheet"
                  onClick={() => loaddata({ ...formdata, sheet: "current" })}
                >
                  Current
                </span>
                <span
                  id="statussheet"
                  className={`sheet`}
                  onClick={() =>
                    loaddata({ ...formdata, sheet: "statussheet" })
                  }
                >
                  Status Sheet
                </span>
                <span
                  className={`sheet`}
                  id="exhausted"
                  onClick={() => loaddata({ ...formdata, sheet: "exhausted" })}
                >
                  Exhausted
                </span>
                <span
                  className={`sheet`}
                  id="converted"
                  onClick={() => loaddata({ ...formdata, sheet: "converted" })}
                >
                  Converted
                </span>
                <span
                  className={`sheet`}
                  id="pipeline"
                  onClick={() => loaddata({ ...formdata, sheet: "pipeline" })}
                >
                  Pipeline
                </span>
                <span
                  className={`sheet`}
                  id="dnc"
                  onClick={() => loaddata({ ...formdata, sheet: "dnc" })}
                >
                  Dnc
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
                          5000, 7000, 10000,
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

export default Dashboard;
