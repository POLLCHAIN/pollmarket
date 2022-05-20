/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import "./App.css";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Modal } from '@material-ui/core';
import Button from '@material-ui/core/button';
import { makeStyles } from '@material-ui/core/styles';

import { connectors, connectorLocalStorageKey } from './utils/connectors'
import { useEagerConnect } from "./hooks/useEagerConnect"
import { useInactiveListener } from "./hooks/useInactiveListener"
import { useAxios } from "./hooks/useAxios";
import { getErrorMessage } from "./utils/ethereum";
import { getUser, loginUser, useAuthDispatch, useAuthState } from "./context/authContext";

import Home from "./containers/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import UserProfile from "./containers/UserProfile/UserProfile";
import Collection from "./containers/Collection/Collection";
import Activity from "./containers/Activity/Activity";
import { Footer } from "./components/footer/footer";
import Create from "./containers/Create/Create";
import EditProfile from "./containers/EditProfile/EditProfile";
import SearchPage from "./containers/SearchPage/SearchPage";
import HowItWork from "./containers/HowItWork/HowItWork";
import Support from "./containers/Support/Support";
import ItemDetail from "./containers/ItemDetail/ItemDetail";

function App() {
  const [connectModalOpen, setConnectModalOpen] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  function getModalStyle() {
    const top = 50
    const left = 50  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 300,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(3, 4, 3),
    },
  }));

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  useAxios();

  const {account, library, activate, active, connector} = useWeb3React();
  const connectAccount = () => {
    setConnectModalOpen(true)
  }  
  const connectToProvider = (connector) => {
    activate(connector)
  }

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState()
  useEffect(() => {
      if (activatingConnector && activatingConnector === connector) {
          setActivatingConnector(undefined)
      }
  }, [activatingConnector, connector])

  // mount only once or face issues :P
  const [triedEager, triedEagerError] = useEagerConnect()
  const { activateError } = useInactiveListener(!triedEager || !!activatingConnector)

  // handling connection error
  if((triedEagerError || activateError) && errorModalOpen === null) {
      const errorMsg = getErrorMessage(triedEagerError || activateError);
      setNetworkError(errorMsg);
      setErrorModalOpen(true);
  }

  const dispatch = useAuthDispatch();
  const { user, token } = useAuthState();

  const login = async () => {
    if(!account || !library) {
      console.log('not connected to wallet')
      return;
    }
    if(!user) {
      console.log('fetching user')
      await getUser(dispatch, account);
    }
    if(!user?.nonce || token) {
      console.log('nonce is invalid or already logged in')
      return;
    }
    console.log("login 2")
    loginUser(dispatch, account, user?.nonce, library.getSigner())
  }

  useEffect(() => {      
    if (active && account && !user){
      getUser(dispatch, account)
    }
  }, [active, account])

  return (
    <div className="App">
      <Router>
        <Route path="/" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <Home {...props} user={user}/>
              <Footer {...props} user={user}/>
            </>)
          }/> 
        <Route path="/user/:address" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <UserProfile {...props} getUser={getUser} user={user} login={login}/>
              <Footer {...props} user={user}/>
            </>)
          }/>         
        <Route path="/collection/:address" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <Collection {...props} user={user} />
              <Footer {...props} user={user}/>
            </>)
          }/>
        <Route path="/activity" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <Activity {...props} getUser={getUser} user={user} login={login}/>              
            </>)
          }/>     
        <Route path="/create/single" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <Create {...props} type={"S"} getUser={getUser} user={user} login={login}/>
              <Footer {...props} user={user}/>
            </>)
          }/>
        <Route path="/create/multiple" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <Create {...props} type={"M"} getUser={getUser} user={user} login={login}/>
              <Footer {...props} user={user}/>
            </>)
          }/>
        <Route path="/edit" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <EditProfile {...props} getUser={getUser} user={user} login={login}/>
              <Footer {...props} user={user}/>
            </>)
          }/>
        <Route path="/detail/:collection/:tokenId" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <ItemDetail {...props} user={user} />              
            </>)
          }/>
        <Route path="/search/:searchTxt" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <SearchPage {...props} user={user} />              
            </>)
          }/>        
        <Route path="/how-it-work" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <HowItWork {...props} />              
            </>)
          }/>
        <Route path="/support" exact render={
          (props) => (
            <>
              <Navbar {...props} user={user} connectAccount={connectAccount}/>
              <Support {...props} user={user} />              
            </>)
          }/>             
      </Router>
      <Modal
        open={!!errorModalOpen && !active}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            return false;
          }      
          if (reason === "escapeKeyDown") {
            return false;
          }      
          setErrorModalOpen(false)
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
        <div style={modalStyle} className={`${classes.paper} modal-div`}>
          <p>{networkError}</p>
          <Button className="" onClick={() => {window.location.reload()}} variant="contained" color="primary">Close</Button>            
        </div>

      </Modal>
      <Modal
        open={!!connectModalOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            return false;
          }      
          if (reason === "escapeKeyDown") {
            return false;
          }      
          setConnectModalOpen(false)
        }}        
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
        <div style={modalStyle} className={`${classes.paper} modal-div`}>
          <p style={{fontSize:'20px', fontWeight:'600', lineHeight:'1.1'}}>Connect Wallet</p>
          <div className={`connectors-wrapper`} style = {{display : 'grid'}}>
          {
            connectors.map((entry, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => {
                  connectToProvider(entry.connectorId);
                  window.localStorage.setItem(connectorLocalStorageKey, entry.key);
                  setConnectModalOpen(false)                               
                }}
                className="connect-button textPrimary"
                color="primary"
                style={{color: 'red', marginBottom: '10px'}}
                endIcon={<entry.icon width="30"/>}
                id={`wallet-connect-${entry.title.toLocaleLowerCase()}`}
              >
              {entry.title}
              </Button>
            ))}
            </div>
            <div style={{textAlign: 'center'}}>
              <Button style={{width: '100%'}} onClick={() => {setConnectModalOpen(false)}} variant="contained" color="primary">Close</Button>
            </div>
          
        </div>
      </Modal>
    </div>
  );
}

export default () => (
    <App />
)
