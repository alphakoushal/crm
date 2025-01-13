import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Switch,
  Router,
} from "react-router-dom";
import Login from "./screens/Login.js";
import Dashboard from "./screens/Dashboard";
import IIPDashboard from "./screens/IIPDashboard.js";
import ITDashboard from "./screens/iitdashboard.js";
import Freshdata from "./screens/Freshdata.js";
import IIPFreshdata from "./screens/Iipreshdata.js";
import Analytic from "./screens/Analytics";
import Emailemplate from "./screens/Emailemplate.js";
import Analyticemailemplate from "./screens/Analytic-template.js";
import ITEmailemplate from "./screens/it-template-component.js";
import TemplateList from "./screens/Templatelist.js";
import ITTemplateList from "./screens/It-templatelist.js";
import AnalytictemplateList from "./screens/Analytic-template-list.js";
import Editemailemplate from "./screens/edittemplate.js";
import Editanalytictemplate from "./screens/Edit-analytic-template.js";
import EditITemailemplate from "./screens/editittemplate.js";
import Editcountryformula from "./screens/Edit-country-formula.js";
import Comparedata from "./screens/compare-existing-data.js";
import Countrylist from "./screens/formula-country.js";
import Calculatecost from "./screens/calculate-cost.js";
import Sockets from "./screens/socket.js";
import Analyticdashboard from "./screens/Analytics-screen.js";
import Calculatetradecost from "./screens/calculate-trademark-cost.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./bootstrap-table.min.css";
function App() {
  let auth = localStorage.getItem("user");
  auth = auth != "" ? JSON.parse(auth) : { userid: "", type: "", org: "" };
  return (
    <div
      className="page-wrapper"
      id="main-wrapper"
      data-theme="blue_theme"
      data-layout="vertical"
      data-sidebartype=""
      data-sidebar-position="fixed"
      data-header-position=""
    >
      <BrowserRouter basename="/crm">
        {auth?.userid ? (
          <Routes path="/">
            <Route path="/calculate" element={<Calculatecost />}></Route>
            <Route path="/trademark-calculator" element={<Calculatetradecost />}></Route>
            {auth.type == 2 ? ( 
              <>
                <Route path="/sockets" element={<Sockets />}></Route>
                <Route path="/countrylist" element={<Countrylist />}></Route>
                <Route path="/comparedata" element={<Comparedata />}></Route>
                <Route path="/freshdata" element={<Freshdata />}></Route>
                <Route path="/iip-freshdata" element={<IIPFreshdata />}></Route>
                <Route
                  path="edit-country-formula"
                  element={<Editcountryformula />}
                ></Route>
              </>
            ) : (
              <></>
            )}
               {auth.type == 1 || auth.type == 3 || auth.type == 2 ? ( 
              <>
<Route path="*" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/iip-dashboard" element={<IIPDashboard />}></Route>
            <Route path="/it-dashboard" element={<ITDashboard service={'it'} />}></Route>
            <Route path="/audit-dashboard" element={<ITDashboard service={'audit'}/>}></Route>
            <Route path="/analytic" element={<Analytic />}></Route>
            <Route path="/analytic-dashboard" element={<Analyticdashboard />}></Route>
            <Route path="/analytic-templates" element={<Analyticemailemplate />}></Route>
            <Route path="/templates" element={<Emailemplate />}></Route>
            <Route path="/it-templates" element={<ITEmailemplate />}></Route>
            <Route path="/templates-list" element={<TemplateList />}></Route>
            <Route path="/analytic-templates-list" element={<AnalytictemplateList />}></Route>
            <Route path="/it-templates-list" element={<ITTemplateList />}></Route>
            <Route
                  path="/edit-template"
                  element={<Editemailemplate />}
                ></Route>
            <Route
                  path="/edit-analytic-template"
                  element={<Editanalytictemplate />}
                ></Route>
            <Route
                  path="/edit-it-template"
                  element={<EditITemailemplate />}
                ></Route>
              </>
            ) : (
              <></>
            )}
               {auth.type == 5 ? ( 
              <>
<Route path="*" element={<Countrylist />}></Route>
<Route path="edit-country-formula" element={<Editcountryformula />}></Route>
              </>
            ) : (
              <></>
            )}
            
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
