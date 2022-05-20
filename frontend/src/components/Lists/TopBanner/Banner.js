import React from "react";
import * as Element from './styles';
import Slider from "react-slick";

import $ from 'jquery';

import BannerImg1 from "../../../assets/banners/1.jpg";
import BannerImg2 from "../../../assets/banners/2.jpg";
import BannerImg3 from "../../../assets/banners/3.jpg";
import BannerImg4 from "../../../assets/banners/4.jpg";
import BannerImg5 from "../../../assets/banners/5.jpg";


var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    centerPadding: '0px',
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

const Banner = (props) => {       
    return (
        <Element.HomePageWrap>
            <Element.BannerSlider>                                 
                <div className="bannerSlider">
                    <Slider className="banner-slider" {...settings}>
                        <div className="img-box" onClick={(e) => {                            
                            if (e.detail === 2 || window.innerWidth < 1200) {
                                window.open('https://medium.com/@pollchain/pollchains-nft-functional-support-b1a8c0e6d572');
                            }
                            
                        }}>
                            <img src={BannerImg1} alt="SliderImage1" />
                        </div> 

                        <div className="img-box" onClick={(e) => {                            
                            if (e.detail === 2 || window.innerWidth < 1200) {
                                window.open('https://medium.com/@pollchain/pollchains-nft-functional-support-b1a8c0e6d572');
                            }
                            
                        }}>
                            <img src={BannerImg2} alt="SliderImage2" />
                        </div> 

                        <div className="img-box" onClick={(e) => {                            
                            if (e.detail === 2 || window.innerWidth < 1200) {
                                window.open('https://medium.com/@pollchain/pollchains-nft-functional-support-b1a8c0e6d572');
                            }
                            
                        }}>
                            <img src={BannerImg3} alt="SliderImage3" />
                        </div> 

                        <div className="img-box" onClick={(e) => {                            
                            if (e.detail === 2 || window.innerWidth < 1200) {
                                window.open('https://medium.com/@pollchain/pollchains-nft-functional-support-b1a8c0e6d572');
                            }
                            
                        }}>
                            <img src={BannerImg4} alt="SliderImage4" />
                        </div> 

                        <div className="img-box" onClick={(e) => {                            
                            if (e.detail === 2 || window.innerWidth < 1200) {
                                window.open('https://medium.com/@pollchain/pollchains-nft-functional-support-b1a8c0e6d572');
                            }
                            
                        }}>
                            <img src={BannerImg5} alt="SliderImage5" />
                        </div> 

                        
                                                
                    </Slider>                     
                </div>                
            </Element.BannerSlider>          
        </Element.HomePageWrap>
    );    
}

export default Banner;
