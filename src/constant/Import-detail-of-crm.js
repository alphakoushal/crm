const CRM = 'crm4'; // This should be set in .env file

let config;

switch (CRM) {
  case "crm1":
    config = require("./Ip-config").default;
    break;
  case "crm2":
    config = require("./Iip-config").default;
    break;
  case "crm3":
    config = require("./analytic-config").default;
    break;
  case "crm4":
    config = require("./it-config").default;
    break;
  default:
    throw new Error("Invalid CRM environment specified.");
}

export default config;