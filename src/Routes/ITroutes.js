import { Route,Routes } from "react-router-dom";
import ITDashboard from "../screens/iitdashboard";
import ITEmailemplate from "../screens/it-template-component";
import ITTemplateList from "../screens/It-templatelist";
import EditITemailemplate from "../screens/editittemplate";
import PSdashboard from "../screens/PSdashboard";
import Notfound from "../screens/Not-found";
import Dashboard from "../screens/patent-shelter/Dashboard";
const itRoutes = [
  { path: "/",header:false,name:'IT Dashboard', element: <ITDashboard service={'it'}/>, roles: ['admin', 'user', 'manager']  },
  { path: "/dashboard",header:false,name:'IT Dashboard', element: <ITDashboard service={'it'}/>, roles: ['admin', 'user', 'manager']  },
  { path: "/it-dashboard",header:true,name:'IT Dashboard', element: <ITDashboard service={'it'}/>, roles: ['admin', 'user', 'manager']  },
  { path: "/audit-dashboard",header:true,name:'Audit Dashboard', element: <ITDashboard service={'audit'}/>, roles: ['admin', 'user', 'manager']  },
  { path: "/patent-shelter-dashboard",header:true,name:'PS Dashboard', element: <PSdashboard service={'ps'}/>, roles: ['admin', 'user', 'manager']  },
  { path: "/patent-shelter-dashboard-new",header:true,name:'PS Dashboard', element: <Dashboard service={'patentshelter'}/>, roles: ['admin', 'user', 'manager']  },
  { path: "/it-templates",header:true,name:'Templates', element: <ITEmailemplate />, roles: ['admin', 'user', 'manager']  },
  { path: "/it-templates-list",header:true,name:'Template List', element: <ITTemplateList service={'it'} />, roles: ['admin', 'user', 'manager']  },
  { path: "/ps-templates-list",header:true,name:'PS Template List', element: <ITTemplateList service={'ps'} />, roles: ['admin', 'user', 'manager']  },
  { path: "/edit-it-template",header:false,name:'Edit Template', element: <EditITemailemplate />, roles: ['admin', 'user', 'manager']  },
  { path: "*",header:false,name:'Not found', element: <Notfound />,roles: ['admin', 'user', 'manager'] },
];

export default itRoutes;