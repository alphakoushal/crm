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
import Header from "../component/Header";
import Fetchdata from "../services/fetchdata";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch, useSelector } from "react-redux";
import { userprofileupdate } from "../reducers/Userdata";
import Uploadsidebar from "../component/Uploadsidebar";
import Commentmodal from "../component/modals/comments";
import Uploaddata from "../services/uploaddata";
import Style from "../component/style/style";
import Editmodal from "../component/modals/Editmodal";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  callstatus,
  emailstatus,
  costs,
  standard,
  tablesetting,
  defaultvalue,
} from "../constant/Constant.js";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Sidebarprofile from "../component/modals/Sidebarprofile";
import ITEmailbox from "../component/modals/Itemailbox";
import Dupeemailprocess from "../component/modals/Dupeemailprocess";
import Cronlist from "../component/modals/cron-list";
import ResizableColumn2 from "../component/Resize-two";
function Loading() {
  return <h2>🌀 Loading...</h2>;
}
let filtered = [];
const ITDashboard = () => {
  const [d, sd] = useState([]);
  const [d2, gd] = useState([]);
  const [profilebar, setprofilebar] = useState({ status: false, email: "" });
  const [sortDown, setSortDown] = useState(true);
  const [emailstatusdata, setemail] = useState([]);
  const [callstatusdata, setcall] = useState([]);
  const [showcurrencytab, setcurrency] = useState(false);
  const [showeditmodal, updateeditmodal] = useState({ state: false, data: {} });
  const [opensendmailbox, setsendmailbox] = useState(false);
  const [opendupesendmailbox, setdupesendmailbox] = useState(false);
  const [opencronbox, setcronbox] = useState(false);
  const countries = useRef([]);
  const processing = useRef(false);
  const months = useRef([]);
  const platform = useRef("it");
  const auth = JSON.parse(localStorage.getItem("user"));
  const valued = useSelector((state) => state.userdata.value);
  const dispatch = useDispatch();
  useEffect(() => {
    clearfilter();
  }, []);

  let data = {};
  const [columns, setColumns] = useState([
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
  ]);
  let formdata1 = {
    type: "value",
    file_refresh: "comment",
    offset: "1",
    w_id: "",
    anuationuser_uniqueid: auth.userid,
    accounttype: auth.type,
    org: auth.org,
    email: "",
    domain: "",
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

  const changedata = useCallback((data) => {
    sd(data);
    gd(data);
  });
  const loaddata = useCallback(async (formdata) => {
    let abortc = new AbortController();
    let { signal } = abortc;
    if (processing.current) {
      abortc.abort();
    }
    processing.current = true;
    let datas = {};
    document.querySelector(".ti-refresh").classList.add("rotate");
    document.querySelector(".body-wrapper1").classList.add("loader");
    data = await Fetchdata.fetchitdata(formdata, signal)
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
    } else {
      processing.current = false;
    }

    sd(datas);
    gd(datas);
    dispatch(userprofileupdate(data.length));
    document
      .querySelector("table")
      .classList.add("table", "table-bordered", "table-hover");
  });
  useEffect(() => {
    loaddata(formdata);
  }, []);
  const showmailbox = () => {
    setsendmailbox(true);
  };
  const showdupemailbox = () => {
    setdupesendmailbox(true);
  };
  const showcronbox = () => {
    setcronbox(true);
  };
  const closecronbox = () => {
    setcronbox(false);
  };
  const closeemailsendbox = () => {
    setsendmailbox(false);
  };
  const closedupeemailsendbox = () => {
    setdupesendmailbox(false);
  };

  function filterdata(index, value) {
    let i = 0;
    let filters = document.querySelectorAll(".filter");

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
          return tablesetting.itreturndata(sv, f[e.key], e.key) > -1;
        });
      }
      i++;
    });
    if (filtered.length == i) {
      sd(copy);
      dispatch(userprofileupdate(copy.length));
    }
  }
  async function pickvalue(e, i, ni) {
    e.stopPropagation();
    if (e.detail == 1) {
      document.querySelector(".cell-name").value = document
        .querySelectorAll(".custom-table table thead tr+tr th")
        [ni].querySelector(".headers").innerText;

      document.querySelector(".cell-value").innerHTML =
        i == "2" && e.target.tagName == "TD"
          ? e.target.getElementsByTagName("span")[0].innerHTML
          : i == "22" && e.target.tagName == "TD"
          ? e.target.getElementsByTagName("a")[0].innerHTML
          : e.target.innerHTML;
    }
    else if (e.detail == 2 && i == "11") {
      let formdata = {
        publication_value: e.target.closest("tr").querySelectorAll("td")[2]
          .innerText,
        email: e.target.closest("tr").querySelectorAll("td")[2].innerText,
        domain: e.target.closest("tr").querySelectorAll("td")[3].innerText,
        type: "3",
        table:'it'
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
  function sortdata(index = 0) {
    const copy = [...d];
    if (sortDown) {
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
    setSortDown((prev) => !prev);
    sd(copy);
  }
  const clearfilter = useCallback(() => {
    filtered = [];
    let d = document.querySelectorAll(".filter");
    setemail([]);
    setcall([]);
    d.forEach((e) => {
      e.value = "";
    });
    sd(d2);
    dispatch(userprofileupdate(d2.length));
  }, [d]);
  const showcurrency = useCallback(() => {
    setcurrency((prev) => (prev ? false : true));
  }, [showcurrencytab]);
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
    setemail(e.target.value);
    filterdata('emailtype', e.target.value.toString());
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
  const handleResize = (index, width) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      newColumns[index].width = width;
      return newColumns;
    });
  };
  const handlecallchange = (e) => {
    setcall(e.target.value);
    filterdata('calltype', e.target.value.toString());
  };
  const showprofilesidebar = (i, v) => {
    if (document.querySelector("i.profilefetch.show")) {
      document
        .querySelector("i.profilefetch.show")
        .classList.replace("show", "hide");
    }
    i.target.querySelector("i").classList.replace("hide", "show");

    setprofilebar((prev) => ({ ...prev, status: true, email: v }));
  };
  const closebar = () => {
    setprofilebar((prev) => ({ ...prev, status: false, email: "" }));
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
  return (
    <>
      <div className={" custom-table "}>
        {showeditmodal.state == true ? (
          <Editmodal show={showeditmodal} fn={editinfo}></Editmodal>
        ) : (
          <></>
        )}
        <Commentmodal />
        <Style></Style>
        <Header
          platform={platform}
          changedata={changedata}
          except={true}
          alldata={d}
          showmailbox={showmailbox}
          showdupemailbox={showdupemailbox}
          showcronbox={showcronbox}
          clearfilters={clearfilter}
          refreshdata={loaddata}
          formdatas={formdata}
          showcurrencies={showcurrency}
        ></Header>
        {opensendmailbox ? (
          <ITEmailbox
            page="itdata"
            platform={platform}
            alldata={d}
            changedata={changedata}
            closeemailsendbox={closeemailsendbox}
            emailsdata={d.slice(
              0,
              document.querySelector("#totalsending").value
            )}
            fn={closeemailsendbox}
          ></ITEmailbox>
        ) : (
          <></>
        )}
        {opendupesendmailbox ? (
          <Dupeemailprocess
            page="it"
            platform={platform}
            alldata={d}
            changedata={changedata}
            closedupeemailsendbox={closedupeemailsendbox}
            emailsdata={d}
            fn={closedupeemailsendbox}
          ></Dupeemailprocess>
        ) : (
          <></>
        )}
        {opencronbox ? (
          <Cronlist closecronbox={closecronbox}></Cronlist>
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
                          costtab={false}
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
                    <th style={{ background: "white" }}>
                      <div className="headers">
                        CONTACT PERSON
                        <i
                          className="ti ti-sort-ascending"
                          onClick={() => {
                            sortdata('cp');
                          }}
                        ></i>{" "}
                      </div>
                      <input
                        className="filter"
                        onKeyUp={(e) => filterdata('cp', e.target.value)}
                        type="text"
                      ></input>
                    </th>
                    <th style={{ background: "white" }}>
                      <div className="headers">
                        EMAIL ID
                        <i
                          className="ti ti-sort-ascending"
                          onClick={() => {
                            sortdata('email');
                          }}
                        ></i>{" "}
                      </div>
                      <input
                        className="filter"
                        onKeyUp={(e) => filterdata('email', e.target.value)}
                        type="text"
                      ></input>
                    </th>
                    <th style={{ background: "white" }}>
                      <div className="headers">
                        Domain
                        <i
                          className="ti ti-sort-ascending"
                          onClick={() => {
                            sortdata('domain');
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
                          onClick={() => {
                            sortdata('p_h_n');
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
                          onClick={() => {
                            sortdata('firstemail');
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
                          onClick={() => {
                            sortdata('followup');
                          }}
                        ></i>{" "}
                      </div>
                      <input
                        className="filter"
                        onKeyUp={(e) => filterdata('followup', e.target.value)}
                        type="text"
                      ></input>
                    </th>
                    <th style={{ background: "white" }}>
                      <div className="headers">
                        Next Follow Up
                        <i
                          className="ti ti-sort-ascending"
                          onClick={() => {
                            sortdata('nextfollowup');
                          }}
                        ></i>{" "}
                      </div>
                      <input
                        className="filter"
                        onKeyUp={(e) => filterdata('nextfollowup', e.target.value)}
                        type="text"
                      ></input>
                    </th>
                    <th style={{ background: "white" }}>
                      <div className="headers">
                        Email Status
                        <i
                          className="ti ti-sort-ascending"
                          onClick={() => {
                            sortdata('emailtype');
                          }}
                        ></i>{" "}
                      </div>

                      <FormControl sx={{ m: 0, width: 100 }}>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          multiple
                          value={emailstatusdata}
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
                          onClick={() => {
                            sortdata('calltype');
                          }}
                        ></i>{" "}
                      </div>
                      <FormControl sx={{ m: 0, width: 100 }}>
                        <Select
                          labelId="call-name-label"
                          id="call-name"
                          multiple
                          value={callstatusdata}
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
                          onClick={() => {
                            sortdata('comment');
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
                          onClick={() => {
                            sortdata('senton');
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
                          onClick={() => {
                            sortdata('crondate');
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
                          onClick={() => {
                            sortdata('assigned');
                          }}
                        ></i>{" "}
                      </div>
                      <input
                        className="filter"
                        onKeyUp={(e) => filterdata('assigned', e.target.value)}
                        type="text"
                      ></input>
                    </th>
                    <th style={{ background: "white" }}>
                      <div className="headers">
                        Filename
                        <i
                          className="ti ti-sort-ascending"
                          onClick={() => {
                            sortdata('filename');
                          }}
                        ></i>{" "}
                      </div>
                      <input
                        className="filter"
                        onKeyUp={(e) => filterdata('filename', e.target.value)}
                        type="text"
                      ></input>
                    </th>
                  </tr>
                  </>
                )}
                itemContent={(index, user) => (
                  <>
                  <td>
                      {500 * (1 - 1) +
                        (index + 1)}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 1, 1);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["cp"]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 2, 2);
                      }}
                      className={`cursor-pointer text-primary column-value d-flex align-items-center ${
                        tablesetting.countred(user["email"], "email", d)
                          ? "red-dupe"
                          : ""
                      }`}
                      style={{}}
                    >
                      <i className="ti ti-refresh rotate hide profilefetch"></i>
                      <span className="email-id">{user["email"]}</span>
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 4, 3);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["domain"]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 5, 4);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["p_h_n"]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 6, 5);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["firstemail"]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 7, 6);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["followup"]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 8, 7);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["nextfollowup"]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 9, 8);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {emailstatus[user["emailtype"]] ?? ""}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 10, 9);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {callstatus[user["calltype"]] ?? ""}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 11, 10);
                      }}
                      className="column-value"
                      style={{}}
                      dangerouslySetInnerHTML={{
                        __html: removeduplicate(user["comment"]),
                      }}
                    />
                    <td
                      onClick={(e) => {
                        pickvalue(e, 12, 11);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["senton"]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 13, 12);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["crondate"]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 14, 13);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["assigned"]}
                    </td>
                    <td
                      onClick={(e) => {
                        pickvalue(e, 15, 14);
                      }}
                      className="column-value"
                      style={{}}
                    >
                      {user["filename"]}
                    </td>
                  </>
                )}
              />
            </Suspense>
            <div className="footable-pagination-wrapper text-center fixed">
              <div className="divider"></div>
              <span className="label label-default">
                <span className="text-white">
                  Total Filtered Record {valued}
                </span>
              </span>
            </div>
          </div>
        </div>
        <Uploadsidebar />
        {profilebar.status ? (
          <Sidebarprofile closebar={closebar} email={profilebar.email} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ITDashboard;
