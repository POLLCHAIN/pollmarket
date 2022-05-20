/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom"
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import Querystring from 'query-string'

import { CopyOutlined, EllipsisOutlined, GlobalOutlined, ShareAltOutlined, MailOutlined } from "@ant-design/icons";
import ReadMoreReact from "read-more-react";
import { useHistory } from "react-router";
import { EmailShareButton, EmailIcon,
  FacebookShareButton, FacebookIcon,
  TelegramShareButton, TelegramIcon,
  TwitterShareButton, TwitterIcon,
} from "react-share";
import { Dropdown, Menu } from "antd";

import { shorter } from "../../utils";

import "./MyHeader.css";
import DialogFun from "../../functions/DialogFun";
import ReportDialog from "../Dialogs/ReportDialog";
import ThanksDialog from "../Dialogs/ThanksDialog";


const MyHeader = (props) => {
  let { address } = useParams(); 
  const { user, login} = props; 
  const [userProfile, setUserProfile] = useState(undefined)
  const { account, library } = useWeb3React();
  const [didFollow, setDidFollow] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)



  const history = useHistory();  

  const goToEditPage = () => {
    history.push("/edit");
  };

  useEffect(() => {        
    getUser()        
  }, [address])

  useEffect(() => {
    if(!!user) {
      login();
    }
  }, [user, account, library])

  function getUser(){
    axios.get(`/api/user_info/${address ? address : ""}`)
    .then(res => {
      setUserProfile(res.data.user)                
    })
  }
  useEffect(() => {
      if (userProfile){          
          if (account) {
              setDidFollow(userProfile.followers && userProfile.followers.includes(account.toLowerCase()))
          }          
      }
  }, [userProfile, account])


  function clickFollow() {
    if (account && address) {
        if (!isFollowing){
          setIsFollowing(true)          
          setDidFollow(i => !i)
          axios.post("/api/user/follow", Querystring.stringify({from: account.toLowerCase(), to: address.toLowerCase()}))
          .then(res => {
            setIsFollowing(false)
          })
          .catch(err => {
            setIsFollowing(false)
          })
        }
    }        
  }

  const {
    toggleReportDialog,
    reportDialog,
    thanksDialog,
    toggleThanksDialog,
  } = DialogFun();

  const shareMenu = (
    <Menu onClick={() => { }}>
      <div className="social-share-body">
        <h3 className="social-share-title">Share link to this page</h3>
        <div className="social-share-tags">
          <TwitterShareButton
            url={`${process.env.REACT_APP_HOST}/user/${address}`}
            title={`Sharing user profile from POLL MARKET`}
            hashtag="POLL MARKET"
          >
            <TwitterIcon round size={48} />
          </TwitterShareButton>
          
          <FacebookShareButton
            url={`${process.env.REACT_APP_HOST}/user/${address}`}
            quote={`Sharing user profile from POLL MARKET`}
            hashtag="POLL MARKET"
          >
            <FacebookIcon round size={48} />
          </FacebookShareButton>

          <TelegramShareButton
            url={`${process.env.REACT_APP_HOST}/user/${address}`}
            title={`Sharing user profile from POLL MARKET`} >
            <TelegramIcon round size={48} />
          </TelegramShareButton>

          <EmailShareButton
            url={`${process.env.REACT_APP_HOST}/user/${address}`}
            subject={`Sharing user profile from POLL MARKET`} >
            <EmailIcon round size={48}  />
          </EmailShareButton>
        </div>
      </div>
    </Menu>
  );

  const moreMenu = (toggleReportDialog) => (
    <Menu>
      <Menu.Item onClick={toggleReportDialog} key="1">
        Report page
      </Menu.Item>
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
          src={userProfile && userProfile.profilePic ? userProfile.profilePic : "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"}
          alt="user profile"
        />
        <div className="user-content-box">
          <div className="user-content">
            <h1>{userProfile && userProfile.name ? userProfile.name : "NoName"}</h1>
            <div className="user-address">
              <h2>{`${shorter(address)}`}</h2>
              <CopyOutlined onClick={() => copyToClipboard(address)}/>
            </div>
            {
              userProfile && userProfile.bio ? 
                <ReadMoreReact
                  text={ `${userProfile.bio}`}
                  min={1}
                  ideal={50}
                  max={100}
                  readMoreText="Read more"
                />
                :
                <></>
            }
                        
            {/* <h4>
              Background: Advisor is a boutique firm of financial and investment
              strategists, with a long history of helping their clients develop
              and act on plans to achieve their financial goals.
            </h4> */}
            <p style = {{display: userProfile && userProfile.emailAddress ? '' : 'none'}}>
              <span>
                <MailOutlined />
              </span>{` ${userProfile?.emailAddress}`}              
            </p>

            <p style = {{display: userProfile && userProfile.personalLink ? '' : 'none'}}>
              <span>
                <GlobalOutlined />
              </span>{` ${userProfile?.personalLink}`}              
            </p>
          </div>
          <div className="user-setting-container">
            <div className="user-setting">

              {
                account ?                 
                  account.toLowerCase() !== address.toLowerCase() ? (
                    <button
                      onClick={() => clickFollow()}
                      className="edit-cover-btn"
                    >
                      {didFollow ? "Unfollow" : "Follow"}
                    </button>
                  ) : (
                    <button onClick={goToEditPage}>Edit Profile</button>
                  )                 
                : 
                  <></>                
              }
              <Dropdown
                overlay={shareMenu}
                trigger={["click"]}
                placement="bottomCenter"
              >
                <ShareAltOutlined />
              </Dropdown>
              <Dropdown                
                overlay={moreMenu(toggleReportDialog)}
                trigger={["click"]}
                placement="bottomCenter"
              >
                <EllipsisOutlined style={{display:'none'}}/>
              </Dropdown>
            </div>            
          </div>
        </div>
      </div>
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

export default MyHeader;
