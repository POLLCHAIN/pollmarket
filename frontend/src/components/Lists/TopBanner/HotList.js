import React , {useState,useEffect} from "react";
import * as home from './styles';
import Slider from "react-slick";

import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import $ from 'jquery';

import HotNft from './hot';


var settings = {
    dots: true,
    arrow: true,
    infinite: true,
    // autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    centerMode: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    variableWidth: true,
    centerPadding: '0px',
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                autoplay: false,
                autoplaySpeed: 4000,
                variableWidth: false,
            }
        },

    ],
    afterChange: function (event) {
        $(".slick-slide.slick-active.slick-center.slick-current").prev(":first").addClass("prev-slide-1");
        $(".slick-slide.slick-active.slick-center.slick-current").prev(":first").prev().addClass("prev-slide-2");
        $(".slick-slide.slick-active.slick-center.slick-current").next(":first").addClass("next-slide-1");
        $(".slick-slide.slick-active.slick-center.slick-current").next(":first").next().addClass("next-slide-2");
    },
    beforeChange: function (event) {
        $(".slick-slide.slick-active.slick-center.slick-current").prev(":first").removeClass("prev-slide-1");
        $(".slick-slide.slick-active.slick-center.slick-current").prev(":first").prev().removeClass("prev-slide-2");
        $(".slick-slide.slick-active.slick-center.slick-current").next(":first").removeClass("next-slide-1");
        $(".slick-slide.slick-active.slick-center.slick-current").next(":first").next().removeClass("next-slide-2");
    }


};

const HotList = (props) => {        
    const [hotItems, setHotItems] = useState([])
    const [activeIndex, setActiveIndex] = useState(2)
    const [startX, setStartX] = useState(0)    
 
    useEffect(() => {
        fetchHotItems();
    }, [props]);
    function fetchHotItems() {        
        axios.get(`/api/hots`)
        .then((res) => {
            console.log("res: ", res);
            setHotItems(res.data.items); 
        })
        .catch((err) => {
            console.log("err: ", err.message);
            setHotItems([]);
        });
    } 

    return (
        <home.HomePageWrap style={{ display:hotItems?.length > 5 ? '' : 'none' }}>
            <home.HomeSlider>
                <home.Container>                    
                    <div className="homeSlider">
                    {
                        hotItems?.length > 0 ? 
                            <Slider className="banner-slider" {...settings}>
                            {
                                hotItems.map((item, index)=> 
                                <HotNft key={index} {...props} 
                                    item={item} 
                                    length={hotItems.length} 
                                    i={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} startX={startX} setStartX={setStartX}/>)
                            }                                
                            </Slider>                            
                            : 
                            <home.ProgressContainer>
                                <CircularProgress style={{ width: "50px", height: "50px", color: "#e24717"}}/>                       
                            </home.ProgressContainer>
                    }                      
                    </div>
                </home.Container>
            </home.HomeSlider>          
        </home.HomePageWrap>
    );    
}

export default HotList;
