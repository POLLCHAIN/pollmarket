import React, { useState } from "react";
import { useHistory } from "react-router";
import { formatNum } from "../../utils";
import BuyItemDialog from "../../components/Dialogs/BuyItemDialog";
import DelistItemDialog from "../../components/Dialogs/DelistItemDialog";
import DialogFun from "../../functions/DialogFun";

const OwnersList = (props) => {
    const {item,account,setRefresh} = props;
    const [pairItem, setPairItem] = useState(null);

    const history = useHistory();
    function goToProfilePage(address) {
        history.push(`/user/${address?.toLowerCase()}`);
    }

    function buyItem(pair) {
        setPairItem(pair)
        toggleBuyItemDialog()
    }
    function delistItem(pair) {
        setPairItem(pair)
        toggleDelistItemDialog()        
    }

    const {
        toggleBuyItemDialog, buyItemDialog,
        toggleDelistItemDialog, delistItemDialog,          
      } = DialogFun();

    return (
        <div>
            {
                item?.auctionInfo && (
                    <div className="owner-item-content">                   
                        <div className="user-item" >
                            <div className="user-content" >
                                <img src={item.auctionInfo.user.profilePic} alt={"profile"} 
                                    onClick={() => goToProfilePage(item.auctionInfo.user.address)}/>
                                <div className="user-info">
                                    <p>{item.auctionInfo.user.name}</p>                                                                              
                                </div>
                            </div>
                        </div>                            
                    </div>
                )
            }
            {
                item?.pairs && (
                    item?.pairs.map((pair, index) => (
                        <div className="owner-item-content">                   
                            <div className="user-item" >
                                <div className="user-content">
                                    <img src={pair.user.profilePic} alt={"profile"} 
                                        onClick={() => goToProfilePage(pair.user?.address)}/>
                                    <div className="user-info">
                                        <p>{pair.user.name}</p> 
                                        <h5>{pair.balance}/{item.supply} on sale for<span> {`${formatNum(pair.price)} ${pair.tokenSymbol}`} </span>each</h5>                                         
                                    </div>
                                </div>
                            </div>
                            {
                                (props.user && account) &&
                                (
                                    pair.user.address.toLowerCase() === account?.toLowerCase() ?
                                    <button onClick={() => { delistItem(pair) }}>Unlist</button>
                                    :
                                    <button onClick={() => { buyItem(pair)}}>Buy</button>
                                )
                            }
                            
                        </div>                        
                    ))
                )
            }
            {
                item?.holders && (
                    item?.holders.map((holder, index) => (
                        <div className="owner-item-content">                   
                            <div className="user-item">
                                <div className="user-content">
                                    <img src={holder.user.profilePic} alt={"profile"} 
                                        onClick={() => goToProfilePage(holder.user?.address)}/>
                                    <div className="user-info">
                                        <p>{holder.user.name}</p> 
                                        <h5>{holder.balance} editions are not for sale</h5>                                         
                                    </div>
                                </div>
                            </div>                            
                        </div>                        
                    ))
                )
            }
            {
                pairItem && 
                <BuyItemDialog
                    item={item}
                    pair={pairItem}
                    setRefresh={setRefresh}
                    modalVisible={buyItemDialog}
                    toggleDialog={toggleBuyItemDialog}
                />
            }
            {
                pairItem && 
                <DelistItemDialog
                    pair={pairItem}
                    setRefresh={setRefresh}
                    modalVisible={delistItemDialog}
                    toggleDialog={toggleDelistItemDialog}
                /> 
            }
        </div>
    )
}

export default OwnersList
