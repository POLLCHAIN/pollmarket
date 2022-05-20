import React from "react";
import { useHistory } from "react-router";

import "./CollectionItem.css";

const CollectionItem = (props) => {
  const {collection} = props;

  const history = useHistory();

  const goToCollectionPage = () => {
    history.push(`/collection/${collection.address}`)
  }

  return (
    <div className="search-collection-item" onClick={goToCollectionPage}>
      <img
        src={collection.image}
        alt="collection logo"
      />
      <div className="search-collection-item-info">
        <h4>{collection.name}</h4>
        <p>{collection.type === 'single' ? 'ERC-721' : 'ERC-1155'}</p>
      </div>
    </div>
  );
};

export default CollectionItem;
