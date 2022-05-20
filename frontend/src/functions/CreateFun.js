import { useState } from "react";
import { getIpfsHashFromFile } from "../utils/ipfs";

const CreateFun = () => {
  const [mainFile, setMainFile] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [collectionImage, setCollectionImage] = useState("");

  const [collectionImgUploading, setCollectionImgUploading] = useState(false)
  const [mainFileUploading, setMainFileUploading] = useState(false)
  const [coverImgUploading, setCoverImgUploading] = useState(false)

  const pickMainFile = (e) => {
    if (e.target.files[0]) {
      const fileType = e.target.files[0].type.split("/")[0]
      if (fileType === "image") {        
        setMainFileUploading(true)
        getIpfsHashFromFile(e.target.files[0]).then((hash) => {
          setMainFile(`https://pollchain.mypinata.cloud/ipfs/${hash}`)
          setCoverImage(`https://pollchain.mypinata.cloud/ipfs/${hash}`)
          setMainFileUploading(false) 
          setCoverImgUploading(false)   
          setMediaType(fileType)                    
        });
      }else if ((fileType === "video") || (fileType === "audio")) {
        setMainFileUploading(true)
        getIpfsHashFromFile(e.target.files[0]).then((hash) => {
          setMainFile(`https://pollchain.mypinata.cloud/ipfs/${hash}`)
          setCoverImage("")
          setMainFileUploading(false) 
          setCoverImgUploading(false)  
          setMediaType(fileType)                     
        });
      }
      
    }
  };

  const pickCoverImage = (e) => {
    if (e.target.files[0]) {
      const fileType = e.target.files[0].type.split("/")[0]
      if (fileType === "image") {        
        setCoverImgUploading(true)
        getIpfsHashFromFile(e.target.files[0]).then((hash) => {
          setCoverImage(`https://pollchain.mypinata.cloud/ipfs/${hash}`)
          setCoverImgUploading(false)               
        });                
      }
    }
  };


  const pickCollection = (e) => {
    if (e.target.files[0]) {
      const fileType = e.target.files[0].type.split("/")[0]
      if (fileType === "image") {
        setCollectionImgUploading(true)
        getIpfsHashFromFile(e.target.files[0]).then((hash) => {
          setCollectionImage(`https://pollchain.mypinata.cloud/ipfs/${hash}`)
          setCollectionImgUploading(false)               
        });        
      }
    }
  };

  const removeMainFile = () => {
    setMainFile("")
    setMediaType("")
    setCoverImage("")
    setMainFileUploading(false)
    setCoverImgUploading(false)
  }

  const removeCoverImage = () => {
    setCoverImage("")
    setCoverImgUploading(false)
  }
  const removeCollectionImage = () => {
    setCollectionImage("")
    setCollectionImgUploading(false)
  }

  return { pickMainFile, mainFile, mediaType, removeMainFile, mainFileUploading,
          pickCoverImage, coverImage, removeCoverImage, coverImgUploading,
          pickCollection, collectionImage, removeCollectionImage, collectionImgUploading };
};

export default CreateFun;
