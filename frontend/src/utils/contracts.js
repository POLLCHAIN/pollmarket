/* eslint-disable no-redeclare */
import { BigNumber, ethers } from "ethers";
import { getCollectionContract, getContractInfo, getContractObj } from ".";

export function isAddress(address) {
    try {
        ethers.utils.getAddress(address);
    } catch (e) { return false; }
    return true;
}

export function toEth(amount,decimal) {
    return ethers.utils.formatUnits(String(amount),decimal) 
}

export function toWei(amount,decimal) {    
  return ethers.utils.parseUnits(String(amount),decimal);
}

/**
 * Governance Token Contract Management
 */


/**
 * getTokenBalance(account, symbol, chainId, library)
 * account : user address
 * symbol : ETH / POLL
 */
export async function getTokenBalance(account, symbol, chainId, library) {
    if (symbol === 'ETH') {
        var balance = await library.getBalance(account);
        var etherVal = parseFloat(ethers.utils.formatEther(balance));  
        return etherVal;
    } else {
        var Token = getContractObj(symbol, chainId, library.getSigner());
        if(Token) {
            var balance = await Token.balanceOf(account);
            var decimal = await Token.decimals();
            return toEth(balance,decimal);
        }
    }
    
    return 0;
}

/**
 * isTokenApproved(account, symbol, amount, to, chainId, provider)
 * account : user address
 * symbol : ETH / POLL
 * amount : approving amount
 * to : SingleFixed, SingleAuction, MultipleFixed
 */
export async function isTokenApproved(account, symbol, amount, to, chainId, provider) {
    const toContract = getContractObj(to, chainId, provider);
    const tokenContract = getContractObj(symbol, chainId, provider);
    if (!toContract || !tokenContract) return false

    const decimal = await tokenContract.decimals();
    const allowance = await tokenContract.allowance(account, toContract.address);
    if(BigNumber.from(toWei(amount,decimal)).gt(allowance)) {
        return false;
    }
    return true;
}

/**
 * approveToken(symbol, to, chainId, signer)
 * symbol : ETH / POLL
 * to : SingleFixed, SingleAuction, MultipleFixed
 */
export async function approveToken(symbol, to, chainId, signer) {
    const toContract = getContractObj(to, chainId, signer);
    const tokenContract = getContractObj(symbol, chainId, signer);
    if (!toContract || !tokenContract) return false

    const approveAmount = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
    try {
        const approve_tx = await tokenContract.approve(toContract.address, approveAmount);
        await approve_tx.wait(1);
        return true;
    }catch(e) {
        console.log(e)
        return false;
    }
}


/**
 * NFT Contract Management
 */

/**
 * isNFTApproved(name, collection, to, account, chainId, provider)
 * name : SingleNFT / MultipleNFT
 * collection : collectioin address
 * account : user address
 * to : SingleFixed, SingleAuction, MultipleFixed
 */
export async function isNFTApproved(name, collection, to, account, chainId, provider) {
    const toContract = getContractObj(to, chainId, provider);
    const nftToken = getCollectionContract(name, collection, chainId, provider);
    if (!toContract || !nftToken) return false
    return await nftToken.isApprovedForAll(account, toContract.address);
}

/**
 * setNFTApproval(name, collection, to, chainId, provider)
 * name : SingleNFT / MultipleNFT
 * collection : collectioin address
 * to : SingleFixed, SingleAuction, MultipleFixed
 */
export async function setNFTApproval(name, collection, to, chainId, provider) {
    const toContract = getContractObj(to, chainId, provider);
    const nftToken = getCollectionContract(name, collection, chainId, provider);

    if (!toContract || !nftToken) return false
    try {
        const tx = await nftToken.setApprovalForAll(toContract.address, true);
        await tx.wait(1);
        return true;
    }catch(e) {
        console.log(e)
    }
    return false;
}

