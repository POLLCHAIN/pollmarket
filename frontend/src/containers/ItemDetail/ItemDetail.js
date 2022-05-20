/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from 'axios'
import {useParams} from "react-router-dom"
import { useWeb3React } from '@web3-react/core'
import Querystring from 'query-string'
import { HeartOutlined, HeartFilled, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Image, Menu, Tabs, Avatar } from "antd";

import { getTokenBalance } from "../../utils/contracts";
import { formatNum, getUSDRateFromSymbol } from "../../utils";

import "./ItemDetail.css";

import InfoList from "../../components/ItemDetail/InfoList";
import OwnersList from "../../components/ItemDetail/OwnersList";
import HistoryList from "../../components/ItemDetail/HistoryList";

import PutSaleDialog from "../../components/Dialogs/PutSaleDialog";
import EndAuctionDialog from "../../components/Dialogs/EndAuctionDialog";
import AuctionBidDialog from "../../components/Dialogs/AuctionBidDialog";

import TransferDialog from "../../components/Dialogs/TransferDialog";
import DialogFun from "../../functions/DialogFun";

import { useHistory } from "react-router";
import ShareDialog from "../../components/Dialogs/ShareDialog";
import ReportDialog from "../../components/Dialogs/ReportDialog";
import ThanksDialog from "../../components/Dialogs/ThanksDialog";

const { TabPane } = Tabs;

