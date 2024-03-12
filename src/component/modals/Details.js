import React,{useState} from "react";
import moment from "moment";
import { emailstatus } from "../../constant/Constant";
const Details = ({data}) =>{
const userdetails= JSON.parse(data['other']);
let comments= (data['comment']!=null ? JSON.parse(data['comment'])['freshcomment']: []);

comments.sort((a,b)=> {return b.comment_added_date -a.comment_added_date});
// comments =[];
    return(
        <div className="tab-content pt-4" id="pills-tabContent">
        <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
          <div className="row">
            <div className="col-lg-3">
                  <div className="sticky-top" >
              <div className="card bx">

                <div className="card-body">
                  <p className="fs-2"><b>Assigned to</b>- {data['user']}</p>
                  <p className="fs-2"><b>Applicant name</b>- {userdetails['APPLICANT_NAME']}</p>
                  <p className="fs-2"><b>Contact Person</b>- {userdetails['c_p_f']} {userdetails['c_p_l']}</p>
                  <p className="fs-2"><b>Agent Name</b>- {userdetails['agent_name']??'N/A'}</p>
                  <p className="fs-2"><b>Email-id</b>- {userdetails['email_id']??'N/A'}</p>
                  <p className="fs-2"><b>Agent Email</b>- {userdetails['agent_email_id']??'N/A'}</p>
                  <p className="fs-2"><b>Applicant Status</b>-  {userdetails['applicant_status']}</p>
                  <p className="fs-2"><b>Phone Number</b>-  {userdetails['p_h_n']}</p>
                  <p className="fs-2"><b>Priority Date</b>-  {userdetails['p_date']}</p>
                  <p className="fs-2"><b>Deadline 30</b>-  {userdetails['deadline_30_month']}</p>
                  <p className="fs-2"><b>Deadline 31</b>-  {userdetails['deadline_31_month']}</p>


                </div>
              </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="card">
                <div className="card-body border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <img src='../crm/assets/icons/patent.png' alt="" className="rounded-circle" width="40" height="40"/>
                    <h6 className="fw-semibold mb-0 fs-4">{data['weblink']} {comments.length>0 ? '( '+(emailstatus?.[comments[0].comment_type]!=undefined ? emailstatus?.[comments[0].comment_type] : '')  +' )' : ''}</h6>
                  </div>
                  <p className="text-dark my-3"><b>Application Number : </b> {userdetails['app_no']}</p>
                  <p className="text-dark my-3"><b>Title : </b> {userdetails['title']}</p>
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