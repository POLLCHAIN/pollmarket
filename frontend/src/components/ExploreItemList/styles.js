import styled from 'styled-components';
import {Close} from "@styled-icons/material/Close";

export const Container = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 200;
    @media(max-width:1199px){
        max-width: 780px;
    }
    @media(max-width:991px){
        max-width: 680px;
    }
    .filterBox{
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 30px;
        .item-box{
            display: flex;
            width: 100%;
        }
        .form-search{
            background-color: var(--backgroundWhiteColor);
            color: var(--textPrimaryColor);
            background-position:left 40px center;
            background-repeat: no-repeat;
            padding: 0 40px;
            padding-left: 76px;
            border: none;
            border-radius: 50px;
            height: 50px;
            font-size: 20px;
            flex: 1;
            @media (max-width:1199px) {
                height: 50px;
                font-size: 16px;
                background-size: 20px;
            }
            @media (max-width:767px) {
                max-width:100%;
                padding: 0 20px;
                padding-left: 45px;
                background-position:left 15px center;
            }
        }

        .filter-button{
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            height: 60px;
            img{
                margin-right: 8px;
            }
            @media (max-width:1199px) {
                height: 60px;
                font-size: 16px;
                img{
                   max-width: 20px;
                }
            }
        }
        
        .selectWrap{
            position: relative;                                
        }
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
        padding: 5px 30px;
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

export const DropDownMenus = styled.div`
    background: white;
    color: var(--buttonColor);
    width: 100%;
    position: absolute;
    bottom: -140px;
    left: 20px;
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 15px;
    z-index: 300;    
`;

export const DropDownMenu = styled.div`
    padding 12px 24px;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    align-items: center;
    &:hover {
        background-color: #e3e3e3;
    }
`;

export const FilterContent = styled.div`
    position: absolute;
    background-color: var(--backgroundWhiteColor);
    top: 60px;
    width: 100%;
    z-index: 400;
    padding: 20px 10px;
`;

export const FilterCategoryContainer = styled.div`
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const FilterLabel = styled.div`
    color: var(--textPrimaryColor);
    padding: 4px;
`;

export const FilterCategories = styled.div`
     display: flex;
     flex-wrap: wrap;
`;

export const FilterClearAll = styled.div`
    margin-left: 20px;
    padding-top: 4px;
    text-decoration: underline;
    color: #c99400;
    cursor: pointer;
`;

export const FilterCategory = styled.div`
    color: grey;
    padding: 4px 12px;
    margin-left: 12px;
    cursor: pointer;
    position: relative;
    &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0px;
        height: 2px;
        width: 100%;
        background-color: var(--textPrimaryColor);
        transform: scaleX(0);
        transition: all 0.3s;
    }
    &.active {
        color: var(--textPrimaryColor);
        font-weight: 500;
        &:after{
           transform: scaleX(1);
        }
    }
    &:hover {
        color: var(--textPrimaryColor);
        font-weight: 500;        
    }    
`;

export const FilterFooter = styled.div`
     display: block;
     justify-content: space-between;
     align-items: center;
    @media (min-width: 768px){
        display: flex;
    }
`;

export const FilterSaleTypesContainer = styled.div`
     display: flex;
`;

export const FilterSaleTypes = styled.div`
     display: flex;
`;

export const FilterString = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 40px;
    padding: 10px;
`;

export const FilterStringItem = styled.div`
    display: flex;
    align-items: center;
    margin-right: 16px;
    margin-top: 8px;
          
    label{
        margin-right: 8px;
    }
`;

export const FilterValue = styled.div`
    display: flex;
    align-items: center;
    margin-right: 8px;
    color: grey;
    font-size: 14px;
`;

export const RemoveIcon = styled(Close)`
    background: grey;
    border-radius: 8px;
    color: white;
    padding: 2px;
    margin-left: 4px;
`;

