import React from "react";
import { useWeb3React } from '@web3-react/core'
import "./Activity.css";
import ActivityList from "../../components/Lists/Activity/ActivityList";

const Activity = (props) => {
  const { account } = useWeb3React();

  
  return (
    <div className="activity-container">
      <div className="activity-headline">
        <h1 className="activity-container-headline">Activity</h1>          
      </div>
      {
        account && (
          <div className="activity-container-context">
            <ActivityList query={`/api/user/activities?address=${account.toLowerCase()}`}/>          
          </div>
        )
      }
      
    </div>
  );
  
}

export default Activity;
