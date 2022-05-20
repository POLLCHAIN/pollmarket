import React from 'react'
import { useHistory } from "react-router";

import './PopularItemCard.css'
import { formatNum } from "../../utils";

const PopularItemCard = (props) => {
    const {item} = props;
    const history = useHistory();    

    const goToItemDetail = () => {
        history.push(`/detail/${item.itemCollection}/${item.tokenId}`)
    }
    return (
        <div className="search-item" onClick={goToItemDetail}>
            <img src={item.image} alt={item.name} />
            <div className="search-item-info">
                <h4>{item.name}</h4>
                {
                    item?.auctionInfo ? 
                        item?.auctionInfo.bidded ?                            
                            <p><span>Highest Bid</span> {formatNum(item?.auctionInfo.lastPrice)} {item?.auctionInfo.tokenSymbol}</p>
                            :
                            <p><span>Minimum Bid</span> {formatNum(item?.auctionInfo.lastPrice)} {item?.auctionInfo.tokenSymbol}</p>                                             
                        :
                        item?.pairInfo ?
                            item?.pairInfo.coumt > 1 ?
                                <p><span> From {formatNum(item?.pairInfo.price)} {item?.pairInfo.tokenSymbol} </span> {item?.pairInfo.totalBalance} of {item?.supply}</p>
                                :
                                <p><span> {formatNum(item?.pairInfo.price)} {item?.pairInfo.tokenSymbol} </span> {item?.pairInfo.totalBalance} of {item?.supply}</p>                                                       
                            :
                            <p><span>Not for sale</span> {item?.supply} editions </p>                                             
                                         
                }                
            </div>            
        </div>
    )
}

export default PopularItemCard
