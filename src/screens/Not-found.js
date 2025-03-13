import React from "react";
const Notfound =() => {
    return (
<div class="position-relative overflow-hidden min-vh-100 w-100 d-flex align-items-center justify-content-center">
      <div class="d-flex align-items-center justify-content-center w-100">
        <div class="row justify-content-center w-100">
          <div class="col-lg-4">
            <div class="text-center">
              <img src={`${process.env.PUBLIC_URL}/assets/images/backgrounds/errorimg.svg`} alt="modernize-img" class="img-fluid col-6" width="400"/>
              <h1 class="fw-semibold mb-7 fs-9">Opps!!!</h1>
              <h4 class="fw-semibold mb-7">This page you are looking for could not be found.</h4>
              <a class="btn btn-primary" href={`${process.env.PUBLIC_URL}`} role="button">Go Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Notfound;