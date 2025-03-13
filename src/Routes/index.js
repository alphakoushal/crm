import itRoutes from "./itroutes";
import analyticRoutes from "./analyticroute";
import IPRoutes from "./pctroutes";
const getRoutesByCRM = (crmType) => {
    switch (crmType) {
        case "crm1":
            return IPRoutes;
        case "crm2":
            return IPRoutes;
        case "crm3":
            return analyticRoutes;
        case "crm4":
            return itRoutes;
        default:
            return [];
    }
};

export default getRoutesByCRM;