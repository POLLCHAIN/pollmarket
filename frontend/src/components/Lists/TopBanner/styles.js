import styled from 'styled-components';

export const Container = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index:1;
    @media(max-width:1199px){
        max-width: 780px;
    }
    @media(max-width:991px){
        max-width: 680px;
    }
    h1,h2,h3,h4,h5,h6{
        margin: 0;
        margin-bottom: 30px;
        font-weight: 500;
        line-height: 1.4;
    }
    h1{
        font-size: 50px;
        @media(max-width:1199px){
            font-size: 50px;
        }
        @media(max-width:767px){
            font-size: 35px;
        }
    }
    h2{
        font-size: 60px;
        @media(max-width:1199px){
            font-size: 50px;
        }
        @media(max-width:767px){
            font-size: 30px;
        }
    }
    h3{
        font-size: 50px;
        @media(max-width:1199px){
            font-size: 40px;
        }
        @media(max-width:767px){
            font-size: 22px;
        }
    }
    h4{
        font-size: 40px;
        @media(max-width:1199px){
            font-size: 30px;
        }
        @media(max-width:767px){
            font-size: 18px;
        }
    }
    h5{
        font-size: 30px;
        @media(max-width:1199px){
            font-size: 20px;
        }
        @media(max-width:767px){
            font-size: 18px;
        }
    }
    h6{
        font-size: 20px;
        @media(max-width:1199px){
            font-size: 16px;
        }
    }
    a{
        text-decoration: none;
        color: #000;
        transition: all .3s;
        outline: none !important;

        &:hover{
            text-decoration: underline;
            outline: none !important;
        }
    }
    img{
        vertical-align: top;
    }
    p{
        margin: 0;
        margin-bottom: 15px;
        &:last-of-type{
            margin-bottom: 0;
        }
    }
    .cta-button{
        background: var(--buttonColor);
        padding: 12px 30px;
        border:1px solid var(--buttonColor);
        border-radius: 100px;
        display: inline-block;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s;   
        &:hover{
            background: #000 !important;
            text-decoration: none;
            border-color: #000 !important;
            outline: none !important;
        }
    }

    input,button{
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        appearance: none;
    }
    .formWrap,
    form{
        .form-control{
            background: #fff;
            padding: 12px 24px;
            outline: none !important;
            border: none !important;
        }
        .inputGroup{
            display: flex;
            flex-wrap: wrap;
            @media(max-width:767px){
                flex-wrap: nowrap;

            }
        }
    }
    .sectionHeading{
        text-align: center;
    }
    
