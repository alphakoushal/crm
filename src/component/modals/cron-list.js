import React, { Suspense, useEffect, useState, useContext } from "react";
import { TableVirtuoso } from "react-virtuoso";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Fetchdata from "../../services/fetchdata";
import moment from "moment";
const Cronlist = ({ closecronbox, service, platform }) => {
  console.log(service);
  const [crondata, setcrondata] = useState([]);
  let designation = {
    6: "Business Development Executive",
    1: "Associate Business Development Executive",
    2: "Sr Business Development Executive",
    3: "Team Lead",
    4: "Trainee",
    5: "Manager",
  };
  let auth = localStorage.getItem("user");

  auth = auth != "" ? JSON.parse(auth) : { userid: "", type: "", org: "" };
  const [validate, setvalidate] = useState({
    status: false,
    color: "error",
    icon: "error",
    message: "",
    modalstatus: true,
  });

  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
  const Deletecron = async (id) => {
    let auth = { posttype: "deletecron", id: id };
    let d = await Fetchdata.deletecron(auth).then((response) => {
      return response;
    });
  };

  const reschedule = async (data) => {
    let last = moment(data[9]).add(5, "minutes").format("YYYY-MM-DD H:mm:ss");
    let now = moment(data[10]).format("YYYY-MM-DD H:mm:ss");
    let auth = { posttype: "reschedulecron", id: data[8] };
    let d = await Fetchdata.reschedulecron(auth).then((response) => {
      return response;
    });
  };
  const pausecron = async (data) => {
    let auth = {
      posttype: "pausecron",
      id: data[8],
      platform: platform.current,
    };
    let d = await Fetchdata.pausecron(auth).then((response) => {
      return response;
    });
    setvalidate((prev) => ({ ...prev, status: true, message: d.data.message }));
  };
  async function getcrondata() {
    if (auth.org == "2" || auth.org == "") {
      try {
        let crond = await Fetchdata.fetchanalyticcrondata({
          ...auth,
          posttype: "fetchanalyticcrondata",
          platform: platform.current,
          service: service,
        }).then((response) => {
          return response;
        });

        setcrondata(crond.data.data);
      } catch (e) {
        setcrondata([]);
      }
    } else {
      try {
        let crond = await Fetchdata.fetchcrondata({
          ...auth,
          service: service,
          platform: platform.current,
        }).then((response) => {
          return response;
        });

        setcrondata(crond.data.data);
      } catch (e) {
        setcrondata([]);
      }
    }
  }
  useEffect(() => {
    document
      .querySelector("table")
      .classList.add("table", "table-bordered", "table-hover");
    getcrondata();
  }, []);
  const handleClosetoast = (event, reason) => {
    if (reason === "clickaway") return; // Prevent closing on click away
    setvalidate((prev) => ({ ...prev, status: false }));
    closecronbox(false);
  };
  return (
    <>
      <Snackbar
        open={validate.status}
        onClose={handleClosetoast}
        autoHideDuration={2000}
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
                  Total Cron List {crondata.length}
                </h4>
                <button
                  onClick={() => {
                    closecronbox(false);
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
                    data={crondata}
                    fixedHeaderContent={() => (
                      <tr>
                        <th>
                          <div className="headers">User</div>
                        </th>
                        <th>
                          <div className="headers">Cron Title</div>
                        </th>
                        <th>
                          <div className="headers">Total Record</div>
                        </th>
                        <th>
                          <div className="headers">Sent Email</div>
                        </th>
                        <th>
                          <div className="headers">Template Name</div>
                        </th>
                        <th>
                          <div className="headers">Account Name</div>
                        </th>
                        <th>
                          <div className="headers">Schedule On</div>
                        </th>
                        <th>
                          <div className="headers">Reschedule On</div>
                        </th>
                        <th>
                          <div className="headers">Status</div>
                        </th>
                        <th>
                          <div className="headers">Action</div>
                        </th>
                      </tr>
                    )}
                    itemContent={(index, user) => (
                      <>
                        <td className="ps-0">
                          <div className="d-flex align-items-center">
                            <div>
                              <h6 className="fw-semibold mb-1">{user[0]}</h6>
                              <p className="fs-1 mb-0 text-muted">
                                {designation[user[1]]}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="mb-0 fs-1">{user[2]}</p>
                        </td>
                        <td>
                          <p className="mb-0 fs-1">{user[3]}</p>
                        </td>
                        <td>
                          <p className="mb-0 fs-1">{user[7]}</p>
                        </td>
                        <td title={user[4]} aria-description="Template Name">
                          <p className="mb-0 fs-1">{user[4]}</p>
                        </td>
                        <td>
                          <p className="mb-0 fs-1">{user[5]}</p>
                        </td>
                        <td>
                          <p className="fs-1 text-dark mb-0">
                            {moment(user[6]).format("lll")}
                          </p>
                        </td>
                        <td>
                          <p className="fs-1 text-dark mb-0">
                            {user[12] != ""
                              ? moment(user[12]).format("lll")
                              : ""}
                          </p>
                        </td>
                        <td>
                          <a target="_blank" href={`${user[8]}`}>
                            {" "}
                            <span
                              onClick={() => {
                                reschedule(user);
                              }}
                              className={`badge fw-semibold py-1 w-85 bg-${
                                user[3] == user[7] ? "success" : "danger"
                              }-subtle text-${
                                user[3] == user[7] ? "success" : "danger"
                              }`}
                            >
                              {user[3] == user[7] ? "Completed" : "Pending"}
                            </span>
                          </a>
                        </td>
                        <td>
                          <a>
                            {" "}
                            <span
                              onClick={() => {
                                pausecron(user);
                              }}
                              className={`badge fw-semibold py-1 w-85 bg-${
                                user[11] == true ? "success" : "danger"
                              }-subtle text-${
                                user[11] == true ? "success" : "danger"
                              }`}
                            >
                              {user[11] == true ? "Resume" : "Pause"}
                            </span>
                          </a>
                        </td>
                      </>
                    )}
                  />
                </Suspense>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cronlist;
