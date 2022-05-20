import React, { useState } from "react";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Modal, Spin } from "antd";
import Snackbar from '@material-ui/core/Snackbar';

import { finalizeAuction } from "../../utils/contracts";


import "./Dialog.css";

const EndAuctionDialog = ({ modalVisible, toggleDialog, item, setRefresh }) => {
    
  const { account, chainId, library } = useWeb3React();
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [loading, setLoading] = useState(false)   
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const setProgressOn = () => {
    setLoading(true)
    if (account) {
      setLoading(true)
      finalizeAuction(
        item.auctionInfo.auctionId,
        chainId,
        library.getSigner()
      ).then((result) => {
          if (result) {
            axios.get(`/api/sync_block`)
            .then((res) => {
              setSnackBarMessage("Auction is ended. Data will be updated after some block confirmation");
              setOpenSnackbar(true);                    
              setLoading(false);
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
            setSnackBarMessage("Failed Transaction on ending auction");                
            setOpenSnackbar(true);
            setLoading(false);
          }
      });
    }      
  }

  return (
    <>
    <Modal
      title="End Auction"
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
          <p><span>Are you sure you want to end this auction ?</span></p>
          <div className="purchase-dialog-action">
            <button onClick={setProgressOn} className="proceed-btn">End Auction</button>            
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

export default EndAuctionDialog;
