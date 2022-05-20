import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import FeatureLoader from "../ContentLoaders/FeatureLoader";
import "./FeatureCard.css";

const FeatureCard = ({ card }) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const goToProfilePage = () => {
    history.push('/user/address')
  }

  return (
    <div className="feature-card" onClick={goToProfilePage}>
      {loading ? <FeatureLoader /> :
        <div>
          <div className="feature-image">
            <img src={card.url} alt={card.title} />
          </div>
          <div className="feature-image-fade"></div>
          <div className="feature-content">
            <h3>{card.author !== "" ? `by ${card.author}` : ""}</h3>
            <h2>{card.title}</h2>
          </div>
        </div>
      }
    </div>
  );
};

export default FeatureCard;
