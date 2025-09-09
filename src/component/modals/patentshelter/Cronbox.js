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
import Uploaddata from "../../../services/uploaddata";
import Fetchdata from "../../../services/fetchdata";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { costs, standard, defaultvalue } from "../../../constant/Constant";
import config from "../../../constant/Import-detail-of-crm";
const PScronbox = ({
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
  const serviceConfig = config.services[platform.current];
  const { accounts } = serviceConfig;
  let mailtypeaccount = document.querySelector("#mailtypeaccount").value;
  const inprocess = useRef(false);
  let auth = localStorage.getItem("user");
  auth = auth != "" ? JSON.parse(auth) : { userid: "", type: "", org: "" };
  let accountslist = accounts[auth.userid] !== undefined
      ? accounts[auth.userid]
      : Object.values(accounts).flat();
  const [validate, setvalidate] = useState({
    status: false,
    color: "error",
    icon: "error",
    message: "",
    modalstatus: true,
  });
  const fetchlist = async (type) => {
    let data = await Fetchdata.itaxiosrequest({
      type: type,
      posttype: "ps-fetchtemplate",
      platform: platform.current,
      user: auth.userid,
    }).then((response) => {
      return response;
    });
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
      posttype: "psemailformat",
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
            title: val["title"],
            email_id: mailtypeaccount == "2" ? val["emailid"] : val["emailid"],
            fromemail: val["fromemail"],
            fromname: val["fromname"],
            lastsenton: val["senton"],
            applicant_name: val["applicantname"],
            application_no: val["appno"],
            contact_person: mailtypeaccount == "2" ? val["cpf"] : val["cpf"],
          };
        })
      ),
    };
    return Uploaddata.itaxiosrequest(formdata).then((resposne) => {
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
                  Total {defaultvalue.mailtypeaccount[mailtypeaccount]} Record{" "}
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
                          <div className="headers">Email-id</div>
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
                        <td className="column-value">{user["appno"]}</td>
                        <td className="column-value">{user["title"]}</td>
                        <td className="column-value">{user["emailid"]}</td>
                        <td className="column-value">
                          {user["applicantname"]}
                        </td>
                        <td className="column-value">{user["cpf"]}</td>
                        <td className="column-value">{user["fromname"]}</td>
                        <td className="column-value">{user["fromemail"]}</td>
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
                        <></>
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
                        {accountslist.map((name) => (
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
export default PScronbox;
