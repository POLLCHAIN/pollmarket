/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from 'axios'
import CollectionItem from '../../SearchItems/CollectionItem'

const CollectionItemList = (props) => {

    const [collections, setCollections] = useState([])

    const [page, setPage] = useState(1)
    const [noCollections, setNoCollections] = useState(false)
    const [initialItemsLoaded, setInitialItemsLoaded] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {    
        if (props.searchTxt) {
            setCollections([])
            setNoCollections(false)
            setInitialItemsLoaded(false)
            setLoading(true)   
            setPage(1)            
            fetchCollections(true)
        }        
    }, [props])    
    
    useEffect(() => {
        setLoading(true)    
        if (initialItemsLoaded){
            fetchCollections(false);
        }
    }, [page])
    
    function fetchCollections(reset){    
        let queryUrl = `/api/search_collections?search=${props.searchTxt}&page=${reset ? 1 : page}`
        axios.get(queryUrl)
        .then(res => {
          setLoading(false)   
          if (res.data.collections.length === 0) setNoCollections(true)
              
          if (reset){        
            setCollections(res.data.collections)
            setInitialItemsLoaded(true)
          }else{
            let prevArray = JSON.parse(JSON.stringify(collections))
            prevArray.push(...res.data.collections)
            setCollections(prevArray)        
          }
          
        })
        .catch(err => {            
          setLoading(false)  
          if (err.response.data.message === 'No Collections found') {
            setNoCollections(true)    
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
                {collections.map((collection, index) => ( props.limit ? 
                    index < 3 && <CollectionItem {...props} collection={collection} key={index} />
                    :
                    <CollectionItem {...props} collection={collection} key={index} />
                ))}
            </div>
            <div className="load-more" style={{display: noCollections || props.limit ? "none" : ""}}>
                <button onClick={() => loadMore()} className="" type="primary" >
                {loading ? "Loading..." : "Load more"}
                </button>
            </div>
        </div>
        
    )
}

export default CollectionItemList
