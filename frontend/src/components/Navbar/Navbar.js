import React, {useState,useEffect} from "react";
import { useWeb3React } from '@web3-react/core'

import "./Navbar.css";
import Logo from "../../assets/png/header-logo.png";
import UserIcon from "../../assets/png/user.png";
import ConnectIcon from "../../assets/images/connect.png";

import {
  MenuOutlined,
  PlusCircleOutlined,
  SearchOutlined,    
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { Input } from "antd";
import { Link, useHistory } from "react-router-dom";
import SearchDrop from "../Search/SearchDrop";
import CreateDialogFun from "../../functions/CreateDialogFun";
import CreateDialog from "../CreateDialog/CreateDialog";

import NavDrawer from "./NavDrawer";
import MobileDrawerFun from "../../functions/MobileDrawerFun";
import SearchMobile from "../Search/SearchMobile";
import ProfileDrop from "../Profile/ProfileDrop";



const Navbar = (props) => {
  const {connectAccount} = props;
  const {account} = useWeb3React();
  const [searchTxt, setSearchTxt] = useState("")
  
  const history = useHistory();
  const [selected, setSelected] = useState(1);
  const [visibleSearch, setVisibleSearch] = useState(false);

  const profileMenu = () => (
    <ProfileDrop/>
  );

  const searchDrop = <SearchDrop {...props}/>;
  const searchMobile = (setVisibleSearch) => (
    <SearchMobile {...props} setVisibleSearch={setVisibleSearch} />
  );

  useEffect(() => {
    window.localStorage.setItem('searchTxt', searchTxt);  
  }, [searchTxt])
  
  const changeSearchTxt = (value) => {
    setSearchTxt(value); 
    window.localStorage.setItem('searchTxt', value);   
  };
  const searchKeyDown = (value) => {
    if (value) {
     setSearchTxt(value); 
      window.localStorage.setItem('searchTxt', value);
      history.push(`/search/${value}`);
    }    
  };

  const selecteHeaderItem = (key) => {
    setSelected(key);
  };

  const goToHomePage = () => {
    selecteHeaderItem(1);
    history.push("/");
  };

  const { showCreateDialog, showDialog } = CreateDialogFun();

  const { showDrawer, showMobileDrawer } = MobileDrawerFun();


  return (
    <div className="navbar">
      <div className="nav-context">
        <div className="nav-logo">
          <img onClick={goToHomePage} src={Logo} alt="learning logo" />
          <p><span>POLL MARKET</span></p>
        </div>
        <div className="nav-search">
          <Dropdown
            placement="bottomCenter"
            overlay={searchDrop}
            trigger={["click"]}
          >
            <Input
              placeholder="Search by collection, collectible or creator"
              onChange={e => changeSearchTxt(e.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter')
                  searchKeyDown(event.target.value)
              }} 
              value={searchTxt} 
              allowClear
              suffix={<SearchOutlined style={{ color: "#595959" }} />}
            />
          </Dropdown>
        </div>
        <div className="tablet-search">
            <Dropdown
              placement="bottomCenter"
              overlay={searchMobile}
              trigger={["click"]}
            >
              <SearchOutlined />
            </Dropdown>
        </div>
        
        <div className="nav-actions">

          <div className="nav-items">
            <ul>
              <li onClick={() => selecteHeaderItem(1)}>
                <Link className={`${selected === 1 ? "active" : ""}`} to="/">
                  Market
                </Link>
              </li>
              <li style={{display: account? '' : 'none'}} onClick={() => selecteHeaderItem(2)}>
                <Link
                  className={`${selected === 2 ? "active" : ""}`}
                  to={`/user/${account}`}
                >
                  My Profile
                </Link>
              </li>
              <li style={{display: account? '' : 'none'}} onClick={() => selecteHeaderItem(4)}>
                <Link
                  className={`${selected === 4 ? "active" : ""}`}
                  to="/activity"
                >
                  Activity
                </Link>
              </li>
              <li onClick={() => selecteHeaderItem(5)}>
                <Link
                  className={`${selected === 5 ? "active" : ""}`}
                  to="/how-it-work"
                >
                  How It Work
                </Link>
              </li>            
            </ul>
          </div>
          
          {!account ? (
            <div className="nav-actions-container">              
              {/* <Button onClick={connectAccount} icon={<WalletOutlined />}>
                Connect wallet
              </Button> */}
              <div className="cta-button" onClick={connectAccount} style={{backgroundImage: `url(${ConnectIcon})`}}>
                Sign in
              </div>
            </div>
          ) : (
            <div className="nav-actions-container">
              <Button onClick={showCreateDialog} icon={<PlusCircleOutlined />}>
                Create
              </Button>              
              <div className="navbar-account">
                <Dropdown
                  onClick={() => { }}
                  overlay={profileMenu}
                  trigger={["click"]}
                  placement="bottomLeft"
                >
                  <img
                    src={props.user && props.user.profilePic ? props.user.profilePic : UserIcon }
                    alt="navbar account profile"
                  />
                </Dropdown>
              </div>             
            </div>
          )}
        </div>
        <div className="mobile-drawer">
          <Dropdown
            placement="bottomCenter"
            overlay={searchMobile(setVisibleSearch)}
            trigger={["click"]}
            onVisibleChange={(e) => setVisibleSearch(e)}
            visible={visibleSearch}
          >
            <SearchOutlined />
          </Dropdown>
          <MenuOutlined onClick={showMobileDrawer} />          
          {account && (
            <div className="navbar-account">
              <Dropdown
                onClick={() => { }}
                overlay={profileMenu}
                trigger={["click"]}
                placement="bottomLeft"
              >
                <img
                  src={props.user && props.user.profilePic ? props.user.profilePic : UserIcon }
                  alt="navbar account profile"
                />
              </Dropdown>
            </div>
          )}
        </div>
      </div>
      <NavDrawer
        connectAccount={connectAccount}
        showCreateDialog={showCreateDialog}
        showDrawer={showDrawer}
        showMobileDrawer={showMobileDrawer}       
      />      
      <CreateDialog
        modalVisible={showDialog}
        showCreateDialog={showCreateDialog}
      />
    </div>
  );
};

export default Navbar;
