import { Carousel } from "antd";
import React, { useState, useEffect } from "react";
import axios from 'axios'

import CollectionCard from "../../Cards/CollectionCard";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import FireIcon from "../../../assets/svg/fire.svg";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div className="next-arrow" onClick={onClick}>
      <CaretRightOutlined style={{ color: "white" }} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div className="prev-arrow" onClick={onClick}>
      <CaretLeftOutlined style={{ color: "white" }} />
    </div>
  );
}

var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 3,
  initialSlide: 0,
  arrows: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1500,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 3,
        dots: true
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 3,
        dots: true
      }
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const CollectionList = (props) => {

  const [collections, setCollections] = useState([])
  useEffect(() => {    
    fetchItems();    
  }, [props])

  function fetchItems(){    
    let queryUrl = `/api/hot_collections`    
    axios.get(queryUrl)
    .then(res => {
      setCollections(res.data.collections)      
    })
    .catch(err => {            
      setCollections([])      
    })
  }

  return (
    <div>
      <div className="hotbid-list">
        <h1>
          Hot Collections{" "}
          <span>
            <img src={FireIcon} alt="fire icon" />
          </span>
        </h1>
        <div className="hotbid-item-list">
          <Carousel {...settings}>
            {collections.map((collection, index) => (
              <CollectionCard {...props} collectionItem={collection} key={index + collection.address} />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default CollectionList;
