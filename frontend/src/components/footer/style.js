import styled from 'styled-components';



export const FiteFooter = styled.div`
    padding: 30px 0 20px;
    background: var(--backgroundWhiteColor);  
    @media(max-width:1199px){
        padding: 50px 0;
    }
    
    .top-Box{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        border-bottom: 1px solid #fff;
        padding-bottom: 30px;
        margin-bottom: 30px;
        @media(max-width:1199px){
            flex-direction: column;
            align-items: flex-start;
        }
        .subscrib-Box{
            padding-right: 30px;
            .inner-box{
                max-width: 575px;
            }
            @media(max-width:767px){
                padding-right:0;
            }
            form{
                margin-top: 20px;
                .form-control{
                    flex: 1;
                    border-radius: 6px 0 0 6px;
                }
                .form-button{
                    width:70px;
                    border: none;
                    background-color: var(--buttonColor);
                    border-radius: 0 6px 6px 0;                    
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: 27px;
                    cursor: pointer;
                }
            }
        }
        .community-Box{
            text-align: right;
            @media(max-width:1199px){
                text-align: left;
                margin-top: 30px;
            }
            h5{
                margin-bottom: 20px;
                @media(min-width:1200px){
                    font-size: 24px;
                }
            }
            ul{
                display: flex;
                flex-wrap: wrap;
                list-style: none;
                margin: 0;
                padding: 0;
                li{
                    margin: 5px 10px;
                    &:last-of-type{
                        margin-right: 0;
                    }
                    @media(max-width:1199px){
                        &:first-of-type{
                            margin-left: 0;
                        }
                    }
                    img{
                        width: 25px;
                        height: 25px;
                    }
                }
            }
        }
    }
    .bottom-Box{
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        @media(max-width:1199px){
            flex-direction: column;
            align-items: flex-start;
        }
        .logoInfo-Box{
            max-width: 310px;
            padding-right: 30px;
            @media(max-width:1199px){
                max-width: 100%;
                padding-right: 0;
            }
            p{
                margin-top: 20px;
                font-size: 20px;
                color: #989898;
                a{
                    color: #457efb;
                }
                @media(max-width:1199px){
                    font-size: 16px;
                }
            }
        }
        .menulinks-Box{
            display: flex;
            flex-wrap: wrap;
            flex: 1;
            justify-content: flex-end;
            @media(max-width:1199px){
                justify-content: space-between;
                width: 100%;
                margin-top:30px;
            }
            >div{
                width: 25%;
                padding: 0 15px;
                &:last-of-type{
                    padding-right: 0;   
                }
                @media(max-width:1199px){
                    &:first-of-type{
                        padding-left: 0;
                    }
                }
                @media(max-width:660px){
                    width: 50%;
                    padding-left: 0;
                    margin-top: 30px;
                }
            }
            .menulinks-3{
                width: 20%;
            }
            h5{
                font-size: 24px;
                margin-bottom: 20px;
                @media(max-width:1199px){
                    font-size: 20px;
                }
            }
            ul{
                list-style: none;
                margin: 0;
                padding: 0;
                li{
                    margin-bottom: 15px;
                    a{
                        color: #989898;
                        font-size: 18px;
                        @media(max-width:1199px){
                            font-size: 16px;
                        }
                    }
                }
            }
        }
    }
    .copyRight-box{
        margin-top: 30px;
        text-align: center;
        @media(max-width: 991px){
            margin-top: 40px;
        }
        p{
            color: #989898;
            @media(max-width: 991px){
                font-size: 12px;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                justify-content:center;
                margin: 0 10px;
                img{
                    padding: 0 7px;
                }
            }
        }
    }
    
`;

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
        font-size: 60px;
        @media(max-width:1199px){
            font-size: 60px;
        }
        @media(max-width:767px){
            font-size: 50px;
        }
    }
    h2{
        font-size: 60px;
        @media(max-width:1199px){
            font-size: 50px;
        }
        @media(max-width:767px){
            font-size: 40px;
        }
    }
    h3{
        font-size: 50px;
        @media(max-width:1199px){
            font-size: 40px;
        }
        @media(max-width:767px){
            font-size: 30px;
        }
    }
    h4{
        font-size: 40px;
        @media(max-width:1199px){
            font-size: 30px;
        }
        @media(max-width:767px){
            font-size: 25px;
        }
    }
    h5{
        font-size: 30px;
        color: var(--textPrimaryColor);
        @media(max-width:1199px){
            font-size: 20px;
        }
        @media(max-width:767px){
            font-size: 18px;
        }
    }
    h6{
        font-size: 20px;
        color: var(--textPrimaryColor);
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