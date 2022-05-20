/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios'

import { CloseCircleOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import FollowCard from "../../Follower/FollowCard";
import "./FollowList.css";

const FollowList = (props) => {
  const { show, changeDrawer, type } = props;
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  
  const [noUsers, setNoUsers] = useState(false)
  const [initialEventsLoaded, setInitialEventsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

    // initialize loading
    useEffect(() => {    
      if(!props.refresh){
        setUsers([])
        setNoUsers(false)
        setInitialEventsLoaded(false)
        setLoading(true)   
        setPage(1)
        fetchUsers(true)
        if(props.setRefresh) props.setRefresh(true)
      }    
    }, [props])
  
    // load more
    useEffect(() => {
      setLoading(true)    
      if (initialEventsLoaded){
        fetchUsers(false);
      }
    }, [page])
  
    function fetchUsers(reset){    
      let queryUrl = `${props.query}&page=${reset ? 1 : page}`    
      axios.get(queryUrl)
      .then(res => {
        setLoading(false)   
        if (res.data.users.length === 0) setNoUsers(true)
        
        if (reset){        
          setUsers(res.data.users)
          setInitialEventsLoaded(true)
        }else{
          let prevArray = JSON.parse(JSON.stringify(users))
          prevArray.push(...res.data.users)
          setUsers(prevArray)        
        }
        
      })
      .catch(err => {            
        setLoading(false)  
        setNoUsers(true)      
      })
    }
  
    function loadMore() {
      if (!loading) {
        setPage(page => {return (page + 1)})  
      }      
    }

  return (
    <div className="follow-list">

      <Drawer
        title={type}
        placement="left"
        closable={true}
        width={window.screen.width > 500 ? "400px" : "90vw"}
        onClose={changeDrawer}
        visible={show}
        closeIcon={<CloseCircleOutlined />}
      >
        <div style={{marginTop:'10px'}}>
          {users.map((userItem, index) => (
            <FollowCard {...props} userItem={userItem} key={index} />           
          ))}          
        </div>
        <div className="load-more" style={{display: noUsers ? "none" : ""}}>
            <button onClick={() => loadMore()} className="" type="primary" >
              {loading ? "Loading..." : "Load more"}
            </button>
        </div>

      </Drawer>
    </div>
  );
};

export default FollowList;
