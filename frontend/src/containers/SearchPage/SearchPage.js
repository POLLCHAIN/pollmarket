import React from "react";
import {useParams} from "react-router-dom"

import "./SearchPage.css";
import { Tabs } from "antd";
// import EmptyContent from "../../components/Empty/EmptyContent";
import UserItemList from "../../components/Lists/UserItemList/UserItemList";
import CollectionItemList from "../../components/Lists/CollectionItemList/CollectionItemList";
import ItemList from "../../components/Lists/ItemList/ItemList";

const { TabPane } = Tabs;

const SearchPage = (props) => {
  const { searchTxt } = useParams();
  
  return (
    <div className="search-page">
      <h1 className="search-page-headline">Search results for <span>{searchTxt}</span></h1>
      <div className="search-page-context">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Items" key="1">
            <ItemList {...props} query={`/api/search_items?search=${searchTxt}`}/>
          </TabPane>
          <TabPane tab="Users" key="2">
            <UserItemList limit={false} {...props} searchTxt={searchTxt}/>
          </TabPane>
          <TabPane tab="Collections" key="3">
            <CollectionItemList limit={false} {...props} searchTxt={searchTxt}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
  
}

export default SearchPage;
