import React from 'react'
import './Preview.css'
import PreviewCard from '../Cards/PreviewCard';

const Preview = ({image,currency, saleType, price, supply, name}) => {

    return (
        <div className="preview-card">
            <h3 className="preview-tag">Preview</h3>
            <PreviewCard image={image} currency={currency} saleType={saleType} price={price}  supply={supply} name={name} />
        </div>
    )
}

export default Preview
