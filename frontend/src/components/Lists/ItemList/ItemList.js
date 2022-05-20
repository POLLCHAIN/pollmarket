/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios'

import ItemCard from "../../Cards/ItemCard";
import "./ItemList.css";

const ItemList = (props) => {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [timestamp, setTimestamp] = useState(9999999999)
  const [lastTimeStamp, setLastTimeStamp] = useState(9999999999)
  const [noItems, setNoItems] = useState(false)
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {    
    if(!props.refresh){
      setItems([])
      setNoItems(false)
      setInitialItemsLoaded(false)
      setLoading(true)   
      setPage(1)
      setTimestamp(9999999999)
      fetchItems(true)
      if(props.setRefresh) props.setRefresh(true)
    }    
  }, [props])

  useEffect(() => {
    setLoading(true)    
    if (initialItemsLoaded){
      fetchItems(false);
    }
  }, [page,timestamp])

  function fetchItems(reset){    
    let queryUrl = `${props.query}&page=${reset ? 1 : page}`
    if (props?.type === 'sale') {
      queryUrl = `${props.query}&timestamp=${reset ? 9999999999 : timestamp}`
    }
    axios.get(queryUrl)
    .then(res => {
      setLoading(false)   
      if (res.data.items.length === 0) setNoItems(true)
      if (props?.type === 'sale') {
        setLastTimeStamp(res.data.lastTimeStamp)
      }

      if (reset){        
        setItems(res.data.items)
        setInitialItemsLoaded(true)
      }else{
        let prevArray = JSON.parse(JSON.stringify(items))
        prevArray.push(...res.data.items)
        setItems(prevArray)        
      }
      
    })
    .catch(err => {            
      setLoading(false)  
      if (err.response.data.message === 'No Items found') {
        setNoItems(true)    
      }      
    })
  }

  function loadMore() {
    if (!loading) {
      if (props?.type === 'sale') {
        setTimestamp(lastTimeStamp)     
      } else {
        setPage(page => {return (page + 1)})
      }  
    }      
  }
  return (
    <div>
        <div className="sale-list">
          {items.map((item, index) => (
            <ItemCard {...props} item={item} key={index} />           
          ))}
        </div>
        <div className="load-more" style={{display: noItems ? "none" : ""}}>
          <button onClick={() => loadMore()} className="" type="primary" >
            {loading ? "Loading..." : "Load more"}
          </button>
      </div>
    </div>
    
  );
};

export default ItemList;