const ItemDetail = (props) => {
  let { collection, tokenId } = useParams();  
  const {account, chainId, library} = useWeb3React();  

  const [item, setItem] = useState(null);
  const [refresh, setRefresh] = useState(false)

  const [ethBalance, setEthBalance] = useState(0)
  const [ethRate, setEthRate] = useState(0)
  const [pollBalance, setPollBalance] = useState(0)  
  const [pollRate, setPollRate] = useState(0)

  // for favorite
  const [localLikeCount, setLocalLikeCount] = useState(0)
  const [didLike, setDidLike] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  // for auction part
  const [auctionStatus, setAuctionStatus] = useState(false)
  const [auctionStatusMessage, setAuctionStatusMessage] = useState('')
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });


  const [holding, setHolding] = useState(0);

  // get balance
  useEffect(() => {
    if(!!account && !!library) {
      // get ETH balance
      getTokenBalance(account, 'ETH', chainId, library)
        .then((balance) => {
          setEthBalance(Number(balance))
        })
        .catch(() => {
          setEthBalance(0)
        })           
      // get POLL balance
      getTokenBalance(account, 'POLL', chainId, library)
        .then((balance) => {
          setPollBalance(Number(balance))
        })
        .catch(() => {
          setPollBalance(0)
        })         
    }

    return () => {
      setEthBalance(0)
      setPollBalance(0)      
    }
  }, [account, chainId, library, refresh])

  // get token rate
  useEffect(() => {
    if(!ethRate) {
      // get ETH rate
      getUSDRateFromSymbol('ETH')
        .then((rate) => {          
          setEthRate(rate)
        })
        .catch(() => {
          setEthRate(0)
        })       
    }   
  }, [ethRate])
  useEffect(() => {
    if(!pollRate) {
      // get POLL rate
      getUSDRateFromSymbol('POLL')
        .then((rate) => {
          setPollRate(rate)
        })
        .catch(() => {
          setPollRate(0)
        })    
    }
  }, [pollRate])

  // fetch item detail
  useEffect(() => { 
    if (!item || !refresh) {
      fetchItem()
    } else {
      let holdingAmount = 0;
      for (let index = 0; index < item.holders.length; index++) {
        let holder = item.holders[index];
        if (holder.user && holder.balance > 0 && account) {
          if (holder.address.toLowerCase() === account?.toLowerCase()) {            
            holdingAmount = holdingAmount + holder.balance;
          } 
        }                       
      }         
      setHolding(holdingAmount); 
    }    
  }, [account, item, collection, tokenId,refresh])
  function fetchItem(){    
    let queryUrl = `/api/item_detail/${collection}/${tokenId}`    
    axios.get(queryUrl)
    .then(res => {
      setItem(res.data.item)    
      setRefresh(true)  
    })
    .catch(err => {            
      setItem(null)     
    })
  }

  // favorite
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
        setAuctionStatusMessage('Auction ends in')
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

  const goToCollectionPage = () => {
    history.push(`/collection/${item?.itemCollection?.toLowerCase()}`);
  }

  function goToProfilePage(address) {
    history.push(`/user/${address?.toLowerCase()}`);
  }

  const {
    togglePutSaleDialog, putSaleDialog,
    toggleEndAuctionDialog, endAuctionDialog,
    toggleAuctionBidDialog, auctionBidDialog,    
    toggleTransferDialog, transferdDialog,
    toggleShareDialog, shareDialog,
    toggleReportDialog, reportDialog,
    toggleThanksDialog, thanksDialog,    
  } = DialogFun();

  const menu = (toggleShareDialog, toggleTransferDialog) => (
    <Menu onClick={() => { }}>
      <Menu.Item key="1" onClick={toggleShareDialog}>
        Share
      </Menu.Item>
      <Menu.Item key="2" onClick={toggleTransferDialog}>
        Transfer
      </Menu.Item>      
    </Menu>
  );

  return (
    <div className="sell-page">
      <div className="sell-page-left">
        {
          item?.asset_type === 'video' ? <video style={{width:'50%'}} src={item?.file} autoPlay loop controls/> 
            : item?.asset_type === 'audio' ? <div><img src={item?.image} alt="cover logo"/><audio src={item?.file}  autoPlay loop controls/></div>
              : <Image src={item?.file} alt="logo"/>              
        } 
      </div>
      <div className="sell-page-right">
        <div className="sell-page-right-header">
          <div>
            <h1>{item?.name}</h1>
            {
              item?.auctionInfo ? 
                item?.auctionInfo.bidded ?                            
                  <p>Highest Bid <span>{formatNum(item?.auctionInfo.lastPrice)} {item?.auctionInfo.tokenSymbol}</span> </p>
                  :
                  <p>Minimum Bid <span>{formatNum(item?.auctionInfo.lastPrice)} {item?.auctionInfo.tokenSymbol}</span> </p>                                             
                :
                item?.pairInfo ?
                  item?.pairInfo.count > 1 ?
                    <p><span>From {formatNum(item?.pairInfo.price)} {item?.pairInfo.tokenSymbol} </span> {item?.pairInfo.totalBalance} of {item?.supply}</p>
                    :
                    <p><span> {formatNum(item?.pairs[0].price)} {item?.pairs[0].tokenSymbol} </span> {item?.pairs[0].balance} of {item?.supply}</p>                                                       
                  :
                  <p><span>Not for sale</span> {item?.supply} editions </p>                                             
                                      
            }
            
          </div>
          <div className="sell-page-header-action">
            <div className="sell-page-like"onClick={(event) => {
              event.stopPropagation();
              clickFavorite();
            }}>
              {
                didLike ?              
                  <HeartFilled style = {{color:'red'}}/>
                  : 
                  <HeartOutlined style = {{color:'gray'}}/>
              }               
              <p>{localLikeCount}</p>
            </div>
            <Dropdown
              onClick={() => { }}
              overlay={menu(toggleShareDialog, toggleTransferDialog)}
              trigger={["click"]}
              placement="bottomCenter"
            >
              <MoreOutlined />
            </Dropdown>
          </div>
        </div>
        <div className="sell-page-right-content">
          <h3>{item?.description}</h3>
          <div className="seperate-content">
            <div className="seperate-content-component">
              <h5>Creator<span> 10% royalties </span></h5>
              <div style={{display:'flex', alignItems:'center', marginTop:'10px'}}>
                <Avatar onClick={() => goToProfilePage(item?.creatorUser?.address)} style={{marginRight:'10px'}} size="large" src={item?.creatorUser?.profilePic} alt={'creator'} />
                <h3>{item?.creatorUser?.name}</h3>
              </div>
            </div>

            <div className="seperate-content-component">
              <h5>Collection</h5>
              <div style={{display:'flex', alignItems:'center', marginTop:'10px'}}>
                <Avatar onClick={goToCollectionPage} style={{marginRight:'10px'}} size="large" src={item?.collectionInfo?.image} alt={'creator'} />
                <h3>{item?.collectionInfo?.name}</h3>
              </div>
            </div>
          </div>
          
          <Tabs defaultActiveKey="1">
            <TabPane tab="Info" key="1">
              <InfoList item={item}/>
            </TabPane>
            <TabPane tab="Owners" key="2">
              <OwnersList {...props} item={item} account={account} setRefresh={setRefresh}/>
            </TabPane>
            <TabPane tab="History" key="3">
              <HistoryList item={item}/>
            </TabPane>            
          </Tabs>
        </div>
        <div className="sell-page-right-footer">
          <div className="sell-page-right-footer-separate"/>

          { item?.auctionInfo && 
            <div className="seperate-content">
              {
                item?.auctionInfo.bidded ?                             
                  <div className="seperate-content-component" style={{borderRight:'1px solid rgba(4, 4, 5, 0.1)'}}>
                    <h5><span>Highest bid by</span> {item?.auctionInfo?.bids[0]?.fromUser?.name}</h5>
                    <h2>{formatNum(item?.auctionInfo.lastPrice)} {item?.auctionInfo.tokenSymbol}</h2>
                    {/* <h5><span> $102</span></h5> */}
                  </div>
                  :
                  <div className="seperate-content-component" style={{borderRight:'1px solid rgba(4, 4, 5, 0.1)'}}>
                    <h5><span>Minimum Bid</span></h5>
                    <h2>{formatNum(item?.auctionInfo.lastPrice)} {item?.auctionInfo.tokenSymbol}</h2>
                    {/* <h5><span> $102</span></h5> */}
                  </div>
              }              

              <div className="seperate-content-component">
                <h5> <span>{auctionStatusMessage}</span></h5>
                {
                  auctionStatus &&
                  <div style={{display:'flex',justifyContent:'flex-start'}}>
                    <div className="time">
                      <div className="time-value">{state.days || '00'}</div>
                    </div>
                    <div className="time">
                      <div className="time-value">{state.hours || '00'}</div>
                    </div>
                    <div className="time">
                      <div className="time-value">{state.minutes || '00'}</div>
                    </div>
                    <div className="time">
                      <div className="time-value">{state.seconds || '00'}</div>
                    </div>
                  </div>
                }                
              </div>
            </div>
          }
          {
            (props.user && account) && 
            (
              item?.auctionInfo ?
                item.auctionInfo.user.address.toLowerCase() === account?.toLowerCase() ?
                  <div className="seperate-content">                              
                    <button className="sell-page-right-footer-full" onClick={toggleEndAuctionDialog}>End Auction</button>
                  </div>
                  :
                  <div className="seperate-content">                              
                    <button className="sell-page-right-footer-full" onClick={toggleAuctionBidDialog}>Place a bid</button>
                  </div>
                :
                holding > 0 &&  
                  (<div className="seperate-content">                    
                    <button className="sell-page-right-footer-left" onClick={togglePutSaleDialog}>Put on sale</button>                                     
                  </div>)
            )
          }          
        </div>
      </div>
      {
        item &&
        <PutSaleDialog
          item={item}
          holding={holding}
          setRefresh={setRefresh}
          modalVisible={putSaleDialog}
          toggleDialog={togglePutSaleDialog}
        />
      }
      {
        item && item?.auctionInfo &&
        <EndAuctionDialog
          item={item}
          setRefresh={setRefresh}
          modalVisible={endAuctionDialog}
          toggleDialog={toggleEndAuctionDialog}
        />
      } 
      {
        item && item?.auctionInfo &&
        <AuctionBidDialog
          item={item}
          setRefresh={setRefresh}
          ethBalance={ethBalance}
          pollBalance={pollBalance}
          modalVisible={auctionBidDialog}
          toggleDialog={toggleAuctionBidDialog}
        />
      }  
      {
        item &&
        <TransferDialog
          item={item}
          holding={holding}          
          setRefresh={setRefresh}
          modalVisible={transferdDialog}
          toggleDialog={toggleTransferDialog}
        />
      }   
      
      <ShareDialog
        modalVisible={shareDialog}
        toggleDialog={toggleShareDialog}
        shareUrl={`${process.env.REACT_APP_HOST}/detail/${collection}/${tokenId}`}
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

export default ItemDetail;
