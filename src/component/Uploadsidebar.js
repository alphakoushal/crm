import React, { useState, useRef } from "react";
import Uploaddata from "../services/uploaddata";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Uploadsidebar = () => {
  const [open, setOpen] = useState({ status: false, message: "" });
  const currentfetch = useRef(false);
  const auth = JSON.parse(localStorage.getItem("user"));
  function handleClose() {
    setOpen({ status: false, message: "" });
  }
  const createsheet = async () => {
    if (currentfetch.current) {
      setOpen({ status: true, message: "In process" });
    } else {
      let css = await Uploaddata.createssheet({
        type: "create_sheet",
        sheettype: "3",
      }).then((response) => {
        return response;
      });
      if (css.data.success) {
        currentfetch.current = false;
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: css.data.message });
      } else {
        currentfetch.current = false;
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: css.data.errors.error });
      }
    }
  };
  const transferdatatopct = async () => {
    if (currentfetch.current) {
      setOpen({ status: true, message: "In process" });
    } else {
      currentfetch.current = true;
      document.querySelector(".transferdatatopct").classList.add("rotate");
      document.querySelector(".body-wrapper1").classList.add("loader");
      let transferdatatopctstatus = await Uploaddata.transferdatatopct({
        type: "transferdatatopct",
        posttype: "transferdatatopct",
      }).then((response) => {
        return response;
      });
      if (transferdatatopctstatus.data.success) {
        currentfetch.current = false;
        document.querySelector(".transferdatatopct").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({
          status: true,
          message: transferdatatopctstatus.data.message,
        });
      } else {
        currentfetch.current = false;
        document.querySelector(".transferdatatopct").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({
          status: true,
          message: transferdatatopctstatus.data.errors.error,
        });
      }
    }
  };
  const transferdatatoiippct = async () => {
    if (currentfetch.current) {
      setOpen({ status: true, message: "In process" });
    } else {
      currentfetch.current = true;
      document.querySelector(".transferdatatoiippct").classList.add("rotate");
      document.querySelector(".body-wrapper1").classList.add("loader");
      let transferdatatoiippctstatus = await Uploaddata.transferdatatoiippct({
        type: "transferdatatoiippct",
        posttype: "transferdatatoiippct",
      }).then((response) => {
        return response;
      });
      if (transferdatatoiippctstatus.data.success) {
        currentfetch.current = false;
        document.querySelector(".transferdatatoiippct").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({
          status: true,
          message: transferdatatoiippctstatus.data.message,
        });
      } else {
        currentfetch.current = false;
        document.querySelector(".transferdatatoiippct").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({
          status: true,
          message: transferdatatoiippctstatus.data.errors.error,
        });
      }
    }
  };
  const updatepct = async () => {
    if (currentfetch.current) {
      setOpen({ status: true, message: "In process" });
    } else {
      currentfetch.current = true;
      document.querySelector(".updatepct").classList.add("rotate");
      document.querySelector(".body-wrapper1").classList.add("loader");

      let updatepctstatus = await Uploaddata.updatepct({
        type: "updatepct",
      }).then((response) => {
        return response;
      });
      if (updatepctstatus.data.success) {
        currentfetch.current = false;
        document.querySelector(".updatepct").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: updatepctstatus.data.message });
        window.location.reload();
      } else {
        currentfetch.current = false;
        document.querySelector(".updatepct").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: updatepctstatus.data.errors.error });
      }
    }
  };
  const uploadfile = async () => {
    const formData = new FormData();
    let l = document.querySelector("#formFileSm").files;
    if (currentfetch.current) {
      setOpen({ status: true, message: "In process" });
    } else if (l.length > 0 && l[0].name.split(".").pop() != "xlsx") {
      setOpen({ status: true, message: "Format Should be xlsx" });
    } else if (l.length > 0) {
      currentfetch.current = true;
      document.querySelector(".uploadfile").classList.add("rotate");
      document.querySelector(".body-wrapper1").classList.add("loader");
      formData.append(
        "fileName",
        document.querySelector("#formFileSm").files[0].name
      );
      formData.append(
        "document1",
        document.querySelector("#formFileSm").files[0]
      );
      formData.append("type", "updatesheet");
      formData.append("auth", auth.userid);
      let rs = await Uploaddata.uploaddata(formData).then((response) => {
        return response;
      });
      if (rs.data.success) {
        currentfetch.current = false;
        document.querySelector(".uploadfile").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: rs.data.message });
      } else {
        currentfetch.current = false;
        document.querySelector(".uploadfile").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: rs.data.errors.error });
      }
    } else {
      setOpen({ status: true, message: "Choose file" });
    }
  };
  const uploadanalyticdata = async (typeofsheet) => {
    let l = document.querySelector("#" + typeofsheet).files;
    if (currentfetch.current) {
      setOpen({ status: true, message: "In process" });
    } else if (l.length > 0 && l[0].name.split(".").pop() != "xlsx") {
      setOpen({ status: true, message: "Format Should be xlsx" });
    } else if (l.length > 0) {
      //
      const formdata = new FormData();
      currentfetch.current = true;
      document.querySelector("." + typeofsheet).classList.add("rotate");
      document.querySelector(".body-wrapper1").classList.add("loader");
      formdata.append(
        "filename",
        document.querySelector("#" + typeofsheet).files[0].name
      );
      formdata.append(
        "document1",
        document.querySelector("#" + typeofsheet).files[0]
      );
      formdata.append("type", typeofsheet);
      formdata.append("auth", auth);
      let rs = await Uploaddata.uploadanalyticdata(formdata)
        .then((response) => {
          return response;
        })
        .catch((response) => {
          return response;
        });
      if (rs.data.success) {
        currentfetch.current = false;
        document.querySelector("." + typeofsheet).classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: rs.data.message });
        if (typeofsheet == "uploadpctfreshdata") {
          window.location.reload();
        }
      } else {
        currentfetch.current = false;
        document.querySelector("." + typeofsheet).classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: rs.data.errors.error });
      }
    } else {
      setOpen({ status: true, message: "Choose file" });
    }
  };
  const assignfile = async () => {
    let l = document.querySelector("#assignfile").files;
    let u = document.querySelector("#userid").value;
    if (currentfetch.current) {
      setOpen({ status: true, message: "In process" });
    } else if (u == "" || typeof u == "undefined") {
      setOpen({ status: true, message: "Enter Userid" });
    } else if (l.length > 0 && l[0].name.split(".").pop() != "xlsx") {
      setOpen({ status: true, message: "Format Should be xlsx" });
    } else if (l.length > 0) {
      //
      const formdata = new FormData();
      currentfetch.current = true;
      document.querySelector(".assignfile").classList.add("rotate");
      document.querySelector(".body-wrapper1").classList.add("loader");
      formdata.append(
        "filename",
        document.querySelector("#assignfile").files[0].name
      );
      formdata.append(
        "document1",
        document.querySelector("#assignfile").files[0]
      );
      formdata.append("type", "assignsheet");
      formdata.append("auth", auth);
      formdata.append("s_assign_to", u);
      let rs = await Uploaddata.assignsheet(formdata).then((response) => {
        return response;
      });
      if (rs.data.success) {
        currentfetch.current = false;
        document.querySelector(".assignfile").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: rs.data.message });
      } else {
        currentfetch.current = false;
        document.querySelector(".assignfile").classList.remove("rotate");
        document.querySelector(".body-wrapper1").classList.remove("loader");
        setOpen({ status: true, message: rs.data.errors.error });
      }
    } else {
      setOpen({ status: true, message: "Choose file" });
    }
  };

  const closebar = async (e) => {
    e.preventDefault();
    let exit = document
      .querySelector(".body-wrapper1")
      .classList.contains("loader");
    if (!exit) {
      document.querySelector(".uploadsidebar").classList.remove("show");
    }
  };
  return (
    <>
      <Snackbar
        open={open.status}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert elevation={6} variant="filled">
          {open.message}
        </MuiAlert>
      </Snackbar>
      <div
        className="offcanvas offcanvas-end shopping-cart uploadsidebar"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header py-4">
          <h5
            className="offcanvas-title fs-5 fw-semibold"
            id="offcanvasRightLabel"
          >
            Assignment
          </h5>
          <a
            onClick={(e) => closebar(e)}
            className="btn btn-outline-primary w-30"
          >
            Close
          </a>
        </div>
        <div className="offcanvas-body h-100 px-4 pt-0" data-simplebar>
          {auth.type == "2" ? (
            <>
              <div className="card card-body">
                <div className="mb-3 d-flex gap-3">
                  <label htmlFor="assignfile" className="form-label">
                    Assign Sheet To Employee
                  </label>
                  <select id="userid" className="form-select flex-item">
                        <option value="">Choose User</option>
                        <option value="191214150648429653">Kim (A016)</option>
                        <option value="191220121357187063">Ria (A007)</option>
                        <option value="231220121357187063">
                          Mohini (A109)
                        </option>
                        <option value="240120121357187064">Komal (A154)</option>
                      </select>
                </div>
                <div className="col-12">
                  <div className="d-md-flex align-items-center mt-0 align-content-md-between gap-3">
                    <input
                      className="form-control form-control-sm flex-item"
                      id="assignfile"
                      type="file"
                    />
                    <div className="ms-auto mt-3 mt-md-0">
                      <button
                        onClick={() => assignfile()}
                        type="submit"
                        className="btn btn-info font-medium rounded-pill px-4"
                      >
                        <div className="d-flex align-items-center">
                          Upload &nbsp;<i className="ti ti-refresh assignfile"></i>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card card-body">
                <div className="mb-3">
                  <label htmlFor="assignfile" className="form-label">
                    Upload Analytic Sheet
                  </label>
                </div>
                <div className="col-12">
                  <div className="d-md-flex align-items-center mt-0 align-content-md-between gap-3">
                    <input
                      className="form-control form-control-sm flex-item"
                      id="uploadanalyticdata"
                      type="file"
                    />
                    <div className="ms-auto mt-3 mt-md-0 ">
                      <button
                        onClick={() => uploadanalyticdata("uploadanalyticdata")}
                        type="submit"
                        className="btn btn-info font-medium rounded-pill px-4"
                      >
                        <div className="d-flex align-items-center">
                          Upload &nbsp;
                          <i className="ti ti-refresh uploadanalyticdata"></i>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card card-body">
                <div className="mb-3">
                  <label htmlFor="assignfile" className="form-label">
                    Upload Pct Fresh Data
                  </label>
                </div>
                <div className="col-12">
                  <div className="d-md-flex align-items-center mt-0 align-content-md-between gap-3">
                    <input
                      className="form-control form-control-sm flex-item"
                      id="uploadpctfreshdata"
                      type="file"
                    />
                    <div className="ms-auto mt-3 mt-md-0 ">
                      <button
                        onClick={() => uploadanalyticdata("uploadpctfreshdata")}
                        type="submit"
                        className="btn btn-info font-medium rounded-pill px-4"
                      >
                        <div className="d-flex align-items-center">
                          Upload &nbsp;
                          <i className="ti ti-refresh uploadpctfreshdata"></i>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card card-body">
                <div className="mb-3">
                  <label htmlFor="assignfile" className="form-label">
                    Upload IT Fresh Data
                  </label>
                </div>
                <div className="col-12">
                  <div className="d-md-flex align-items-center mt-0 align-content-md-between gap-3">
                    <input
                      className="form-control form-control-sm flex-item"
                      id="uploaditdata"
                      type="file"
                    />
                    <div className="ms-auto mt-3 mt-md-0 ">
                      <button
                        onClick={() => uploadanalyticdata("uploaditdata")}
                        type="submit"
                        className="btn btn-info font-medium rounded-pill px-4"
                      >
                        <div className="d-flex align-items-center">
                          Upload &nbsp;<i className="ti ti-refresh uploaditdata"></i>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="card card-body">
            <div className="mb-3">
              <label htmlFor="formFileSm" className="form-label">
                Employee Current Sheet Update{" "}
              </label>
            </div>
            <div className="col-12">
              <div className="d-md-flex align-items-center mt-0  align-content-md-between gap-3">
                  <input
                    className="form-control form-control-sm flex-item"
                    id="formFileSm"
                    type="file"
                  />
                <div className="ms-auto mt-3 mt-md-0 ">
                  <button
                    type="submit"
                    className="btn btn-info font-medium rounded-pill px-4"
                  >
                    <div
                      onClick={() => uploadfile()}
                      className="d-flex align-items-center"
                    >
                      Upload &nbsp;<i className="ti ti-refresh uploadfile"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {auth.type == "2" ? (
            <>
              <div className="card card-body">
                <div className="mb-3 d-flex">
                  <label htmlFor="formFileSm" className="form-label">
                    Create Sheet
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-info font-medium rounded-pill px-4 ms-auto"
                >
                  <div
                    onClick={() => createsheet()}
                    className="d-flex align-items-center"
                  >
                    Create &nbsp;<i className="ti ti-refresh createstatusheet"></i>
                  </div>
                </button>
              </div>
              <div className="card card-body">
                <div className="mb-3 d-flex">
                  <label htmlFor="formFileSm" className="form-label">
                    Update Fresh data According to Status Sheet
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-info font-medium rounded-pill px-4 ms-auto"
                >
                  <div
                    onClick={() => updatepct()}
                    className="d-flex align-items-center"
                  >
                    Update &nbsp;<i className="ti ti-refresh updatepct"></i>
                  </div>
                </button>
              </div>
              <div className="card card-body">
                <div className="mb-3 d-flex">
                  <label htmlFor="formFileSm" className="form-label">
                    Transfer Data
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-info font-medium rounded-pill px-4 ms-auto"
                >
                  <div
                    onClick={() => transferdatatopct()}
                    className="d-flex align-items-center"
                  >
                    Transfer &nbsp;<i className="ti ti-refresh transferdatatopct"></i>
                  </div>
                </button>
              </div>
              <div className="card card-body">
                <div className="mb-3 d-flex">
                  <label htmlFor="formFileSm" className="form-label">
                    Transfer IIP Data
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-info font-medium rounded-pill px-4 ms-auto"
                >
                  <div
                    onClick={() => transferdatatoiippct()}
                    className="d-flex align-items-center"
                  >
                    Transfer &nbsp;<i className="ti ti-refresh transferdatatoiippct"></i>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Uploadsidebar;
