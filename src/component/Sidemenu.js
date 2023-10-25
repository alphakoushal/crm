import React from "react";

const Sidebar = ()=>
{
    return(
      <aside className="left-sidebar">
        <div className="brand-logo d-flex align-items-center justify-content-between">
            <a href="./index.html" className="text-nowrap logo-img">
              <img src="../../dist/images/logos/dark-logo.svg" className="dark-logo" width="180" alt=""/>
              <img src="../../dist/images/logos/light-logo.svg" className="light-logo" width="180" alt="" style={{"display": "none"}}/>
            </a>
            <div className="close-btn d-lg-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
              <i className="ti ti-x fs-8 text-muted"></i>
            </div>
          </div>
        <nav className="sidebar-nav scroll-sidebar" data-simplebar>
        <ul id="sidebarnav">
          <li className="nav-small-cap">
            <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
            <span className="hide-menu">Home</span>
          </li>
          <li className="sidebar-item">
            <a className="sidebar-link" href="./index.html" aria-expanded="false">
              <span>
                <i className="ti ti-aperture"></i>
              </span>
              <span className="hide-menu">Modern</span>
            </a>
          </li>
        
          <li className="nav-small-cap">
            <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
            <span className="hide-menu">Apps</span>
          </li>
          <li className="sidebar-item">
            <a className="sidebar-link has-arrow" href="#" aria-expanded="false">
              <span className="d-flex">
                <i className="ti ti-chart-donut-3"></i>
              </span>
              <span className="hide-menu">Blog</span>
            </a>
            <ul aria-expanded="false" className="collapse first-level">
              <li className="sidebar-item">
                <a href="./blog-posts.html" className="sidebar-link">
                  <div className="round-16 d-flex align-items-center justify-content-center">
                    <i className="ti ti-circle"></i>
                  </div>
                  <span className="hide-menu">Posts</span>
                </a>
              </li>
              <li className="sidebar-item">
                <a href="./blog-detail.html" className="sidebar-link">
                  <div className="round-16 d-flex align-items-center justify-content-center">
                    <i className="ti ti-circle"></i>
                  </div>
                  <span className="hide-menu">Details</span>
                </a>
              </li>
            </ul>
          </li>
         
         
        </ul>
        <div className="unlimited-access hide-menu bg-light-primary position-relative my-7 rounded">
          <div className="d-flex">
            <div className="unlimited-access-title">
              <h6 className="fw-semibold fs-4 mb-6 text-dark w-85">Unlimited Access</h6>
              <button className="btn btn-primary fs-2 fw-semibold lh-sm">Signup</button>
            </div>
            <div className="unlimited-access-img">
              <img src="../../dist/images/backgrounds/rocket.png" alt="" className="img-fluid"/>
            </div>
          </div>
        </div>
      </nav>
      </aside>
    )
}

export default Sidebar;