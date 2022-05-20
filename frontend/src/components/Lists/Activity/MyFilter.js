import React, { useState } from "react";
import "./MyFilter.css";
import ListingIcon from "../../../assets/svg/listing.svg";
import PurchIcon from "../../../assets/svg/ethereum.svg";
import SaleIcon from "../../../assets/svg/flash.svg";
import TransferIcon from "../../../assets/svg/transfer.svg";
import BurnIcon from "../../../assets/svg/fire.svg";
import BidIcon from "../../../assets/svg/bid.svg";

const MyFilter = (props) => {
  const [filterName, setFilterName] = useState('')
  const listing = () => {
    if(props.setRefresh) props.setRefresh(false)
    if (filterName === 'listing') {
      setFilterName('')
      if(props.setFilter) props.setFilter('')
    } else {
      setFilterName('listing')
      if(props.setFilter) props.setFilter('MultiItemListed_SingleItemListed_AuctionCreated_MultiItemCreated_SingleItemCreated')
    }
  };
  const purchase = () => {
    if(props.setRefresh) props.setRefresh(false)
    if (filterName === 'purchase') {
      setFilterName('')
      if(props.setFilter) props.setFilter('')
    } else {
      setFilterName('purchase')
      if(props.setFilter) props.setFilter('AuctionFinalized_MultiItemSwapped_SingleSwapped')
    }
  };
  const sale = () => {
    if(props.setRefresh) props.setRefresh(false)
    if (filterName === 'sale') {
      setFilterName('')
      if(props.setFilter) props.setFilter('')
    } else {
      setFilterName('sale')
      if(props.setFilter) props.setFilter('AuctionFinalized_MultiItemSwapped_SingleSwapped_AuctionCanceled')
    }
  };
  const transfer = () => {
    if(props.setRefresh) props.setRefresh(false)
    if (filterName === 'transfer') {
      setFilterName('')
      if(props.setFilter) props.setFilter('')
    } else {
      setFilterName('transfer')
      if(props.setFilter) props.setFilter('MultiTransfer_SingleTransfer')
    }
  };
  const burn = () => {
    if(props.setRefresh) props.setRefresh(false)
    if (filterName === 'burn') {
      setFilterName('')
      if(props.setFilter) props.setFilter('')
    } else {
      setFilterName('burn')
      if(props.setFilter) props.setFilter('MultiBurn_SingleBurn')
    }
  };
  const bid = () => {
    if(props.setRefresh) props.setRefresh(false)
    if (filterName === 'bid') {
      setFilterName('')
      if(props.setFilter) props.setFilter('')
    } else {
      setFilterName('bid')
      if(props.setFilter) props.setFilter('AuctionBidSuccess')
    }
  };


  return (
    <div className="activity-my-filter">
      <h1>Filters</h1>
      <div className="activity-my-filter-buttons">
        <button className={filterName === 'listing' ? "listing-btn-back" : "listing-btn"} onClick={listing}>
          <img src={ListingIcon} alt="listing icon" />
          Listing
        </button>
        <button className={filterName === 'purchase' ? "purchase-btn-back" : "purchase-btn"} onClick={purchase}>
          <img src={PurchIcon} alt="purchase icon" />
          Purchases
        </button>
        <button className={filterName === 'sale' ? "sale-btn-back" : "sale-btn"} onClick={sale}>
          <img src={SaleIcon} alt="sales icon" />
          Sales
        </button>
        <button className={filterName === 'transfer' ? "transfer-btn-back" : "transfer-btn"} onClick={transfer}>
          <img src={TransferIcon} alt="transfer icon" />
          Transfers
        </button>
        <button className={filterName === 'burn' ? "burn-btn-back" : "burn-btn"} onClick={burn}>
          <img src={BurnIcon} alt="burns icon" />
          Burns
        </button>
        <button className={filterName === 'bid' ? "bid-btn-back" : "bid-btn"} onClick={bid}>
          <img src={BidIcon} alt="bid icon" />
          Bids
        </button>        
      </div>
    </div>
  );
};

export default MyFilter;