// Add item to SingleNFT collection contract
export async function addSingleItem(collection, uri, royalty, chainId, provider) {
    const contractObj = getCollectionContract('SingleNFT', collection, chainId, provider);
    const contractInfo = getContractInfo('SingleNFT', chainId);
    if (!contractObj || !contractInfo) return false
    try {
        const tx = await contractObj.addItem(uri,royalty)
        const receipt = await tx.wait(2);
        if(receipt.confirmations) {
            const interf = new ethers.utils.Interface(contractInfo.abi);
            const logs = receipt.logs;
            let tokenId = 0;
            for(let index = 0; index < logs.length; index ++) {
              const log = logs[index];
              if(collection.toLowerCase() === log.address?.toLowerCase()) {
                tokenId = interf.parseLog(log).args.tokenId.toNumber();
                return tokenId;
              }
            }
        }
        return false;
    }catch(e) {
        console.log(e)
        return false;
    }        
}
// Add item to MultipleNFT collection contract
export async function addMultiItem(collection, uri, royalty, supply, chainId, provider) {
    const contractObj = getCollectionContract('MultipleNFT', collection, chainId, provider);
    const contractInfo = getContractInfo('MultipleNFT', chainId);
    if (!contractObj || !contractInfo) return false
    try {
        const tx = await contractObj.addItem(supply,royalty,uri)
        const receipt = await tx.wait(2);
        if(receipt.confirmations) {
            const interf = new ethers.utils.Interface(contractInfo.abi);
            const logs = receipt.logs;
            let tokenId = 0;
            for(let index = 0; index < logs.length; index ++) {
              const log = logs[index];
              if(collection.toLowerCase() === log.address?.toLowerCase()) {
                tokenId = interf.parseLog(log).args.id.toNumber();
                return tokenId;
              }
            }
        }
        return false;
    }catch(e) {
        console.log(e)
        return false;
    }        
}
// transfer SingleNFT nft item
export async function transferSingleItem(collection, from, to, tokenId, chainId, provider) {
    const nftToken = getCollectionContract('SingleNFT', collection, chainId, provider);
    try {
        const tx = await nftToken.safeTransferFrom(from, to, tokenId);
        await tx.wait(1);

        return true;
    }catch(e) {
        console.log(e);
        return false;
    }
}
// transfer MultipleNFT nft item
export async function transferMultiItem(collection, from, to, tokenId, amount, chainId, provider) {
    const nftToken = getCollectionContract('MultipleNFT', collection, chainId, provider);
    var data = [];
    try {
        const tx = await nftToken.safeTransferFrom(from, to, tokenId, amount, data);
        await tx.wait(1);

        return true;
    }catch(e) {
        console.log(e);
        return false;
    }
}




/**
 * Market Contract Management
 */

/**
 * createNewCollection(from, name, uri, bPublic, chainId, provider)
 * from : SingleFixed / MultipleFixed
 * name : collection name
 * uri : collectioin uri
 */
export async function createNewCollection(from, name, uri, bPublic, chainId, provider) {
    const marketContract = getContractObj(from, chainId, provider);
    const marketContractInfo = getContractInfo(from, chainId);
    try {
        const tx =  await marketContract.createCollection(name, uri, bPublic);
        const receipt = await tx.wait(2);
        if(receipt.confirmations) {
            const interf = new ethers.utils.Interface(marketContractInfo.abi);
            const logs = receipt.logs;
            let collectionAddress = "";
            for(let index = 0; index < logs.length; index ++) {
              const log = logs[index];
              if(marketContractInfo.address?.toLowerCase() === log.address?.toLowerCase()) {
                collectionAddress = interf.parseLog(log).args.collection_address?.toLowerCase();
                return collectionAddress;
              }
            }
        }
        return false;
    }catch(e) {
        console.log(e);
        return false;
    }
}

/**
 * listSingleItem(collection, owner, token_id, symbol, price, chainId, provider)
 * collection : SingleNFT collection addresss
 * owner : nft token owner
 * token_id : nft token id
 * symbol : governance token symbol ETH / POLL
 * price : nft token price
 */
