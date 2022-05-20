/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core'

import axios from 'axios'
import { Input, Form } from "antd";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';

import "./EditProfile.css";
import { getIpfsHashFromFile } from "../../utils/ipfs";
import Preview from '../../assets/svg/preview.svg'
import { useAuthDispatch } from "../../context/authContext";

const EditProfile = (props) => {  
  const { user, login, getUser} = props; 
  const dispatch = useAuthDispatch();

  const [userProfile, setUserProfile] = useState(undefined)
  const { account, library } = useWeb3React();

  const [imgUploading, setImgUploading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [newName, setNewName] = useState("")
  const [newBio, setNewBio] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPersonalLink, setNewPersonalLink] = useState("")
  const [newProfilePic, setNewProfilePic] = useState("")

  useEffect(() => {
    if(!!user) {
      login();
    }
    if (account && !userProfile){
      getUserInfo()
    }
  }, [user, account, library])

  function getUserInfo(){
    axios.get(`/api/user_info/${account}`)
    .then(res => {            
      setUserProfile(res.data.user) 
      setNewProfilePic(res.data.user.profilePic)
      setNewName(res.data.user.name)
      setNewBio(res.data.user?.bio)
      setNewEmail(res.data.user?.emailAddress)
      setNewPersonalLink(res.data.user?.personalLink)             
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  

  const selectFile = () => {
    document.getElementById("my-file-edit").click();
  };

  const fileChange = (e) => {
    if (e.target.files[0]) {
      const fileType = e.target.files[0].type.split("/")[0]
      if (fileType === "image") {        
        setImgUploading(true)
        getIpfsHashFromFile(e.target.files[0]).then((hash) => {
          setNewProfilePic(`https://pollchain.mypinata.cloud/ipfs/${hash}`)
          setImgUploading(false)                
        })       
        
      }
    }
  }

  const updateProfile = async () => {
    if (!newProfilePic) {
      setSnackBarMessage("Please select profile image")
      setOpenSnackbar(true) 
      return
    }

    const data = new FormData()
    data.append("address", account)
    data.append("name", newName || "NoName")
    data.append("bio", newBio || "")
    data.append("emailAddress", newEmail || "")
    data.append("personalLink", newPersonalLink || "")
    data.append("profilePic", newProfilePic || "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67")

    setUpdating(true)
    axios.post("/api/user/update", data)
    .then(res => {            
        setUpdating(false)
        setSnackBarMessage("Success")
        setOpenSnackbar(true)
        getUser(dispatch, account)
        props.history.push(`/user/${account}`)                  
    })
    .catch(err => {
        setUpdating(false)
        setSnackBarMessage(err.response.data.message)
        setOpenSnackbar(true)     
    })
  };

  
  return (
    <div className="edit-profile">
      {
        account?
        <>
          <div className="edit-user-box">
            {
              imgUploading ? 
                <div style={{display:'flex'}}><CircularProgress style={{margin:"auto", color: "red"}}/></div>                
                :
                <img src={newProfilePic? newProfilePic: Preview} alt="profile"/>
            }           
            
            <div className="edit-user-info">
              <button onClick={selectFile}>Upload Photo</button>
              <p>At least 400x400, Gifs work too.</p>
              <input onChange={fileChange} type="file" accept="image/*" name="my_file" id="my-file-edit" />
            </div>
          </div>
          <Form className="edit-form">
          
            <Form.Item name="name" rules={[{ required: true, message: "Please enter your name" }]}>        
              <div className="name-box">
                <h3>Display name</h3>
                <Input placeholder="Enter your name"
                  onChange={e => setNewName(e.target.value)} 
                  value={newName} />
              </div>  
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: "Please Enter your email address" }]}>
              <div className="email-box">
                <h3>Email Address</h3>
                <Input placeholder="Enter your email address"
                  onChange={e => setNewEmail(e.target.value)} 
                  value={newEmail} /> 
              </div>        
            </Form.Item>
            <Form.Item name="info" rules={[{ required: true, message: "Please enter your portfolio link" }]}>
              <div className="info-box">
                <h3>Personal site or portfolio link</h3>
                <Input placeholder="https://" 
                  onChange={e => setNewPersonalLink(e.target.value)} 
                  value={newPersonalLink} /> 
              </div>          
            </Form.Item>
            
            <Form.Item name="bio" rules={[{ required: true, message: "Please enter your detail" }]}>
              <div className="bio-box">
                  <h3>Bio</h3>
                  <Input.TextArea placeholder="Tell about yourself in a few words" 
                    onChange={e => setNewBio(e.target.value)} 
                    value={newBio} /> 
              </div>
            </Form.Item>     
            
            <Form.Item>
              <button className="submit-button" disabled={updating} onClick={updateProfile} type="primary">
                {
                  updating? <CircularProgress style={{width: "16px", height: "16px", color: "white"}}/>
                  :
                  <> Update </>
                }
                
              </button>
            </Form.Item>
          </Form>
        </>
        :<></>
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
    </div>
  );
}

export default EditProfile;
