const config = {
    apiBaseUrl: "https://www.anuation.com/oldcrm/",
    basepath: "crm",
    crmtype:'crm1',
    authKey: "CRM1_SECRET_KEY",
    featureFlags: {
      enableEmailTracking: false,
      enableCallLogging: true,
    },
    accounts: {
        "191214150648429653": [
          { name: "Divi", account: 15 },
          { name: "Meenu", account: 4 },
          { name: "Kim", account: 5 },
          { name: "Ojas", account: 6 },
          { name: "Naina", account: 7 },
        ],
        "231220121357187063": [
          { name: "Mohini", account: 8 },
          { name: "Eva", account: 9 },
          { name: "Nancy", account: 10 },
        ],
        "191220121357187063": [
          { name: "Ria", account: 14 },
          { name: "Amy", account: 11 },
          { name: "Anu", account: 12 },
          { name: "Neha", account: 13 },
          { name: "Priya", account: 16 },
        ],
        "240120121357187064": [
          { name: "Sia", account: 17 },
          { name: "Komal", account: 18 },
        ],
        "240513115857792863": [{ name: "Gary", account: 19 }],
      },
    username: {
        "191214150648429653": "Kim",
        "231220121357187063": "Mohini",
        "191220121357187063": "Ria",
        "240120121357187064": "Komal",
        "240513115857792863": "Gary",
      },
      usernames: [
        { key: "191214150648429653", name: "Kim" },
        { key: "231220121357187063", name: "Mohini" },
        { key: "191220121357187063", name: "Ria" },
        { key: "240120121357187064", name: "Komal" },
        { key: "240513115857792863", name: "Garry" },
      ],
      usernames2: [
        { account: "191214150648429653", name: "Kim" },
        { account: "231220121357187063", name: "Mohini" },
        { account: "191220121357187063", name: "Ria" },
        { account: "240120121357187064", name: "Komal" },
        { account: "240513115857792863", name: "Garry" },
      ],
  };
  
  export default config;
  