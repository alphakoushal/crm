import { BrowserRouter,HashRouter, Routes, Route, Switch } from "react-router-dom";
import Login from "./screens/Login.js";
import Dashboard from './screens/Dashboard';
import IIPDashboard from "./screens/IIPDashboard.js";
import ITDashboard from "./screens/iitdashboard.js";
import Freshdata from "./screens/Freshdata.js";
import Analytic from './screens/Analytics';
import Emailemplate from "./screens/Emailemplate.js";
import TemplateList from "./screens/Templatelist.js";
import Editemailemplate from "./screens/edittemplate.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './bootstrap-table.min.css';
function App() {
  let auth= localStorage.getItem("user"); 
  auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
  console.log(process.env.PUBLIC_URL);
  return (
    <div className="page-wrapper" id="main-wrapper" data-theme="blue_theme" data-layout="vertical" data-sidebartype="" data-sidebar-position="fixed" data-header-position="">
    {/* basename={process.env.PUBLIC_URL} */}
     <HashRouter basename="/portal" >
      
      {auth?.userid ? ( <Routes path="/" ><Route path="*" element={<Dashboard />} /><Route path="/dashboard" element={<Dashboard />} /><Route path='/iip-dashboard' element={<IIPDashboard/>}></Route><Route path='/it-dashboard' element={<ITDashboard/>}></Route><Route path="/freshdata" element={<Freshdata/>}></Route><Route path='/analytic' element={<Analytic/>}></Route><Route path='/templates' element={<Emailemplate/>}></Route><Route path='/templates-list' element={<TemplateList/>}></Route><Route path='/edit-template' element={<Editemailemplate/>}></Route></Routes>)
      :
      (<Routes><Route path="/login" element={<Login />} /><Route path="/" element={<Login />} /></Routes>)}  
   
      
       
    </HashRouter >
    
    </div>
  );
}

export default App;
