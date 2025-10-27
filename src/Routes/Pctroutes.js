import { Route } from "react-router-dom";
import Dashboard from "../screens/Dashboard";
import Emailemplate from "../screens/Emailemplate";
import Editemailemplate from "../screens/edittemplate";
import TemplateList from "../screens/Templatelist";
import Notfound from "../screens/Not-found";
import QuotationList from "../screens/Quotationlist";
import Gmailemaillist from "../screens/Gmail/Emaillist";
import PctForm from "../screens/pct/Pct-form";
import Dashboardfreshdata from "../screens/pct/pct-fresh-data";
import PctallFreshdata from "../screens/pct/pct-all-fresh-data";
import Freshdata from "../screens/Freshdata";
import Masterdata from "../screens/pct/Master-data";
import Translationcost from "../screens/Translation-cost";
const IPRoutes = [
  { path: "/",header:true,name:'Dashboard',key:"dashboard", element: <Dashboard />, roles: ['admin', 'user', 'manager']  },
  { path: "/dashboard",header:true,name:'Dashboard',key:"dashboard", element: <Dashboard />, roles: ['admin', 'user', 'manager']  },
  { path: "/pct-form",header:false,name:'Add Application',key:"pct-form", element: <PctForm />, roles: ['admin', 'user', 'manager']  },
  // { path: "/pct-fresh-data",header:false,name:'Application List', element: <Dashboardfreshdata />, roles: ['admin', 'user', 'manager','operation']  },
  { path: "/templates",header:true,name:'Templates',key:"templates", element: <Emailemplate />, roles: ['admin', 'user', 'manager']  },
  { path: "/templates-list",header:true,name:'Template List',key:"template-list", element: <TemplateList />, roles: ['admin', 'user', 'manager']  },
  { path: "/edit-template",header:false,name:'Edit Template',key:"edit-template", element: <Editemailemplate />, roles: ['admin', 'user', 'manager']  },
  { path: "/quotation-list",header:true,name:'Quotation List',key:"quotation-list", element: <QuotationList />, roles: ['admin', 'user', 'manager']  },
  { path: "/gmail-list",header:true,name:'Gmail List',key:"gmail-list", element: <Gmailemaillist />, roles: ['admin', 'user', 'manager']  },
  { path: "/freshdata",header:true,name:'Fresh data',key:"freshdata", element: <Freshdata />, roles: ['admin', 'manager', 'operation']  },
  { path: "/pct-fresh-data",header:true,name:'All Fresh data',key:"pct-fresh-data", element: <PctallFreshdata />, roles: ['admin', 'manager', 'operation']  },
  { path: "/master-data",header:true,name:'Unreviwed Master data',key:"master-data", element: <Masterdata page={"masterdata"} reviewcategory={1} />, roles: ['admin', 'manager']  },
  { path: "/final-master-data",header:true,name:'Final Master data',key:"final-master-data", element: <Masterdata page={"finalmasterdata"} reviewcategory={2}/>, roles: ['admin', 'manager']  },
  { path: "/translation-cost",header:true,name:'Translation Cost',key:"translation-cost", element: <Translationcost />, roles: ['admin']  },
  { path: "*",header:false,name:'Not found', element: <Notfound />,roles: ['admin', 'user', 'manager'] },
]; 

export default IPRoutes;

