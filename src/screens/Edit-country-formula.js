import React, { useState, useEffect, useRef } from "react";
import Tradenarkclac from "../component/Trademarkcalc";
import Patentclac from "../component/Patentcalc";
import Toast from "../component/New-toast";
import { useSearchParams } from "react-router-dom";
import "../component/style/cost.css";
import Headerblank from "../component/Header-blank";
const Editcountryformula = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [validate, setvalidate] = useState({
        status: false,
        color: "error",
        icon: "error",
        message: "",
      });
      const selectedcountry = useRef(searchParams.get("id"));
      const matter = searchParams.get("matter");
  return (
    <>
      <Toast validate={validate}></Toast>
      <Headerblank except={false}></Headerblank>
      {matter == "1" ? (
        <Patentclac matter={matter} setvalidate={setvalidate} selectedcountry={selectedcountry}
        ></Patentclac>
      ) : (
        <Tradenarkclac matter={matter} setvalidate={setvalidate} selectedcountry={selectedcountry}
        ></Tradenarkclac>)}
    </>
  );
};
export default Editcountryformula;
