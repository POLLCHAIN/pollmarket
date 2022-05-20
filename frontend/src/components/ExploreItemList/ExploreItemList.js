/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios'
import * as style from './styles';
import ItemCard from "../Cards/ItemCard";
import FilterIcon from '../../assets/images/filter.png';
import SearchIcon from '../../assets/images/search-icon.png';

import "./ExploreItemList.css";

const SELECT_ORDER_BY_ITEMS = [
  {value: 'timestamp', text: 'Recently added'},
  {value: 'usdPrice', text: 'Price: Low to High'},
  {value: 'usdPrice', text: 'Price: High to Low'}
];

const ExploreItemList = (props) => {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [noItems, setNoItems] = useState(false)
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');

  const [showFilter, setShowFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);

  const [searchTxt, setSearchTxt] = useState("")   
  const [tempSearchTxt, setTempSearchTxt] = useState("") 
  const [sortBy, setSortBy] = useState("timestamp")
  const [sortByText, setSortByText] = useState("Recently added")  
  const [sortDir, setSortDir] = useState("desc")

  function chooseFilter(filter) {
    setSortBy(filter.value); 
    setSortByText(filter.text); 
    setShowSortBy(false);

    switch (filter.text) {
      case 'Recently added':
        setSortDir('desc')
        break;
      case 'Price: Low to High':
        setSortDir('asc')
        break;
      case 'Price: High to Low':
        setSortDir('desc')
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [categories]);
  function fetchCategories() {        
    axios.get(`/api/categories`)
    .then((res) => {            
        setCategories(res.data.categories);                       
    })
    .catch((err) => {
        console.log("err: ", err.message);
        setCategories([]);
    });
  }
  useEffect(() => {    
    setItems([])
    setNoItems(false)
    setInitialItemsLoaded(false)
    setLoading(true)   
    setPage(1)    
    fetchItems(true)    
  }, [props, searchTxt, category, sortBy, sortDir])

  useEffect(() => {
    setLoading(true)    
    if (initialItemsLoaded){
      fetchItems(false);
    }
  }, [page])

  function fetchItems(reset){    
    let queryUrl = `${props.query}&page=${reset ? 1 : page}&sortDir=${sortDir}${sortBy ? '&sortBy=' + sortBy : ''}${category ? '&category=' + category : ''}${searchTxt ? '&searchTxt=' + searchTxt : ''}`
        
    axios.get(queryUrl)
    .then(res => {
      setLoading(false)   
      if (res.data.items.length === 0) setNoItems(true)      
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
      setPage(page => {return (page + 1)}) 
    }      
  }

  return (
    <div className="item-list">
      {
        props.place === "collection" ? 
        <></>
        :
        <h1>Market</h1>
      }
      
      <style.Container>
        <div className="filterBox" onClick={() => {setSearchTxt(tempSearchTxt); }}>
          <div className="item-box" onClick={() => setShowSortBy(false)}>
            <input type="text" value={tempSearchTxt} className="form-search" style={{backgroundImage: `url(${SearchIcon})`}} placeholder="Search Items" onChange={event => {setTempSearchTxt(event.target.value)}} onKeyDown={event => {
              if (event.key === 'Enter')
                setSearchTxt(event.target.value)
            }}/>
          </div>                             
        </div>  
        <style.FilterCategoryContainer>    
          <style.FilterCategories>
            <style.FilterCategory onClick={() => setCategory('')} className={category === ''?'active':''}>All</style.FilterCategory>        
            {
              categories.map((categoryItem, index) => <style.FilterCategory key={index} onClick={() => setCategory(categoryItem.name)} className={category === categoryItem.name?'active':''}>{categoryItem.name}</style.FilterCategory>)
            }
          </style.FilterCategories>
        </style.FilterCategoryContainer>      
        <div className="all-items">
          {items.map((item, index) => (
            <ItemCard {...props} item={item} key={index} />
          ))}
        </div>
        <div className="load-more" style={{display: noItems ? "none" : ""}}>
            <button onClick={() => loadMore()} className="" type="primary" >
              {loading ? "Loading..." : "Load more"}
            </button>
        </div>        
      </style.Container>


      
    </div>
    
  );
};

export default ExploreItemList;
