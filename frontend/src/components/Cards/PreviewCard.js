import { Avatar } from "antd";
import React from "react";
import BlankImage from '../../assets/svg/blank_card.svg'
import "./ItemCard.css";


const PreviewCard = ({image, currency, saleType, price, supply, name}) => {

  return (
    <div className="collectible-item">
      <div className="collectible-preview">
        <img className="preview-image" src={image !== ""? image: BlankImage} alt="preview" />
      </div>
      <div className="collectible-main-content">
        <div className="collectible-item-header">
          <Avatar.Group>
            <Avatar style={{ color: '#597ef7', backgroundColor: '#d6e4ff' }} >O</Avatar>
            <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>C</Avatar>
            <Avatar
              src="https://www.eaclinic.co.uk/wp-content/uploads/2019/01/woman-face-eyes-1000x1000.jpg"
              alt="collectible avatar"
            />
          </Avatar.Group>
        </div>
        <div className="collectible-footer">
          <div className="collectible-content">
            <h3 className="name-text">{name}</h3>
            <h3>
              {
                saleType === "fixed_price" ? 
                  <>
                    {`${price} ${currency}`} <span>{`${supply}/${supply}`}</span>
                  </>
                  : saleType === "timed_auction" ? 
                  <>
                    <span>{`Minimum bid ${supply}/${supply}`}</span>
                  </> : 
                  <>
                    <span>{`Not for sale ${supply}/${supply}`}</span>
                  </>
              } 
            </h3>
            <p>
              {
                saleType === "timed_auction" ? 
                  <>
                    {`${price} ${currency}`}
                  </> : 
                  <>
                    {`Place a bid`}
                  </>
              }              
            </p>
          </div>
        </div>
      </div>
      {/* {card.multiple && <div className="collectible-multi-cards1"></div>}
      {card.multiple && <div className="collectible-multi-cards2"></div>} */}
    </div>
  );
};

export default PreviewCard;