export async function listSingleItem(collection, owner, token_id, symbol, price, chainId, provider) {
    const marketContract = getContractObj('SingleFixed', chainId, provider);
    const marketContractInfo = getContractInfo('SingleFixed', chainId);
    const Token = getContractObj(symbol, chainId, provider);
    if (!marketContract || !marketContractInfo || !Token) return false
    try {
        let isApproved = await isNFTApproved('SingleNFT', collection, 'SingleFixed', owner, chainId, provider);
        if(!isApproved) {
            isApproved = await setNFTApproval('SingleNFT', collection, 'SingleFixed', chainId, provider);            
        }
        if (isApproved) {            
            const tx =  await marketContract.singleList(collection, token_id, Token.address, toWei(price,18));
            const receipt = await tx.wait(2);
            if(receipt.confirmations) {
                const interf = new ethers.utils.Interface(marketContractInfo.abi);
                const logs = receipt.logs;
                let pairId  = 0;
                for(let index = 0; index < logs.length; index ++) {
                    const log = logs[index];
                    if(marketContractInfo.address?.toLowerCase() === log.address?.toLowerCase()) {
                        pairId = interf.parseLog(log).args.pair.pairId.toString();
                        return pairId;
                    }
                }
            }
        }               
        return false;
    }catch(e) {
        console.log(e);
        return false;
    }
}

/**
 * singleDelistItem(id, chainId, provider)
 * id : pair ID
 */
export async function singleDelistItem(id, chainId, provider) {
    const marketContract = getContractObj('SingleFixed', chainId, provider);
    if (!marketContract) return false
    try {
      const tx = await marketContract.singleDelist(id)
      await tx.wait(2)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
}
 
/**
 * singleBuy(account, id, symbol, price, chainId, provider)
 * id : pair ID
 * symbol : governance token symbol ETH / POLL
 * price : pair price
 */
export async function singleBuy(account, id, symbol, price, chainId, provider) {    
    const marketContract = getContractObj('SingleFixed', chainId, provider)
    if (!marketContract) return false 
    try {
        if (symbol === 'ETH') {
            const tx = await marketContract.singleBuy(id, {
                value: toWei(price,18)
            })
            await tx.wait(2)
            return true
        } else {
            const Token = getContractObj(symbol, chainId, provider);
            if (!Token) return false    
            let tokenApproveStatus = await isTokenApproved(account, symbol, price, 'SingleFixed', chainId, provider)
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(symbol, 'SingleFixed', chainId, provider)
            }
            if (tokenApproveStatus) {                
                const tx = await marketContract.singleBuy(id, {
                    value: BigNumber.from(0)
                })
                await tx.wait(2)
                return true
            }
            return false
        }   
    } catch (error) {
        console.log(error)
        return false
    } 
    
}

/**
 * listMultiItem(collection, owner, token_id, amount, symbol, price, chainId, provider)
 * collection : MultipleNFT collection addresss
 * owner : nft token owner
 * token_id : nft token id
 * amount : nft item amount
 * symbol : governance token symbol ETH / POLL
 * price : nft token price
 */
 export async function listMultiItem(collection, owner, token_id, amount, symbol, price, chainId, provider) {
    const marketContract = getContractObj('MultipleFixed', chainId, provider);
    const marketContractInfo = getContractInfo('MultipleFixed', chainId);
    const Token = getContractObj(symbol, chainId, provider);
    if (!marketContract || !marketContractInfo || !Token) return false
    try {
        let isApproved = await isNFTApproved('MultipleNFT', collection, 'MultipleFixed', owner, chainId, provider);
        if(!isApproved) {
            isApproved = await setNFTApproval('MultipleNFT', collection, 'MultipleFixed', chainId, provider);            
        }
        if (isApproved) {            
            const tx =  await marketContract.multipleList(collection, token_id, Token.address, amount, toWei(price,18));
            const receipt = await tx.wait(2);
            if(receipt.confirmations) {
                const interf = new ethers.utils.Interface(marketContractInfo.abi);
                const logs = receipt.logs;
                let pairId  = 0;
                for(let index = 0; index < logs.length; index ++) {
                    const log = logs[index];
                    if(marketContractInfo.address?.toLowerCase() === log.address?.toLowerCase()) {
                        pairId = interf.parseLog(log).args.item.pairId.toString();
                        return pairId;
                    }
                }
            }
        }               
        return false;
    }catch(e) {
        console.log(e);
        return false;
    }
}

/**
 * multipleDelistItem(id, chainId, provider)
 * id : pair ID
 */
