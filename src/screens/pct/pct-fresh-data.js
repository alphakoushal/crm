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
import Fetchdata from "../../services/fetchdata";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch, useSelector } from "react-redux";
import { userprofileupdate,profilesidebar } from "../../reducers/Userdata";
import Uploaddata from "../../services/uploaddata.js";
import {
  tablesetting,
  defaultvalue,
} from "../../constant/Constant.js";

import ResizableColumn2 from "../../component/Resize-two.js";

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
let filtered = [];
const Dashboardfreshdata = () => {
  const [d, sd] = useState([]);
  const [d2, gd] = useState([]);
  const [defaultdata, setdefaultdata] = useState({
    totalpages: [],
    profilebar: { status: false, email: "" },
    opencronbox: false,
    opendupesendmailbox: false,
    showanalyticsidebar: false,
    opensendmailbox: false,
    sortDown: true,
    showcurrencytab: false,
    countrydata: [],
    agentdupedata: [],
    dupedata: [],
    applicantstatusdata: [],
    cio: [],
    agentgendata: [],
    gendata: [],
    monthdata: [],
  });
  const [columns, setColumns] = useState([
    { width: 140, css: "", type: "", key: "APPLN.NO." },
    { width: 110, css: "", type: "", key: "Title" },
    { width: 110, css: "", type: "select", key: "COUNTRY" },
    { width: 110, css: "", type: "", key: "PRIOTITY DATE" },
    { width: 110, css: "", type: "", key: "DEADLINE - 30 mth" },
    { width: 110, css: "", type: "", key: "DEADLINE - 31 mth" },
    { width: 110, css: "", type: "", key: "APPLICANT NAME" },
  ]);
  const handleResize = (index, width) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      newColumns[index].width = width;
      return newColumns;
    });
  };
      function showanalyticsidebar(value) {
          setdefaultdata((prev) => ({
      ...prev,
      showanalyticsidebar: value,
    }));
    }
  const [showeditmodal, updateeditmodal] = useState({ state: false, data: {} });
  const countries = useRef([]);
  const offset = useRef({ limit: 0, page: 0 });
  const processing = useRef(false);
  const months = useRef([]);
  const platform = useRef("anuation");
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
    anuationuser_uniqueid: auth.userid,
    accounttype: auth.type,
    org: auth.org,
    recordlimit: auth.type == "1" ? 10000 : 0,
    posttype: "local-current-data",
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
  const loaddata = useCallback(async (formdata, refreshmode = "") => {
    let abortc = new AbortController();
    let { signal } = abortc;

    processing.current = true;
    let datas = {};
    data = await Fetchdata.fetchdata(formdata, signal)
      .then((response) => {
        return response;
      })
      .finally(() => {
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
  async function pickvalue(e, i, ni,key) {
    e.stopPropagation();
    if (e.detail == 1) {
      document.querySelector(".cell-name").value = key.key;
      document.querySelector(".cell-value").innerHTML =
        i == "11" && e.target.tagName == "TD"
          ? e.target.getElementsByTagName("span")[0].innerHTML
          : i == "2" && e.target.tagName == "TD"
            ? e.target.getElementsByTagName("a")[0].innerHTML
            : e.target.innerHTML;
    } else if (e.detail == 2 && i == "11") {
      showprofilesidebar(
        e,
        e.target.getElementsByTagName("span")[0].innerHTML,
        e.target.parentNode.children[9].innerHTML
      );
    } else if (e.detail == 2 && i == "25") {
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
                        <th><div className="headers">Sr. no</div></th>
                          {columns.map((column, index) => (
                            <th key={index} className="headers"><div className="headers">{column.key}</div></th>
                          ))}
                    </tr>
                  </>
                )}
                itemContent={(index, user) => (
                  <>
                    <td>
                      {offset.current.limit * (offset.current.page - 1) +
                        (index + 1)}
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
              </div>
              <span className="label label-default">
                <span className="text-white">
                  Total Filtered Record {valued}
                </span>
              </span>
            </div>
          </div>
        </div>
       </div>
    </>
  );
};

export default Dashboardfreshdata;
