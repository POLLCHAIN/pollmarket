/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState,useEffect } from "react";
import { useWeb3React } from '@web3-react/core'

import "react-datepicker/dist/react-datepicker.css";
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Input, Form } from "antd";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';

import { formatNum, getUSDRateFromSymbol } from "../../utils";
import { getIpfsHash } from "../../utils/ipfs";
import { addMultiItem, listMultiItem } from "../../utils/contracts";

import CreateFun from "../../functions/CreateFun";
import Preview from "../Preview/Preview";
import "./CreateSingle.css";
import CreateForm from "../Form/CreateForm";
import DialogFun from "../../functions/DialogFun";
import CreateCollectionDialog from "../Dialogs/CreateCollectionDialog";

import FixedIcon from "../../assets/svg/icon_fixed.svg";
import FreeIcon from "../../assets/svg/icon_free.svg";

const CreateMultiple = (props) => {
  const { pickMainFile, mainFile, mediaType, removeMainFile, mainFileUploading,
    pickCoverImage, coverImage, removeCoverImage, coverImgUploading } = CreateFun();

  const { account, chainId, library } = useWeb3React();
      
  const [saleType, setSaleType] = useState("not_for_sale");
  const [currency, setCurrency] = useState("POLL"); 
  const [rate, setRate] = useState("1.0");   
  
  const [price, setPrice] = useState(0);



  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [royalty, setRoyalty] = useState(0);
  const [supply, setSupply] = useState(1);
  const [category, setCategory] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collections, setCollections] = useState([]);  

  const [properties, setProperties] = useState([]);

  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [confirming, setConfirming] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if(currency) {      
      getUSDRateFromSymbol(currency)
        .then((rate) => {          
          setRate(rate)
        })
        .catch(() => {
          setRate(0)
        })
    }    
  }, [currency])

  useEffect(() => {
    if (props.user && collections.length === 0) updateCollection();
  }, [props.user, selectedCollection]);
  function updateCollection() {
    axios.get(`/api/collection?ownerAddress=${props.user.address}&type=multi`)
      .then((res) => {
          console.log("res: ", res);
          setCollections(res.data.collections);
          res.data.collections.forEach((item, i) => {
              if (item.isPublic) {
                  setSelectedCollection(item);
              }
          });
      })
      .catch((err) => {
          console.log("err: ", err.message);
          setCollections([]);
      });
  };

  const nameChange = (e) => {
    setName(e.target.value);
  };
  const descriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const royaltyChange = (e) => {
    setRoyalty(e.target.value);
  };
  const supplyChange = (e) => {
    setSupply(e.target.value);
  };
  const categoryChange = (value) => {
    setCategory(value);
  };

  function propertiesChange(values) {
    setProperties(values)
  }

  const selectMainFile = () => {
    document.getElementById("main-file-input").click();
  };
  const selectCoverImage = () => {
    document.getElementById("cover-image-input").click();
  };
  

  const {
    createCollDialog,
    toggleCreateCollDialog,    
  } = DialogFun();


  function confirmCreateItem() {
    if (!name){
      setSnackBarMessage("Please Input Title!")
      setOpenSnackbar(true)
      return
    } 
    if (!description){
      setSnackBarMessage("Please Input Description!")
      setOpenSnackbar(true)
      return
    }
    if (supply < 1){
      setSnackBarMessage("Please Input supply!")
      setOpenSnackbar(true)
      return
    }
    if (royalty > 20 || royalty < 1){
      setSnackBarMessage("Please Input Royalty Correctly!")
      setOpenSnackbar(true)
      return
    }
    if (!category){
      setSnackBarMessage("Please Select Category!")
      setOpenSnackbar(true)
      return
    }
    if (!selectedCollection){
      setSnackBarMessage("Please Select Collection!")
      setOpenSnackbar(true)
      return
    }
    if (!mainFile){
      setSnackBarMessage("Please Upload file!")
      setOpenSnackbar(true)
      return
    }
    if ((mediaType === "video" || mediaType === "audio") && !coverImage){
      setSnackBarMessage("Please Upload cover image!")
      setOpenSnackbar(true)
      return
    }

    let attributesData = [];
    for (let i = 0; i < properties.length; i++) {
      attributesData.push({
        trait_type: properties[i][0],
        value: properties[i][1],
      });
    }

    if ((saleType === 'fixed_price') && (price <= 0)) {
      setSnackBarMessage("Please input price correctly!")
      setOpenSnackbar(true)
      return
    }

    const openseadata = {
      name: name,
      description: description,
      image: coverImage,
      file: mainFile,
      asset_type: mediaType,
      attributes: attributesData,
      category:category
    };
    
    setConfirming(true)
    getIpfsHash(openseadata).then((hash) => {
      let tokenUri = `https://pollchain.mypinata.cloud/ipfs/${hash}`;      
      addMultiItem(
          selectedCollection.address,
          tokenUri,
          royalty,
          supply,
          chainId,
          library.getSigner()
      ).then((tokenId) => {
          if (tokenId) {
              if (saleType === 'fixed_price') {
                setSnackBarMessage("Item Created successfully, Listing Item...");
                setOpenSnackbar(true);
                listItem(tokenId)
              } else {
                axios.get(`/api/sync_block`)
                .then((res) => {
                    setSnackBarMessage("Item Created successfully. Data will be updated after some block confirmation");
                    setOpenSnackbar(true);
                    props.history.push(`/user/${account}`)
                    setConfirming(false);
                    return true;
                })
                .catch((error) => {
                    if (error.response) {
                        setSnackBarMessage(error.response.data.message);
                        setOpenSnackbar(true);
                        setConfirming(false);
                    }
                });
              }              
          } else {
              setSnackBarMessage("Failed Transaction on Creating Item");              
              setOpenSnackbar(true);
              setConfirming(false);
          }
      });
  });
    
  };


  function listItem(tokenId) {
    listMultiItem(
      selectedCollection.address,
      account,
      tokenId,
      supply,
      currency,
      price,
      chainId,
      library.getSigner()
    ).then((pairId) => {
        if (pairId) {            
            axios.get(`/api/sync_block`)
            .then((res) => {
                setSnackBarMessage("Item listed successfully Data will be updated after some block confirmation");
                setOpenSnackbar(true);
                props.history.push(`/user/${account}`)
                setConfirming(false);
                return true;
            })
            .catch((error) => {
                if (error.response) {
                    setSnackBarMessage(error.response.data.message);
                    setOpenSnackbar(true);
                    setConfirming(false);
                }
            });                        
        } else {
            setSnackBarMessage("Failed Transaction on Listing Item");
            setConfirming(false);
            setOpenSnackbar(true);
        }
    });
  }

  return (
    <div className="create-single-container">
      <Preview
        image={ coverImage}
        currency={currency}
        saleType={saleType}
        price={price}
        supply={supply}
        name={name}
        
      />
      <div className="create-single-upload">
        <h1>Create Multiple Collectible</h1>        
        <div className="upload-box-container">
          <p>Upload file</p>
          <div className="upload-box">
            {mainFile !== "" ? (
              <div>
                <CloseCircleFilled onClick={removeMainFile} />
                <div style={{display:'flex',justifyContent:'center'}}>
                  <img style = {{display : mediaType && mediaType === "image" ? "":"none"}} src={mainFile} alt="picked file" />
                  <audio style = {{display : mediaType && mediaType === "audio" ? "":"none"}} src={mainFile} autoPlay loop controls/>
                  <video style = {{display : mediaType && mediaType === "video" ? "":"none"}} src={mainFile} autoPlay loop controls/>
                </div>                
              </div>)
              : mainFileUploading ? (
                <div style={{display:'flex', height:'100px'}}>
                  <CircularProgress style={{margin:"auto", color: "red"}}/>
                </div>)
                : (
                <div className="upload-input">
                  <p>JPG, PNG, GIF, MP4 or MP3. Max 30mb</p>
                  <input
                    id="main-file-input"
                    className="upload-box-input"
                    onChange={pickMainFile}
                    type="file"
                    accept="image/*,audio/*,video/*"
                  />
                  <button onClick={selectMainFile}>Choose File</button>
                </div>)
            }
          </div>
        </div>
        
        <div className="upload-box-container" style={{display : mediaType && mediaType !== "image" ? '' : 'none'}}>
          <p>Upload Cover</p>
          <div className="upload-box">
            {coverImage !== "" ? (
              <div>
                <CloseCircleFilled onClick={removeCoverImage} />
                <div style={{display:'flex',justifyContent:'center'}}>
                  <img src={coverImage} alt="picked file" />
                </div>                 
              </div>) 
              : coverImgUploading ?  (
                <div style={{display:'flex', height:'100px'}}>
                  <CircularProgress style={{margin:"auto", color: "red"}}/>
                </div>)
                : (
                <div className="upload-input">
                  <p>JPG, PNG, GIF. Max 30mb</p>
                  <input
                    id="cover-image-input"
                    className="upload-box-input"
                    onChange={pickCoverImage}
                    type="file"
                    accept="image/*"
                  />
                  <button onClick={selectCoverImage}>Choose File</button>
                </div>)
            }
          </div>
        </div>
        
        <div className="create-context">
          <div className="switch-type">
            <h2 className="special-text">
              {
                saleType === "fixed_price" ? 
                  <>
                    {`Fixed Price`}
                  </>
                  :<>
                    {`Not for sale`}
                  </>
              } 

            </h2>
            <p>
              {
                saleType === "fixed_price" ? 
                  <>
                    {`Enter price to allow users instantly purchase your NFT`}
                  </>
                  : 
                  <>
                    {`You will own NFT in your wallet address`}
                  </>
              }
            </p>
          </div>
          <div className="regular-item" style={{display:'none'}}>
            <div className="regular-item-container">
              <div className={`regular-collection-card ${ saleType === "not_for_sale" ? "active" : "" }`}
                onClick={() => { setSaleType("not_for_sale")}}>
                <img src={FreeIcon} alt="not for sale" />
                <h3>Not for</h3>
                <h3>sale</h3>
              </div>
              <div className={`regular-collection-card ${ saleType === "fixed_price" ? "active" : "" }`}
                onClick={() => { setSaleType("fixed_price")}}>
                <img src={FixedIcon} alt="fixed price" />
                <h3>Fixed</h3>
                <h3>price</h3>
              </div>              
            </div>
          </div>
          
          {saleType === "fixed_price" && (
            <div className="regular-item">
              <Form.Item
                name="price"
                rules={[
                  { required: true, message: "'Price' must be a number" },
                ]}
              >
                <Input.Group size="large" style={{ display: "flex" }}>
                  <Input 
                    type="number"
                    value={price}
                    onChange={event => setPrice(event.target.value)}
                    placeholder="Enter price for one item" />
                  <select
                    className="regular-select-currency"
                    defaultValue={currency}
                    onChange={event => setCurrency(event.target.value)}
                    style={{ width: "96px", padding: "0 8px" }}
                  >
                    <option value="POLL">POLL</option>
                    <option value="ETH">ETH</option>                    
                  </select>
                </Input.Group>
              </Form.Item>
              <p>
                Service fee <span>10 %</span>
              </p>
              <p>
                You will receive <span>{`${formatNum(price * 0.9)} ${currency}`}</span> {` ≈ $ ${formatNum(rate * price * 0.9)}`}
              </p>
            </div>
          )}  

          <div className="regular-item">
            <h2>Choose Collection</h2>
            <div className="regular-item-container">
              <div
                className="regular-collection-card"
                onClick={toggleCreateCollDialog}
              >
                <PlusOutlined />
                <h2>Create</h2>
                <p>ERC-1155</p>
              </div>
              {
                collections.map((collection, index)=> {                             
                    return (
                      <div key={index} onClick={() => setSelectedCollection(collection)} className={`regular-collection-card ${ selectedCollection === collection ? "active" : "" }`} >
                        <img src={collection.image} alt="collection" />
                        <h2>{collection.name}</h2>
                        <p>ERC-1155</p>
                      </div>                        
                    );
                })
              }               
            </div>
          </div>
        </div>
        <CreateForm 
          nameChange={nameChange}
          descriptionChange={descriptionChange}
          royaltyChange={royaltyChange}
          supplyChange={supplyChange}
          confirmCreateItem={confirmCreateItem}
          propertiesChange={propertiesChange}
          categoryChange={categoryChange}
          confirming={confirming}
          type={"M"}/>
      </div>
      <CreateCollectionDialog
        modalVisible={createCollDialog}
        collectionType="multi"
        toggleDialog={toggleCreateCollDialog}
        updateCollection={updateCollection}
      /> 
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
    </div>
  );
};

export default CreateMultiple;
