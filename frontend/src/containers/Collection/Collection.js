import React from 'react'
import MyContent from '../../components/Collection/MyContent'
import MyHeader from '../../components/Collection/MyHeader'
import './Collection.css'

const Collection = (props) => {
    return (
        <div className="my-items">
            <MyHeader {...props}/>
            <MyContent {...props}/>
        </div>
    )    
}

export default Collection
