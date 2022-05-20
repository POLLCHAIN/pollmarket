import React from "react";
import "./SupportNav.css";
import Logo from "../../assets/png/header-logo.png";
import { Link } from "react-router-dom";

const SupportNav = () => {
  return (
    <div className="support-nav">
      <div className="support-nav-logo">
        <img src={Logo} alt="brand logo" />
      </div>
      <div className="support-nav-items">
        <Link to="/support">Submit a Request</Link>
        <Link to="/support">Sign In</Link>
      </div>
    </div>
  );
};

export default SupportNav;