export async function multipleDelistItem(id, chainId, provider) {
    const marketContract = getContractObj('MultipleFixed', chainId, provider);
    if (!marketContract) return false
    try {
      const tx = await marketContract.multipleDelist(id)
      await tx.wait(2)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
}
 
/**
 * multipleBuy(account, id, amount, symbol, price, chainId, provider)
 * id : pair ID
 * amount: nft item amount
 * symbol : governance token symbol ETH / POLL
 * price : pair price
 */
export async function multipleBuy(account, id, amount, symbol, price, chainId, provider) {
    const marketContract = getContractObj('MultipleFixed', chainId, provider)
    if (!marketContract) return false
    try {
        if (symbol === 'ETH') {
            const tx = await marketContract.multipleBuy(id, amount, {
                value: toWei(price * amount ,18)
            })
            await tx.wait(2)
            return true
        } else {
            const Token = getContractObj(symbol, chainId, provider);
            if (!Token) return false    
            let tokenApproveStatus = await isTokenApproved(account, symbol, price * amount, 'MultipleFixed', chainId, provider)
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(symbol, 'MultipleFixed', chainId, provider)
            }
            if (tokenApproveStatus) {
                const tx = await marketContract.multipleBuy(id, amount, {
                    value: BigNumber.from(0)
                })
                await tx.wait(2)
                return true
            }
            return false   
        }
        
    } catch (error) {
        console.log(error)
        return false
    }
}


/**
 * Auction Contract Management
 */

/**
 * createAuction(collection, owner, token_id, symbol, startPrice, startTime, endTime, chainId, provider)
 * collection : SingleNFT collection address
 * owner : nft token owner
 * token_id : nft token id
 * symbol : governance token symbol ETH / POLL
 * startPrice : start bid price
 * startTime : auction start time
 * endTime : auction end time
 */
export async function createAuction(collection, owner, token_id, symbol, startPrice, startTime, endTime, chainId, provider) {
    const auctionContract = getContractObj('SingleAuction', chainId, provider);
    const auctionContractInfo = getContractInfo('SingleAuction', chainId);
    const tokenContract = getContractObj(symbol, chainId, provider);
    
    if (!auctionContract || !auctionContractInfo|| !tokenContract) return false
    try {
        let isApproved = await isNFTApproved('SingleNFT', collection, 'SingleAuction', owner, chainId, provider);
        if(!isApproved) {
            isApproved = await setNFTApproval('SingleNFT', collection, 'SingleAuction', chainId, provider);            
        }
        if (isApproved) {
            const tx =  await auctionContract.createAuction(collection, token_id, tokenContract.address, toWei(startPrice,18),startTime,endTime);
            const receipt = await tx.wait(2);
            if(receipt.confirmations) {
                return true
            }
        }               
        return false;
    }catch(e) {
        console.log(e);
        return false;
    }
}

/**
 * finalizeAuction(id, chainId, provider)
 * id : auction ID
 */
export async function finalizeAuction(id, chainId, provider) {
    const auctionContract = getContractObj('SingleAuction', chainId, provider)
    if (!auctionContract) return false
    try {
      const tx = await auctionContract.finalizeAuction(id)
      await tx.wait(2)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
}
  
/**
 * finalizeAuction(id, chainId, provider)
 * id : auction ID
 */
export async function bidOnAuction(account, id, symbol, price, chainId, provider) {
    const auctionContract = getContractObj('SingleAuction', chainId, provider)
    if (!auctionContract) return false   
    try {
        if (symbol === 'ETH') {
            const tx = await auctionContract.bidOnAuction(id, toWei(price,18), {
                value: toWei(price,18)
            })
            await tx.wait(2)
            return true
        } else {
            const Token = getContractObj(symbol, chainId, provider)
            if (!Token) return false    
            
            let tokenApproveStatus = await isTokenApproved(account, symbol, price, 'SingleAuction', chainId, provider)
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(symbol, 'SingleAuction', chainId, provider)
            }
            if (tokenApproveStatus) {
                const decimal = await Token.decimals();
                const tx = await auctionContract.bidOnAuction(id, toWei(price,decimal), {
                    value: BigNumber.from(0)
                })
                await tx.wait(2)
                return true
            }
            return false 
        }
    } catch (error) {
        console.log(error)
        return false
    }

             
    
}