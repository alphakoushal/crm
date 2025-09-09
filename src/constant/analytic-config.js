const config = {
  apiBaseUrl: "https://www.anuationanalytics.com/oldcrm/",
  assetsurl: "https://www.anuationanalytics.com/crm/assets/",
  basepath: "crm",
  crmtype: "crm3",
   lastaccountcount: "20",
  name:'Analytics CRM',
  authKey: "CRM3_SECRET_KEY",
  featureFlags: {
    enableEmailTracking: false,
    enableCallLogging: true,
  },
      headers:["First Name","Last Name","Company","Designation","Field/Expertise","Technology","Contact Info of","Company Type","Email ID","Web Domain","Phone No","Alt Phone No.","City","Country","Linkedin Profile","Email Date","Follow up","Next Follow up","Email Status","Call Date","Call Status","Comments","Assigned to","Last Name Sent Account","Last Email Sent Account","Account History","Cron Status" ],
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
      { name: "Sanchit", account: 14 },
      { name: "Henry", account: 15 },
    ],
    "230703121732279703": [
      { name: "Tanisha Yadav", account: 8 },
      { name: "Pam Jones", account: 10 },
      { name: "Alina Shaw", account: 11 },
      { name: "Emily", account: 16 },
    ],
    "250128115427791733": [
      { name: "Dimple", account: 17 },
      { name: "Miko", account: 18 },
    ],
    "250522114818323453": [
      { name: "Shivam", account: 19 },
      { name: "James", account: 20 },
    ]
  },
  username: {
    "240621150648429643": "Abhishek",
    "230703121732279603": "Sheetal",
    "230703121732279703": "Tanisha",
    "240621150648429843": "Sanchit",
    "250128115427791733": "Dimpal Som",
    "250522114818323453": "Shivam Yadav",
    "191214201403624913": "Rajat Rastogi",
  },
  usernames: [
    { key: "240621150648429643", name: "Abhishek" },
    { key: "230703121732279603", name: "Sheetal" },
    { key: "230703121732279703", name: "Tanisha" },
    { key: "240621150648429843", name: "Sanchit" },
    { key: "250128115427791733", name: "Dimpal Som" },
    { key: "250522114818323453", name: "Shivam Yadav" },
    { key: "191214201403624913", name: "Rajat Rastogi" },
  ],
  usernames2: [
    { account: "240621150648429643", name: "Abhishek" },
    { account: "230703121732279603", name: "Sheetal" },
    { account: "230703121732279703", name: "Tanisha" },
    { account: "240621150648429843", name: "Sanchit" },
    { account: "250128115427791733", name: "Dimpal Som" },
    { account: "250522114818323453", name: "Shivam Yadav" },
    { account: "191214201403624913", name: "Rajat Rastogi" },
  ],
};

export default config;
