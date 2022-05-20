import React, { useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { Modal, Spin } from "antd";
import DatePicker from 'react-datepicker'
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';

import "./Dialog.css";

import AuctionIcon from "../../assets/svg/icon_auction.svg";
import FixedIcon from "../../assets/svg/icon_fixed.svg";
import { listSingleItem, createAuction, listMultiItem } from "../../utils/contracts";
import { formatNum } from "../../utils";

const PutSaleDialog = ({ modalVisible, toggleDialog, item, holding, setRefresh }) => {

  const { account, chainId, library } = useWeb3React();
  const [saleType, setSaleType] = useState("fixed_price");
  const [symbol, setSymbol] = useState("POLL"); 
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);  
  
  const [startType, setStartType] = useState('now')
  const [startDate, setStartDate] = useState(null)
  const [endType, setEndType] = useState('1')
  const [endDate, setEndDate] = useState(null)
  
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [loading, setLoading] = useState(false)   
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  function setDefaultData(){
    setSaleType("fixed_price")
    setSymbol("POLL")    
    setPrice(0)
    setQuantity(1)
    setStartType("now")    
    setStartDate(null)    
    setEndType("1")    
    setEndDate(null)    
    setLoading(false)
  }


  const setProgressOn = () => {
    
    if (price <= 0) {
      setSnackBarMessage("Please input price correctly!")
      setOpenSnackbar(true)
      
      return
    }
    if (quantity <= 0 || quantity > holding) {
      setSnackBarMessage("Please input quantity correctly!")
      
      setOpenSnackbar(true)
      return
    }

    if ((saleType === 'timed_auction')) {
      // timed auction
      const currentTime = new Date().getTime()
      let startTimeStamp = 0
      if (startType === 'specific') {
        if (!startDate) {
          setSnackBarMessage("Please select start time.")
          
          setOpenSnackbar(true)
          return
        }
        const startTime = startDate.getTime()
        if (currentTime >= startTime) {
          setSnackBarMessage("The start time must be after the current time.")
          
          setOpenSnackbar(true)
          return
        }            
        startTimeStamp = Math.floor(startTime / 1000) 
      } else {
        startTimeStamp = Math.floor(currentTime / 1000)
      }
      
      let endTimeStamp = 0        
      if (endType === 'specific') {
        if (!endDate) {
          setSnackBarMessage("Please select end time.")
          
          setOpenSnackbar(true)
          return
        }
        const endTime = endDate.getTime()
        endTimeStamp = Math.floor(endTime / 1000)
        if (currentTime >= endTime) {
          setSnackBarMessage("The end time must be after the current time.")
          
          setOpenSnackbar(true)
          return
        } else {

        }
        if (startTimeStamp >= endTimeStamp) {
          setSnackBarMessage("The end time must be after the start time.")
          
          setOpenSnackbar(true)
          return
        } 
      } else {
        const later = Number(endType)
        endTimeStamp = startTimeStamp + 86400 * later
      }
      
      setLoading(true)
      createAuction(
        item.itemCollection,
        account,
        item.tokenId,
        symbol,
        price,
        startTimeStamp,
        endTimeStamp,
        chainId,
        library.getSigner()
      ).then((result) => {
          if (result) {
            axios.get(`/api/sync_block`)
            .then((res) => {
              setSnackBarMessage("Auction Created successfully. Data will be updated after some block confirmation");
              setOpenSnackbar(true);                    
              setDefaultData();
              toggleDialog();
              setRefresh(false);
            })
            .catch((error) => {
              if (error.response) {           
                setSnackBarMessage(error.response.data.message);
                setOpenSnackbar(true); 
                setLoading(false);                       
              }
            });
          } else {       
            setSnackBarMessage("Failed Transaction on creating auction");       
            console.log("Failed Transaction on creating auction")         
            setOpenSnackbar(true);
            setLoading(false);
          }
      });      
    } else {
      // fixed price
      setLoading(true)
      if (item.type === 'multi') {
        // list multiple item
        listMultiItem(
          item.itemCollection,
          account,
          item.tokenId,
          quantity,
          symbol,
          price,
          chainId,
          library.getSigner()
        ).then((pairId) => {
          if (pairId) {            
            axios.get(`/api/sync_block`)
            .then((res) => {
              setSnackBarMessage("Item listed successfully. Data will be updated after some block confirmation");
              setOpenSnackbar(true);
              setDefaultData();
              toggleDialog();
              setRefresh(false);
            })
            .catch((error) => {
              if (error.response) {
                setSnackBarMessage(error.response.data.message);
                setOpenSnackbar(true);
                setLoading(false);
              }
            });                        
          } else {
            setSnackBarMessage("Failed Transaction on Listing Item");
            setOpenSnackbar(true);
            setLoading(false);
          }
        });

      } else {
        //list single item
        listSingleItem(
          item.itemCollection,
          account,
          item.tokenId,
          symbol,
          price,
          chainId,
          library.getSigner()
        ).then((pairId) => {
          if (pairId) {            
            axios.get(`/api/sync_block`)
            .then((res) => {
              setSnackBarMessage("Item listed successfully. Data will be updated after some block confirmation");
              setOpenSnackbar(true);
              setDefaultData();
              toggleDialog();
              setRefresh(false);
            })
            .catch((error) => {
              if (error.response) {
                setSnackBarMessage(error.response.data.message);
                setOpenSnackbar(true);
                setLoading(false);     
              }
            });                        
          } else {
            setSnackBarMessage("Failed Transaction on Listing Item");            
            setOpenSnackbar(true);
            setLoading(false);     
          }
        });
      }      
    }
    
  }


  return (
    <>
    <Modal
      title="Put on sale"
      maskStyle={{background: 'rgba(0, 0, 0, .7)'}}
      style={{ top: 100 }}
      width={window.screen.width > 500 ? window.screen.width > 1024 ? "30vw": "60vw" : "90vw"}
      visible={modalVisible}
      onOk={toggleDialog}
      onCancel={toggleDialog}
      footer={[]}
    >
      <div className="purchase-dialog-main">
        {loading ?
          <div className="purchase-dialog-action">
            <Spin size="large" />
            <button className="disabled-btn">In Progress...</button>
          </div>
          :
          <div className="purchase-dialog">
            {item.type === 'single' &&
            <div className="regular-item">
              <div className="regular-item-container">
                <div className={`regular-collection-card ${ saleType === "fixed_price" ? "active" : "" }`}
                  onClick={() => { setSaleType("fixed_price")}}>
                  <img src={FixedIcon} alt="fixed price" />
                  <h3>Fixed</h3>
                  <h3>price</h3>
                </div>
                <div className={`regular-collection-card ${ saleType === "timed_auction" ? "active" : "" }`}
                  onClick={() => { setSaleType("timed_auction")}}>
                  <img src={AuctionIcon} alt="timed auction" />
                  <h3>Timed</h3>
                  <h3>auction</h3>
                </div>               
              </div>
            </div>
            }

            <div className="purchase-dialog-item">
              <h3>Price</h3>
              <div className="purchase-dialog-item-select">
                <input 
                  value={price}
                  type="number"
                  onChange={(e) => { setPrice(e.target.value) }}
                  bordered={false} 
                  placeholder="Enter price" />                  

                <select defaultValue={symbol}
                  onChange={event => setSymbol(event.target.value)}>
                    <option value="POLL">POLL</option>
                    <option value="ETH">ETH</option>                      
                </select>
              </div>
              <p>
                Service fee <span>10 %</span>
              </p>
              <p>
                You will receive <span>{`${formatNum(price * 0.9)} ${symbol}`}</span>
              </p>
            </div>

            {saleType === "timed_auction" &&
            <div className="regular-item">
              <div className="auction-time-container">
                <div className="auction-time-field">
                    <h3>Starting Date</h3>
                    <select className="auction-time-select" name={"starting_date"} defaultValue={startType} onChange={event => setStartType(event.target.value)}>
                        <option value={"now"}>Right after listing</option>
                        <option value={"specific"}>Pick specific date</option>
                    </select>
                    {
                        startType === "specific" &&
                        <DatePicker
                            selected={startDate}
                            onChange={value => setStartDate(value)}
                            className={"input-picker"}
                            showTimeSelect
                            dateFormat="Pp"                                            
                        />
                    }
                </div>
                <div className="auction-time-field">
                    <h3>Expiration Date</h3>
                    <select className="auction-time-select" name={"expiration_date"} defaultValue={endType} onChange={event => setEndType(event.target.value)}>
                        <option value={"1"}>1 day</option>
                        <option value={"3"}>3 days</option>
                        <option value={"5"}>5 days</option>
                        <option value={"7"}>7 days</option>
                        <option value={"specific"}>Pick specific date</option>
                    </select>
                    {
                        endType === "specific" &&
                        <DatePicker
                            selected={endDate}
                            onChange={value => setEndDate(value)}
                            className={"input-picker"}
                            showTimeSelect
                            dateFormat="Pp"                                            
                        />
                    }
                </div>
              </div>
            </div>
            }

            {item.type === 'multi' &&
            <div className="purchase-dialog-item">
              <h3>Enter quantity <span>({holding} available)</span></h3>
              <input 
                    value={quantity}
                    type="number"
                    onChange={(e) => { setQuantity(Math.floor(e.target.value)) }}
                    bordered={false} 
                    placeholder="Enter quantity" />              
            </div>  
            }  
            
            <div className="purchase-dialog-action">
              <button onClick={setProgressOn} className="proceed-btn">List Item</button>            
            </div>
          </div>
        }        
      </div>
             
    </Modal>
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
      open={openSnackbar}
      autoHideDuration={4000}
      onClose={handleClose}
      message={snackBarMessage}
      action={ <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
          </IconButton>
          </React.Fragment> }/>
    </>
  );
};

export default PutSaleDialog;
