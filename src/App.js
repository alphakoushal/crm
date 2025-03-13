import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./screens/Login.js";
import Freshdata from "./screens/Freshdata.js";
import Editcountryformula from "./screens/Edit-country-formula.js";
import Countrylist from "./screens/formula-country.js";
import Calculatecost from "./screens/calculate-cost.js";
import Calculatetradecost from "./screens/calculate-trademark-cost.js";
import Useranalytics from "./screens/User-analytics.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./bootstrap-table.min.css";
import config from "./constant/Import-detail-of-crm.js";
import getRoutesByCRM from "./Routes/index.js";
function App() {
  let auth = localStorage.getItem("user");
  const crmRoutes = getRoutesByCRM(config.crmtype);
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
      <BrowserRouter basename={config.basepath}>
        {auth?.userid ? (
          <Routes path="/">
            <Route path="/calculate" element={<Calculatecost />}></Route>
            <Route path="/user-analytics" element={<Useranalytics />} />
            <Route
              path="/trademark-calculator"
              element={<Calculatetradecost />}
            ></Route>
            {auth.type == 2 ? (
              <>
                <Route path="/countrylist" element={<Countrylist />}></Route>
                <Route path="/freshdata" element={<Freshdata />}></Route>
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
                {crmRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
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
