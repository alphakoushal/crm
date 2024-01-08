const callstatus={'1':'NI','2':'lb','3':'Voice mail','4':'Invalid no','5':'Email sent','6':'Cb','7':'Ringing','8':'Dnc','9':'Other'};
const emailstatus = {'1':'Pipeline','2':'Failed','3':'Rejection','4':'Reciprocity','5':'Ooo','6':'Converted','7':'Response','8':'Dnc','9':'Dupe','10':'Exhausted','11':'Other','12':'Email Sent'};
const standard={'IN':{'Small':22,'other':110},'CA':{'Small':1160,'other':1320},'CN':{'other':1210},'JP':{'other':1340},'AU':{'other':1300},'BR':{'other':1200},'US':{'Small':1240,'other':1380},'KR':{'other':1080},'EP':{'other':715+700+400+1825},'RU':{'other':1130},'MX':{'other':1630},'MY':{'other':900},'PH':{'other':800},'TH':{'other':900},'ID':{'other':850},'NZ':{'other':1200},'ZA':{'other':900},'VN':{'other':655},'SG':{'other':1100},'CO':{'other':1650}};

const costs ={
    standardcall:function(standard,c,as) {
        return standard[c].hasOwnProperty(as) ? standard[c]['Small'] : standard[c]['other'];
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
        if(as=='')
        {
            if(pages>pageslimit)
            {
              ocosts=ocosts+smallcost*(costs.pagerouncall(info));
            }
        }
        else if(as=="Small")
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
        else if(as=="Small")
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
        if(as=='')
        {
            if(priority>1)
            {
              ocosts=ocosts+smallcost*(priority-prioritylimit);
            }
        }
        else if(as=="Small")
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
        if(as=='')
        {
            if(isa!=c)
            {
              ocosts=ocosts+smallcost;
            }
        }
        else if(as=="Small")
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
    IN:function()
    {
        if(this.ci=='Individual')
        {
          return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':3,'largecost':12,'pageslimit':30}) + costs.claimcall({'as':this.as,'claim':this.claim,'smallcost':5,'largecost':22,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':22,'largecost':110,'prioritylimit':1}) + costs.standardcall({'IN':{'Small':300,'other':400}},this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':3,'largecost':5,'pageslimit':30}) + costs.claimcall({'as':this.as,'claim':this.claim,'smallcost':7,'largecost':10,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':30,'largecost':50,'prioritylimit':1});
        }
        else
        {
          return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':3,'largecost':12,'pageslimit':30}) + costs.claimcall({'as':this.as,'claim':this.claim,'smallcost':5,'largecost':22,'claimlimit':10}) + costs.prioritycall({'as':this.as,'priority':this.priority,'smallcost':22,'largecost':110,'prioritylimit':1}) + costs.standardcall({'IN':{'Small':400,'other':500}},this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':3,'largecost':5,'pageslimit':30}) + costs.claimcall({'as':this.as,'claim':this.claim,'smallcost':7,'largecost':10,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':30,'largecost':55,'prioritylimit':1});

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
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':'','pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':30}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':30,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':30,'largecost':0,'prioritylimit':10});
    },
    AU:function()
    {
        return costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':'','pages':this.pages,'smallcost':0,'largecost':0,'pageslimit':30}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':30,'largecost':0,'claimlimit':10}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':30,'largecost':0,'prioritylimit':10});
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
       // return 1.12 * (costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':15,'largecost':0,'pageslimit':35}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':235,'largecost':0,'claimlimit':15,'claimlimittwo':50,'claimlimittwocost':580}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':100,'largecost':0,'prioritylimit':1})) + costs.isacall({'as':this.as,'isa':this.isa,'smallcost':1456,'largecost':0,'c':this.c});
        return (1.12 * (costs.standardcall(this.standard,this.c,this.as) + costs.pagescall({'as':this.as,'pages':this.pages,'smallcost':15,'largecost':0,'pageslimit':35}) + costs.claimcall({'as':'','claim':this.claim,'smallcost':235,'largecost':0,'claimlimit':15,'claimlimittwo':50,'claimlimittwocost':580}) + costs.prioritycall({'as':'','priority':this.priority,'smallcost':100,'largecost':0,'prioritylimit':1}) + costs.isacall({'as':this.as,'isa':this.isa,'smallcost':1456,'largecost':0,'c':this.c})));
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
export { callstatus, emailstatus,costs,standard};