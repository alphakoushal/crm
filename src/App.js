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
import Analytic from "./screens/Analytics";
import Emailemplate from "./screens/Emailemplate.js";
import TemplateList from "./screens/Templatelist.js";
import Editemailemplate from "./screens/edittemplate.js";
import Editcountryformula from "./screens/Edit-country-formula.js";
import Comparedata from "./screens/compare-existing-data.js";
import Countrylist from "./screens/formula-country.js";
import Calculatecost from "./screens/calculate-cost.js";
import Sockets from "./screens/socket.js";
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
            {auth.type == 2 ? (
              <>
                <Route path="/sockets" element={<Sockets />}></Route>
                <Route path="/countrylist" element={<Countrylist />}></Route>
                <Route path="/comparedata" element={<Comparedata />}></Route>
                <Route path="/freshdata" element={<Freshdata />}></Route>
                <Route
                  path="edit-country-formula"
                  element={<Editcountryformula />}
                ></Route>
                <Route
                  path="/edit-template"
                  element={<Editemailemplate />}
                ></Route>
              </>
            ) : (
              <></>
            )}
            <Route path="*" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/iip-dashboard" element={<IIPDashboard />}></Route>
            <Route path="/it-dashboard" element={<ITDashboard />}></Route>
            <Route path="/analytic" element={<Analytic />}></Route>
            <Route path="/templates" element={<Emailemplate />}></Route>
            <Route path="/templates-list" element={<TemplateList />}></Route>
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
