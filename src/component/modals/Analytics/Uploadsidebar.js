import React, { useState, useRef } from "react";
import Uploaddata from "../../../services/uploaddata";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import config from "../../../constant/Import-detail-of-crm";
const Uploadsidebar = () => {
  const [open, setOpen] = useState({ status: false, message: "" });
  const currentfetch = useRef(false);
  const auth = JSON.parse(localStorage.getItem("user"));
  function handleClose() {
    setOpen({ status: false, message: "" });
  }

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
      formdata.append("auth", auth.userid);
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
          <div className="card card-body">
            <div className="row align-items-start">
              <div class="col-9">
                <div className="mb-3">
                  <label htmlFor="assignfile" className="form-label">
                    Upload Analytic Sheet
                  </label>
                </div>
              </div>
              <div class="col-3">
                <div class="d-flex justify-content-end">
                  <a download href={`${config.assetsurl}files/analytic-format.xlsx`}>
                  <div class="text-white text-bg-secondary rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <i class="ti ti-file-info fs-2"></i>
                  </div>
                  </a>
                </div>
              </div>
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
        </div>
      </div>
    </>
  );
};

export default Uploadsidebar;
