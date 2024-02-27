import React,{useState} from "react";
import moment from "moment";
const Details = ({data}) =>{
const userdetails= JSON.parse(data[3]);
let comments= (data[2]!=null ? JSON.parse(data[2])['freshcomment']: []);

// comments =[];
    return(
        <div className="tab-content pt-4" id="pills-tabContent">
        <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
          <div className="row">
            <div className="col-lg-3">
                  <div className="sticky-top" >
              <div className="card bx">

                <div className="card-body">
                  <p><b>Contact Person</b>- {userdetails['c_p_f']} {userdetails['c_p_l']}</p>
                  <p><b>Applicant Status</b>-  {userdetails['applicant_status']}</p>
                  <p><b>Phone Number</b>-  {userdetails['p_h_n']}</p>
                  <p><b>Priority Date</b>-  {userdetails['p_date']}</p>
                  <p><b>Deadline 30</b>-  {userdetails['deadline_30_month']}</p>
                  <p><b>Deadline 31</b>-  {userdetails['deadline_31_month']}</p>


                </div>
              </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="card">
                <div className="card-body border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <img src="https://www.anuationlabs.com/demo/main/dist/images/profile/user-1.jpg" alt="" className="rounded-circle" width="40" height="40"/>
                    <h6 className="fw-semibold mb-0 fs-4">{userdetails['APPLICANT_NAME']}</h6>
                  </div>
                  <p className="text-dark my-3">
                  {userdetails['title']}
                  </p>
                  <img src="dist/images/products/s1.jpg" alt="" className="img-fluid rounded-4 w-100 object-fit-cover"/>

                  {comments.map((item) => {
                    let d =moment.unix(item['comment_added_date']).format("YYYY-MM-DDTHH:mm:ss");
                  return ( item['comments']!=='' ? <div className="position-relative">
                    <div className="p-4 rounded-2 bg-light mb-3">
                      <div className="d-flex align-items-center gap-3">
                      <i className="ti ti-user"></i>
                          <h6 className="fw-semibold mb-0 fs-4">{item['username']}</h6>
                        <span className="fs-2"><span className="p-1 bg-muted rounded-circle d-inline-block"></span> {moment(d).fromNow()}</span>
                      </div>
                      <p className="my-3">{item['comments']}
                      </p>
                    </div>
                  </div> : <></>)
                })}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div> )
}
export default Details;