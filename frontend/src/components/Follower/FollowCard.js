import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { useHistory } from "react-router";
import axios from 'axios'
import Querystring from 'query-string'
import "./FollowCard.css";

const FollowCard = (props) => {
  const { userItem, user } = props;
  const { account } = useWeb3React();
  const [didFollow, setDidFollow] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const history = useHistory();
  const goToUserProfile = (user_address) => {
    history.push(`/user/${user_address}`);
  };

  useEffect(() => {             
    if (userItem && account && user) {
        setDidFollow(userItem?.followers && userItem?.followers.includes(account.toLowerCase()))
    }          
    
}, [user, account, userItem])

  function clickFollow() {
    if (userItem && account && user && (userItem?.address !== account.toLowerCase())) {
        if (!isFollowing){
          setIsFollowing(true)          
          setDidFollow(i => !i)
          axios.post("/api/user/follow", Querystring.stringify({from: account.toLowerCase(), to: userItem?.address}))
          .then(res => {
            setIsFollowing(false)
          })
          .catch(err => {
            setIsFollowing(false)
          })
        }
    }        
  }


  return (
    <div className="follow-card">
      {
        userItem && (
          <div className="follow-context">
            <img
              src={userItem?.profilePic}
              alt="follow"
              onClick={(event) => {
                event.stopPropagation();
                goToUserProfile(userItem?.address);
              }} 
            />
            <div className="follow-content">
              <h2>{userItem?.name}</h2>
              <p>{userItem?.followers?.length} followers</p>
            </div>
          </div>
        )
      }
      
      {
        (account && userItem && account.toLowerCase() !== userItem?.address) && 
        (
          <button
            onClick={(event) => {
              event.stopPropagation();
              clickFollow();
            }}                      
          >
            {didFollow ? "Unfollow" : "Follow"}
          </button>
        )
      }
      
    </div>
  );
};

export default FollowCard;
