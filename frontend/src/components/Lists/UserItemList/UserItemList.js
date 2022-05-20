/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios'
import UserItem from '../../SearchItems/UserItem'

const UserItemList = (props) => {    
    const [users, setUsers] = useState([])

    const [page, setPage] = useState(1)
    const [noUsers, setNoUsers] = useState(false)
    const [initialItemsLoaded, setInitialItemsLoaded] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {    
        if (props.searchTxt) {
            setUsers([])
            setNoUsers(false)
            setInitialItemsLoaded(false)
            setLoading(true)   
            setPage(1)            
            fetchUsers(true)
        }        
    }, [props])    
    
    useEffect(() => {
        setLoading(true)    
        if (initialItemsLoaded){
            fetchUsers(false);
        }
    }, [page])
    
    function fetchUsers(reset){    
        let queryUrl = `/api/search_users?search=${props.searchTxt}&page=${reset ? 1 : page}`
        axios.get(queryUrl)
        .then(res => {
          setLoading(false)   
          if (res.data.users.length === 0) setNoUsers(true)
              
          if (reset){        
            setUsers(res.data.users)
            setInitialItemsLoaded(true)
          }else{
            let prevArray = JSON.parse(JSON.stringify(users))
            prevArray.push(...res.data.users)
            setUsers(prevArray)        
          }
          
        })
        .catch(err => {            
          setLoading(false)  
          if (err.response.data.message === 'No Users found') {
            setNoUsers(true)    
          }      
        })
    }
    
    function loadMore() {
        if (!loading) {
            setPage(page => {return (page + 1)})
        }      
    }

    return (
        <div>
            <div>
                {users.map((user, index) => ( props.limit ? 
                    index < 3 && <UserItem {...props} user={user} key={index} />
                    :
                    <UserItem {...props} user={user} key={index} />
                ))}
            </div>
            <div className="load-more" style={{display: noUsers || props.limit ? "none" : ""}}>
                <button onClick={() => loadMore()} className="" type="primary" >
                {loading ? "Loading..." : "Load more"}
                </button>
            </div>
        </div>
        
    )
}

export default UserItemList
