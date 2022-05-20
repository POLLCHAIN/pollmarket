import React, { useState, useEffect } from "react";
import axios from 'axios'
import "./LiveAuctionList.css";
import FireIcon from "../../../assets/svg/fire.svg";
import { Carousel } from "antd";
import ItemCard from "../../Cards/ItemCard";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="next-arrow"
      onClick={onClick}
    >
      <CaretRightOutlined style={{ color: 'white' }} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="prev-arrow"
      onClick={onClick}
    >
      <CaretLeftOutlined style={{ color: 'white' }} />
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

const LiveAuctionList = (props) => {

  const [items, setItems] = useState([])
  useEffect(() => {    
    fetchItems();    
  }, [props])

  function fetchItems(){    
    let queryUrl = `/api/auctions`    
    axios.get(queryUrl)
    .then(res => {
      setItems(res.data.items)      
    })
    .catch(err => {            
      setItems([])      
    })
  }
  return (
    <div className="hotbid-list">
      <h1>
        Live auctions{" "}
        <span>
          <img src={FireIcon} alt="fire icon" />
        </span>
      </h1>

      <div className="hotbid-item-list">

        <Carousel {...settings}>
          {items.map((item, index) => (
            <ItemCard {...props} item={item} key={index} />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default LiveAuctionList;
