import Analyticdashboard from "../screens/Analytics-screen.js";
import Analyticemailemplate from "../screens/Analytic-template.js";
import AnalytictemplateList from "../screens/Analytic-template-list.js";
import Editanalytictemplate from "../screens/Edit-analytic-template.js";
import Advancedashboard from "../screens/analytic/Advance-dashboard.js";
import Notfound from "../screens/Not-found.js";
const analyticRoutes = [
    { path: "/",header:false, name:'Dashboard', element: <Analyticdashboard />,roles: ['admin', 'user']  },
    { path: "/dashboard",header:false, name:'Dashboard', element: <Analyticdashboard />, roles: ['admin', 'user', 'manager']  },
    { path: "/analytic-dashboard",header:true, name:'Dashboard', element: <Analyticdashboard />, roles: ['admin', 'user', 'manager']  },
    { path: "/analytic-templates",header:true,name:'Add Template', element: <Analyticemailemplate />, roles: ['admin', 'user', 'manager']  },
    { path: "/analytic-templates-list",header:true,name:'Template List', element: <AnalytictemplateList />, roles: ['admin', 'user', 'manager']  },
    { path: "/edit-analytic-template",header:false,name:'Edit Template', element: <Editanalytictemplate />, roles: ['admin', 'user', 'manager']  },
    { path: "/advance-dashboard",header:true,name:'Advance Dashboard', element: <Advancedashboard />, roles: ['admin', 'manager']  },
    { path: "*",header:false,name:'Not found', element: <Notfound />,roles: ['admin', 'user', 'manager']  },
];

export default analyticRoutes;