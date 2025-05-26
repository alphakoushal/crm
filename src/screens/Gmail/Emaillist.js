import React,{useEffect,useState} from "react";
import gmailfetch from "../../services/gmail";
const Gmailemaillist = () =>{
    const [emaildata,setemaildata]=useState({data:[],type:''});
    const [maildata,setmaildata]=useState([]);
    const [emails,setemail] = useState([]);
    const [searchterm,setsearch] = useState('subject:(Delivery Status Notification OR from:mailer-daemon) after:2025/04/14 before:2025/04/28');
    let collection = [];
    const clientsecret={'portfolio':'1053893797333-r24eog8i08fjca2muni5fjvuekt05lgj.apps.googleusercontent.com','labs':'829492777914-m91u4ic5hbqn31fecfjtd52mf2amge4o.apps.googleusercontent.com','anuation':'830783147294-sp88gmu3ovlg6es412io3q90sn4v0teu.apps.googleusercontent.com','analytics':'223546413651-ij52mm909fbf6r5l4nmgfpurejn5l3g3.apps.googleusercontent.com'};
    function extractEmailFromSnippet(snippet) {
      if (!snippet) return null;
    
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const match = snippet.match(emailRegex);
    
      return match ? match[0] : null;
    }
    const getlist = async(type) =>{
      let filterquery = document.querySelector('#text-srh').value;
        try{
const res = await gmailfetch.fetchlist({'type':type,'query':filterquery}).then((response)=>{return response;})
if(type === 'draft'){
    setemaildata({data:res?.data?.drafts??[],type:type});
}
else
{
setemaildata({data:res?.data?.messages??[],type:type});

if(type=='failed')
{
  const messages = res?.data?.messages ?? [];
  for (const item of messages) {
    const res= await fetchmaildatareturn(item.id,type);
    if(res)
    {
      if (res.data?.snippet?.includes('delivering your message to ravish@anuation.com')) {
        console.log('⏩ Skipping failure for ravish@anuation.com');
        continue; // Skip this email
    }

    // Process other failed emails normally here
    const extractedemail=extractEmailFromSnippet(res.data?.snippet);
    if(extractedemail)
    {
    collection.push(extractedemail);
    let uniqueEmails = [...new Set(collection)];
    let emailString = uniqueEmails.join(',');
    let rawdata = {snippet:emailString,name:'Failed Emails',length:collection.length};
    setmaildata(rawdata);
    console.log('✅ Processing failure for other recipient:',extractedemail );
    }
   
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
}
        }
        catch(error){
            const message = error?.response?.data?.error?.message || '';
            const tokenErrorRegex = /(invalid|expired).*token|authentication credentials/i;
            if (tokenErrorRegex.test(message)) {
                console.warn('⚠️ Token is invalid or expired.');
              } else {
                console.error('API Error:', message);
              }
        }
    }
    const fetchmaildata = async(id,type) =>{
        try{
const res = await gmailfetch.fetchmaildata({'id':id,type:type}).then((response)=>{return response;})
setmaildata(res.data);
        }
        catch(error){
            const message = error?.response?.data?.error?.message || '';
            const tokenErrorRegex = /(invalid|expired).*token|authentication credentials/i;
            if (tokenErrorRegex.test(message)) {
                console.warn('⚠️ Token is invalid or expired.');
              } else {
                console.error('API Error:', message);
              }
        }
    }
    const fetchmaildatareturn = async(id,type) =>{
        try{
const res = await gmailfetch.fetchmaildata({'id':id,type:type}).then((response)=>{return response;})
return res;       
}
        catch(error){
          return [];
        }
    }
    const refreshtoken = async(code,state) =>{
        const REDIRECT_URI = 'http://localhost:3000/crm/gmail-list';
        try{
            const res = await gmailfetch.refreshtoken({'type':'message','code':code,'REDIRECT_URI':REDIRECT_URI,'clientid':state}).then((response)=>{return response;})
            if(res.status === 200 && res.data.success){
           localStorage.setItem("gmailtoken", JSON.stringify({'access_token':res.data.access_token,'refresh_token':res.data.refresh_token}));
            }
        }
        catch(error){
            const message = error?.response?.data?.error?.message || '';
            const tokenErrorRegex = /(invalid|expired).*token|authentication credentials/i;
            if (tokenErrorRegex.test(message)) {
                console.warn('⚠️ Token is invalid or expired.');
                } else {
                console.error('API Error:', message);
                }
        }
    }
        const handleLogin = () => {
            const portal = document.querySelector('input[name="inlineRadioOptions"]:checked');
            const clientid = portal.value;
          const REDIRECT_URI = 'http://localhost:3000/crm/gmail-list';
          const SCOPE = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send'
          ].join(' ');
      
          const params = new URLSearchParams({
            client_id: clientsecret[clientid],
            redirect_uri: REDIRECT_URI,
            state:clientid,
            response_type: 'code',
            scope: SCOPE,
            access_type: 'offline',
            prompt: 'consent',
          });
      
          window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        };
    useEffect(()=>{
getlist('message');
    },[])
    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        if (code) {
            refreshtoken(code,state);
          }
    },[])
    return (
        <>
    <div class="container-fluid">
          <div class="card bg-info-subtle shadow-none position-relative overflow-hidden mb-4">
            <div class="card-body px-4 py-3">
              <div class="row align-items-center">
                <div class="col-9">
                  <h4 class="fw-semibold mb-8">Email</h4>
                  <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                      <li class="breadcrumb-item">
                        <a class="text-muted text-decoration-none" href="../main/index.html">Home</a>
                      </li>
                      <li class="breadcrumb-item" aria-current="page">Email</li>
                    </ol>
                  </nav>
                </div>
                <div class="col-3">
                  <div class="text-center mb-n5">
                    <img src="../crm/assets/images/breadcrumb/ChatBc.png" alt="modernize-img" class="img-fluid mb-n4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card overflow-hidden chat-application">
            <div class="d-flex w-100">
              <div class="left-part border-end w-20 flex-shrink-0 d-none d-lg-block">

                <ul class="list-group mh-n100" data-simplebar>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a onClick={()=>{getlist('inbox')}} class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-inbox fs-5"></i>Inbox
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a onClick={()=>{getlist('sent')}} class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-brand-telegram fs-5"></i>Sent
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a onClick={()=>{getlist('draft')}} class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-file-text fs-5"></i>Draft
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a onClick={()=>{getlist('trash')}} class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-trash fs-5"></i>Trash
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a onClick={()=>{getlist('failed')}} class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-trash fs-5"></i>Failed
                    </a>
                  </li>
                </ul>
              </div>
              <div class="d-flex w-100">
                <div class="min-width-340">
                  <div class="border-end user-chat-box h-100">
                    <div class="px-4 pt-9 pb-6 d-none d-lg-block">
                      <form class="position-relative">
                        <input type="text" class="form-control search-chat py-2 ps-5" id="text-srh" onChange={(e)=>{setsearch(e.target.value)}} value={searchterm}  placeholder="Search" />
                        <i class="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                      </form>
                    </div>
                    <div class="app-chat">
                      <ul class="chat-users mh-n100" data-simplebar>
                        {
                            emaildata.data.map((item,index)=>{
                                return(
                                    <li>
                                    <a onClick={()=>fetchmaildata((emaildata.type=='draft' ? item.message.id : item.id),emaildata.type)} class="px-4 py-3 bg-hover-light-black d-flex align-items-start chat-user bg-light-subtle" id="chat_user_1" data-user-id="1">
                                      <div class="form-check mb-0">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                      </div>
                                      <div class="position-relative w-100 ms-2">
                                        <div class="d-flex align-items-center justify-content-between mb-2">
                                          <h6 class="mb-0">{item.id}</h6>
                                          <span class="badge text-bg-primary"></span>
                                        </div>
                                        <h6 class="fw-semibold text-dark">
                                         
                                        </h6>
                                        <div class="d-flex align-items-center justify-content-between">
                                          <div class="d-flex align-items-center">
                                            <span>
                                              <i class="ti ti-star fs-4 me-2 text-dark"></i>
                                            </span>
                                            <span class="d-block">
                                              <i class="ti ti-alert-circle text-muted"></i>
                                            </span>
                                          </div>
                                          <p class="mb-0 fs-2 text-muted">04:00pm</p>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="w-100">
                  <div class="chat-container h-100 w-100">
                    <div class="chat-box-inner-part h-100">
                      <div class="chatting-box app-email-chatting-box">
                        <div class="p-9 py-3 border-bottom chat-meta-user">
                          <ul class="list-unstyled mb-0 d-flex align-items-center">
                            <li class="d-block">
                            <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" value="labs"/>
                    <label class="form-check-label" for="inlineRadio1">Anuationlabs</label>
                  </div>
                            <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" value="anuation"/>
                    <label class="form-check-label" for="inlineRadio1">Anuation</label>
                  </div>
                            <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" value="analytics"/>
                    <label class="form-check-label" for="inlineRadio1">Anuation analytics</label>
                  </div>
                            <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" value="portfolio"/>
                    <label class="form-check-label" for="inlineRadio1">Anuation Portfolio</label>
                  </div>
                            </li>
                            <li onClick={()=>{handleLogin()}} class="position-relative" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Star">
                              <a class="text-dark px-2 fs-5 bg-hover-primary nav-icon-hover position-relative z-index-5" href="javascript:void(0)">
                                <i class="ti ti-star"></i>
                              </a>
                            </li>
                            <li class="position-relative" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="important">
                              <a class="d-block text-dark px-2 fs-5 bg-hover-primary nav-icon-hover position-relative z-index-5" href="javascript:void(0)">
                                <i class="ti ti-alert-circle"></i>
                              </a>
                            </li>
                            <li class="position-relative" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                              <a class="text-dark px-2 fs-5 bg-hover-primary nav-icon-hover position-relative z-index-5" href="javascript:void(0)">
                                <i class="ti ti-trash"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div class="position-relative overflow-hidden">
                          <div class="position-relative">
                            <div class="chat-box email-box mh-n100 p-9" data-simplebar="init">
                                {('snippet' in maildata) ?
                         (
<div class="chat-list chat active-chat" data-user-id="1">
                                <div class="hstack align-items-start mb-7 pb-1 align-items-center justify-content-between flex-wrap gap-6">
                                  <div class="d-flex align-items-center gap-2">
                                   <div>
                                      <h6 class="fw-semibold mb-0">
                                        {maildata?.name??''}
                                      </h6>
                                      <p class="mb-0"> {maildata?.length??''}</p>
                                    </div>
                                  </div>
                                </div>
                                <div class="border-bottom pb-7 mb-7">
                                 {maildata?.snippet}
                                </div>
                              </div>)
:<></>}
                            </div>
                            <div class="px-9 py-3 border-top chat-send-message-footer">
                              <div class="d-flex align-items-center justify-content-between">
                                <ul class="list-unstyled mb-0 d-flex align-items-center gap-7">
                                  <li>
                                    <a class="text-dark bg-hover-primary d-flex align-items-center gap-1" href="javascript:void(0)">
                                      <i class="ti ti-arrow-back-up fs-5"></i>
                                      Reply
                                    </a>
                                  </li>
                                  <li>
                                    <a class="text-dark bg-hover-primary d-flex align-items-center gap-1" href="javascript:void(0)">
                                      <i class="ti ti-arrow-forward-up fs-5"></i>
                                      Forward
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="offcanvas offcanvas-start user-chat-box" tabindex="-1" id="chat-sidebar" aria-labelledby="offcanvasExampleLabel">
                <div class="offcanvas-header">
                  <h5 class="offcanvas-title" id="offcanvasExampleLabel">
                    Email
                  </h5>
                  <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <ul class="list-group h-n150" data-simplebar>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-inbox fs-5"></i>Inbox
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-brand-telegram fs-5"></i>Sent
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-file-text fs-5"></i>Draft
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-inbox fs-5"></i>Spam
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-trash fs-5"></i>Trash
                    </a>
                  </li>
                  <li class="border-bottom my-3"></li>
                  <li class="fw-semibold text-dark text-uppercase mx-9 my-2 px-3 fs-2">
                    IMPORTANT
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-star fs-5"></i>Starred
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)" class="d-block">
                      <i class="ti ti-badge fs-5"></i>Important
                    </a>
                  </li>
                  <li class="border-bottom my-3"></li>
                  <li class="fw-semibold text-dark text-uppercase mx-9 my-2 px-3 fs-2">
                    LABELS
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-bookmark fs-5 text-primary"></i>Promotional
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-bookmark fs-5 text-warning"></i>Social
                    </a>
                  </li>
                  <li class="list-group-item border-0 p-0 mx-9">
                    <a class="d-flex align-items-center gap-6 list-group-item-action text-dark px-3 py-8 mb-1 rounded-1" href="javascript:void(0)">
                      <i class="ti ti-bookmark fs-5 text-success"></i>Health
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>)
    }
export default Gmailemaillist;