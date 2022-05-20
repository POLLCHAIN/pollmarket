import React, {useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'

import { connectorLocalStorageKey, injectedConnector } from "../../utils/connectors"
import { getTokenBalance } from "../../utils/contracts";
import { formatNum, getUSDRateFromSymbol } from "../../utils";
import { logout, useAuthDispatch } from "../../context/authContext";

import "./ProfileDrop.css";

import ETHIcon from "../../assets/png/eth.png";
import POLLIcon from "../../assets/png/poll.png";


const ProfileDrop = () => {
  const {account, chainId, deactivate,library} = useWeb3React();
  const dispatch = useAuthDispatch();
  const [ethBalance, setEthBalance] = useState(0)
  const [ethRate, setEthRate] = useState(0)
  const [pollBalance, setPollBalance] = useState(0)  
  const [pollRate, setPollRate] = useState(0)
  

  const signOut = async() => {
    deactivate(injectedConnector)     
    window.localStorage.setItem(connectorLocalStorageKey, "");
    logout(dispatch)
  }
  
  useEffect(() => {
    if(!!account && !!library) {
      // get ETH balance and rate      
      getTokenBalance(account, 'ETH', chainId, library)
        .then((balance) => {
          setEthBalance(Number(balance))
        })
        .catch(() => {
          setEthBalance(0)
        })  
      getUSDRateFromSymbol('ETH')
        .then((rate) => {          
          setEthRate(rate)
        })
        .catch(() => {
          setEthRate(0)
        })

      // get POLL balance
      getTokenBalance(account, 'POLL', chainId, library)
        .then((balance) => {
          setPollBalance(Number(balance))
        })
        .catch(() => {
          setPollBalance(0)
        })
      getUSDRateFromSymbol('POLL')
        .then((rate) => {
          setPollRate(rate)
        })
        .catch(() => {
          setPollRate(0)
        })    
    }

    return () => {
      setEthBalance(0)
      setPollBalance(0)
      setEthRate(0)
      setPollRate(0)
    }
  }, [account, chainId, library])

  return (
    <div className="profile-drop">
      
      <div className="profile-drop-account">
        <div className="profile-drop-header">
          <img
            src={ETHIcon}
            alt="ETH"
          />
          <div className="profile-drop-header-context">
            <p>ETH Balance</p>
            <p>
              <span>{formatNum(ethBalance)} ETH</span> ≈ ${formatNum(ethBalance * ethRate)}
            </p>
          </div>
        </div>
        <div className="profile-drop-header">
          <img
              src={POLLIcon}
              alt="POLL"
            />
          <div className="profile-drop-header-context">
            <p>POLL Balance</p>
            <p>
              <span>{formatNum(pollBalance)} POLL</span> ≈ ${formatNum(pollBalance * pollRate)}
            </p>
          </div>
        </div>
      </div>
      <div className="profile-drop-manage">        
        <a href={"https://www.lbank.info/exchange/poll/usdt"} target="_blank" rel="noreferrer">Manage Funds</a>
      </div>
      <div className="profile-drop-menu">
        <div className="profile-drop-menu-item">
          <Link to={`/user/${account}`}>
          <h3>My Profile</h3>
          </Link>
      </div>
      <div className="profile-drop-menu-item">
        <Link to="/edit">
          <h3>Edit profile</h3>
        </Link>
      </div>
      <div className="profile-drop-menu-item" onClick={() => signOut()}>
        <h3>Disconnect</h3>
      </div>
    </div>
    </div >
  );
};

export default ProfileDrop;
