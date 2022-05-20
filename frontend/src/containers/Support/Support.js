import React, { Component } from 'react'
import SupportForm from '../../components/Support/SupportForm'
import SupportNav from '../../components/Support/SupportNav'
import './Support.css'

class Support extends Component {
    render() {
        return (
            <div className="support-container">
                <SupportNav />
                <SupportForm />
                <div className="support-footer">

                </div>
            </div>
        )
    }
}

export default Support
