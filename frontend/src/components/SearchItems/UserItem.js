import React from "react";
import { useHistory } from "react-router";
import "./UserItem.css";

const UserItem = (props) => {
  const {user} = props;

  const history = useHistory();
  const goToUserProfilePage = () => {
    history.push(`/user/${user.address}`)
  }
  return (
    <div className="search-user-item" onClick={goToUserProfilePage}>
      <img
        src={user.profilePic}
        alt={user.name}
      />
      <div className="search-user-item-info">
        <h4>{user.name}</h4>
        <p>{user.followers?.length} followers</p>
      </div>
    </div>
  );
};

export default UserItem;
