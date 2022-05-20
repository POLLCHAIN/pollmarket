/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios'

import ActivityCard from "../../Cards/ActivityCard";
import "./ActivityList.css";
import MyFilter from "./MyFilter";

const ActivityList = (props) => {
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(1)
  const [filter,setFilter] = useState('')

  const [noEvents, setNoEvents] = useState(false)
  const [initialEventsLoaded, setInitialEventsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  // initialize loading
  useEffect(() => {    
    if(!props.refresh){
      setEvents([])
      setNoEvents(false)
      setInitialEventsLoaded(false)
      setLoading(true)   
      setPage(1)
      fetchEvents(true)
      if(props.setRefresh) props.setRefresh(true)
    }    
  }, [props,filter])

  // load more
  useEffect(() => {
    setLoading(true)    
    if (initialEventsLoaded){
      fetchEvents(false);
    }
  }, [page])

  function fetchEvents(reset){    
    let queryUrl = `${props.query}&page=${reset ? 1 : page}&filter=${filter}`    
    axios.get(queryUrl)
    .then(res => {
      setLoading(false)   
      if (res.data.events.length === 0) setNoEvents(true)
      
      if (reset){        
        setEvents(res.data.events)
        setInitialEventsLoaded(true)
      }else{
        let prevArray = JSON.parse(JSON.stringify(events))
        prevArray.push(...res.data.events)
        setEvents(prevArray)        
      }
      
    })
    .catch(err => {            
      setLoading(false)  
      if (err.response.data.message === 'No events found') {
        setNoEvents(true)    
      }      
    })
  }

  function loadMore() {
    if (!loading) {
      setPage(page => {return (page + 1)})  
    }      
  }

  return (
    <div className="my-content-activity-list">
      <div className="activity-list">
        <div className="activity-item-list">
          {events.map((eventItem, index) => (
            <ActivityCard {...props} eventItem={eventItem} key={index} />
          ))}
          <div className="load-more" style={{display: noEvents ? "none" : ""}}>
            <button onClick={() => loadMore()} className="" type="primary" >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        </div>
      </div>
      <MyFilter {...props} setFilter={setFilter}/>
    </div>
    
  );
};

export default ActivityList;