`


export const HomeSlider = styled.div`
    padding: 60px 0;
    background: var(--buttonColor);
    color: #fff;
    min-height: 300px;
    >div{
        @media(max-width:560px){
            padding: 0px;
        }
    }
    .homeSlider{
        // overflow:hidden;
        @media(max-width:1600px){
            padding: 0 40px;
        }
        @media(max-width:560px){
            padding: 0 30px;
        }
        .slick-list{
            // overflow: inherit;
            height: 630px;
            @media(max-width:767px){
                height: auto;
            }
        }
        a{
            color: #fff;
            text-decoration: none;
        }
        .slick-dots{
            bottom: -40px;
            li{
                margin: 0;
                &.slick-active{
                    button{
                        &:before{
                            font-size: 20px;
                            opacity: 1;
                            color: #fff;
                        }
                    }
                }
                button{
                    &:before{
                        font-size: 10px;
                        opacity: 1;
                        color: #fff;
                    }
                }
            }
        }
        .sliderCard{
            .cardImg{
                width: 500px;
                border-radius:10px;
                overflow: hidden;
                height: 500px;
                margin: auto;
                position: relative;
                display: flex !important;
                width: 100%;
                transition : all .2s;
                @media(max-width:767px){
                    width: 100%;
                }
                @media(max-width:550px){
                    height: 400px;
                }
                @media(max-width:350px){
                    height: 330px;
                }
                .img-box{
                    position: relative;
                    width: 100%;
                    img{
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;                        
                    }
                }
                .content-box{
                    margin-top:auto;
                    width: 100%;
                    padding: 30px 50px;
                    position: relative;
                    z-index: 2;
                    display: flex;
                    justify-content: space-between;
                    color: #fff;
                    @media(max-width:767px){
                        padding: 20px 20px;
                    }
                    @media(max-width:360px){
                        flex-direction: column;
                    }
                    :before{
                        position: absolute;
                        content:"";
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        height: 200%;
                        z-index: -1;
                        background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5194852941176471) 30%, rgba(0,0,0,0) 100%);
                    }
                }
                .leftBox{
                    .heading{
                        display: block;
                        font-size: 20px;
                        margin-bottom: 5px;
                        @media(max-width:550px){
                            font-size: 14px;
                        }
                    }
                    .tag{
                        font-size:15px;
                        @media(max-width:550px){
                            font-size: 11px;
                        }
                    }
                }
                .timer{
                    display: flex;
                    align-items: center;
                    padding-left: 20px;
                    span{
                        padding: 3px;
                        font-size:15px;
                        width: 24px;
                        height: 24px;
                        color: #fff;
                        background-color: var(--buttonColor);
                        border-radius:6px;
                        margin: 0 3px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        @media(max-width:550px){
                            font-size: 11px;
                             width: 20px;
                            height: 20px;
                        }
                    }
                    @media(max-width:370px){
                        margin-top: 20px;
                        padding-left: 0;
                    }
                }
            }
            .cardContent{
                margin: 0 auto;
                margin-top: 20px;
                text-align: center;
                max-width: 350px;
                opacity: 0;
                transition: all 0.3s;
                color: #fff;

                p{
                    font-size: 16px;
                    @media(max-width:550px){
                        font-size: 14px;
                    }
                }
            }
        }
        .slick-track{
            display: flex;
        }
        .slick-slide {
            opacity: 0;
            transition: all 0.3s;
        }
        .slick-center{
            opacity: 1;
            .cardContent{
                opacity: 1;
            }
        }
        @media(min-width:768px){
            .slick-slide {
                width: 300px;
                position: relative;
                z-index: 0;
                opacity: 0;
                .cardImg{
                    height: 350px;
                    margin-top: 100px;
                }

            }
            .slick-active {
                z-index: 1;
                opacity: 1;
                .cardImg{
                    width: 500px;
                    height: 350px;
                        margin-top: 100px;

                }

                +.slick-active{
                    z-index: 2;
                    .cardImg{
                        width: 500px;
                        height: 450px;
                        margin-top: 50px;

                    }

                    +.slick-active{
                        z-index: 3;

                        .cardImg{
                            width: 500px !important;
                            height: 550px;
                            margin-left: -100px;
                            margin-top: 0px;
                        }
                        +.slick-active{
                            z-index: 2;

                            .cardImg{
                                width: 500px !important;
                                height: 450px;
                                margin-left: -170px;
                                margin-top: 50px;
                            }
                            +.slick-active{
                                // border-color: red;
                                z-index: 1;

                                .cardImg{
                                    width: 500px !important;
                                    height: 350px;
                                    margin-left: -220px;
                                    margin-top: 100px;
                                }
                            }
                        }
                    }
                }
            }
            .slick-center{
                position: relative;
                z-index: 10;
                .cardContent{
                    opacity: 1;
                }
            }
        }
    }
`

export const BannerSlider = styled.div`
    padding-top: 10px;
    padding-bottom: 60px;
    .bannerSlider{        
        .slick-list{
            height: auto;
        }
        a{
            color: #fff;
            text-decoration: none;
        }
        .slick-dots{
            bottom: -40px;
            li{
                width: auto;
                height: auto;
                button{
                    width: 5px;
                    height: 5px;
                    border-radius: 5px;
                    background: #757575;
                    &:before{
                        display: none;
                    }
                }
                &.slick-active{
                    button{
                        color: #16419f;
                        background: #16419f;
                        width: 60px;
                        content: '';
                        &:before{
                            display: none;
                        }
                    }
                }                
            }
        }
        .slick-track{
            display: flex;
        }
        .slick-slide {
            opacity: 0;
            transition: all 0.3s;
        }
        .slick-center{
            opacity: 1;
            .cardContent{
                opacity: 1;
            }
        }    
        .img-box{
            width: 98% !important;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                
            }
        }        
    }
`

export const HomePageWrap = styled.div`
    position: relative;
`;

export const ProgressContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
`;


