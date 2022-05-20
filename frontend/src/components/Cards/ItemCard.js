/* eslint-disable react-hooks/exhaustive-deps */
import React , {useState,useEffect} from "react";
import axios from 'axios'
import Querystring from 'query-string'
import { formatNum } from "../../utils";
import { HeartOutlined,HeartFilled, MoreOutlined } from "@ant-design/icons";
import { Tooltip, Avatar, Menu, Dropdown } from "antd";

import { useHistory } from "react-router";
import DialogFun from "../../functions/DialogFun";
import FireIcon from "../../assets/svg/fire.svg";
import ReportDialog from "../Dialogs/ReportDialog";
import ShareDialog from "../Dialogs/ShareDialog";
import ThanksDialog from "../Dialogs/ThanksDialog";

import "./ItemCard.css";

const menu = (
  toggleShareDialog,  
  toggleReportDialog
) => (
  <Menu onClick={() => { }}>
    <Menu.Item key="3" onClick={toggleShareDialog}>
      Share
    </Menu.Item>
    <Menu.Item key="4" onClick={toggleReportDialog}>
      Report
    </Menu.Item>
  </Menu >
);

const ItemCard = (props) => {
  const { item } = props;

  // for favorite
  const [localLikeCount, setLocalLikeCount] = useState(0)
  const [didLike, setDidLike] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (item){
      setLocalLikeCount(item?.likes ? item?.likes.length : 0)
      if (props.user) {
        setDidLike(item?.likes && item?.likes.includes(props.user.address?.toLowerCase()))
      }          
    }
  }, [item, props.user])

  function clickFavorite() {
    if (props.user) {
      if (!isLiking){
        setIsLiking(true)
        setLocalLikeCount(l => l + (didLike ? -1 : 1))
        setDidLike(i => !i)
        axios.post("/api/item/like", Querystring.stringify({address: props.user.address?.toLowerCase(), tokenId: item?.tokenId, itemCollection: item?.itemCollection}))
        .then(res => {
          setIsLiking(false)
        })
        .catch(err => {
          setIsLiking(false)
        })
      }
    }        
  }

  // for auction part
  const [auctionStatus, setAuctionStatus] = useState(false)
  const [auctionStatusMessage, setAuctionStatusMessage] = useState('')
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (item?.auctionInfo) setInterval(() => setNewTime(), 1000);
  }, [item]);

  const setNewTime = () => {
    const currentTimestamp = new Date().getTime()
    let countdownDate = 0;
    if(item?.auctionInfo.startTime * 1000 > currentTimestamp) {
        setAuctionStatusMessage('Auction has not started')
        setAuctionStatus(false)
    } else if(item?.auctionInfo.endTime * 1000 > currentTimestamp) {
        setAuctionStatus(true)
        countdownDate = item?.auctionInfo.endTime * 1000;
        setAuctionStatusMessage('Auction is started')
    } else {
        setAuctionStatusMessage('Auction has ended')
        setAuctionStatus(false)
    }

    if (countdownDate) {
      const distanceToDate = countdownDate - currentTimestamp;

      let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor(
        (distanceToDate % (1000 * 60 * 60)) / (1000 * 60)
      );
      let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

      const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      if (numbersToAddZeroTo.includes(days)) {
        days = `0${days}`;
      } 
      if (numbersToAddZeroTo.includes(hours)) {
        hours = `0${hours}`;
      } 
      if (numbersToAddZeroTo.includes(minutes)) {
        minutes = `0${minutes}`;
      } 
      if (numbersToAddZeroTo.includes(seconds)) {
        seconds = `0${seconds}`;
      }
      setState({ days: days, hours: hours,  minutes: minutes, seconds: seconds });
    }
  };


  const history = useHistory();
  const {
    shareDialog,
    toggleShareDialog,
    toggleReportDialog,
    reportDialog,
    thanksDialog,
    toggleThanksDialog,
  } = DialogFun();

  const goToItemDetail = () => {
    history.push(`/detail/${item?.itemCollection}/${item?.tokenId}`);
  };

  const goToCollectionDetail = () => {
    history.push(`/collection/${item?.itemCollection}`);
  };
  const goToUserProfile = (user_address) => {
    history.push(`/user/${user_address}`);
  };

  return (
    <div className="collectible-item">
      <div id="my-preview" className="collectible-preview"
        onClick={() => goToItemDetail()}
      >
        { item?.image && <img className="collectible-img" src={item?.image} alt="item logo"/> }
        { item?.auctionInfo && 
          <div className="auction-time"> 
            <button>
              {
                auctionStatus ? 
                  <>
                    {`🕘 ${state.days || '00'}:${state.hours || '00'}:${state.minutes || '00'}:${state.seconds || '00'}`} <span>Left</span>
                    <span> <img src={FireIcon} alt="fire icon" /> </span>
                  </>
                  : 
                  <span>{auctionStatusMessage}</span>
              }
            </button>
          </div> 
        }
      </div>
      <div className="collectible-main-content">
        <div className="collectible-footer">
          <div className="collectible-content">
            <h2>{item?.name}</h2>
            
            {
              item?.auctionInfo ? 
                item?.auctionInfo.bidded ?
                  <>
                    <h3>Highest Bid <span>1/1</span></h3>
                    <p>{formatNum(item?.auctionInfo.lastPrice)} <span> {item?.auctionInfo.tokenSymbol}</span></p>
                  </>
                  :
                  <>
                    <h3>Minimum Bid <span> 1/1</span></h3>
                    <p>{formatNum(item?.auctionInfo.lastPrice)} <span> {item?.auctionInfo.tokenSymbol}</span></p>
                  </>                 
                : 
                <>
                  {
                    item?.pairInfo ?
                      item?.pairInfo.count > 1 ?
                        <h3> From {formatNum(item?.pairInfo.price)} {item?.pairInfo.tokenSymbol} <span>{` ${item?.pairInfo.totalBalance}/${item?.supply}`}</span></h3> 
                        :
                        <h3> {formatNum(item?.pairInfo.price)} {item?.pairInfo.tokenSymbol} <span>{` ${item?.pairInfo.totalBalance}/${item?.supply}`}</span></h3>                       
                      :
                      <h3><span>Not for sale {` ${item?.supply}/${item?.supply}`}</span></h3>
                  }                  
                </>                 
            }            
            
          </div>
          <div className="collectible-more-icon" style={{display:'none'}}>
            <Dropdown
              onClick={() => { }}
              overlay={menu(
                toggleShareDialog,
                toggleReportDialog
              )}
              trigger={["click"]}
              placement="bottomCenter"
            >
              <MoreOutlined />
            </Dropdown>
          </div>
        </div>
        <div className="collectible-item-header">
          <div className="collectible-item-heart" onClick={(event) => {
            event.stopPropagation();
            clickFavorite();
          }}>
            {
              didLike ?              
                <HeartFilled style = {{color:'red'}}/>
                : 
                <HeartOutlined style = {{color:'gray'}}/>
            } 
            <p>{localLikeCount}</p>{" "}
          </div>
          
          
          <Avatar.Group>
            <Tooltip title={`Collection: ${item?.collectionInfo?.name}`} placement="top">
              <Avatar
                src={item?.collectionInfo?.image}
                alt="collectible avatar"
                onClick={(event) => {
                  event.stopPropagation();
                  goToCollectionDetail();
                }}
              />
            </Tooltip>
            {
              item?.ownerUser &&
              <Tooltip title={`Owner: ${item?.ownerUser?.name}`} placement="top" style = {{display : item?.ownerUser? '':'none'}}>
                <Avatar
                  src={item?.ownerUser?.profilePic}
                  alt="owner avatar"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToUserProfile(item?.ownerUser?.address);
                  }}
                />
              </Tooltip>
            }
            <Tooltip title={`Creator: ${item?.creatorUser?.name}`} placement="top">
              <Avatar
                src={item?.creatorUser?.profilePic}
                alt="creator avatar"
                onClick={(event) => {
                  event.stopPropagation();
                  goToUserProfile(item?.creatorUser?.address);
                }}
              />
            </Tooltip>
          </Avatar.Group>
        </div>
      </div>
      <ShareDialog
        modalVisible={shareDialog}
        toggleDialog={toggleShareDialog}
      />
      <ReportDialog
        modalVisible={reportDialog}
        toggleDialog={toggleReportDialog}
        toggleThanksDialog={toggleThanksDialog}
      />
      <ThanksDialog
        modalVisible={thanksDialog}
        toggleDialog={toggleThanksDialog}
      />      
    </div>
  );
};

export default ItemCard;
