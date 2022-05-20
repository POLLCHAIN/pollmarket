import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Modal, Spin } from "antd";
import Snackbar from '@material-ui/core/Snackbar';
import { formatNum } from "../../utils";

import { singleBuy, multipleBuy, getTokenBalance } from "../../utils/contracts";

import "./Dialog.css";

const BuyItemDialog = ({ modalVisible, toggleDialog, item, pair, setRefresh}) => {

  const { account, chainId, library } = useWeb3React();  
  const [balance, setBalance] = useState(0)
     
  const [quantity, setQuantity] = useState(1);

  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [loading, setLoading] = useState(false)   
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  function setDefaultData(){
    setQuantity(1)
    setLoading(false)
  }

  useEffect(() => {
    if(account && library && pair) {
      // get ETH balance
      getTokenBalance(account, pair.tokenSymbol, chainId, library)
        .then((balance) => {
          setBalance(Number(balance))
        })
        .catch(() => {
          setBalance(0)
        })    
    }
    return () => {
      setBalance(0)         
    }
  }, [account, chainId, library, pair])

  const setProgressOn = () => {
    if (quantity <= 0 || quantity > pair.balance) {
      setSnackBarMessage("Please input quantity correctly!")
      setOpenSnackbar(true)
      return
    }

    if (balance < pair.price * quantity) {
      setSnackBarMessage("Your don't have enough funds")
      setOpenSnackbar(true)
      return
    }
    setLoading(true)
    if (pair.type === 'multi') {
      // multiple item buy
      multipleBuy(
        account,
        pair.pairId,
        quantity,
        pair.tokenSymbol,
        pair.price,
        chainId,
        library.getSigner()
      ).then((result) => {
          if (result) {
            axios.get(`/api/sync_block`)
            .then((res) => {
              setSnackBarMessage("Multiple Buy Success. Data will be updated after some block confirmation");
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
            setSnackBarMessage("Failed Transaction on buying multiple nft");                
            setOpenSnackbar(true);
            setLoading(false);
          }
      });
    } else {
      // single item buy
      singleBuy(
        account,
        pair.pairId,
        pair.tokenSymbol,
        pair.price,
        chainId,
        library.getSigner()
      ).then((result) => {
          if (result) {
            axios.get(`/api/sync_block`)
            .then((res) => {
              setSnackBarMessage("Single Buy Success. Data will be updated after some block confirmation");
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
            setSnackBarMessage("Failed Transaction on buying nft");                
            setOpenSnackbar(true);
            setLoading(false);
          }
      });
    }    
  }

  return (
    <>
    <Modal
      title="Buy"
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
          <p>
            You are about to purchase <span>{item.name}</span>{" "}
            from <span>{pair.user.name}</span>
          </p>
          <div className="purchase-dialog-item">
              <div className="purchase-dialog-item-select">
                <p> Price :  </p>
                <p> <span> {`${formatNum(pair.price)} ${pair.tokenSymbol}`} </span> for each </p>
            </div>
          </div>
          {item.type === 'multi' &&
          <div className="purchase-dialog-item">
            <h3>Enter quantity <span>({pair.balance} available)</span></h3>
            <input 
              value={quantity}
              type="number"
              onChange={(e) => { setQuantity(Math.floor(e.target.value)) }}
              bordered={false} 
              placeholder="Enter quantity" />              
          </div>  
          }  
          <div className="purchase-dialog-item flex-container">
            <p>Your balance</p>
            <h4>{`${formatNum(balance)} ${pair.tokenSymbol}`}</h4>
          </div>
          <div className="purchase-dialog-item flex-container">
            <p>You will pay</p>
            <h4>{`${formatNum(pair.price * quantity)} ${pair.tokenSymbol}`}</h4>
          </div>
          <div className="purchase-dialog-action">
            <button onClick={setProgressOn} className="proceed-btn">Buy</button>            
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

export default BuyItemDialog;
