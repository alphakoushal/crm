import { Route,Routes } from "react-router-dom";
import ITDashboard from "../screens/iitdashboard";
import ITEmailemplate from "../screens/it-template-component";
import ITTemplateList from "../screens/It-templatelist";
import EditITemailemplate from "../screens/editittemplate";
import PSdashboard from "../screens/PSdashboard";
import Notfound from "../screens/Not-found";
const itRoutes = [
  { path: "/",header:false,name:'IT Dashboard', element: <ITDashboard service={'it'}/> },
  { path: "/dashboard",header:false,name:'IT Dashboard', element: <ITDashboard service={'it'}/> },
  { path: "/it-dashboard",header:true,name:'IT Dashboard', element: <ITDashboard service={'it'}/> },
  { path: "/audit-dashboard",header:true,name:'Audit Dashboard', element: <ITDashboard service={'audit'}/> },
  { path: "/patent-shelter-dashboard",header:true,name:'PS Dashboard', element: <PSdashboard service={'ps'}/> },
  { path: "/it-templates",header:true,name:'Templates', element: <ITEmailemplate /> },
  { path: "/it-templates-list",header:true,name:'Template List', element: <ITTemplateList service={'it'} /> },
  { path: "/ps-templates-list",header:true,name:'PS Template List', element: <ITTemplateList service={'ps'} /> },
  { path: "/edit-it-template",header:false,name:'Edit Template', element: <EditITemailemplate /> },
  { path: "*",header:false,name:'Not found', element: <Notfound /> },
];

export default itRoutes;