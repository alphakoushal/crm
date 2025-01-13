import { Route,Routes } from "react-router-dom";
import ITDashboard from "../screens/iitdashboard";
import ITEmailemplate from "../screens/it-template-component";
import ITTemplateList from "../screens/It-templatelist";
import EditITemailemplate from "../screens/editittemplate";
const IIPRoutes = () => (
    <Routes path="/">
    <Route path="/it-dashboard" element={<ITDashboard />} />
    <Route path="/it-templates" element={<ITEmailemplate />} />
    <Route path="/edit-it-template" element={<EditITemailemplate />} />
    <Route path="/it-templates-list" element={<ITTemplateList />} />
  </Routes>
);

export default IIPRoutes;