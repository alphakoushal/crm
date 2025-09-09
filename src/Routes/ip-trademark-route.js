import { Route } from "react-router-dom";
import Dashboard from "../screens/Dashboard";
import Emailemplate from "../screens/Emailemplate";
import Editemailemplate from "../screens/edittemplate";
import TemplateList from "../screens/Templatelist";
import Notfound from "../screens/Not-found";
import QuotationList from "../screens/Quotationlist";
import Gmailemaillist from "../screens/Gmail/Emaillist";
const IPtrademarkRoutes = [
  { path: "/",header:true,name:'Dashboard', element: <Dashboard />, roles: ['admin', 'user', 'manager']  },
  { path: "/dashboard",header:true,name:'Dashboard', element: <Dashboard />, roles: ['admin', 'user', 'manager']  },
  { path: "/templates",header:true,name:'Templates', element: <Emailemplate />, roles: ['admin', 'user', 'manager']  },
  { path: "/templates-list",header:true,name:'Template List', element: <TemplateList />, roles: ['admin', 'user', 'manager']  },
  { path: "/edit-template",header:false,name:'Edit Template', element: <Editemailemplate />, roles: ['admin', 'user', 'manager']  },
  { path: "/quotation-list",header:true,name:'Quotation List', element: <QuotationList />, roles: ['admin', 'user', 'manager']  },
  { path: "/gmail-list",header:true,name:'Gmail List', element: <Gmailemaillist />, roles: ['admin', 'user', 'manager']  },
  { path: "*",header:false,name:'Not found', element: <Notfound />,roles: ['admin', 'user', 'manager'] },
];

export default IPtrademarkRoutes;