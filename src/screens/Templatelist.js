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
import Fetchdata from "../services/fetchdata";
import moment from "moment";
import Headerblank from "../component/Header-blank";
import Uploaddata from "../services/uploaddata";
import { Link } from "react-router-dom";
const TemplateList = () => {
  const [templatelist, settemplate] = useState([]);
  const [activecategory, setCategory] = useState(2);
  const templateid = useRef("");
  const [validate, setvalidate] = useState({
    status: false,
    color: "error",
    icon: "error",
    message: "",
  });
  const auth = JSON.parse(localStorage.getItem("user"));
  let clienttype = { 1: "Agent", 2: "Individual", 3: "Both" };
  let templatetype = { 1: "Individual", 2: "Dupe" };
  function filterTemplate(type) {
    setCategory(type);
  }
  function openpreview(e, id) {
    let m = document.querySelector("#previewtemplate");
    m.classList.add("show");
    m.style.display = "block";
    let title = document.querySelector(".title_");
    let subject = document.querySelector(".subject_");
    let foundtemplate = templatelist.filter((item) => item.id == id)[0
    ];
    title.innerHTML = foundtemplate.title;
    subject.innerHTML = foundtemplate.subject;
    templateid.current = id;
  }
  function closepreview(e) {
    let m = document.querySelector("#previewtemplate");
    m.classList.remove("show");
    m.style.display = "none";
    templateid.current = "";
  }
  const sendtome = async (e) => {
    e.preventDefault();
    let email = document.querySelector("#sendtome").value;
    if (email == "") {
      setvalidate((prev) => ({
        ...prev,
        status: true,
        message: "Please enter email",
        color: "error",
        icon: "error",
      }));
      return;
    } else if (templateid.current == "") {
      setvalidate((prev) => ({
        ...prev,
        status: true,
        message: "Template id not found",
        color: "error",
        icon: "error",
      }));
      return;
    } else {
      let res = await Uploaddata.sendtome({
        email: email,
        id: templateid.current,
      }).then((resposne) => {
        return resposne;
      });
      if (res.data.success) {
        setvalidate((prev) => ({
          ...prev,
          status: true,
          message: res.data.message,
          color: "success",
          icon: "success",
        }));
        closepreview("");
      } else {
        setvalidate((validate) => ({
          ...validate,
          status: true,
          message: res.data.errors.error,
          color: "error",
          icon: "error",
        }));
      }
      setTimeout(() => {}, 1000);
    }
  };
  const fetchlist = async (type) => {
    let data = await Fetchdata.fetchtemplate({
      type: type,
      matter: "1",
      anuationuser_uniqueid: auth.userid,
    }).then((response) => {
      return response;
    });
    settemplate(data.data.data);
  };
  useEffect(() => {
    document
      .querySelector("table")
      .classList.add("table", "table-bordered", "table-hover");

    fetchlist("");
  }, []);
  return (
    <>
      <Snackbar open={validate.status} autoHideDuration={6000}>
        <MuiAlert
          elevation={6}
          variant="filled"
          color={validate.color}
          severity={validate.icon}
        >
          {validate.message}
        </MuiAlert>
      </Snackbar>
      <Headerblank except={false}></Headerblank>
      <div className={"body-wrapper1 custom-table "}>
        <div
          class="modal fade"
          id="previewtemplate"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-modal="true"
          role="dialog"
        >
          <div class="modal-dialog modal-lg modal-fullscreen-md-down modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-light">
                <h5 class="modal-title fs-3" id="exampleModalLabel">
                  📤 Send Email
                </h5>
                <button
                  onClick={(e) => {
                    closepreview(e);
                  }}
                  type="button"
                  class="btn-close fs-1"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div className="row">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group row">
                        <label class="form-label text-end col-md-3">
                          Title:
                        </label>
                        <div class="col-md-9">
                          <p className="title_"></p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group row">
                        <label class="form-label text-end col-md-3">
                          Subject:
                        </label>
                        <div class="col-md-9">
                          <p className="subject_"></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <form>
                  <div class="form-floating mb-3">
                    <input
                      type="email"
                      id="sendtome"
                      class="form-control border"
                      placeholder="Recipient Email Address "
                    />
                    <label>
                      <i class="ti ti-mail me-2 fs-4 text-success"></i>
                      <span class="border-start ps-3">
                        Recipient Email Address
                      </span>
                    </label>
                  </div>
                </form>
              </div>
              <div class="modal-footer justify-content-start">
                <button
                  onClick={(e) => {
                    sendtome(e);
                  }}
                  type="button"
                  class="btn btn-primary d-none d-md-inline"
                  data-bs-dismiss="modal"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid bootstrap-table">
          <div className="fixed-table-container fixed-height d-flex">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div class="d-md-flex align-items-center mb-9">
                      <div>
                        <h4 class="card-title fw-semibold">
                          Email Template List
                        </h4>
                        <p class="card-subtitle">
                          Manage and send your email templates
                        </p>
                      </div>
                      <div class="ms-auto mt-4 mt-md-0">
                        <ul class="nav nav-tabs" role="tablist">
                          <li
                            onClick={() => {
                              filterTemplate(2);
                            }}
                            class="nav-item"
                            role="presentation"
                          >
                            <a
                              class={`nav-link rounded ${
                                activecategory == 2 ? "active" : ""
                              }`}
                              data-bs-toggle="tab"
                              href="#home"
                              role="tab"
                              aria-selected="true"
                            >
                              <span>Individual</span>
                            </a>
                          </li>
                          <li
                            onClick={() => {
                              filterTemplate(1);
                            }}
                            class="nav-item"
                            role="presentation"
                          >
                            <a
                              class={`nav-link rounded ${
                                activecategory == 1 ? "active" : ""
                              }`}
                              data-bs-toggle="tab"
                              href="#profile"
                              role="tab"
                              aria-selected="false"
                              tabindex="-1"
                            >
                              <span>Agent</span>
                            </a>
                          </li>
                          <li
                            onClick={() => {
                              filterTemplate(3);
                            }}
                            class="nav-item"
                            role="presentation"
                          >
                            <a
                              class={`nav-link rounded ${
                                activecategory == 3 ? "active" : ""
                              }`}
                              data-bs-toggle="tab"
                              href="#profile"
                              role="tab"
                              aria-selected="false"
                              tabindex="-1"
                            >
                              <span>Both</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="row custom-table">
                      <TableVirtuoso
                        components={{ className: "koushal" }}
                        style={{ height: 400 }}
                        data={templatelist.filter((item) => {
                          return item.client_type == activecategory;
                        })}
                        fixedHeaderContent={() => (
                          <tr>
                            <th>
                              <div className="headers">Tile</div>
                            </th>
                            <th>
                              <div className="headers">Email Subject</div>
                            </th>
                            <th>
                              <div className="headers">Client Type</div>
                            </th>
                            <th>
                              <div className="headers">Mail Type</div>
                            </th>
                            <th>
                              <div className="headers">Edit</div>
                            </th>
                            <th>
                              <div className="headers">Action</div>
                            </th>
                          </tr>
                        )}
                        itemContent={(index, user) => (
                          <>
                            <td
                              className="text-break mb-0 fs-1 text-wrap"
                              style={{ maxWidth: "300px" }}
                            >
                              {user["title"]}
                            </td>
                            <td
                              className="text-break mb-0 fs-1 text-wrap"
                              style={{ maxWidth: "300px" }}
                            >
                              {user["subject"]}
                            </td>
                            <td>
                              <p className="mb-0 fs-1">
                                {clienttype[user["client_type"]]}
                              </p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">
                                {templatetype[user["template_type"]]}
                              </p>
                            </td>
                            <td>
                              <p className="mb-0 fs-1">
                                <Link to={"/edit-template?id=" + user["id"]}>
                                  Edit
                                </Link>
                              </p>
                            </td>
                            <td>
                              <button
                                onClick={(e) => {
                                  openpreview(e, user["id"]);
                                }}
                                class="btn btn-primary"
                              >
                                📤 Preview
                              </button>
                            </td>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateList;
