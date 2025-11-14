import React, { useState, useEffect, useRef,useCallback } from "react";
import "../component/style/calcost.css";
import Patentcalculator from "./patent-calc";
import Trademarkcalculator from "./calculate-trademark-cost";
import Uploaddata from "../services/uploaddata";
import { defaultvalue } from "../constant/Constant";
const Calculatecost = () => {
  const [calcstate, updatestate] = useState(1);
  const updatevalue = (state) => {
    updatestate(state);
  };
    const fetchdata = useCallback( async() => {
      try{
      const result = await Uploaddata.pctaxiosrequest({
        posttype: "fetch-translation-cost",
        data: "",
      });
      if(result.data.success && result.data.data.length>0)
      {
         let response=result.data.data.map((item)=>{return JSON.parse(item.details);});
         defaultvalue.transcost=response;
      }
    }
    catch(err)
    {

    }
    }, []);
      useEffect(() => {
        fetchdata();
      }, []);
  return (
    <>
      {calcstate == 1 ? (
        <Patentcalculator
          calcstate={calcstate}
          updatevalue={updatevalue}
        ></Patentcalculator>
      ) : (
        <Trademarkcalculator
          calcstate={calcstate}
          updatevalue={updatevalue}
        ></Trademarkcalculator>
      )}
    </>
  );
};
export default Calculatecost;
