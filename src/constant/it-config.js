const config = {
    apiBaseUrl: "https://www.anuation.com/itcrm/admin/",
    basepath: "itcrm",
    crmtype:'crm4',
    authKey: "CRM4_SECRET_KEY",
    featureFlags: {
      enableEmailTracking: false,
      enableCallLogging: true,
    },
    accounts: {
        "210401170743442923": [
      { name: "iris", account: 1 },
      { name: "sanjana", account: 2 },
      { name: "palak", account: 3 }
    ]
      },
    username: {
      },
      usernames: [
      ],
      usernames2: [
      ],
  };
  
  export default config;
  