import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom"

import { Tabs } from "antd";
import "./MyContent.css";
import ItemList from "../Lists/ItemList/ItemList";
import ActivityList from "../Lists/Activity/ActivityList";
import FollowList from "../Lists/FollowList/FollowList";
import DrawerControlerFun from "../../functions/DrawerControlerFun";


const { TabPane } = Tabs;

const MyContent = (props) => {
  let { address } = useParams();
  const [refresh, setRefresh] = useState(false)

  const { show, changeDrawer, activeTab, changeTab, key, changeKey } = DrawerControlerFun();

  const callback = (key) => {
    setRefresh(false)
    changeKey(key)
    if (key === "6" || key === "7") {
      changeDrawer();
      changeTab(activeTab);
    } else {
      changeTab(key);
    }
  };

  useEffect(() => {
    setRefresh(false)    
  }, [address])

  return (
    <div className="my-content">
      <Tabs defaultActiveKey="1" onChange={callback} activeKey={activeTab}>
        <TabPane tab="On sale" key="1">
          <ItemList {...props} type='sale' query={`/api/user/sale?address=${address?.toLowerCase()}`} refresh={refresh} setRefresh={setRefresh}/>
        </TabPane>
        <TabPane tab="Owned" key="2">
          <ItemList {...props} query={`/api/user/owned?address=${address?.toLowerCase()}`} refresh={refresh} setRefresh={setRefresh}/>
        </TabPane>
        <TabPane tab="Created" key="3">
          <ItemList {...props} query={`/api/user/created?address=${address?.toLowerCase()}`} refresh={refresh} setRefresh={setRefresh}/>
        </TabPane>
        <TabPane tab="Liked" key="4">
          <ItemList {...props} query={`/api/user/liked?address=${address?.toLowerCase()}`} refresh={refresh} setRefresh={setRefresh}/>
        </TabPane>
        <TabPane tab="Activity" key="5">
          <ActivityList {...props} query={`/api/user/activities?address=${address?.toLowerCase()}`} refresh={refresh} setRefresh={setRefresh} />    
        </TabPane>
        <TabPane tab="Following" key="6"></TabPane>
        <TabPane tab="Followers" key="7"></TabPane>
        {key === "6"?
        <FollowList
          {...props} 
          type={"Following"}
          show={show}
          changeDrawer={changeDrawer}
          query={`/api/user/following?address=${address?.toLowerCase()}`}
          refresh={refresh} 
          setRefresh={setRefresh}
        />:
        <FollowList
          {...props} 
          type={"Followers"}
          show={show}
          changeDrawer={changeDrawer}
          query={`/api/user/followers?address=${address?.toLowerCase()}`}
          refresh={refresh} 
          setRefresh={setRefresh}
        />}
      </Tabs>
    </div>
  );
};

export default MyContent;
