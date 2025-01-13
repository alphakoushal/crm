import { Route } from "react-router-dom";
import Dashboard from "../screens/Analytics";
import Emailemplate from "../screens/Emailemplate";
import Editemailemplate from "../screens/edittemplate";
const IIPRoutes = () => (
  <>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/templates" element={<Emailemplate />} />
    <Route path="/edit-template" element={<Editemailemplate />} />
  </>
);

export default IIPRoutes;