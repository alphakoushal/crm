const config = {
  apiBaseUrl: "https://www.anuation.com/iip-crm/admin/",
  authKey: "CRM2_SECRET_KEY",
  crmtype:'crm2',
  basepath: "iipcrm",
  featureFlags: {
    enableEmailTracking: false,
    enableCallLogging: true,
  },
  accounts: {
    "240513115857792863": [
      { name: "Gary", account: 7 },
      { name: "Sahil", account: 8 },
      { name: "Vicky", account: 9 },
      { name: "Raj", account: 10 },
      { name: "Ryan", account: 11 },
    ],
    "191214150648429653": [{ name: "Isha", account: 1 }],
    "231220121357187063": [{ name: "Sara", account: 6 }],
    "191214201403624915": [
      { name: "Grace", account: 2 },
      { name: "Maya", account: 3 },
      { name: "Mia", account: 4 },
      { name: "Rimi", account: 5 },
    ],
  },
  username: {
    "240513115857792863": "Garry",
    "191214201403624914": "Maya",
    "191214201403624915": "Jyoti",
    "231220121357187063": "Mohini",
  },
  usernames: [
    { key: "240513115857792863", name: "Garry" },
    { key: "191214201403624914", name: "Maya" },
    { key: "191214201403624915", name: "Jyoti" },
  ],
  usernames2: [
    { account: "240513115857792863", name: "Garry" },
    { account: "191214201403624914", name: "Maya" },
    { account: "191214201403624915", name: "Jyoti" },
  ],
};

export default config;
