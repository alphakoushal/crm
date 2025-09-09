import React, {
  Suspense,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from "@mui/material/Snackbar";
import dayjs from "dayjs";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Uploaddata from "../../services/uploaddata";
import InputLabel from "@mui/material/InputLabel";
import Fetchdata from "../../services/fetchdata";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import moment from "moment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MenuItem from "@mui/material/MenuItem";
import { costs, standard, defaultvalue } from "../../constant/Constant";
const Dupeemailprocess = ({
  page,
  platform,
  fn,
  emailsdata,
  closedupeemailsendbox,
  changedata,
  alldata,
}) => {
  let auth = localStorage.getItem("user");
  auth = auth != "" ? JSON.parse(auth) : { userid: "", type: "", org: "" };
  const [newdupedata, setdupedata] = useState([]);
  const [templatelist, settemplate] = useState([]);
  const templates = useRef();
  const [crontime, setCrontime] = useState(dayjs(moment()));
  const [userlist, setchooseuser] = useState([]);
  const inprocess = useRef(false);
  useEffect(() => {
    getdupedata(emailsdata);
  }, []);
  const fetchlist = async (type) => {
    let data = await Fetchdata.fetchtemplate({ type: type,anuationuser_uniqueid:auth.userid??'' }).then(
      (response) => {
        return response;
      }
    );
    settemplate(data.data.data);
    templates.current=data.data.data
  };

  function getdupedata(emailsdata) {
    let dupedata = [];
    let res = emailsdata.map((e) => {
      let incost = costs.IN.apply({
        c: "IN",
        as: e[8],
        ci: e[9],
        pages: e[14],
        claim: e[15],
        priority: e[16],
        co: e[3],
        isa: e[18],
        standard: standard,
      });

      if (e[12] !== "" && e[12] != "n/a") {
        if (e[54] == "Email") {
          //FOR GENERIC DATA
          let find = dupedata.findIndex((e1) => {
            return e1[7].trim() === e[11].trim();
          });
          if (find > -1) {
            if (
              page == "freshdata"
                ? dupedata[find][2].split(",,").length >= 1
                : dupedata[find][2].split(",,").length >= 1
            ) {
              dupedata[find][1] = `${e[11]},,${dupedata[find][1]}`; //email
              dupedata[find][2] = `${e[2]},,${dupedata[find][2]}`; //app
              dupedata[find][3] = `${e[1]},,${dupedata[find][3]}`; //title
              dupedata[find][4] = `${e[7]},,${dupedata[find][4]}`; //applicant name
              dupedata[find][6] = `${e[10]},,${dupedata[find][6]}`; //contact person name
              dupedata[find][5] = `${e[5]},,${dupedata[find][5]}`; //Deadline
              dupedata[find][8] = `${e[6]},,${dupedata[find][8]}`; //Deadline 31
              dupedata[find][9] = `${incost},,${dupedata[find][9]}`; //in cost
              dupedata[find][10] = `${e[27]},,${dupedata[find][10]}`; //in cost
            } else {
            }
          } else if (
            emailsdata.filter((e1) => {
              return e1[11].trim() === e[11].trim();
            }).length > 1
          ) {
            dupedata.push([
              e[12].trim(),
              e[11].trim(),
              e[2].trim(),
              e[1].trim(),
              e[7].trim(),
              e[5].trim(),
              e[10].trim(),
              e[11].trim(),
              e[6].trim(),
              incost,
              e[27].trim(),
              e[65],
              e[63],
              e[64],
            ]);
          }
        } else {
          let find = dupedata.findIndex((e1) => {
            return e1[0] === e[12];
          });
          if (find > -1) {
            dupedata[find][1] = `${e[11]},,${dupedata[find][1]}`; //email
            dupedata[find][2] = `${e[2]},,${dupedata[find][2]}`; //app
            dupedata[find][3] = `${e[1]},,${dupedata[find][3]}`; //title
            dupedata[find][4] = `${e[7]},,${dupedata[find][4]}`; //applicant name
            dupedata[find][6] = `${e[10]},,${dupedata[find][6]}`; //contact person name
            dupedata[find][5] = `${e[5]},,${dupedata[find][5]}`; //Deadline
            dupedata[find][8] = `${e[6]},,${dupedata[find][8]}`; //Deadline
            dupedata[find][9] = `${incost},,${dupedata[find][9]}`; //in cost
            dupedata[find][10] = `${e[27]},,${dupedata[find][10]}`; //agent email
          } else if (
            emailsdata.filter((e1) => {
              return e1[12] === e[12];
            }).length > 1
          ) {
            dupedata.push([
              e[12],
              e[11],
              e[2],
              e[1],
              e[7],
              e[5],
              e[10],
              e[11],
              e[6],
              incost,
              e[27],
              e[65],
              e[63],
              e[64],
            ]);
          }
        }
      }
    });

    let pushh = dupedata.reduce((apps, item) => {
      apps.push(item[0]);
      return apps;
    }, []);
    let newd = dupedata.slice(0, document.querySelector("#totalsending").value);
    setdupedata(newd);
  }
  let accounts =
    page == "freshdata"
      ? defaultvalue.usernames2
      : defaultvalue.accounts[auth.userid] !== undefined
      ? defaultvalue.accounts[auth.userid]
      : Object.values(defaultvalue.accounts).flat();
  const [validate, setvalidate] = useState({
    status: false,
    color: "error",
    icon: "error",
    message: "",
    modalstatus: true,
  });
  async function emailformat(
    t,
    a,
    emailsdata,
    title,
    template,
    account,
    type,
    nextfollowup,
    crondate
  ) {
    let appno = document.querySelectorAll(".appno");
    let apppush = [];
    let formdata = {
      type: "emailformat",
      data: "",
      t: t,
      preview: type,
      nextfollowup: nextfollowup,
      templatename: template,
      account: account,
      title: title,
      crontime: crontime,
      H: crontime.$H,
      M: crontime.$m,
      platform: platform.current,
      crondate: crondate,
      userid: auth.userid,
      dupeprocess: "yes",
      a: a,
      totalapp: emailsdata.length,
      apps: JSON.stringify(
        emailsdata.map((val) => {
          return {
            domain: val[0],
            email_id: val[1],
            application_no: val[2],
            title: val[3],
            contact_person: val[6],
            deadline_30_month: val[5],
            deadline_31_month: val[8],
            applicant_name: val[4],
            incost: val[9],
            agentemail_id: val[10],
            fromemail: val[12],
            fromname: val[11],
            lastsenton: val[13],
          };
        })
      ),
    };
    return Uploaddata.emailformat(formdata).then((resposne) => {
      return resposne;
    });
  }
  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
  function handleClose() {}
  function handleuser(e) {
    const {
      target: { value },
    } = e;
    setchooseuser(e.target.value);
  }
  async function choosetype(e, type) {
    let appno = newdupedata.reduce((all, item) => {
      return all.concat(item[2].split(",,"));
    }, []);
    e.preventDefault();
    let t = document.querySelector("#templateid");
    let title = document.querySelector("#crontitle").value;
    let nextfollowup = document.querySelector("#nextfollowup").value;
    let crondate = document.querySelector("#crondate").value;
    let today = moment().format("YYYY-MM-DD");
    let diff = moment(nextfollowup).diff(moment(today), "days");
    if (inprocess.current == true) {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "In process",
      }));
    } else if (diff <= 2) {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Next follow up Date should be greater",
      }));
    } else if (crontime == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Choose Time",
      }));
    } else if (t.value == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Choose Email format",
      }));
    } else if (userlist.length == 0) {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Choose Account",
      }));
    } else if (title == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Enter Comment",
      }));
    } else if (nextfollowup == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Choose Date",
      }));
    } else if (crondate == "" || typeof crondate == "undefined") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Choose Date",
      }));
    } else {
      inprocess.current = true;
      const res = await emailformat(
        t.value,
        userlist,
        newdupedata,
        title,
        t.options[t.selectedIndex].text,
        "",
        type,
        nextfollowup,crondate
      );
      if (res.data.success) {
        setvalidate((prev) => ({
          ...prev,
          status: true,
          modalstatus: false,
          message: res.data.message,
          color: "success",
          icon: "success",
        }));
        if (page == "freshdata") {
          window.location.reload();
        }
        let newarray = alldata.map((item, index) => {
          return appno.includes(item[2]) ? { ...item, [57]: "sent" } : item;
        });
        //   changedata(newarray);
      } else {
        inprocess.current = false;
        setvalidate((validate) => ({
          ...validate,
          status: true,
          modalstatus: true,
          message: res.data.errors.error,
        }));
      }
      if (type == "send") {
        setTimeout(() => {
          closedupeemailsendbox(false);
        }, 1000);
      } else {
        inprocess.current = true;
      }
    }
  }
   function changetype(e){
    let type=e.target.value;
    let filtered = templates.current.filter((item,index)=>item.client_type==type ? item : null);
    settemplate(filtered);
  }
  useEffect(() => {
    document
      .querySelector("table")
      .classList.add("table", "table-bordered", "table-hover");
    page == "freshdata" ? <></> : fetchlist("2");
  }, []);

  return (
    <>
      <Snackbar
        open={validate.status}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          color={validate.color}
          severity={validate.icon}
        >
          {validate.message}
        </MuiAlert>
      </Snackbar>
      <div
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
            <form className="form-horizontal filing-form_data">
              <div className="modal-header d-flex align-items-center">
                <h4 className="modal-title" id="myLargeModalLabel">
                  Total Filtered Record{" "}
                  {newdupedata.reduce((v, v1) => {
                    return v + v1[1].split(",,").length;
                  }, 0)}
                </h4>
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
              <div className="modal-body custom-table">
                <Suspense fallback={<Loading />}>
                  <TableVirtuoso
                    components={{ className: "koushal" }}
                    style={{ height: 300 }}
                    data={newdupedata}
                    fixedHeaderContent={() => (
                      <tr>
                        <th className="small">
                          <div className="headers">Email id</div>
                        </th>
                        <th className="small">
                          <div className="headers">Agent Email id</div>
                        </th>
                        <th className="small">
                          <div className="headers">Contact Person</div>
                        </th>
                        <th className="small">
                          <div className="headers">Applicant</div>
                        </th>
                        <th className="small">
                          <div className="headers">App</div>
                        </th>
                        <th className="small">
                          <div className="headers">Title</div>
                        </th>
                        <th className="small">
                          <div className="headers">Deadline 30</div>
                        </th>
                        <th className="small">
                          <div className="headers">Deadline 31</div>
                        </th>
                        <th className="small">
                          <div className="headers">In cost</div>
                        </th>
                        <th className="small">
                          <div className="headers">Last Sent From</div>
                        </th>
                        <th className="small">
                          <div className="headers">Last Sent From Email</div>
                        </th>
                      </tr>
                    )}
                    itemContent={(index, user) => (
                      <>
                        <td className="column-value small text-break">
                          {user[1]}
                        </td>
                        <td className="column-value small text-break">
                          {user[10]}
                        </td>
                        <td className="column-value small text-break">
                          {user[6]}
                        </td>
                        <td className="column-value small text-break">
                          {user[4]}
                        </td>
                        <td className="column-value small text-break">
                          {user[2]}
                        </td>
                        <td className="column-value small text-break">
                          {user[3]}
                        </td>
                        <td className="column-value small text-break">
                          {user[5]}
                        </td>
                        <td className="column-value small text-break">
                          {user[8]}
                        </td>
                        <td className="column-value small text-break">
                          {user[9]}
                        </td>
                        <td className="column-value small text-break">
                          {user[11]}
                        </td>
                        <td className="column-value small text-break">
                          {user[12]}
                        </td>
                      </>
                    )}
                  />
                </Suspense>
                <div className="flex-md-wrap mb-3 text-center d-md-flex align-items-center mt-3  align-content-md-between gap-3">
                  <div className="col-md-3">
                    <label class="text-start w-100" data-shrink="true">
                      Add comment
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="crontitle"
                      placeholder="Enter Comment"
                    />
                  </div>
                  <div className="col-md-3">
                    <label class="text-start w-100" data-shrink="true">
                      Cron date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      min={new Date().toISOString().split("T")[0]} // Set min to today's date
                      id="crondate"
                      placeholder="Choose date"
                    />
                  </div>
                  <div className="col-md-2 time-selector">
                  <label class="text-start w-100" data-shrink="true">
                  Set cron Time
                    </label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        value={crontime}
                        onChange={(newValue) => setCrontime(newValue)}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-md-3">
                    <label class="text-start w-100" data-shrink="true">
                      Next Follow Up
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      min={new Date().toISOString().split("T")[0]} // Set min to today's date
                      id="nextfollowup"
                      placeholder="Choose date"
                    />
                  </div>
                                     <div className="col-md-3">
                    <label class="text-start w-100" data-shrink="true">
                      Template Type
                    </label>
                    <select onChange={(e)=>changetype(e)} id="templatetype" className="form-select">
                      <option value="">Template Type</option>
                          <option value="1">Agent</option>
                          <option value="2">Individual</option>
                          <option value="3">Both</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label class="text-start w-100" data-shrink="true">
                      Choose Format
                    </label>
                    <select id="templateid" className="form-select">
                      <option value="">Choose Format</option>
                      {templatelist.map((item, index) => {
                        return (
                          <option value={item["id"]}>{item["title"]}</option>
                        );
                      })}
                      {auth.userid == "191214201403624913" &&
                      page == "freshdata" ? (
                        <>
                          <option value="assigned">Assigned</option>
                          <option value="transfer">Transfer</option>
                        </>
                      ) : (
                        <></>
                      )}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label class="text-start w-100" data-shrink="true">
                      Choose User
                    </label>
                    <FormControl
                      className="accounts"
                      sx={{ m: 0, width: "100%" }}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Users
                      </InputLabel>
                      <Select
                        labelId="up-multiple-name-label"
                        id="up-multiple-name"
                        value={userlist}
                        multiple
                        onChange={handleuser}
                        label="Users"
                      >
                        <MenuItem disabled key="all" value="all">
                          Choose Account
                        </MenuItem>
                        {accounts.map((name) => (
                          <MenuItem key={name.account} value={name.account}>
                            {name.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <button
                    onClick={(e) => choosetype(e, "send")}
                    className="btn btn-light-info text-info font-medium"
                    type="submit"
                  >
                    Submit
                  </button>
                  <button
                    onClick={(e) => choosetype(e, "preview")}
                    className="btn btn-light-info text-info font-medium"
                    type="submit"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dupeemailprocess;
