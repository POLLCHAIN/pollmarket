import React, { useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { Modal, Spin } from "antd";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';

import "./Dialog.css";

import { transferSingleItem, transferMultiItem } from "../../utils/contracts";


const TransferDialog = ({ modalVisible, toggleDialog, item, holding, setRefresh }) => {

  const { account, chainId, library } = useWeb3React();
  const [receiver, setReceiver] = useState('');  
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
    setReceiver('')
    setLoading(false)
  }

  const setProgressOn = () => {    
    if (quantity <= 0 || quantity > holding) {
      setSnackBarMessage("Please input quantity correctly!")      
      setOpenSnackbar(true)
      return
    }
    if (receiver === '') {
      setSnackBarMessage("Please input receiver address!")      
      setOpenSnackbar(true)
      return
    }
    setLoading(true)
    if (item.type === 'multi') {
      // multiple item transfer
      transferMultiItem(
        item.itemCollection,
        account,
        receiver,
        item.tokenId,
        quantity,
        chainId,
        library.getSigner()
      ).then((result) => {
        if (result) {            
          axios.get(`/api/sync_block`)
          .then((res) => {
            setSnackBarMessage("Items have been transfered. Data will be updated after some block confirmation");
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
          setSnackBarMessage("Failed Transaction on Transfering Items");
          setOpenSnackbar(true);
          setLoading(false);
        }
      });

    } else {
      //single item transfer
      transferSingleItem(
        item.itemCollection,
        account,
        receiver,
        item.tokenId,
        chainId,
        library.getSigner()
      ).then((result) => {
        if (result) {            
          axios.get(`/api/sync_block`)
          .then((res) => {
            setSnackBarMessage("Item have been transfered. Data will be updated after some block confirmation");
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
          setSnackBarMessage("Failed Transaction on Transfering Item");            
          setOpenSnackbar(true);
          setLoading(false);     
        }
      });
    }  
  }

  return (
    <>
      <Modal
        title="Transfer token"
        maskStyle={{background: 'rgba(0, 0, 0, .7)'}}
        style={{ top: 100 }}
        width={window.screen.width > 500 ? "25vw": "90vw"}
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
            <p> You can transfer tokens from your address to another </p>
            <div className="purchase-dialog-item">
                <h3>Receiver address</h3>
                <div className="purchase-dialog-item-select">
                  <input
                    value={receiver}
                    onChange={(e) => { setReceiver(e.target.value) }} 
                    bordered={false} 
                    placeholder="Enter address" />                
              </div>
            </div>

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
              <button onClick={setProgressOn} className="proceed-btn">Continue</button>            
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

export default TransferDialog;
