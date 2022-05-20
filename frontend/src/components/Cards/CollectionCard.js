import React from "react";
import "./CollectionCard.css";
import { useHistory } from "react-router";

const CollectionCard = ({ collectionItem }) => {
  const history = useHistory();
  
  const goToCollectionPage = () => {
    history.push(`/collection/${collectionItem.address}`)
  }

  return (
    <div className="collection-item" >
      <div className="collection-cover" onClick={goToCollectionPage}>
        <img          
          className="collection-cover-image"
          src={collectionItem.image}
          alt="collection logo"
        />
        <div className="collection-mask"></div>
        <div className="collection-seller-box">          
          <div className="collection-content">
            <h2>{collectionItem.name}</h2>
            <h3>{collectionItem.type === 'single' ? 'ERC-721' : 'ERC-1155'}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
