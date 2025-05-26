import { Route } from "react-router-dom";
import Dashboard from "../screens/Dashboard";
import Emailemplate from "../screens/Emailemplate";
import Editemailemplate from "../screens/edittemplate";
import TemplateList from "../screens/Templatelist";
import Notfound from "../screens/Not-found";
import QuotationList from "../screens/Quotationlist";
import Gmailemaillist from "../screens/Gmail/Emaillist";
const IPRoutes = [
  { path: "/",header:true,name:'Dashboard', element: <Dashboard /> },
  { path: "/dashboard",header:true,name:'Dashboard', element: <Dashboard /> },
  { path: "/templates",header:true,name:'Templates', element: <Emailemplate /> },
  { path: "/templates-list",header:true,name:'Template List', element: <TemplateList /> },
  { path: "/edit-template",header:false,name:'Edit Template', element: <Editemailemplate /> },
  { path: "/quotation-list",header:true,name:'Quotation List', element: <QuotationList /> },
  { path: "/gmail-list",header:true,name:'Gmail List', element: <Gmailemaillist /> },
  { path: "*",header:false,name:'Not found', element: <Notfound /> },
];

export default IPRoutes;