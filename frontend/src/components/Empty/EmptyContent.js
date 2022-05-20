import { Empty } from 'antd'
import React from 'react'
import './EmptyContent.css'

function EmptyContent() {
    return (
        <div className="empty-box">
           <Empty description={
               <div className="empty-box-content">
                <h2>No items found</h2>
                <h3>Go to the market place and try to buy somthing for you</h3>
               </div>
           } /> 
           <button>Browse Market</button>
        </div>
    )
}

export default EmptyContent
