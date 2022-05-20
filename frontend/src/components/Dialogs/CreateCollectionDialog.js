import { Form } from "antd";
import React, { useState } from "react";
import { useWeb3React } from '@web3-react/core'

import axios from 'axios'
import { Modal } from "antd";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';

import "./Dialog.css";
import { getIpfsHash } from "../../utils/ipfs";
import { createNewCollection } from "../../utils/contracts";
import Preview from "../../assets/svg/preview.svg";
import CreateFun from "../../functions/CreateFun";

const CreateCollectionDialog = ({
  modalVisible,
  collectionType,
  toggleDialog,
  updateCollection,
}) => {
  const { account, chainId, library } = useWeb3React();

  const [name, setName] = useState("");
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [description, setDescription] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const { pickCollection, collectionImage, removeCollectionImage, collectionImgUploading } = CreateFun();
  const [creating, setCreating] = useState(false)

  const selectFile = () => {
    document.getElementById("my-file").click();
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const createCollection = async () => {
    if (collectionImage === "") {
      setSnackBarMessage("Please select image")
      setOpenSnackbar(true) 
      return
    }
    if (name === "") {
      setSnackBarMessage("Please Input Collection Name")
      setOpenSnackbar(true) 
      return
    }
    if (name !== "") {
      // create new collection
      axios.get(`/api/collection/exist?name=${name}`)
        .then((res) => {
          setSnackBarMessage("Collection Name is already existed!")
          setOpenSnackbar(true)
          return;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            const openseadata = {
              name: name,
              description: description,
              image: collectionImage,
              short_url: shortUrl          
            };
            setCreating(true)
            getIpfsHash(openseadata).then((hash) => {
              let uri = `https://pollchain.mypinata.cloud/ipfs/${hash}`;
              let from = 'SingleFixed'
              if (collectionType === 'multi') {
                from = 'MultipleFixed'
              }
              createNewCollection(
                from,
                name,
                uri,
                false,
                chainId,
                library.getSigner()
              ).then((result) => {
                  if (result) {
                      axios.get(`/api/sync_block`)
                      .then((res) => {
                          setSnackBarMessage("Collection is created. Data will be updated after some block confirmation");
                          setOpenSnackbar(true);                    
                          setCreating(false);
                          toggleDialog();
                          removeCollectionImage();
                          updateCollection();
                      })
                      .catch((error) => {
                          if (error.response) {
                              setSnackBarMessage(error.response.data.message);
                              setOpenSnackbar(true);
                              setCreating(false);
                          }
                      });
                  } else {
                      setSnackBarMessage("Failed Transaction");
                      setOpenSnackbar(true);
                      setCreating(false);                
                  }
              });
            });
          }
        });
      
    }
  };
  
  return (
    <Modal
      title="Create a collection"
      maskStyle={{ background: "rgba(0, 0, 0, .7)" }}
      style={{ top: 50 }}
      width={"350px"}
      visible={modalVisible}
      onOk={toggleDialog}
      onCancel={toggleDialog}
      footer={[]}
    >
      {
        account?
        <div className="create-coll-dialog">
          <div className="create-coll-top">
            {
              collectionImgUploading ? 
                <div style={{display:'flex', width:'100px', height:'100px'}}><CircularProgress style={{margin:"auto", color: "red"}}/></div>                
                :
                <img src={collectionImage === "" ? Preview : collectionImage} alt="profile"/>
            }          

            <div className="create-coll-header">
              <p>Recommend an image of at least 400x400. Gifs work too.</p>
              <div className="create-coll-upload">
                <input onClick={selectFile} type="button" id="my-button" value="Select Files"/>              
              </div>
              <input onChange={pickCollection} type="file" accept="image/*" name="my_file" id="my-file" />
            </div>
          </div>
          <Form className="create-coll-dialog-container">
            <Form.Item  className="purchase-dialog-item"
              rules={[{ required: true, message: "Name is not allowed to be empty" },]} >
              <div>
                <h3> Display name <span>(required)</span> </h3>
                <input value={name} 
                  onChange={(e) => { setName(e.target.value) }} 
                  placeholder="Enter collection name" />
              </div>            
            </Form.Item>

            <Form.Item className="purchase-dialog-item">
              <h3>Description <span>(optional)</span></h3>
              <input value={description} 
                onChange={(e) => { setDescription(e.target.value) }} 
                placeholder="Describe something about the collection" />
            </Form.Item>

            <Form.Item className="purchase-dialog-item">
              <h3> Short url <span>(optional)</span></h3>
              <input value={shortUrl} 
                onChange={(e) => { setShortUrl(e.target.value) }} 
                placeholder="Enter short url" />            
            </Form.Item>

            <Form.Item className="purchase-dialog-item">
              <button onClick={createCollection} disabled={creating} htmlType="submit">              
                {
                    creating? <CircularProgress style={{width: "16px", height: "16px", color: "white"}}/>
                    :
                    <> Submit </>
                }
              </button>
            </Form.Item>
          </Form>
        </div>
          :
        <></>
      }      
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
    </Modal>    
  );
};

export default CreateCollectionDialog;
