import React from 'react'
import CreateMultiple from '../../components/Create/CreateMultiple'
import CreateSingle from '../../components/Create/CreateSingle'
import './Create.css'

const Create = (props) =>  { 

    return (
        <div className="create-container">
            {props.type === "S"?
            <CreateSingle {...props}/>:
            <CreateMultiple {...props}/>
            }
        </div>
    );
    
}

export default Create
