import itRoutes from "./itroutes";
import analyticRoutes from "./analyticroute";
import IPRoutes from "./pctroutes";
import IPtrademarkRoutes from "./ip-trademark-route";
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
        case "crm5":
            return IPtrademarkRoutes;
        default:
            return [];
    }
};

export default getRoutesByCRM;