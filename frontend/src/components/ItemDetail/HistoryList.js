/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios'
import { formatNum } from "../../utils";

const HistoryList = (props) => {
    const {item} = props;
    const [events, setEvents] = useState([])

    useEffect(() => {
        if (events.length === 0 && item) {
            fetchEvents();
        }        
    }, [item])
    
    function fetchEvents(){    
        let queryUrl = `/api/user/activities?itemCollection=${item?.itemCollection}&tokenId=${item?.tokenId}`    
        axios.get(queryUrl)
        .then(res => {
            setEvents(res.data.events)
            
        })
        .catch(err => {            
            setEvents([])      
        })
    }

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
        <div>
            {events.map((eventItem, index) => (
                <div className="user-item">
                    <div className="user-content">
                        <img src={eventItem?.actionUser?.profilePic} alt={"profile"} />
                        <div className="user-info">
                            <h5>
                                { (eventItem?.paramInfo && eventItem?.paramInfo?.amount > 1 ?
                                    `${eventItem?.paramInfo?.amount} editions ${eventItem?.actionMsg}`
                                    :
                                    `1 edition ${eventItem?.actionMsg}`)
                                }            
                                <span>{eventItem?.actionUser?.name}</span>

                                {eventItem?.paramInfo && eventItem?.paramInfo?.tokenInfo && ( <>for <span>{`${formatNum(eventItem?.paramInfo?.price)} ${eventItem?.paramInfo?.tokenInfo?.symbol}`}</span> each</>) }
                                {eventItem?.actionMsg=== 'transferred from' && (" to")}
                                {eventItem?.actionMsg === 'purchased by' && (" from")}
                                {
                                eventItem?.paramInfo && eventItem?.paramInfo?.userInfo && 
                                (
                                    <span>{eventItem?.paramInfo?.userInfo?.name}</span>
                                )
                                }           
                                
                            </h5>                           
                            <p><span>{getTime(eventItem?.timestamp)}</span></p>          
                        </div>
                    </div>
                </div>                
            ))}        
        </div>
    )
}

export default HistoryList
