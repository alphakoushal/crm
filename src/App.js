import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import Login from "./screens/Login.js";
import Dashboard from './screens/Dashboard';
import Analytic from './screens/Analytics';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './bootstrap-table.min.css';
function App() {
  let auth= localStorage.getItem("user"); 
  auth =(auth!='' ? JSON.parse(auth) : {'userid':'','type':'','org':''})
  return (
    <div className="page-wrapper" id="main-wrapper" data-theme="blue_theme" data-layout="vertical" data-sidebartype="" data-sidebar-position="fixed" data-header-position="">
     <BrowserRouter basename={process.env.PUBLIC_URL}>
      
      {auth?.userid ? ( <Routes path="/" ><Route path="*" element={<Dashboard />} /><Route path="/dashboard" element={<Dashboard />} /><Route path='/analytic' element={<Analytic/>}></Route></Routes>)
      :
      (<Routes><Route path="/login" element={<Login />} /><Route path="/" element={<Login />} /></Routes>)}  
   
      
      
    </BrowserRouter>
    
    </div>
  );
}

export default App;
