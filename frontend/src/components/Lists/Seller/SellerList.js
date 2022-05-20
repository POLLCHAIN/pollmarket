import React, { useState, useEffect } from "react";
import axios from 'axios'
import "./SellerList.css";
import SellerItem from '../../Seller/SellerItem'

const SellerList = (props) => {
  const [users, setUsers] = useState([])
  useEffect(() => {    
    fetchSellers();    
  }, [props])

  function fetchSellers(){    
    let queryUrl = `/api/top_sellers`    
    axios.get(queryUrl)
    .then(res => {
      setUsers(res.data.users)      
    })
    .catch(err => {            
      setUsers([])      
    })
  }

  return (
    <div className="seller-list">      
      <h1>
        Top sellers                
      </h1>
      <div className="seller-item-list">
        {users.map((userItem, index) => (
          <SellerItem {...props} count={index+1} userItem={userItem} />
        ))}
      </div>
    </div>
  );
};

export default SellerList;
