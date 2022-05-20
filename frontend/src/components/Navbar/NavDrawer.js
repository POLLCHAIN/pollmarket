import { useWeb3React } from '@web3-react/core'

import TwitterIcon from "../../assets/images/icon-twitter.png";
import TelegramIcon from "../../assets/images/icon-telegram.png";
import MediumIcon from "../../assets/images/icon-medium.png";

import { Drawer } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NavDrawer = (props) => {
  const { showDrawer, showMobileDrawer, connectAccount, showCreateDialog } = props
  const { account } = useWeb3React();
  

  const showConnect = () => {
    connectAccount();
    showMobileDrawer();
  };

  const showCreate = () => {
    showCreateDialog();
    showMobileDrawer();
  };

  function openPageLink(url) {
    window.open(url);
  }

  return (
    <div>
      <Drawer
        title="POLL MARKET"
        placement="top"
        height="90vh"
        closable={true}
        onClose={showMobileDrawer}
        visible={showDrawer}
        key="top"
      >
        <div className="nav-drawer-body">
          <div>
            <div className="nav-drawer-first">
              <Link to="/">
                <h2 onClick={showMobileDrawer}>Market</h2>
              </Link>
              <Link style={{display: account? '' : 'none'}} to={`/user/${account}`}>
                <h2 onClick={showMobileDrawer}>My Profile</h2>
              </Link>
              <Link style={{display: account? '' : 'none'}} to="/activity">
                <h2 onClick={showMobileDrawer}>Activity</h2>
              </Link>
              <Link to="/how-it-work">
                <h2 onClick={showMobileDrawer}>How it works</h2>
              </Link>
            </div>            
          </div>
          <div className="nav-drawer-third">
            <div className="drawer-social-box">
              <img src={TwitterIcon} alt="Twitter"
                onClick={() => openPageLink("https://mobile.twitter.com/pollchain")}
              />
              {/* <img src={DiscordIcon} alt="Discord"
                onClick={() =>
                  openPageLink(
                    "https://discord.com/invite/qKCfj3SXSV"
                  )
                }
              /> */}
              <img src={TelegramIcon} alt="Telegram"
                onClick={() =>
                  openPageLink(
                    "https://t.me/pollchain"
                  )
                }
              />
              <img src={MediumIcon} alt="Medium" 
                onClick={() =>
                  openPageLink(
                    "https://medium.com/@pollchain"
                  )
                }
              />
            </div>
            <div className="drawer-action-box">
              {!account ? (
                <div className="nav-actions-container">              
                  <button onClick={showConnect} className="connect-button">
                    Sign in
                  </button>
                </div>
              ) : (
                <div className="nav-actions-container">
                  <button onClick={showCreate} className="create-button">
                    Create
                  </button>                
                </div>
              )}              
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default NavDrawer;
