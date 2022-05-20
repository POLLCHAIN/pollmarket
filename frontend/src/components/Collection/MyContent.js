/* eslint-disable no-unused-vars */
import React from "react";
import {useParams} from "react-router-dom"
import { Tabs } from "antd";
import "./MyContent.css";
import ExploreItemList from '../ExploreItemList/ExploreItemList'
import ActivityList from "../Lists/Activity/ActivityList";
import DrawerControlerFun from "../../functions/DrawerControlerFun";

const { TabPane } = Tabs;

const MyContent = (props) => {
  let { address } = useParams();
  const {  activeTab, changeTab, key, changeKey } = DrawerControlerFun();

  const callback = (key) => {
    changeKey(key)
    changeTab(key);
  };
  
  return (
    <div className="my-content">
      <Tabs defaultActiveKey="1" onChange={callback} activeKey={activeTab} >
        <TabPane tab="Items" key="1">
          <ExploreItemList {...props} query={`/api/explore?itemCollection=${address?.toLowerCase()}`} place='collection'/>
        </TabPane>
        
        <TabPane tab="Activity" key="2">
          <div className="my-content-activity-list">
            <ActivityList {...props} query={`/api/user/activities?itemCollection=${address?.toLowerCase()}`}/>
          </div>
        </TabPane>        
      </Tabs>
    </div>
  );
};

export default MyContent;
