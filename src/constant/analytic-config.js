const config = {
    apiBaseUrl: "https://www.anuationanalytics.com/oldcrm/",
    basepath: "crm",
    crmtype:'crm3',
    authKey: "CRM3_SECRET_KEY",
    featureFlags: {
      enableEmailTracking: false,
      enableCallLogging: true,
    },
    accounts: {
        "240621150648429643": [
          { name: "Abhishek Singh", account: 1 },
          { name: "Ben Williams", account: 2 },
          { name: "Alex Turner", account: 12 },
          { name: "Zen Harper", account: 13 },
        ],
        "230703121732279603": [
          { name: "Sheetal Gupta", account: 3 },
          { name: "June Wood", account: 4 },
          { name: "Bella Carter", account: 5 },
        ],
        "240621150648429843": [
          { name: "Chris Brown", account: 6 },
          { name: "San Joy", account: 7 },
        ],
        "230703121732279703": [
          { name: "Tanisha Yadav", account: 8 },
          { name: "Pam Jones", account: 10 },
          { name: "Alina Shaw", account: 11 },
        ],
      },
    username: {
        "240621150648429643": "Abhishek",
        "230703121732279603": "Sheetal",
        "230703121732279703": "Tanisha",
        "240621150648429843": "Sanchit"
      },
      usernames: [
        { key: "240621150648429643", name: "Abhishek" },
        { key: "230703121732279603", name: "Sheetal" },
        { key: "230703121732279703", name: "Tanisha" },
        { key: "240621150648429843", name: "Sanchit" },
      ],
      usernames2: [
        { account: "240621150648429643", name: "Abhishek" },
        { account: "230703121732279603", name: "Sheetal" },
        { account: "230703121732279703", name: "Tanisha" },
        { account: "240621150648429843", name: "Sanchit" },
      ],
  };
  
  export default config;
  