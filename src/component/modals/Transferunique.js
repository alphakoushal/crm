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
import { costs, standard, defaultvalue } from "../../constant/Constant";
const TransferEmailbox = ({
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
    nextfollowup
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
      platform: platform.current,
      title: title,
      nextfollowup: nextfollowup,
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
            fromname: val[58],
            agentemail_id: val[27],
            country:val[3],
            userid:val[64],
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
    let title = '';
    let nextfollowup = '';

    if (inprocess.current == true) {
      setvalidate((validate) => ({
        ...validate,
        status: true,
        message: "In process",
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
    }  else {
      inprocess.current = true;
      const res = await emailformat(
        t.value,
        userlist,
        emailsdata,
        title,
        t.options[t.selectedIndex].text,
        "",
        type,
        nextfollowup
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
  let country=[];
  useEffect(() => {
    emailsdata.map((item)=>{

      let find = country.filter((e1) => {
        return e1.trim() === item[3].trim();
      });
      if (find.length >= 1) {
        country.push(item[3]);
        let len=find.length;
        if(userlist.length==len)
        {
          console.log(country.length,find.length,country,'matched');
          country = country.filter((e1) => {
            return e1.trim() != item[3].trim();
          });
          item[64]=userlist[0];
          country.push(item[3]);
        }
        else
        {
          console.log(country.length,find.length,country,'less');
          item[64]=userlist[len];
        }
      }
      else{
        country.push(item[3]);
        item[64]=userlist[0];
        return item;
      }
    })
    console.log(emailsdata);
  },[userlist])
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
                          <div className="headers">Sent From</div>
                        </th>
                        <th>
                          <div className="headers">Sent From Email</div>
                        </th>
                        <th>
                          <div className="headers">Assigned</div>
                        </th>
                        <th>
                          <div className="headers">Country</div>
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
                        <td className="column-value">{user[58]}</td>
                        <td className="column-value">{user[63]}</td>
                        <td className="column-value">{defaultvalue.username[user[64]]??''}</td>
                        <td className="column-value">{user[3]}</td>
                      </>
                    )}
                  />
                </Suspense>
                <div className="mb-3 text-center d-md-flex align-items-center mt-3  align-content-md-between gap-3">
                  <select id="templateid" className="form-select">
                    <option value="">Choose Type</option>
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
                  <FormControl className="accounts" sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-label">Users</InputLabel>
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
                  <button
                    onClick={(e) => choosetype(e, "send")}
                    className="btn btn-light-info text-info font-medium"
                    type="submit"
                  >
                    <i id="send" className="ti ti-refresh hide"></i>Submit
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
export default TransferEmailbox;
