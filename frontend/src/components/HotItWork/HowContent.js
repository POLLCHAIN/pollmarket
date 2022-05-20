import React from "react";
import "./HowContent.css";
import HowCollapse from "./HowCollapse";
import HowItWorkFun from "../../functions/HowItWorkFun";

const HowContent = () => {

  const { items } = HowItWorkFun();

  return (
    <div className="how-content">
      <div className="how-collapse-content">
        <HowCollapse headline="Marketplace" items={items.Marketplace} />
      </div>
      <div className="how-collapse-content">
        <HowCollapse headline="Governance" items={items.Governance} />
      </div>
    </div>
  );
};

export default HowContent;
