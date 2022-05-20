/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios'

import PopularItemCard from '../../Cards/PopularItemCard'
import './SearchItemList.css'

const SearchItemList = (props) => {

    const [items, setItems] = useState([])
    
    useEffect(() => {    
        if (props.searchTxt) {
            fetchCollections([])  
        }        
    }, [props])
    
    function fetchCollections(){    
    let queryUrl = `/api/search_items?search=${props.searchTxt}`        
    axios.get(queryUrl)
    .then(res => {
        setItems(res.data.items)          
    })
    .catch(err => {
        setItems([])       
    })
    }
    return (
        <div>
            {
                items.map((item, index) => ( index < 3 && 
                    <PopularItemCard {...props} item={item} key={index} />
                ))
            }
        </div>
    )
}

export default SearchItemList
