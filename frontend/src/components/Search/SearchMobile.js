import React, { useState } from "react";
import SearchItemList from "../Lists/PopularItem/SearchItemList";
import UserItemList from "../Lists/UserItemList/UserItemList";
import CollectionItemList from "../Lists/CollectionItemList/CollectionItemList";
import "./SearchDrop.css";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";

const SearchMobile = (props) => {
  const {setVisibleSearch} = props; 

  const [searchTxt, setSearchTxt] = useState("")
  const history = useHistory();
  const keyDownChange = (e) => {
    const key = e.keyCode;
    if(key === 13) {
      history.push('/search')
      setVisibleSearch(false)
    } 
  }

  return (
    <div className="search-drop">
      <div className="search-drop-header">
        <Input onKeyDown={keyDownChange} 
          prefix={<SearchOutlined />} 
          placeholder="Search here..."
          onChange={e => setSearchTxt(e.target.value)} 
          value={searchTxt}                
        />
      </div>
      <div className="search-drop-context">
        <div className="search-drop-items">
          <h4 className="popular-item-text">Collections</h4>
          <div className="search-drop-item-list">
            <CollectionItemList {...props} limit={true} searchTxt={searchTxt}/>
          </div>
        </div>
        <div className="search-drop-items">
          <h4 className="popular-item-text">Items</h4>
          <div className="search-drop-item-list">
            <SearchItemList {...props} searchTxt={searchTxt}/>
          </div>
        </div>
        <div className="search-drop-items">
          <h4 className="popular-item-text">Users</h4>
          <div className="search-drop-item-list">
            <UserItemList {...props} limit={true} searchTxt={searchTxt}/>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SearchMobile;
