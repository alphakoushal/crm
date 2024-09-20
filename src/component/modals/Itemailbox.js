import React, {
    Suspense,
    useEffect,
    useState,
    useContext,
    useRef,
  } from "react";
  import { TableVirtuoso } from "react-virtuoso";
  import Snackbar from "@mui/material/Snackbar";
  import MuiAlert, { AlertProps } from "@mui/material/Alert";
  import Uploaddata from "../../services/uploaddata";
  import Fetchdata from "../../services/fetchdata";
  import FormControl from "@mui/material/FormControl";
  import Select, { SelectChangeEvent } from "@mui/material/Select";
  import moment from "moment";
  import MenuItem from "@mui/material/MenuItem";
  import { costs, standard, defaultvalue } from "../../constant/Constant";
  const ITEmailbox = ({
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
    let mailtypeaccount = document.querySelector("#mailtypeaccount").value;
    const inprocess = useRef(false);
    let auth = localStorage.getItem("user");
    auth = auth != "" ? JSON.parse(auth) : { userid: "", type: "", org: "" };
    let accounts =
    page=='freshdata' ?  defaultvalue.itaccounts :  defaultvalue.itaccounts[auth.userid] !== undefined
        ? defaultvalue.itaccounts[auth.userid]
        : Object.values(defaultvalue.itaccounts).flat();
    const [validate, setvalidate] = useState({
      status: false,
      color: "error",
      icon: "error",
      message: "",
      modalstatus: true,
    });
    const fetchlist = async (type) => {
      let data = await Fetchdata.fetchtemplate({ type: type,matter:'2' }).then(
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
              email_id: val.email,
              contact_person: val.cp,
            };
          })
        ),
      };
      // console.log(formdata);
      return Uploaddata.ITemailformat(formdata).then((resposne) => {
        return resposne;
      });
    }
  
    function Loading() {
      return <h2>🌀 Loading...</h2>;
    }
    function handleClose() {}
    function handleuser(e) {
      const {target: { value }} = e;
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
      } else {
        inprocess.current = true;
        const res = await emailformat(
          t.value,
          userlist,
          emailsdata,
          title,
          t.options[t.selectedIndex].text,
          '',
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
          //   let newarray=alldata.map((item,index)=>{ return (appno.includes(item[2]) ?  {...item,[57]:'sent'} : item) });
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
        (page=='freshdata' ? <></> : fetchlist("1"))
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
                            <div className="headers">Contact Person</div>
                          </th>
                          <th>
                            <div className="headers">Email-id</div>
                          </th>
                        </tr>
                      )}
                      itemContent={(index, user) => (
                        <>
                          <td className="column-value">{user.cp}</td>
                          <td className="column-value">{user.email}</td>
                        </>
                      )}
                    />
                  </Suspense>
                  <div className="mb-3 text-center d-md-flex align-items-center mt-3  align-content-md-between gap-3">
                    <input
                      type="text"
                      className="form-control"
                      id="crontitle"
                      placeholder="Enter Comment"
                    />
                    <input
                      type="date"
                      className="form-control"
                      id="nextfollowup"
                      placeholder="Choose date"
                    />
                    <select id="templateid" className="form-select">
                      <option value="">Choose Format</option>
                      {templatelist.map((item, index) => {
                        return (
                          <option value={item["id"]}>{item["title"]}</option>
                        );
                      })
                      
                      }
  { auth.userid=='241214150648429647' && page=='freshdata' ? <><option value="assigned">Assigned</option><option value="transfer">Transfer</option></> : <></>}
  
                    </select>
                    <FormControl sx={{ m: 0, width: "100%" }}>
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
  export default ITEmailbox;
  