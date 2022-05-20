/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom"

import axios from 'axios'

import { CopyOutlined, GlobalOutlined, ShareAltOutlined } from "@ant-design/icons";
import ReadMoreReact from "read-more-react";
import { Dropdown, Menu } from "antd";
import { EmailShareButton, EmailIcon,
  FacebookShareButton, FacebookIcon,
  TelegramShareButton, TelegramIcon,
  TwitterShareButton, TwitterIcon,
} from "react-share";


import "./MyHeader.css";
import { shorter } from "../../utils";

const MyHeader = () => {
  let { address } = useParams();
  const [collectionInfo, setCollectionInfo] = useState(undefined)

  useEffect(() => {        
    getCollectionInfo()        
  }, [address])

  function getCollectionInfo(){
    axios.get(`/api/collection/detail?address=${address ? address : ""}`)
    .then(res => {
      setCollectionInfo(res.data.collection)                
    })
  }
  
  const shareMenu = (
    <Menu onClick={() => { }}>
      <div className="social-share-body">
        <h3 className="social-share-title">Share link to this page</h3>
        <div className="social-share-tags">
          <TwitterShareButton
            url={`${process.env.REACT_APP_HOST}/collection/${address}`}
            title={`Sharing this NFT Collection from POLL MARKET`}
            hashtag="SNFT"
          >
            <TwitterIcon round size={48} />
          </TwitterShareButton>
          
          <FacebookShareButton
            url={`${process.env.REACT_APP_HOST}/collection/${address}`}
            title={`Sharing this NFT Collection from POLL MARKET`}
            hashtag="SNFT"
          >
            <FacebookIcon round size={48} />
          </FacebookShareButton>

          <TelegramShareButton
            url={`${process.env.REACT_APP_HOST}/collection/${address}`}
            title={`Sharing this NFT Collection from POLL MARKET`}
          >
            <TelegramIcon round size={48} />
          </TelegramShareButton>

          <EmailShareButton
            url={`${process.env.REACT_APP_HOST}/collection/${address}`}
            title={`Sharing this NFT Collection from POLL MARKET`}
          >
            <EmailIcon round size={48}  />
          </EmailShareButton>
        </div>
      </div>
    </Menu>
  );

  const copyToClipboard = (text) => {
    console.log('text', text)
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  return (
    <div className="my-header">
      <div className="my-header-cover">
        <img
          src={
            "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v960-ning-30.jpg?w=600&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=afa67305d57120833e3facc8c508bf8a"
          }
          alt="my items cover"
        />        
      </div>
      <div className="my-header-user-context">
        <img
          src={collectionInfo && collectionInfo.image ? collectionInfo.image : "https://pollchain.mypinata.cloud/ipfs/QmWRV3SE8HcLEgWx1pzHYTXbHDarWB51BRwvTtEtZ5Xwnk"}
          alt="user profile"
        />
        <div className="user-content-box">
          <div className="user-content">
            <h1>{collectionInfo?.name}</h1>
            <div className="user-address">
              <h2>{`${shorter(address)}`}</h2>
              <CopyOutlined  onClick={() => copyToClipboard(address)}/>
            </div>
            {
              collectionInfo && collectionInfo.description ? 
                <ReadMoreReact
                  text={ `${collectionInfo.description}`}
                  min={1}
                  ideal={50}
                  max={100}
                  readMoreText="Read more"
                />
                :
                <></>
            }
            <p style = {{display: collectionInfo && collectionInfo.short_url ? '' : 'none'}}>
              <span>
                <GlobalOutlined />
              </span>{` ${collectionInfo?.short_url}`}              
            </p>            
          </div>
          <div className="user-setting-container">
            <div className="user-setting">              
              <Dropdown
                overlay={shareMenu}
                trigger={["click"]}
                placement="bottomCenter"
              >
                <ShareAltOutlined />
              </Dropdown>              
            </div>            
          </div>
        </div>
      </div>          
    </div>
  );
};

export default MyHeader;
