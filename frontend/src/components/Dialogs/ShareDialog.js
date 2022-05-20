import React from "react";
import "./Dialog.css";
import { Modal } from "antd";

import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

const ShareDialog = ({ modalVisible, toggleDialog, shareUrl }) => {
  return (
    <Modal
      title="Share this NFT"
      maskStyle={{ background: "rgba(0, 0, 0, .7)" }}
      style={{ top: 200 }}
      width={window.screen.width > 500 ? "25vw": "90vw"}
      visible={modalVisible}
      onOk={toggleDialog}
      onCancel={toggleDialog}
      footer={[]}
    >
      <div className="share-dialog">
        
        <TwitterShareButton
          url={shareUrl}
          title={`Sharing this NFT from POLL MARKET`}
          hashtag="SNFT"
        >
          <TwitterIcon round size={48} />
        </TwitterShareButton>

        <FacebookShareButton
          url={shareUrl}
          quote={`Sharing this NFT from POLL MARKET`}
          hashtag="SNFT"
        >
          <FacebookIcon round size={48} />
        </FacebookShareButton>

        <TelegramShareButton
          url={shareUrl}
          title={`Sharing this NFT from POLL MARKET`}
        >
          <TelegramIcon round size={48} />
        </TelegramShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={`Sharing this NFT from POLL MARKET`}>
          <EmailIcon round size={48}/>
        </EmailShareButton>

        <PinterestShareButton
          url={shareUrl}
          description={`Sharing this NFT from POLL MARKET`}
          media="shareUrl"
        >
          <PinterestIcon round size={48} />
        </PinterestShareButton>
      </div>
    </Modal>
  );
};

export default ShareDialog;
