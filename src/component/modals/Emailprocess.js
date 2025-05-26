import React, {
  Suspense,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import dayjs from "dayjs";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Uploaddata from "../../services/uploaddata";
import Fetchdata from "../../services/fetchdata";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { costs, standard, defaultvalue } from "../../constant/Constant";
const Emailbox = ({
  platform,
  page,
  fn,
  emailsdata,
  closeemailsendbox,
  changedata,
  alldata,
}) => {
  const [templatelist, settemplate] = useState([]);
  const [userlist, setchooseuser] = useState([]);
  const [crontime, setCrontime] = useState(dayjs(moment()));
  let mailtypeaccount = document.querySelector("#mailtypeaccount").value;
  const inprocess = useRef(false);
  let auth = localStorage.getItem("user");
  auth = auth != "" ? JSON.parse(auth) : { userid: "", type: "", org: "" };
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
  const fetchlist = async (type) => {
    let data = await Fetchdata.fetchtemplate({ type: type }).then(
      (response) => {
        return response;
      }
    );
    settemplate(data.data.data);
  };

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
      templatename: template,
      preview: type,
      account: account,
      crontime: crontime,
      H: crontime.$H,
      M: crontime.$m,
      platform: platform.current,
      title: title,
      nextfollowup: nextfollowup,
      crondate: crondate,
      mailtypeaccount: mailtypeaccount,
      userid: auth.userid,
      a: a,
      totalapp: emailsdata.length,
      apps: JSON.stringify(
        emailsdata.map((val) => {
          return {
            weblink: val[0],
            title: val[1],
            email_id: mailtypeaccount == "2" ? val[27] : val[11],
            agentname: val[26],
            fromemail: val[63],
            fromname: val[65],
            lastsenton: val[64],
            agentemail_id: val[27],
            deadline_30_month: val[5],
            applicant_name: val[7],
            application_no: val[2],
            contact_person: mailtypeaccount == "2" ? val[26] : val[10],
            deadline_30_month: val[5],
            deadline_31_month: val[6],
            incost: costs.IN.apply({
              c: "IN",
              as: val[8],
              ci: val[9],
              pages: val[14],
              claim: val[15],
              priority: val[16],
              co: val[3],
              isa: val[18],
              standard: standard,
            }),
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
    let appno = emailsdata.map((item) => {
      return item[2];
    });
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
    } else if (title == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Enter Comment",
      }));
    } else if (crondate == "" || typeof crondate == "undefined") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Choose Date",
      }));
    } else if (crontime == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Choose Time",
      }));
    } else if (userlist.length == 0) {
    } else if (nextfollowup == "") {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Please Choose Date",
      }));
    } else if (diff <= 2) {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "Next follow up Date should be greater",
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
    } else {
      inprocess.current = true;
      const res = await emailformat(
        t.value,
        userlist,
        emailsdata,
        title,
        t.options[t.selectedIndex].text,
        "",
        type,
        nextfollowup,
        crondate
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
        //   let newarray=alldata.map((item,index)=>{ return (appno.includes(item[2]) ?  {...item,[57]:'sent'} : item) });
        //   changedata(newarray);
        if (page == "freshdata") {
          window.location.reload();
        }
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
          closeemailsendbox(false);
        }, 1000);
      } else {
        inprocess.current = false;
      }
    }
  }
  useEffect(() => {
    document
      .querySelector("table")
      .classList.add("table", "table-bordered", "table-hover");
    page == "freshdata" ? <></> : fetchlist("1");
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
                  Total {defaultvalue.mailtypeaccount[mailtypeaccount]} Records{" "}
                  {emailsdata.length}
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
                    data={emailsdata}
                    fixedHeaderContent={() => (
                      <tr>
                        <th>
                          <div className="headers">APPLN.NO.</div>
                        </th>
                        <th>
                          <div className="headers">Title</div>
                        </th>
                        <th>
                          <div className="headers">DEADLINE - 30 mth</div>
                        </th>
                        <th>
                          <div className="headers">DEADLINE - 31 mth</div>
                        </th>
                        <th>
                          <div className="headers">Email-id</div>
                        </th>
                        <th>
                          <div className="headers">Agent Name</div>
                        </th>
                        <th>
                          <div className="headers">Agent Email-id</div>
                        </th>
                        <th>
                          <div className="headers">APPLICANT NAME</div>
                        </th>
                        <th>
                          <div className="headers">Contact Person Name</div>
                        </th>
                        <th>
                          <div className="headers">Last Sent From</div>
                        </th>
                        <th>
                          <div className="headers">Last Sent From Email</div>
                        </th>
                      </tr>
                    )}
                    itemContent={(index, user) => (
                      <>
                        <td className="column-value">{user[2]}</td>
                        <td className="column-value">{user[1]}</td>
                        <td className="column-value">{user[5]}</td>
                        <td className="column-value">{user[6]}</td>
                        <td className="column-value">{user[11]}</td>
                        <td className="column-value">{user[26]}</td>
                        <td className="column-value">{user[27]}</td>
                        <td className="column-value">{user[7]}</td>
                        <td className="column-value">{user[10]}</td>
                        <td className="column-value">{user[65]}</td>
                        <td className="column-value">{user[63]}</td>
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
                        <> <option value="transfer">Transfer</option></>
                      )}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label class="text-start w-100" data-shrink="true">
                      Choose User
                    </label>
                    <FormControl className="accounts" sx={{ width: "100%" }}>
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
                    <i id="send" className="ti ti-refresh hide"></i>Submit
                  </button>
                  <button
                    onClick={(e) => choosetype(e, "preview")}
                    className="btn btn-light-info text-info font-medium"
                    type="submit"
                  >
                    <i id="preview" className="ti ti-refresh hide"></i> Preview
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
export default Emailbox;
