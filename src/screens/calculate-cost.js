import React, { useState, useEffect, useRef } from "react";
import "../component/style/calcost.css";
import Patentcalculator from "./patent-calc";
import Trademarkcalculator from "./calculate-trademark-cost";
const Calculatecost = () => {
  const [calcstate, updatestate] = useState(1);
  const updatevalue = (state) => {
    updatestate(state);
  };
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
