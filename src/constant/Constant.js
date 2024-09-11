import moment from "moment";
import React,{useCallback} from "react";
const callstatus={'1':'NI','2':'lb','3':'Voice mail','4':'Invalid no','5':'Email sent','6':'Cb','7':'Ringing','8':'Dnc','9':'Other'};
const emailstatus = {'1':'Pipeline','2':'Failed','3':'Rejection','4':'Reciprocity','5':'Ooo','6':'Converted','7':'Response','8':'Dnc','9':'Dupe','10':'Exhausted','11':'Other','12':'Email Sent','13':'Not Responsive'};
const standard={'IN':{'small':22,'other':110},'CA':{'small':1160,'other':1320},'CN':{'other':1210},'JP':{'other':1340},'AU':{'other':1300},'BR':{'other':1200},'US':{'small':1240,'other':1380},'KR':{'other':1080},'EP':{'other':715+700+400+1825},'RU':{'other':1130},'MX':{'other':1630},'MY':{'other':900},'PH':{'other':800},'TH':{'other':900},'ID':{'other':850},'NZ':{'other':1200},'ZA':{'other':900},'VN':{'other':655},'SG':{'other':1100},'CO':{'other':1650}};
const defaultvalue = {
  mailtypeaccount:{'1':'Individual','2':'Agent'},
  names : [
    {'key':'_blank','value':'Blank'},
    {'key':'1','value':'Pipeline'},
    {'key':'2','value':'Failed'},
    {'key':'3','value':'Rejection'},
    {'key':'4','value':'Reciprocity'},
    {'key':'5','value':'Ooo'},
    {'key':'6','value':'Converted'},
    {'key':'7','value':'Response'},
    {'key':'8','value':'Dnc'},
    {'key':'9','value':'Dupe'},
    {'key':'10','value':'Exhausted'},
    {'key':'12','value':'Email Sent'},
    {'key':'13','value':'Not Responsive'},
      ],
      dupestatus : [{'key':'Unique','value':'Unique'},{'key':'Dupe','value':'Dupe'}],
      genstatus : [{'key':'email','value':'Email'},{'key':'domain','value':'Domain'}],
      applicantstatus : [{'key':'small','value':'Small'},{'key':'large','value':'Large'}],
      contactinfostatus : [{'key':'agent','value':'Agent'},{'key':'individual','value':'Individual'},{'key':'Both - Individual & Agent','value':'Both - Individual & Agent'}],
      callnames : [{'key':'_blank','value':'Blank'},{'key':'1','value':'Ni'},
      {'key':'2','value':'Lb'},
      {'key':'3','value':'Voice mail'},
      {'key':'4','value':'Invalid no'},
      {'key':'5','value':'Email sent'},
      {'key':'6','value':'Cb'},
      {'key':'7','value':'Ringing'},
      {'key':'8','value':'Dnc'}
        ],
        filinglang:[{'code':'eng','value':'English'},{'code':'ger','value':'German'},{'code':'spa','value':'Spanish'},{'code':'por','value':'Portuguese'},{'code':'kor','value':'Korean'},{'code':'jap','value':'Japanese'},{'code':'chn','value':'Chinese'},{'code':'rus','value':'Russian'},{'code':'arb','value':'Arabic'},{'code':'far','value':'Farsi'},{'code':'tha','value':'Thai'},{'code':'fre','value':'French'}],
        fillingcurrency : [{'code':'usd','value':'USD'},{'code':'eur','value':'EUR'},{'code':'inr','value':'INR'}],
        filinglangcurr : {'usd':'USD','eur':'EURO','inr':'INR'},
        filinglangcode:{'eng':'English','ger':'German','spa':'Spanish','por':'Portuguese','kor':'Korean','jap':'Japanese','chn':'Chinese','rus':'Russian','arb':'Arabic','far':'Farsi','tha':'Thai','fre':'French'},
        transcost :[{ "from": "eng", "to": "jap", "currency": "USD", "cost": "0.17", "type": "word" },{ "from": "jap", "to": "eng", "currency": "USD", "cost": "0.15", "type": "char" },{ "from": "eng", "to": "kor", "currency": "USD", "cost": "0.12", "type": "word" },{ "from": "kor", "to": "eng", "currency": "USD", "cost": "0.12", "type": "char" },{ "from": "eng", "to": "por", "currency": "USD", "cost": "0.13", "type": "word" },{ "from": "por", "to": "eng", "currency": "USD", "cost": "0.13", "type": "word" },{ "from": "eng", "to": "spa", "currency": "USD", "cost": "0.12", "type": "word" },{ "from": "spa", "to": "eng", "currency": "USD", "cost": "0.12", "type": "word" },{ "from": "eng", "to": "ger", "currency": "USD", "cost": "0.17", "type": "word" },{ "from": "ger", "to": "eng", "currency": "USD", "cost": "0.17", "type": "word" },{ "from": "eng", "to": "chn", "currency": "USD", "cost": "0.10", "type": "word" },{ "from": "chn", "to": "eng", "currency": "USD", "cost": "0.10", "type": "word" },{ "from": "eng", "to": "rus", "currency": "USD", "cost": "0.06", "type": "word" },{ "from": "rus", "to": "eng", "currency": "USD", "cost": "0.06", "type": "word" },{ "from": "eng", "to": "arb", "currency": "USD", "cost": "25", "type": "page" },{ "from": "arb", "to": "eng", "currency": "USD", "cost": "25", "type": "page" },{ "from": "eng", "to": "far", "currency": "USD", "cost": "25", "type": "page" },{ "from": "far", "to": "eng", "currency": "USD", "cost": "25", "type": "page" },{ "from": "eng", "to": "tha", "currency": "USD", "cost": "0.08", "type": "word" },{ "from": "tha", "to": "eng", "currency": "USD", "cost": "0.08", "type": "word" },{ "from": "eng", "to": "fre", "currency": "USD", "cost": "0.12", "type": "word" },{ "from": "fre", "to": "eng", "currency": "USD", "cost": "0.14", "type": "word" }],
        accounts:{'191214150648429653':[{name:'Divi',account:15},{name:'Priya',account:16},{name:'Meenu',account:4},{name:'Kim',account:5},{name:'Ojas',account:6},{name:'Naina',account:7}],'231220121357187063':[{name:'Amy',account:11},{name:'Mohini',account:8},{name:'Eva',account:9},{name:'Nancy',account:10}],'191220121357187063':[{name:'Ria',account:14},{name:'Anu',account:12},{name:'Neha',account:13}],'240120121357187064':[{name:'Sia',account:17},{name:'Komal',account:18}],'240513115857792863':[{name:'Gary',account:19}]},
        username:{'191214150648429653':'Kim','231220121357187063':'Mohini','191220121357187063':'Ria','240120121357187064':'Komal','240513115857792863':'Gary'},
        usernames:[{'key':'191214150648429653','name':'Kim'},{'key':'231220121357187063','name':'Mohini'},{'key':'191220121357187063','name':'Ria'},{'key':'240120121357187064','name':'Komal'},{'key':'240513115857792863','name':'Garry'}],
        usernames2:[{'account':'191214150648429653','name':'Kim'},{'account':'231220121357187063','name':'Mohini'},{'account':'191220121357187063','name':'Ria'},{'account':'240120121357187064','name':'Komal'},{'account':'240513115857792863','name':'Garry'}],
        iipusernames2:[{'account':'240513115857792863','name':'Garry'},{'account':'191214201403624914','name':'Maya'}],       
        itaccounts: {'210401170743442923': [{ name: 'Tina', account: 20 },{ name: 'Isha', account: 21 },{ name: 'Urvashi', account: 22 },{ name: 'Emma', account: 23 }]},        countries: [{'key':'IN','value':'India','category':['Micro','Small','Large']},{'key':'US','value':'Australia','category':['Micro','Small','Large']}],
        countriescode: {
          "AF" :{"name" :"Afghanistan","code" :"AF","continent" :"Asia","url" :"afghanistan"},
          "OAPI" :{"name" :"OAPI","code" :"OAPI","continent" :"OAPI","url" :"oapi"},
          "EPO" :{"name" :"EPO","code" :"EPO","continent" :"EPO","url" :"epo"},
          "ARIPO" :{"name" :"ARIPO","code" :"ARIPO","continent" :"ARIPO","url" :"aripo"},
          "EAPO" :{"name" :"EAPO","code" :"EAPO","continent" :"EAPO","url" :"eapo"},
          "AL" :{"name" :"Albania","code" :"AL","continent" :"Europe","url" :"albania"},
          "DZ" :{"name" :"Algeria","code" :"DZ","continent" :"Africa","url" :"algeria"},
          "AG" :{"name" :"Antigua and Barbuda","code" :"AG","continent" :"North America","url" :"antigua-and-barbuda"},
          "AO" :{"name" :"Angola","code" :"AO","continent" :"Africa","url" :"angola"},
          "AM" :{"name" :"Armenia","code" :"AM","continent" :"Asia","url" :"armenia"},
          "AU" :{"name" :"Australia","code" :"AU","continent" :"Oceania","url" :"australia","top_country" :true},
          "AT" :{"name" :"Austria","code" :"AT","continent" :"Europe","url" :"austria"},
          "AZ" :{"name" :"Azerbaijan","code" :"AZ","continent" :"Asia","url" :"azerbaijan"},
          "BH" :{"name" :"Bahrain","code" :"BH","continent" :"Asia","url" :"bahrain"},
          "BB" :{"name" :"Barbados","code" :"BB","continent" :"North America","url" :"barbados"},
          "BD" :{"name" :"Bangladesh","code" :"BD","continent" :"Asia","url" :"bangladesh"},
          "BY" :{"name" :"Belarus","code" :"BY","continent" :"Europe","url" :"belarus"},
          "BE" :{"name" :"Belgium","code" :"BE","continent" :"Europe","url" :"belgium"},
          "BZ" :{"name" :"Belize","code" :"BZ","continent" :"North America","url" :"belize"},
          "BJ" :{"name" :"Benin","code" :"BJ","continent" :"Africa","url" :"benin"},
          "BT" :{"name" :"Bhutan","code" :"BT","continent" :"Asia","url" :"bhutan"},
          "BA" :{"name" :"Bosnia and Herzegovina","code" :"BA","continent" :"Europe","url" :"bosnia-and-herzegovina"},
          "BW" :{"name" :"Botswana","code" :"BW","continent" :"Africa","url" :"botswana"},
          "BR" :{"name" :"Brazil","code" :"BR","continent" :"South America","url" :"brazil","top_country" :true},
          "BN" :{"name" :"Brunei Darussalam","code" :"BN","continent" :"Asia","url" :"brunei-darussalam"},
          "BG" :{"name" :"Bulgaria","code" :"BG","continent" :"Europe","url" :"bulgaria"},
          "BF" :{"name" :"Burkina Faso","code" :"BF","continent" :"Africa","url" :"burkina-faso"},
          "CV" :{"name" :"Cabo Verde","code" :"CV","continent" :"Africa","url" :"cabo-verde"},
          "KH" :{"name" :"Cambodia","code" :"KH","continent" :"Asia","url" :"cambodia"},
          "CA" :{"name" :"Canada","code" :"CA","continent" :"North America","url" :"canada"},
          "CM" :{"name" :"Cameroon","code" :"CM","continent" :"Africa","url" :"cameroon"},
          "CF" :{"name" :"Central African Republic","code" :"CF","continent" :"Africa","url" :"central-african-republic"},
          "TD" :{"name" :"Chad","code" :"TD","continent" :"Africa","url" :"chad"},
          "CL" :{"name" :"Chile","code" :"CL","continent" :"South America","url" :"chile"},
          "CN" :{"name" :"China","code" :"CN","continent" :"Asia","url" :"china","top_country" :true},
          "CO" :{"name" :"Colombia","code" :"CO","continent" :"South America","url" :"colombia"},
          "CG" :{"name" :"Congo","code" :"CG","continent" :"Africa","url" :"congo"},
          "CI" :{"name" :"Cote d'Ivoire","code" :"CI","continent" :"Africa","url" :"cote-d-voire"},
          "KM" :{"name" :"Comoros","code" :"KM","continent" :"Africa","url" :"comoros"},
          "CR" :{"name" :"Costa Rica","code" :"CR","continent" :"North America","url" :"costa-rica"},
          "HR" :{"name" :"Croatia","code" :"HR","continent" :"Europe","url" :"croatia"},
          "CU" :{"name" :"Cuba","code" :"CU","continent" :"North America","url" :"cuba"},
          "CY" :{"name" :"Cyprus","code" :"CY","continent" :"Asia","url" :"cyprus"},
          "CZ" :{"name" :"Czechia","code" :"CZ","continent" :"Europe","url" :"czechia"},
          "DK" :{"name" :"Denmark","code" :"DK","continent" :"Europe","url" :"denmark"},
          "KP" :{"name" :"Democratic People's Republic of Korea","code" :"KP","continent" :"Asia","url" :"democratic-peoples-republic-of-korea"},
          "DJ" :{"name" :"Djibouti","code" :"DJ","continent" :"Africa","url" :"djibouti"},
          "DM" :{"name" :"Dominica","code" :"DM","continent" :"North America","url" :"dominica"},
          "DO" :{"name" :"Dominican Republic","code" :"DO","continent" :"North America","url" :"dominican-republic"},
          "EP" :{"name" :"Europe","code" :"EP","continent" :"EP","url" :"europe","top_country" :true},
          "EA" :{"name" :"Eurasia","code" :"EA","continent" :"EA","url" :"eurasia"},
          "EC" :{"name" :"Ecuador","code" :"EC","continent" :"South America","url" :"ecuador"},
          "EG" :{"name" :"Egypt","code" :"EG","continent" :"Africa","url" :"egypt"},
          "SV" :{"name" :"El Salvador","code" :"SV","continent" :"North America","url" :"el-salvador"},
          "GQ" :{"name" :"Equatorial Guinea","code" :"GQ","continent" :"Africa","url" :"equatorial-guinea"},
          "EE" :{"name" :"Estonia","code" :"EE","continent" :"Europe","url" :"estonia"},
          "SZ" :{"name" :"Eswatini","code" :"SZ","continent" :"Africa","url" :"eswatini"},
          "EU" :{"name" :"European Union","code" :"EU","continent" :"EU","url" :"european-union"},
          "FI" :{"name" :"Finland","code" :"FI","continent" :"Europe","url" :"finland"},
          "FR" :{"name" :"France","code" :"FR","continent" :"Europe","url" :"france"},
          "GM" :{"name" :"Gambia","code" :"GM","continent" :"Africa","url" :"gambia"},
          "GA" :{"name" :"Gabon","code" :"GA","continent" :"Africa","url" :"gabon"},
          "GE" :{"name" :"Georgia","code" :"GE","continent" :"Asia","url" :"georgia"},
          "DE" :{"name" :"Germany","code" :"DE","continent" :"Europe","url" :"germany","top_country" :true},
          "GH" :{"name" :"Ghana","code" :"GH","continent" :"Africa","url" :"ghana"},
          "GR" :{"name" :"Greece","code" :"GR","continent" :"Europe","url" :"greece"},
          "GD" :{"name" :"Grenada","code" :"GD","continent" :"North America","url" :"grenada"},
          "GN" :{"name" :"Guinea","code" :"GN","continent" :"Africa","url" :"guinea"},
          "GW" :{"name" :"Guinea-Bissau","code" :"GW","continent" :"Africa","url" :"guinea-bissau"},
          "GT" :{"name" :"Guatemala","code" :"GT","continent" :"North America","url" :"guatemala"},
          "HN" :{"name" :"Honduras","code" :"HN","continent" :"North America","url" :"honduras"},
          "HU" :{"name" :"Hungary","code" :"HU","continent" :"Europe","url" :"hungary"},
          "IS" :{"name" :"Iceland","code" :"IS","continent" :"Europe","url" :"iceland"},
          "IN" :{"name" :"India","code" :"IN","continent" :"Asia","url" :"india","top_country" :true},
          "ID" :{"name" :"Indonesia","code" :"ID","continent" :"Asia","url" :"indonesia"},
          "IR" :{"name" :"Iran","code" :"IR","continent" :"Asia","url" :"iran"},
          "IE" :{"name" :"Ireland","code" :"IE","continent" :"Europe","url" :"ireland"},
          "IQ" :{"name" :"Iraq","code" :"IQ","continent" :"Asia","url" :"iraq"},
          "IL" :{"name" :"Israel","code" :"IL","continent" :"Asia","url" :"israel"},
          "IT" :{"name" :"Italy","code" :"IT","continent" :"Europe","url" :"italy"},
          "JM" :{"name" :"Jamaica","code" :"JM","continent" :"North America","url" :"jamaica"},
          "JP" :{"name" :"Japan","code" :"JP","continent" :"Asia","url" :"japan","top_country" :true},
          "JO" :{"name" :"Jordan","code" :"JO","continent" :"Asia","url" :"jordan"},
          "KZ" :{"name" :"Kazakhstan","code" :"KZ","continent" :"Asia","url" :"kazakhstan"},
          "KW" :{"name" :"Kuwait","code" :"KW","continent" :"Asia","url" :"kuwait"},
          "KE" :{"name" :"Kenya","code" :"KE","continent" :"Africa","url" :"kenya"},
          "KG" :{"name" :"Kyrgyzstan","code" :"KG","continent" :"Asia","url" :"kyrgyzstan"},
          "HK" :{"name" :"Hong Kong","code" :"HK","continent" :"Asia","url" :"hong-kong"},
          "LA" :{"name" :"Lao People's Democratic Republic","code" :"LA","continent" :"Asia","url" :"lao-peoples-democratic-republic"},
          "LV" :{"name" :"Latvia","code" :"LV","continent" :"Europe","url" :"latvia"},
          "LS" :{"name" :"Lesotho","code" :"LS","continent" :"Africa","url" :"lesotho"},
          "LR" :{"name" :"Liberia","code" :"LR","continent" :"Africa","url" :"liberia"},
          "LI" :{"name" :"Liechtenstein","code" :"LI","continent" :"Europe","url" :"liechtenstein"},
          "LT" :{"name" :"Lithuania","code" :"LT","continent" :"Europe","url" :"lithuania"},
          "LY" :{"name" :"Libya","code" :"LY","continent" :"Africa","url" :"libya"},
          "LU" :{"name" :"Luxembourg","code" :"LU","continent" :"Europe","url" :"luxembourg"},
          "MG" :{"name" :"Madagascar","code" :"MG","continent" :"Africa","url" :"madagascar"},
          "MR" :{"name" :"Mauritania","code" :"MR","continent" :"Africa","url" :"mauritania"},
          "MT" :{"name" :"Malta","code" :"MT","continent" :"Europe","url" :"malta"},
          "MW" :{"name" :"Malawi","code" :"MW","continent" :"Africa","url" :"malawi"},
          "ML" :{"name" :"Mali","code" :"ML","continent" :"Africa","url" :"mali"},
          "MY" :{"name" :"Malaysia","code" :"MY","continent" :"Asia","url" :"malaysia"},
          "MU" :{"name" :"Mauritius","code" :"MU","continent" :"Africa","url" :"mauritius"},
          "MX" :{"name" :"Mexico","code" :"MX","continent" :"North America","url" :"mexico","top_country" :true},
          "MC" :{"name" :"Monaco","code" :"MC","continent" :"Europe","url" :"monaco"},
          "MN" :{"name" :"Mongolia","code" :"MN","continent" :"Asia","url" :"mongolia"},
          "ME" :{"name" :"Montenegro","code" :"ME","continent" :"Europe","url" :"montenegro"},
          "MA" :{"name" :"Morocco","code" :"MA","continent" :"Africa","url" :"morocco"},
          "MZ" :{"name" :"Mozambique","code" :"MZ","continent" :"Africa","url" :"mozambique"},
          "NA" :{"name" :"Namibia","code" :"NA","continent" :"Africa","url" :"namibia"},
          "NE" :{"name" :"Niger","code" :"NE","continent" :"Africa","url" :"niger"},
          "NG" :{"name" :"Nigeria","code" :"NG","continent" :"Africa","url" :"nigeria"},
          "NI" :{"name" :"Nicaragua","code" :"NI","continent" :"North America","url" :"nicaragua"},
          "NL" :{"name" :"Netherlands","code" :"NL","continent" :"Europe","url" :"netherlands"},
          "NZ" :{"name" :"New Zealand","code" :"NZ","continent" :"Oceania","url" :"new-zealand","top_country" :true},
          "MK" :{"name" :"North Macedonia","code" :"MK","continent" :"Europe","url" :"north-macedonia"},
          "NO" :{"name" :"Norway","code" :"NO","continent" :"Europe","url" :"norway"},
          "OM" :{"name" :"Oman","code" :"OM","continent" :"Asia","url" :"oman"},
          "PK" :{"name" :"Pakistan","code" :"PK","continent" :"Asia","url" :"pakistan"},
          "PA" :{"name" :"Panama","code" :"PA","continent" :"North America","url" :"panama"},
          "PG" :{"name" :"Papua New Guinea","code" :"PG","continent" :"Oceania","url" :"papua-new-guinea"},
          "PE" :{"name" :"Peru","code" :"PE","continent" :"South America","url" :"peru"},
          "PH" :{"name" :"Philippines","code" :"PH","continent" :"Asia","url" :"philippines"},
          "PL" :{"name" :"Poland","code" :"PL","continent" :"Europe","url" :"poland"},
          "PT" :{"name" :"Portugal","code" :"PT","continent" :"Europe","url" :"portugal"},
          "QA" :{"name" :"Qatar","code" :"QA","continent" :"Asia","url" :"qatar"},
          "MD" :{"name" :"Republic of Moldova","code" :"MD","continent" :"Europe","url" :"republic-of-moldova"},
          "RO" :{"name" :"Romania","code" :"RO","continent" :"Europe","url" :"romania","top_country" :true},
          "RU" :{"name" :"Russia","code" :"RU","continent" :"Asia","url" :"russia"},
          "RW" :{"name" :"Rwanda","code" :"RW","continent" :"Africa","url" :"rwanda"},
          "WS" :{"name" :"Samoa","code" :"WS","continent" :"Oceania","url" :"samoa"},
          "SM" :{"name" :"San Marino","code" :"SM","continent" :"Europe","url" :"san-marino"},
          "ST" :{"name" :"Sao Tome and Principe","code" :"ST","continent" :"Africa","url" :"sao-tome-and-principe"},
          "KN" :{"name" :"Saint Kitts and Nevis","code" :"KN","continent" :"North America","url" :"saint-kitts-and-nevis"},
          "LC" :{"name" :"Saint Lucia","code" :"LC","continent" :"North America","url" :"saint-lucia"},
          "VC" :{"name" :"Saint Vincent and the Grenadines","code" :"VC","continent" :"North America","url" :"saint-vincent-and-the-grenadines"},
          "SA" :{"name" :"Saudi Arabia","code" :"SA","continent" :"Asia","url" :"saudi-arabia"},
          "RS" :{"name" :"Serbia","code" :"RS","continent" :"Europe","url" :"serbia"},
          "SC" :{"name" :"Seychelles","code" :"SC","continent" :"Africa","url" :"seychelles"},
          "SN" :{"name" :"Senegal","code" :"SN","continent" :"Africa","url" :"senegal"},
          "SL" :{"name" :"Sierra Leone","code" :"SL","continent" :"Africa","url" :"sierra-leone"},
          "SG" :{"name" :"Singapore","code" :"SG","continent" :"Asia","url" :"singapore","top_country" :true},
          "SK" :{"name" :"Slovakia","code" :"SK","continent" :"Europe","url" :"slovakia"},
          "SI" :{"name" :"Slovenia","code" :"SI","continent" :"Europe","url" :"slovenia"},
          "ES" :{"name" :"Spain","code" :"ES","continent" :"Europe","url" :"spain"},
          "KR" :{"name" :"South Korea","code" :"KR","continent" :"Asia","url" :"south-korea","top_country" :true},
          "ZA" :{"name" :"South Africa","code" :"ZA","continent" :"Africa","url" :"south-africa"},
          "LK" :{"name" :"Sri Lanka","code" :"LK","continent" :"Asia","url" :"sri-lanka"},
          "SD" :{"name" :"Sudan","code" :"SD","continent" :"Africa","url" :"sudan"},
          "SE" :{"name" :"Sweden","code" :"SE","continent" :"Europe","url" :"sweden"},
          "CH" :{"name" :"Switzerland","code" :"CH","continent" :"Europe","url" :"switzerland"},
          "SY" :{"name" :"Syria","code" :"SY","continent" :"Asia","url" :"syria"},
          "TJ" :{"name" :"Tajikistan","code" :"TJ","continent" :"Asia","url" :"tajikistan"},
          "TZ" :{"name" :"United Republic of Tanzania","code" :"TZ","continent" :"Africa","url" :"united-republic-of-tanzania"},
          "TH" :{"name" :"Thailand","code" :"TH","continent" :"Asia","url" :"thailand","top_country" :true},
          "TT" :{"name" :"Trinidad and Tobago","code" :"TT","continent" :"North America","url" :"trinidad-and-tobago"},
          "TG" :{"name" :"Togo","code" :"TG","continent" :"Africa","url" :"togo"},
          "TN" :{"name" :"Tunisia","code" :"TN","continent" :"Africa","url" :"tunisia"},
          "TR" :{"name" :"Turkey","code" :"TR","continent" :"Asia","url" :"turkey"},
          "TM" :{"name" :"Turkmenistan","code" :"TM","continent" :"Asia","url" :"turkmenistan"},
          "UG" :{"name" :"Uganda","code" :"UG","continent" :"Africa","url" :"uganda"},
          "UA" :{"name" :"Ukraine","code" :"UA","continent" :"Europe","url" :"ukraine"},
          "AE" :{"name" :"United Arab Emirates","code" :"AE","continent" :"Asia","url" :"united-arab-emirates","top_country" :true},
          "GB" :{"name" :"United Kingdom","code" :"GB","continent" :"Europe","url" :"united-kingdom","top_country" :true},
          "US" :{"name" :"United States of America","code" :"US","continent" :"North America","url" :"united-states","top_country" :true},
          "UZ" :{"name" :"Uzbekistan","code" :"UZ","continent" :"Asia","url" :"uzbekistan"},
          "VN" :{"name" :"Vietnam","code" :"VN","continent" :"Asia","url" :"vietnam","top_country" :true},
          "ZM" :{"name" :"Zambia","code" :"ZM","continent" :"Africa","url" :"zambia"},
          "ZW" :{"name" :"Zimbabwe","code" :"ZW","continent" :"Africa","url" :"zimbabwe"}
        },
        continent_country:[{
          "Regional":[
            {"name":"EAPO", "code":"EAPO", "continent":"Regional", "url":"eapo","top_country":false},
            {"name":"EPO", "code":"EPO", "continent":"Regional", "url":"epo","top_country":false},
            {"name":"ARIPO", "code":"ARIPO", "continent":"Regional", "url":"aripo"},
            {"name":"OAPI", "code":"OAPI", "continent":"Regional", "url":"oapi"}
        ]},
          {"Asia":[
                  {"name":"Armenia", "code":"AM", "continent":"Asia", "url":"armenia"},
                  {"name":"Azerbaijan", "code":"AZ", "continent":"Asia", "url":"azerbaijan"},
                  {"name":"Bahrain", "code":"BH", "continent":"Asia", "url":"bahrain"},
                  {"name":"Brunei Darussalam", "code":"BN", "continent":"Asia", "url":"brunei-darussalam"},
                  {"name":"Cambodia", "code":"KH", "continent":"Asia", "url":"cambodia"},
                  {"name":"China", "code":"CN", "continent":"Asia", "url":"china","top_country":true},
                  {"name":"Cyprus", "code":"CY", "continent":"Asia", "url":"cyprus"},
                  {"name":"Democratic People's Republic of Korea", "code":"KP", "continent":"Asia", "url":"democratic-peoples-republic-of-korea"},
                  {"name":"Georgia", "code":"GE", "continent":"Asia", "url":"georgia"},
                  {"name":"India", "code":"IN", "continent":"Asia", "url":"india","top_country":true},
                  {"name":"Indonesia", "code":"ID", "continent":"Asia", "url":"indonesia"},
                  {"name":"Iran", "code":"IR", "continent":"Asia", "url":"iran"},
                  {"name":"Iraq", "code":"IQ", "continent":"Asia", "url":"iraq"},
                  {"name":"Israel", "code":"IL", "continent":"Asia", "url":"israel"},
                  {"name":"Japan", "code":"JP", "continent":"Asia", "url":"japan","top_country":true},
                  {"name":"Jordan", "code":"JO", "continent":"Asia", "url":"jordan"},
                  {"name":"Kazakhstan", "code":"KZ", "continent":"Asia", "url":"kazakhstan"},
                  {"name":"Kuwait", "code":"KW", "continent":"Asia", "url":"kuwait"},
                  {"name":"Kyrgyzstan", "code":"KG", "continent":"Asia", "url":"kyrgyzstan"},
                  {"name":"Lao People's Democratic Republic", "code":"LA", "continent":"Asia", "url":"lao-peoples-democratic-republic"},
                  {"name":"Malaysia", "code":"MY", "continent":"Asia", "url":"malaysia"},
                  {"name":"Mongolia", "code":"MN", "continent":"Asia", "url":"mongolia"},
                  {"name":"Oman", "code":"OM", "continent":"Asia", "url":"oman"},
                  {"name":"Philippines", "code":"PH", "continent":"Asia", "url":"philippines"},
                  {"name":"Qatar", "code":"QA", "continent":"Asia", "url":"qatar"},
                  {"name":"South Korea", "code":"KR", "continent":"Asia", "url":"south-korea","top_country":true},
                  {"name":"Russia", "code":"RU", "continent":"Asia", "url":"russia"},
                  {"name":"Saudi Arabia", "code":"SA", "continent":"Asia", "url":"saudi-arabia"},
                  {"name":"Singapore", "code":"SG", "continent":"Asia", "url":"singapore","top_country":true},
                  {"name":"Sri Lanka", "code":"LK", "continent":"Asia", "url":"sri-lanka"},
                  {"name":"Syria", "code":"SY", "continent":"Asia", "url":"syria"},
                  {"name":"Tajikistan", "code":"TJ", "continent":"Asia", "url":"tajikistan"},
                  {"name":"Thailand", "code":"TH", "continent":"Asia", "url":"thailand","top_country":true},
                  {"name":"Turkmenistan", "code":"TM", "continent":"Asia", "url":"turkmenistan"},
                  {"name":"Turkey", "code":"TR", "continent":"Asia", "url":"turkey"},
                  {"name":"United Arab Emirates", "code":"AE", "continent":"Asia", "url":"united-arab-emirates","top_country":true},
                  {"name":"Uzbekistan", "code":"UZ", "continent":"Asia", "url":"uzbekistan"},
                  {"name":"Vietnam", "code":"VN", "continent":"Asia", "url":"vietnam","top_country":true}
          ]},
              {"Europe":[
                  {"name":"Albania", "code":"AL", "continent":"Europe", "url":"albania"},
                  {"name":"Austria", "code":"AT", "continent":"Europe", "url":"austria"},
                  {"name":"Belarus", "code":"BY", "continent":"Europe", "url":"belarus"},
                  {"name":"Belgium", "code":"BE", "continent":"Europe", "url":"belgium"},
                  {"name":"Bosnia and Herzegovina", "code":"BA", "continent":"Europe", "url":"bosnia-and-herzegovina"},
                  {"name":"Bulgaria", "code":"BG", "continent":"Europe", "url":"bulgaria"},
                  {"name":"Croatia", "code":"HR", "continent":"Europe", "url":"croatia"},
                  {"name":"Czechia", "code":"CZ", "continent":"Europe", "url":"czechia"},
                  {"name":"Denmark", "code":"DK", "continent":"Europe", "url":"denmark"},
                  {"name":"Estonia", "code":"EE", "continent":"Europe", "url":"estonia"},
                  {"name":"Finland", "code":"FI", "continent":"Europe", "url":"finland"},
                  {"name":"France", "code":"FR", "continent":"Europe", "url":"france"},
                  {"name":"Germany", "code":"DE", "continent":"Europe", "url":"germany","top_country":true},
                  {"name":"Greece", "code":"GR", "continent":"Europe", "url":"greece"},
                  {"name":"Hungary", "code":"HU", "continent":"Europe", "url":"hungary"},
                  {"name":"Iceland", "code":"IS", "continent":"Europe", "url":"iceland"},
                  {"name":"Ireland", "code":"IE", "continent":"Europe", "url":"ireland"},
                  {"name":"Italy", "code":"IT", "continent":"Europe", "url":"italy"},
                  {"name":"Latvia", "code":"LV", "continent":"Europe", "url":"latvia"},
                  {"name":"Liechtenstein", "code":"LI", "continent":"Europe", "url":"liechtenstein"},
                  {"name":"Lithuania", "code":"LT", "continent":"Europe", "url":"lithuania"},
                  {"name":"Luxembourg", "code":"LU", "continent":"Europe", "url":"luxembourg"},
                  {"name":"Malta", "code":"MT", "continent":"Europe", "url":"malta"},
                  {"name":"Monaco", "code":"MC", "continent":"Europe", "url":"monaco"},
                  {"name":"Montenegro", "code":"ME", "continent":"Europe", "url":"montenegro"},
                  {"name":"Netherlands", "code":"NL", "continent":"Europe", "url":"netherlands"},
                  {"name":"North Macedonia", "code":"MK", "continent":"Europe", "url":"north-macedonia"},
                  {"name":"Norway", "code":"NO", "continent":"Europe", "url":"norway"},
                  {"name":"Poland", "code":"PL", "continent":"Europe", "url":"poland"},
                  {"name":"Portugal", "code":"PT", "continent":"Europe", "url":"portugal"},
                  {"name":"Republic of Moldova", "code":"MD", "continent":"Europe", "url":"republic-of-moldova"},
                  {"name":"Romania", "code":"RO", "continent":"Europe", "url":"romania","top_country":true},
                  {"name":"San Marino", "code":"SM", "continent":"Europe", "url":"san-marino"},
                  {"name":"Serbia", "code":"RS", "continent":"Europe", "url":"serbia"},
                  {"name":"Slovakia", "code":"SK", "continent":"Europe", "url":"slovakia"},
                  {"name":"Slovenia", "code":"SI", "continent":"Europe", "url":"slovenia"},
                  {"name":"Spain", "code":"ES", "continent":"Europe", "url":"spain"},
                  {"name":"Sweden", "code":"SE", "continent":"Europe", "url":"sweden"},
                  {"name":"Switzerland", "code":"CH", "continent":"Europe", "url":"switzerland"},
                  {"name":"Ukraine", "code":"UA", "continent":"Europe", "url":"ukraine"},
                  {"name":"United Kingdom", "code":"GB", "continent":"Europe", "url":"united-kingdom","top_country":true}
              ]},
              {"Africa":[
                  {"name":"Algeria", "code":"DZ", "continent":"Africa", "url":"algeria"},
                  {"name":"Angola", "code":"AO", "continent":"Africa", "url":"angola"},
                  {"name":"Benin", "code":"BJ", "continent":"Africa", "url":"benin"},
                  {"name":"Botswana", "code":"BW", "continent":"Africa", "url":"botswana"},
                  {"name":"Burkina Faso", "code":"BF", "continent":"Africa", "url":"burkina-faso"},
                  {"name":"Cabo Verde", "code":"CV", "continent":"Africa", "url":"cabo-verde"},
                  {"name":"Cameroon", "code":"CM", "continent":"Africa", "url":"cameroon"},
                  {"name":"Central African Republic", "code":"CF", "continent":"Africa", "url":"central-african-republic"},
                  {"name":"Chad", "code":"TD", "continent":"Africa", "url":"chad"},
                  {"name":"Comoros", "code":"KM", "continent":"Africa", "url":"comoros"},
                  {"name":"Congo", "code":"CG", "continent":"Africa", "url":"congo"},
                  {"name":"C么te d鈥橧voire", "code":"CI", "continent":"Africa", "url":"cote-d-voire"},
                  {"name":"Djibouti", "code":"DJ", "continent":"Africa", "url":"djibouti"},
                  {"name":"Egypt", "code":"EG", "continent":"Africa", "url":"egypt"},
                  {"name":"Equatorial Guinea", "code":"GQ", "continent":"Africa", "url":"equatorial-guinea"},
                  {"name":"Eswatini", "code":"SZ", "continent":"Africa", "url":"eswatini"},
                  {"name":"Gabon", "code":"GA", "continent":"Africa", "url":"gabon"},
                  {"name":"Gambia", "code":"GM", "continent":"Africa", "url":"gambia"},
                  {"name":"Ghana", "code":"GH", "continent":"Africa", "url":"ghana"},
                  {"name":"Guinea", "code":"GN", "continent":"Africa", "url":"guinea"},
                  {"name":"Guinea-Bissau", "code":"GW", "continent":"Africa", "url":"guinea-bissau"},
                  {"name":"Kenya", "code":"KE", "continent":"Africa", "url":"kenya"},
                  {"name":"Lesotho", "code":"LS", "continent":"Africa", "url":"lesotho"},
                  {"name":"Liberia", "code":"LR", "continent":"Africa", "url":"liberia"},
                  {"name":"Libya", "code":"LY", "continent":"Africa", "url":"libya"},
                  {"name":"Madagascar", "code":"MG", "continent":"Africa", "url":"madagascar"},
                  {"name":"Malawi", "code":"MW", "continent":"Africa", "url":"malawi"},
                  {"name":"Mali", "code":"ML", "continent":"Africa", "url":"mali"},
                  {"name":"Mauritania", "code":"MR", "continent":"Africa", "url":"mauritania"},
                  {"name":"Mauritius", "code":"MU", "continent":"Africa", "url":"mauritius"},
                  {"name":"Morocco", "code":"MA", "continent":"Africa", "url":"morocco"},
                  {"name":"Mozambique", "code":"MZ", "continent":"Africa", "url":"mozambique"},
                  {"name":"Namibia", "code":"NA", "continent":"Africa", "url":"namibia"},
                  {"name":"Niger", "code":"NE", "continent":"Africa", "url":"niger"},
                  {"name":"Nigeria", "code":"NG", "continent":"Africa", "url":"nigeria"},
                  {"name":"Rwanda", "code":"RW", "continent":"Africa", "url":"rwanda"},
                  {"name":"Sao Tome and Principe", "code":"ST", "continent":"Africa", "url":"sao-tome-and-principe"},
                  {"name":"Senegal", "code":"SN", "continent":"Africa", "url":"senegal"},
                  {"name":"Seychelles", "code":"SC", "continent":"Africa", "url":"seychelles"},
                  {"name":"Sierra Leone", "code":"SL", "continent":"Africa", "url":"sierra-leone"},
                  {"name":"South Africa", "code":"ZA", "continent":"Africa", "url":"south-africa"},
                  {"name":"Sudan", "code":"SD", "continent":"Africa", "url":"sudan"},
                  {"name":"Togo", "code":"TG", "continent":"Africa", "url":"togo"},
                  {"name":"Tunisia", "code":"TN", "continent":"Africa", "url":"tunisia"},
                  {"name":"Uganda", "code":"UG", "continent":"Africa", "url":"uganda"},
                  {"name":"United Republic of Tanzania", "code":"TZ", "continent":"Africa", "url":"united-republic-of-tanzania"},
                  {"name":"Zambia", "code":"ZM", "continent":"Africa", "url":"zambia"},
                  {"name":"Zimbabwe", "code":"ZW", "continent":"Africa", "url":"zimbabwe"}
              ]},
              {"America":[
                  {"name":"Antigua and Barbuda", "code":"AG", "continent":"North America", "url":"antigua-and-barbuda"},
                  {"name":"Barbados", "code":"BB", "continent":"North America", "url":"barbados"},
                  {"name":"Belize", "code":"BZ", "continent":"North America", "url":"belize"},
                  {"name":"Canada", "code":"CA", "continent":"North America", "url":"canada"},
                  {"name":"Costa Rica", "code":"CR", "continent":"North America", "url":"costa-rica"},
                  {"name":"Cuba", "code":"CU", "continent":"North America", "url":"cuba"},
                  {"name":"Dominica", "code":"DM", "continent":"North America", "url":"dominica"},
                  {"name":"Dominican Republic", "code":"DO", "continent":"North America", "url":"dominican-republic"},
                  {"name":"El Salvador", "code":"SV", "continent":"North America", "url":"el-salvador"},
                  {"name":"Grenada", "code":"GD", "continent":"North America", "url":"grenada"},
                  {"name":"Guatemala", "code":"GT", "continent":"North America", "url":"guatemala"},
                  {"name":"Honduras", "code":"HN", "continent":"North America", "url":"honduras"},
                  {"name":"Jamaica", "code":"JM", "continent":"North America", "url":"jamaica"},
                  {"name":"Mexico", "code":"MX", "continent":"North America", "url":"mexico","top_country":true},
                  {"name":"Nicaragua", "code":"NI", "continent":"North America", "url":"nicaragua"},
                  {"name":"Panama", "code":"PA", "continent":"North America", "url":"panama"},
                  {"name":"Saint Kitts and Nevis", "code":"KN", "continent":"North America", "url":"saint-kitts-and-nevis"},
                  {"name":"Saint Lucia", "code":"LC", "continent":"North America", "url":"saint-lucia"},
                  {"name":"Saint Vincent and the Grenadines", "code":"VC", "continent":"North America", "url":"saint-vincent-and-the-grenadines"},
                  {"name":"Trinidad and Tobago", "code":"TT", "continent":"North America", "url":"trinidad-and-tobago"},
                  {"name":"United States of America", "code":"US", "continent":"North America", "url":"united-states","top_country":true},
                  {"name":"Brazil", "code":"BR", "continent":"South America", "url":"brazil","top_country":true},
                  {"name":"Chile", "code":"CL", "continent":"South America", "url":"chile"},
                  {"name":"Colombia", "code":"CO", "continent":"South America", "url":"colombia"},
                  {"name":"Ecuador", "code":"EC", "continent":"South America", "url":"ecuador"},
                  {"name":"Peru", "code":"PE", "continent":"South America", "url":"peru"}
              ]},
              {"Oceania":[
                  {"name":"Australia", "code":"AU", "continent":"Oceania", "url":"australia","top_country":true},
                  {"name":"New Zealand", "code":"NZ", "continent":"Oceania", "url":"new-zealand","top_country":true},
                  {"name":"Papua New Guinea", "code":"PG", "continent":"Oceania", "url":"papua-new-guinea"},
                  {"name":"Samoa", "code":"WS", "continent":"Oceania", "url":"samoa"}
              ]}
            ]
};
const tablesetting = {
  countred:function(email,numbermatch,d)
{
    return (d.filter((e1)=>{return e1[numbermatch].trim()===email}).length>=2 ? true : false);
},
itreturndata:function(collection,value,key)
{
  value=(value!='' && value !=null ? value: '');
  value = typeof(value)=='number' ? value.toString() : value.toLowerCase();

let t=-1;
    for(let i=0;i<collection.length;i++)
    {
     
        if(key=='emailtype' || key=='calltype')
        {
            if(value==collection[i])
    {
       t= 0;
    } 
        }
        else
        {
    if(value.indexOf(collection[i])>-1)
    {
       t= 0;
       
    }
    else if(collection[i]=='_blank' && value=='')
    {
       t= 0;
    }
    else if(collection[i]=='!n/a' && value!='n/a')
    {
       t= 0;
       
    }
    else if(collection[i].indexOf('!')>-1 && value!=collection[i].split('!')[1])
    {
       t= 0;
       
    }
    }
}

    return t;
}
,
returndata: function(collection,value,key)
{
  value=(value!='' && value !=null ? value: '');
  value = typeof(value)=='number' ? value.toString() : value.toLowerCase();

let t=-1;
    for(let i=0;i<collection.length;i++)
    {
     
      collection[i] = (collection[i]=='_blank' && key=='23' ? '' : collection[i]);
        if(key==23 || key==24 || key==9 || key==3)
        {
            if(value==collection[i])
    {
       t= 0;
    } 
        }
        else if(key==5 && collection[i]=='<' && moment().format('YYYY-MM-DD')<=moment(value).format('YYYY-MM-DD'))
        {

          t= 0;
        }
        else
        {
    if(value.indexOf(collection[i])>-1)
    {
       t= 0;
       
    }
    else if(collection[i]=='_blank' && value=='')
    {
       t= 0;
    }
    else if(collection[i]=='!n/a' && value!='n/a')
    {
       t= 0;
       
    }
    else if(collection[i].indexOf('!')>-1 && value!=collection[i].split('!')[1])
    {
       t= 0;
       
    }
    }
}

    return t;
}
}
const costs ={
    standardcall:function(standard,c,as) {
      as=as.toLowerCase();
        return standard[c].hasOwnProperty(as) ? standard[c]['small'] : standard[c]['other'];
    },
    roundup :function(number,num_digit)
    {
    let n = number.toString().split('.')[0].split('');
    let g =n.slice(0,num_digit).join('');
    g =g+''+(parseInt(n[g.length])+1);
    let zero= '0'.repeat(n.length-g.length);
    return parseInt(g)+zero;
    },
    pagerouncall:function(info)
    {
        let cost=0;
        let {pages,pageslimit,roundcall} = info;
        if(roundcall)
        {
            cost=Math.round((pages-pageslimit)/50);
        }
        else
        {
            cost=pages-pageslimit
        }
        return cost;
    },
    pagescall:function(info) {
        let ocosts=0;
        let {as,pages,smallcost,largecost,pageslimit,ci} = info;
        as=as.toLowerCase();
        if(as=='')
        {
            if(pages>pageslimit)
            {
              ocosts=ocosts+smallcost*(costs.pagerouncall(info));
            }
        }
        else if(as=="small")
        {
          if(pages>pageslimit)
          {
            ocosts=ocosts+smallcost*(costs.pagerouncall(info));
          }
        }
        else
        {
          if(pages>pageslimit)
          {
            ocosts=ocosts+largecost*(costs.pagerouncall(info));
          }
        }
        return ocosts;
    },
    claimcall:function(info) {
        let ocosts=0;
        let {as,claim,smallcost,largecost,claimlimit,claimlimittwo,claimlimittwocost} = info;
        as=as.toLowerCase();
        if(as=='')
        {
            if(claim>claimlimit)
            {
              ocosts=ocosts+smallcost*(claim-claimlimit);
              if(claimlimittwo && claim>claimlimittwo)
              {
                ocosts=ocosts+claimlimittwocost*(claim-claimlimittwo);
              }
            }
        }
        else if(as=="small")
        {
          if(claim>claimlimit)
          {
            ocosts=ocosts+smallcost*(claim-claimlimit);
            if(claimlimittwo)
              {
                ocosts=ocosts+claimlimittwocost*(claim-claimlimittwo);
              }
          }
        }
        else
        {
          if(claim>claimlimit)
          {
            ocosts=ocosts+largecost*(claim-claimlimit);
            if(claimlimittwo)
              {
                ocosts=ocosts+claimlimittwocost*(claim-claimlimittwo);
              }
          }
        }
        return ocosts;
    },
    prioritycall:function(info) {
        let ocosts=0;
        let {as,priority,smallcost,largecost,prioritylimit} = info;
        as=as.toLowerCase();
        if(as=='')
        {
            if(priority>1)
            {
              ocosts=ocosts+smallcost*(priority-prioritylimit);
            }
        }
        else if(as=="small")
      {
        if(priority>1)
        {
          ocosts=ocosts+smallcost*(priority-prioritylimit);
        }
      }
      else
      {
        if(priority>1)
        {
          ocosts=ocosts+largecost*(priority-prioritylimit);
        }
      }
      return ocosts;
    },
    isacall:function(info) {
        let ocosts=0;
        let {as,isa,smallcost,largecost,c} = info;
        as=as.toLowerCase();
        if(as=='')
        {
            if(isa!=c)
            {
              ocosts=ocosts+smallcost;
            }
        }
        else if(as=="small")
      {
        if(isa!=c)
        {
          ocosts=ocosts+smallcost;
        }
      }
      else
      {
        if(isa!=c)
        {
          ocosts=ocosts+largecost;
        }
      }
      return ocosts;
    },
    examination: function(info)
    {
      let {as} =info;
      as=as.toLowerCase();
      let ocosts=120;
      if(as=='small')
      {
        ocosts =ocosts+55;
      }
      else
      {
        ocosts =ocosts+240;
      }
      return ocosts;
    },
    IN:function()
    {
        if(this.ci=='Individual')
        {
          return costs.standardcall(this.standard,this.c,this.as) + costs.examination({'as':this.as}) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':3,'largecost':12,'pageslimit':30}) + costs.claimcall({'as':this.as,'claim':this.claim,'smallcost':5,'largecost':22,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':22,'largecost':110,'prioritylimit':1}) + costs.standardcall({'IN':{'Small':300,'other':400}},this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':3,'largecost':5,'pageslimit':30}) + costs.claimcall({'as':this.as,'claim':this.claim,'smallcost':7,'largecost':10,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':30,'largecost':50,'prioritylimit':1});
        }
        else
        {
          return costs.standardcall(this.standard,this.c,this.as) + costs.examination({'as':this.as}) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':3,'largecost':12,'pageslimit':30}) + costs.claimcall({'as':this.as,'claim':this.claim,'smallcost':5,'largecost':22,'claimlimit':10}) + costs.prioritycall({'as':this.as,'priority':this.priority,'smallcost':22,'largecost':110,'prioritylimit':1}) + costs.standardcall({'IN':{'Small':400,'other':500}},this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':3,'largecost':5,'pageslimit':30}) + costs.claimcall({'as':this.as,'claim':this.claim,'smallcost':7,'largecost':10,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':30,'largecost':55,'prioritylimit':1});

        }
    },
    CA:function()
    {
        return costs.standardcall(this.standard,this.c,this.as);
    },
    CN:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':'','pages':this.pages,'smallcost':10,'largecost':0,'pageslimit':30}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':30,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':30,'largecost':0,'prioritylimit':10});
    },
    JP:function()
    {
        return costs.standardcall(this.standard,this.c,this.as);// + costs.pagescall({'as':'','pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':30}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':30,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':30,'largecost':0,'prioritylimit':10});
    },
    AU:function()
    {
        return costs.standardcall(this.standard,this.c,this.as);// + costs.pagescall({'as':'','pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':30}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':30,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':30,'largecost':0,'prioritylimit':10});
    },
    BR:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':'','pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':30}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':30,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':50,'largecost':0,'prioritylimit':1});
    },
    US:function()
    {
     return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':200,'largecost':400,'pageslimit':100,'roundcall':true}) + costs.claimcall({'as':this.as,'claim':this.claim,'smallcost':40,'largecost':80,'claimlimit':20}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':0,'largecost':0,'prioritylimit':0}) + costs.isacall({'as':this.as,'isa':this.isa,'smallcost':600,'largecost':1200,'c':this.c});

    },
    KR:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':'','pages':0,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':0,'smallcost':0,'largecost':0,'claimlimit':0}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':80,'largecost':0,'prioritylimit':1});
    },
    EP:function()
    {
      //ROUNDUP(1.12*(715+700+400+1825+IF(R3407<36,0,15*(R3407-35))+IF(S3407<16,0,IF(S3407<51,235*(S3407-15),8225+580*(S3407-50)))+IF(T3407<2,0,100*(T3407-1)))+IF(V3407="EP",0,1456),-1)
        return costs.roundup(1.12 * (costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':'','pages':this.pages,'smallcost':15,'largecost':0,'pageslimit':35}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':235,'largecost':0,'claimlimit':15,'claimlimittwo':50,'claimlimittwocost':580}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':100,'largecost':0,'prioritylimit':1})) + costs.isacall({'as':'','isa':this.isa,'smallcost':1456,'largecost':0,'c':this.c}),-2);
    },
    RU:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':7,'largecost':0,'claimlimit':25}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':0,'largecost':0,'prioritylimit':0});
    },
    MX:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':15,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':200,'largecost':0,'prioritylimit':1});
    },
    MY:function()
    { 
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':20,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':100,'largecost':0,'prioritylimit':1});
    },
    PH:function()
    {
      return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':'','pages':this.pages,'smallcost':10,'largecost':0,'pageslimit':30}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':20,'largecost':0,'claimlimit':5}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':200,'largecost':0,'prioritylimit':1});
    },
    TH:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':0,'largecost':0,'claimlimit':0}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':150,'largecost':0,'prioritylimit':1});
    },
    ID:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':15,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':0,'largecost':0,'prioritylimit':0});
    },
    NZ:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':0,'largecost':0,'claimlimit':0}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':0,'largecost':0,'prioritylimit':0});
    },
    ZA:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':0,'largecost':0,'claimlimit':0}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':50,'largecost':0,'prioritylimit':1});
    },
    VN:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':'','pages':this.pages,'smallcost':2,'largecost':0,'pageslimit':5}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':0,'largecost':0,'claimlimit':0}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':0,'largecost':0,'prioritylimit':0});
    },
    SG:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':0,'largecost':0,'claimlimit':0}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':100,'largecost':0,'prioritylimit':1});
    },
    CO:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':0}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':20,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':100,'largecost':0,'prioritylimit':1});
    }
}
const API_URL = "https://www.anuation.com/oldcrm/";
let axiosConfig = { 'content-type': 'application/x-www-form-urlencoded' };
export { callstatus, emailstatus,costs,standard,tablesetting,defaultvalue,API_URL,axiosConfig};