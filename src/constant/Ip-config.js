const config = {
    apiBaseUrl: "https://www.anuation.com/oldcrm/",
    basepath: "crm",
    anuationcomkey:"",
    anuationlabskey:"",
    lastaccountcount:"25",
    crmtype:'crm1',
    authKey: "CRM1_SECRET_KEY",
    featureFlags: {
      enableEmailTracking: false,
      enableCallLogging: true,
    },
    accounts: {
        "191214150648429653": [
          { name: "Divi", account: 15 },
          { name: "Meenu Rai", account: 4 },
          { name: "Kim Karn", account: 5 },
          { name: "Ojas Arora", account: 6 },
          { name: "Naina Bakshi", account: 7 },
        ],
        "231220121357187063": [
          { name: "Mohini Singh", account: 8 },
          { name: "Eva Smith", account: 9 },
          { name: "Nancy Jay", account: 10 },
        ],
        "191220121357187063": [
          { name: "Ria", account: 14 },
          { name: "Amy Arora", account: 11 },
          { name: "Anu Chaudhary", account: 12 },
          { name: "Neha Kapoor", account: 13 },
          { name: "Priya Arora", account: 16 },
          { name: "Lia Chan", account: 24 },
          { name: "Ruhi Sharma", account: 25 },
        ],
        "240120121357187064": [
          { name: "Sia", account: 17 },
          { name: "Komal", account: 18 },
        ],
        "240513115857792863": [{ name: "Gary", account: 19 }],
      },
    username: {
        "191214150648429653": "Kim Karn",
        "231220121357187063": "Mohini Singh",
        "191220121357187063": "Ria Arora",
        "240120121357187064": "Komal",
        "240513115857792863": "Gary",
      },
      usernames: [
        { key: "191214150648429653", name: "Kim Karn" },
        { key: "231220121357187063", name: "Mohini Singh" },
        { key: "191220121357187063", name: "Ria Arora" },
        { key: "240120121357187064", name: "Komal" },
        { key: "240513115857792863", name: "Garry" },
      ],
      usernames2: [
        { account: "191214150648429653", name: "Kim Karn" },
        { account: "231220121357187063", name: "Mohini Singh" },
        { account: "191220121357187063", name: "Ria Arora" },
        { account: "240120121357187064", name: "Komal" },
        { account: "240513115857792863", name: "Garry" },
      ],
  };
  
  export default config;
  