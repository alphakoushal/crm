import Analyticdashboard from "../screens/Analytics-screen.js";
import Analyticemailemplate from "../screens/Analytic-template.js";
import AnalytictemplateList from "../screens/Analytic-template-list.js";
import Editanalytictemplate from "../screens/Edit-analytic-template.js";
import Notfound from "../screens/Not-found.js";
const analyticRoutes = [
    { path: "/",header:false, name:'Dashboard', element: <Analyticdashboard /> },
    { path: "/dashboard",header:false, name:'Dashboard', element: <Analyticdashboard /> },
    { path: "/analytic-dashboard",header:true, name:'Dashboard', element: <Analyticdashboard /> },
    { path: "/analytic-templates",header:true,name:'Add Template', element: <Analyticemailemplate /> },
    { path: "/analytic-templates-list",header:true,name:'Template List', element: <AnalytictemplateList /> },
    { path: "/edit-analytic-template",header:false,name:'Edit Template', element: <Editanalytictemplate /> },
    { path: "*",header:false,name:'Not found', element: <Notfound /> },
];

export default analyticRoutes;