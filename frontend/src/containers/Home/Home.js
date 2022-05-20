/* eslint-disable no-unused-vars */
import React from 'react'
import ExploreItemList from '../../components/ExploreItemList/ExploreItemList'
import CollectionList from '../../components/Lists/Collection/CollectionList'
import LiveAuctionList from '../../components/Lists/LiveAuction/LiveAuctionList'
import SellerList from '../../components/Lists/Seller/SellerList'
import HotList from '../../components/Lists/TopBanner/HotList'
import Banner from '../../components/Lists/TopBanner/Banner'
import './Home.css'

const Home = (props) =>  {    
    return (
        <div className="home">
            <Banner/>
            {/* <HotList {...props}/> */}
            <CollectionList {...props}/>
            {/* <SellerList {...props}/>
            <LiveAuctionList {...props}/> */}
            <hr/>               
            <ExploreItemList {...props} query={`/api/explore?`} place='home'/>
        </div>
    )
    
}

export default Home
