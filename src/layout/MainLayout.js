import React from "react";
import Header from "../component/Header";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="page-content">{children}</div>
    </>
  );
};

export default MainLayout;