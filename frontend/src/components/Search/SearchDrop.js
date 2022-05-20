import React,{ useEffect } from "react";
import SearchItemList from "../Lists/PopularItem/SearchItemList";
import UserItemList from "../Lists/UserItemList/UserItemList";
import CollectionItemList from "../Lists/CollectionItemList/CollectionItemList";
import "./SearchDrop.css";
import { useHistory } from "react-router";


const SearchDrop = (props) => {
  const searchTxt = window.localStorage.getItem('searchTxt');  
  
  const history = useHistory();
  const goToSearchPage = () => {
    history.push(`/search/${searchTxt}`);
  };

  useEffect(() => {
    console.log(`searchTxt: ${searchTxt}`)
  }, [searchTxt])


  return (
    <div className="search-drop">
      {
        searchTxt ?
          <>
            <div className="search-drop-header">
              <h4 className="search-drop-search-text">
                Search results for <span>{searchTxt}</span>
              </h4>
              <button onClick={goToSearchPage}>All Results</button>
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
          </>
          :
          <></>
      }      
    </div>
  );
};

export default SearchDrop;
