import { Route,Routes } from "react-router-dom";
import Analyticdashboard from "../screens/Analytics-screen";
import Analyticemailemplate from "../screens/Analytic-template";
import Editanalytictemplate from "../screens/Edit-analytic-template";
import AnalytictemplateList from "../screens/Analytic-template-list";
const AnalyticRoutes = () => (
    <Routes path="/">
    <Route path="/analytic-dashboard" element={<Analyticdashboard />} ></Route>
    <Route path="/analytic-templates" element={<Analyticemailemplate />} ></Route>
    <Route path="/edit-analytic-template" element={<Editanalytictemplate />} ></Route>
    <Route path="/analytic-templates-list" element={<AnalytictemplateList />} ></Route>
  </Routes>
);

export default AnalyticRoutes;