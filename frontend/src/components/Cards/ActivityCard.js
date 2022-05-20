import React from "react";
import { useHistory } from "react-router";
import { formatNum } from "../../utils";

import "./ActivityCard.css";

const ActivityCard = (props) => {
  const { eventItem } = props;
  const history = useHistory();
  
  const goToItemDetail = () => {
    history.push(`/detail/${eventItem?.itemCollection}/${eventItem?.tokenId}`);
  };

  const goToUserProfile = (user_address) => {
    history.push(`/user/${user_address}`);
  };

  const getTime = (timestamp) => {
    const currentTimestamp = new Date().getTime()/1000    
    const distanceToDate = currentTimestamp - timestamp; 

    let months = Math.floor(distanceToDate / (60 * 60 * 24 * 30));
    let days = Math.floor(distanceToDate / (60 * 60 * 24));
    let hours = Math.floor((distanceToDate % (60 * 60 * 24)) / ( 60 * 60));
    let minutes = Math.floor((distanceToDate % (60 * 60)) / 60);
    let seconds = Math.floor((distanceToDate % 60));
    
    if (months > 0) {
      return `${months} months ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0){
      return `${hours} hours ago`;      
    } else if (minutes > 0){
      return `${minutes} minutes ago`;
    } else if (seconds > 0){
      return `${seconds} seconds ago`;
    }
    return "";

  };

  return (
    <div className="activity-card">
      <div className="activity-box">
        { eventItem?.itemInfo && 
          <img className="box-preview"
            src={eventItem?.itemInfo?.image}
            alt={'item logo'}
            onClick={(e) => {
              e.stopPropagation();
              goToItemDetail();
            }}
          />
        }
       
        <div className="activity-content">
          { eventItem?.itemInfo &&             
            <h2>{eventItem?.itemInfo?.name}</h2>
          }
          
          <h3>
            { (eventItem?.paramInfo && eventItem?.paramInfo?.amount > 1 ?
                `${eventItem?.paramInfo?.amount} editions ${eventItem?.actionMsg}`
                :
                `1 edition ${eventItem?.actionMsg}`)                
            }            
            <div className="activity-creator" onClick={(e) => {
                    e.stopPropagation();
                    goToUserProfile(eventItem?.actionUser?.address);
                  }}>
              <img
                src={eventItem?.actionUser?.profilePic}
                alt={'action user'}
              />
              <span>{eventItem?.actionUser?.name}</span>{" "}
            </div>

            {eventItem?.paramInfo && eventItem?.paramInfo?.tokenInfo && ( <>for <span>{`${formatNum(eventItem?.paramInfo?.price)} ${eventItem?.paramInfo?.tokenInfo?.symbol}`}</span> each</>) }
            {eventItem?.actionMsg=== 'transferred from' && (" to")}
            {eventItem?.actionMsg === 'purchased by' && (" from")}
            {
              eventItem?.paramInfo && eventItem?.paramInfo?.userInfo && 
              (
                <div className="activity-creator" onClick={(e) => {
                  e.stopPropagation();
                  goToUserProfile(eventItem?.paramInfo?.userInfo?.address);
                }}>
                  <img
                    src={eventItem?.paramInfo?.userInfo?.profilePic}
                    alt={'action user'}
                  />
                  <span>{eventItem?.paramInfo?.userInfo?.name}</span>{" "}
                </div>
              )
            }           
            
          </h3>
          <p>{getTime(eventItem?.timestamp)}</p>
        </div>
      </div>      
    </div>
  );
};

export default ActivityCard;
