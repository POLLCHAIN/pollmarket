import React from "react";
import "./SellerItem.css";
import Badge from "../../assets/svg/verified_badge.svg";
import { useHistory } from "react-router";

import { formatNum } from "../../utils";

const SellerItem = (props) => {
  const { userItem , count } = props;  
  const history = useHistory();
  const goToProfilePage = () => {
    history.push(`/user/${userItem?.userInfo.address}`)
  }

  return (
    <div className="seller-item" onClick={goToProfilePage}>
      <div className="seller-item-container">
        <p className="seller-item-number">{count}</p>
        <div className="seller-item-content">
          <h3>{userItem?.userInfo.name}</h3>
          <p>$ {formatNum(userItem?.totalSold)}</p>
        </div>
        <div className="seller-item-image">
          <img
            className="seller-avatar"
            src={userItem?.userInfo.profilePic}
            alt="profile logo"
          />
          <img className="seller-badge" src={Badge} alt="verified badge" />
        </div>
      </div>
    </div>
  );
};

export default SellerItem;
