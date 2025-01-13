import { Route,Routes } from "react-router-dom";
import Countrylist from "../screens/formula-country";
import Comparedata from "../screens/compare-existing-data";
import Freshdata from "../screens/Freshdata";
import IIPFreshdata from "../screens/Iipreshdata";
import Editcountryformula from "../screens/Edit-country-formula";
const AdminRoutes = () => (
    <Routes path="/">
<Route path="/countrylist" element={<Countrylist />}></Route>
                <Route path="/comparedata" element={<Comparedata />}></Route>
                <Route path="/freshdata" element={<Freshdata />}></Route>
                <Route path="/iip-freshdata" element={<IIPFreshdata />}></Route>
                <Route
                  path="edit-country-formula"
                  element={<Editcountryformula />}
                ></Route>
  </Routes>
);

export default AdminRoutes;