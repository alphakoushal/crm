import React,{useState} from "react";
import moment from "moment";
import { defaultvalue,emailstatus } from "../../../constant/Constant";
const Analyticdetails = ({data}) =>{
    console.log(data);
const userdetails= JSON.parse(data['other']);
let comments= (data['comment']!=null ? JSON.parse(data['comment'])['freshcomment']: []);
let comments2= (data['comment2']!=null ? JSON.parse(data['comment2'])['freshcomment']: []);

comments.sort((a,b)=> {return b.comment_added_date -a.comment_added_date});
comments2.sort((a,b)=> {return b.comment_added_date -a.comment_added_date});
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
                  <p className="fs-2"><b>Contact Person</b>- {userdetails?.['fullname']}</p>
                  <p className="fs-2"><b>Contact info of </b>- {userdetails?.['cio']}</p>
                  <p className="fs-2"><b>Email-id</b>- {userdetails['emailid']??'N/A'}</p>
                  <p className="fs-2"><b>designation</b>-  {userdetails['designation']}</p>
                  <p className="fs-2"><b>Phone Number</b>-  {userdetails['phone']}</p>
                  <p className="fs-2"><b>linkedin</b>-  {userdetails['linkedin']}</p>
                  <p className="fs-2"><b>firmname</b>-  {userdetails['firmname']}</p>
                  <p className="fs-2"><b>website</b>-  {userdetails['website']}</p>
                  <p className="fs-2"><b>country</b>-  {userdetails['country']}</p>
                  <p className="fs-2"><b>altphn</b>-  {userdetails['altphn']}</p>
                  <p className="fs-2"><b>technology</b>-  {userdetails['technology']}</p>
                  <p className="fs-2"><b>field</b>-  {userdetails['field']}</p>
                  <p className="fs-2"><b>City</b>-  {userdetails['city']}</p>


                </div>
              </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="card">
                <div className="card-body border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <img src='../crm/assets/icons/patent.png' alt="" className="rounded-circle" width="40" height="40"/>
                    <h6 className="fw-semibold mb-0 fs-4">{data['email']} {comments.length>0 ? '( '+(emailstatus?.[comments[0].comment_type]!=undefined ? emailstatus?.[comments[0].comment_type] : '')  +' )' : ''}</h6>
                  </div>
                  <p className="text-dark my-3"><b>Contact Person : </b> {userdetails['fullname']}</p>
                  <p className="text-dark my-3"><b>Firmname : </b> {userdetails['firmname']}</p>
                  <img src="dist/images/products/s1.jpg" alt="" className="img-fluid rounded-4 w-100 object-fit-cover"/>
<>
                  {comments.map((item) => {
                    let d =moment.unix(item['comment_added_date']).format("YYYY-MM-DDTHH:mm:ss");
                  return ( item['comments']!=='' ? <div className="position-relative">
                    <div className="p-4 rounded-2 bg-light mb-3">
                      <div className="d-flex align-items-center gap-3">
                      <i className="ti ti-user"></i>
                          <h6 className="fw-semibold mb-0 fs-4">{defaultvalue.username[item['username']]??item['username']}</h6>
                        <span className="fs-2"><span className="p-1 bg-muted rounded-circle d-inline-block"></span> {moment(d).fromNow()}</span>
                      </div>
                      <p className="my-3">{item['comments']}
                      </p>
                    </div>
                  </div> : <></>)
                })}
                <h4 class="card-title fw-semibold">Comments</h4>
                <p class="card-subtitle">Previous comments from overall data</p>
                  {comments2.map((item) => {
                    let d =moment.unix(item['comment_added_date']).format("YYYY-MM-DDTHH:mm:ss");
                  return ( item['comments']!=='' ? <div className="position-relative">
                    <div className="p-4 rounded-2 bg-light mb-3">
                      <div className="d-flex align-items-center gap-3">
                      <i className="ti ti-user"></i>
                          <h6 className="fw-semibold mb-0 fs-4">{defaultvalue.username[item['username']]??item['username']}</h6>
                        <span className="fs-2"><span className="p-1 bg-muted rounded-circle d-inline-block"></span> {moment(d).fromNow()}</span>
                      </div>
                      <p className="my-3">{item['comments']}
                      </p>
                    </div>
                  </div> : <></>)
                })}
                </>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div> )
}
export default Analyticdetails;