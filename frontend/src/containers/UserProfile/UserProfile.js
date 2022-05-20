import React from 'react'
import MyContent from '../../components/UserProfile/MyContent'
import MyHeader from '../../components/UserProfile/MyHeader'
import './UserProfile.css'

const UserProfile = (props) => {

    return (
        <div className="my-items">
            <MyHeader {...props} />
            <MyContent {...props} />
        </div>
    )
    
}

export default UserProfile
