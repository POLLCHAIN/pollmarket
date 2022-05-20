import React, { useState } from "react";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Modal, Spin } from "antd";
import Snackbar from '@material-ui/core/Snackbar';
import { formatNum } from "../../utils";

import { bidOnAuction } from "../../utils/contracts";


import "./Dialog.css";

const AuctionBidDialog = ({ modalVisible, toggleDialog, item, setRefresh,ethBalance,pollBalance }) => {

    const { account, chainId, library } = useWeb3React();
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [price, setPrice] = useState(0);

    const [loading, setLoading] = useState(false)   
    
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') return;
      setOpenSnackbar(false);
    };
    function setDefaultData(){
      setPrice(0)
      setLoading(false)
    }

    const setProgressOn = () => {
      if (item?.auctionInfo.bidded) {
        if (price < item?.auctionInfo.lastPrice * 1.03) {
          setSnackBarMessage("Your bid must be 3% higher than current bid!")
          setOpenSnackbar(true)
          return
        }
      } else {
        if (price < item?.auctionInfo.lastPrice) {
          setSnackBarMessage("Bid price have to be high than minimum price!")
          setOpenSnackbar(true)
          return
        }
      }
      
      if (price <= 0) {
        setSnackBarMessage("Please input price correctly!")
        setOpenSnackbar(true)
        return
      }
      if ((item?.auctionInfo.tokenSymbol === 'ETH' && ethBalance < price)||((item?.auctionInfo.tokenSymbol === 'POLL' && pollBalance < price))) {
        setSnackBarMessage("Your available balance is less than the bid price!")
        setOpenSnackbar(true)
        return
      }

      setLoading(true)
      bidOnAuction(
        account,
        item.auctionInfo.auctionId,
        item.auctionInfo.tokenSymbol,
        price,
        chainId,
        library.getSigner()
      ).then((result) => {
        if (result) {
          axios.get(`/api/sync_block`)
          .then((res) => {
            setSnackBarMessage("Auction Bid Success!. Data will be updated after some block confirmation");
            setOpenSnackbar(true);                    
            setDefaultData()
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
          setSnackBarMessage("Failed Transaction on auction bid");                
          setOpenSnackbar(true);
          setLoading(false);
        }
      });      
    }

  return (
    <>
    <Modal
      title="Place a bid"
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
          </div>:
        <div className="purchase-dialog">
          <p>Current Bid : 
            <span>{formatNum(item?.auctionInfo.lastPrice)} {item?.auctionInfo.tokenSymbol}</span>
          </p>
          <div className="purchase-dialog-item">
              <h3>Your bid</h3>
              <div className="purchase-dialog-item-select">
                <input 
                  value={price}
                  type="number"
                  onChange={(e) => { setPrice(e.target.value) }}
                  bordered={false} 
                  placeholder="Enter bid" />
                <p><span> {item?.auctionInfo.tokenSymbol} </span></p>
                
            </div>
          </div>          
           
          <div className="purchase-dialog-item flex-container">
            <p>Your balance</p>
            <h4>{item?.auctionInfo.tokenSymbol === 'ETH' ? formatNum(ethBalance):formatNum(pollBalance)} {item?.auctionInfo.tokenSymbol}</h4>
          </div>          
          <div className="purchase-dialog-action">
            <button onClick={setProgressOn} className="proceed-btn">Place a bid</button>            
          </div>
        </div>
        }
      </div>
      
    </Modal>
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
      open={openSnackbar}
      autoHideDuration={3000}
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

export default AuctionBidDialog;
