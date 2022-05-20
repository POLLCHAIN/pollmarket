import React from 'react'
import "./ItemDetailStyle.css";

const InfoList = ({item}) => {

    return (
        <div className="item-detail-info">
            <p><span>Category : </span>{item?.category}</p>
            <p><span>Properties</span></p>
            <div className="item-detail-info-properties">                
                {item?.attributes.map((attribute, index) => (
                    <div className="item-detail-info-property">
                        <p style={{color:'blue',marginTop:'10px', marginBottom:'5px'}}>{attribute.type}</p>
                        <p>{attribute.value}</p>
                    </div>
                ))} 
            </div>
                   
        </div>
    )
}

export default InfoList
