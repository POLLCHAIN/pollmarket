const ethers = require('ethers');
const axios = require('axios');

const SettingModel = require('./models/setting.model');
const config = require('./config')

const Item = require('./models/item.model');
const Pair = require('./models/pair.model');
const Auction = require('./models/auction.model');
const Bid = require('./models/bid.model');
const Event = require('./models/event.model');

const ItemCollection = require('./models/collection.model');
const Category = require('./models/category.model');
const Token = require('./models/token.model');
const Sold = require('./models/sold.model');

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const Sync = {
    init: async function() {
        let setting = await SettingModel.findOne({});

        if(!setting) {
            setting = {
                timestamp: 400
            };    
            await SettingModel.create(setting);
        }

        let categories = await Category.find({}).lean();
        if(!categories || categories.length == 0) {
            const default_categories = [ "Data", "Game", "Art", "Music", "Video", "Travel", "Food", "Sports", "Ticket", "Finance" ];
            let categories_to_save = [];
            for(const category of default_categories) {
                categories_to_save.push({
                    id: category,
                    name: category
                })
            } 
            await Category.insertMany(categories_to_save)
        }  

    },

    execute: async function(){        
        while(1) {
            try {
            //sync token rate
                const currentTimeStamp = Math.floor(Date.now() / 1000);   
                // get ETH rate
                const ethRateUrl = 'https://api.coingecko.com/api/v3/coins/weth'
                const ethRateResult = await axios(ethRateUrl);
                if (ethRateResult.data) {                    
                    const price = Number(ethRateResult.data.market_data.current_price.usd)                                         
                    if (price > 0) {
                        await Token.findOneAndUpdate({address: config.ETH},{
                            timestamp: currentTimeStamp,
                            address: config.ETH,
                            name: "Ethereum",
                            symbol: "ETH",
                            decimal: 18,
                            rate: price                            
                        }, {new: true, upsert: true})
                    }               
                }

                // get POLL rate
                const pollRateUrl = 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=pollchain'
                const pollRateResult = await axios(pollRateUrl);
                if (pollRateResult.data) {               
                    const price = Number(pollRateResult.data.data.marketPairs[0].price)                                         
                    if (price > 0) {
                        await Token.findOneAndUpdate({address: config.POLL},{
                            timestamp: currentTimeStamp,
                            address: config.POLL,
                            name: "POLLCHAIN",
                            symbol: "POLL",
                            decimal: 18,
                            rate: price                            
                        }, {new: true, upsert: true})
                    }               
                }

            // sync subgraph data                
                const setting = await SettingModel.findOne({});                
                const lastTimeStamp = setting?.timestamp || 0;   
                
                console.log(`--- SYNC SUBGRAPH DATA FROM ${lastTimeStamp} TIMESTAMP ---`);
                
                var data = JSON.stringify({
                    query: `{
                                collections(first: 1000, where:{timestamp_gt:${lastTimeStamp}}, orderBy:timestamp, orderDirection:asc) {
                                    id
                                    timestamp
                                    txhash
                                    logIndex
                                    address
                                    ownerAddress
                                    type
                                    name
                                    uri
                                    isPublic
                                }
                                balances(first: 1000, where:{timestamp_gt:${lastTimeStamp}}, orderBy:timestamp, orderDirection:asc) {
                                    id
                                    timestamp
                                    collection
                                    tokenId
                                    account
                                    value
                                }
                                items(first: 1000, where:{timestamp_gt:${lastTimeStamp}}, orderBy:timestamp, orderDirection:asc) {
                                    id
                                    timestamp
                                    txhash
                                    logIndex
                                    collection
                                    tokenId
                                    type
                                    creator
                                    uri
                                    supply
                                    royalty
                                }
                                pairs(first: 1000, where:{timestamp_gt:${lastTimeStamp}}, orderBy:timestamp, orderDirection:asc) {
                                    id
                                    timestamp
                                    txhash
                                    logIndex
                                    collection
                                    tokenId
                                    pairId
                                    type
                                    creator
                                    owner
                                    tokenAdr
                                    balance
                                    price
                                    creatorFee
                                    bValid
                                }
                                auctions(first: 1000, where:{timestamp_gt:${lastTimeStamp}}, orderBy:timestamp, orderDirection:asc) {
                                    id
                                    timestamp
                                    txhash
                                    logIndex
                                    collection
                                    tokenId
                                    auctionId
                                    startTime
                                    endTime
                                    tokenAdr
                                    startPrice
                                    creator
                                    owner
                                    active
                                }
                                bids(first: 1000, where:{timestamp_gt:${lastTimeStamp}}, orderBy:timestamp, orderDirection:asc) {
                                    id
                                    timestamp
                                    txhash
                                    logIndex
                                    collection
                                    tokenId
                                    auctionId
                                    from
                                    tokenAdr
                                    bidPrice
                                }
                                events(first: 1000, where:{timestamp_gt:${lastTimeStamp}}, orderBy:timestamp, orderDirection:asc) {
                                    id
                                    timestamp
                                    collection
                                    tokenId
                                    action
                                    actionAddress
                                    params
                                }                                  
                            }`,
                    variables: {}
                });
    
                var subgraph_config = {
                    method: 'post',
                    url: 'https://api.thegraph.com/subgraphs/name/bin0316/poll-market-mainnet',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
    
                const result = await axios(subgraph_config);
    
                const collections = result.data.data.collections;
                const items = result.data.data.items;
                const pairs = result.data.data.pairs;
                const auctions = result.data.data.auctions;
                const bids = result.data.data.bids;
                const events = result.data.data.events;
                const balances = result.data.data.balances;  
                
                // Collection node
                for (var index = 0; index < collections.length; index++) {
                    const node = collections[index];

                    const address = node.address.toLowerCase();
                    const ownerAddress = node.ownerAddress.toLowerCase();
                    const type = node.type; 
                    const name = node.name;
                    const isPublic = node.isPublic;
                    const timestamp = node.timestamp;
                    const uri = node.uri.replace('ipfs://', 'https://pollchain.mypinata.cloud/ipfs/').replace('ipfs.io', 'pollchain.mypinata.cloud');

                    const uriResult = await axios(uri);
                    var description = '';
                    var image = uri;
                    var short_url = '';
                    if (uriResult.data.image) {
                        description = uriResult.data.description;
                        image = uriResult.data.image.replace('ipfs://', 'https://pollchain.mypinata.cloud/ipfs/').replace('ipfs.io', 'pollchain.mypinata.cloud');
                        short_url = uriResult.data.short_url;
                    }                                             
                    
                    await ItemCollection.findOneAndUpdate({address: address},{
                        address: address,
                        timestamp: timestamp,
                        ownerAddress: ownerAddress,
                        type: type,
                        name: name,
                        uri: uri,
                        description: description,
                        image: image,
                        short_url: short_url,
                        isPublic: isPublic
                    }, {new: true, upsert: true})
                }

                // Item node
                for (var index = 0; index < items.length; index++) {
                    const node = items[index];
                    const id = node.id;
                    const timestamp = node.timestamp;
                    const itemCollection = node.collection.toLowerCase();
                    const tokenId = node.tokenId;
                    const type = node.type;
                    const creator = node.creator.toLowerCase();
                    const supply = node.supply;
                    const royalty = node.royalty;

                    const uri = node.uri.replace('ipfs://', 'https://pollchain.mypinata.cloud/ipfs/').replace('ipfs.io', 'pollchain.mypinata.cloud');
                    const uriResult = await axios(uri);
                    const name = uriResult.data.name;
                    const description = uriResult.data.description;                        
                    const category = uriResult.data.category;
                    const image = uriResult.data.image.replace('ipfs://', 'https://pollchain.mypinata.cloud/ipfs/').replace('ipfs.io', 'pollchain.mypinata.cloud');
                    const file = uriResult.data.file;
                    const asset_type = uriResult.data.asset_type;

                    attributesData = uriResult.data.attributes;
                    const metadata = [];
                    for (let index = 0; index < attributesData.length; index++) {
                        const element = attributesData[index];
                        metadata.push({
                            type: element.trait_type,
                            value: element.value,
                        });                     
                    }

                    var item = await Item.findOne({tokenId: tokenId, itemCollection: itemCollection});        
                    if (!item) {          
                        const newItem = new Item({
                            id: id,
                            timestamp: timestamp,
                            itemCollection: itemCollection,
                            tokenId: tokenId,
                            type: type,
                            creator: creator,                                
                            uri: uri,
                            supply: supply,
                            royalty: royalty,

                            name: name,
                            description: description,
                            category: category,
                            image: image,
                            file: file,
                            asset_type: asset_type,
                            attributes: metadata,

                            usdPrice: 0,
                            auctionEndTimestamp: 0,
                            holders: [],
                            likes: []
                        })
                        await newItem.save();        
                    } else {
                        item.timestamp = timestamp;
                        item.uri = uri;
                        item.supply = supply;
                        item.royalty = royalty;

                        item.name = name;
                        item.description = description;
                        item.category = category;
                        item.image = image;
                        item.file = file;
                        item.asset_type = asset_type;
                        item.attributes = metadata;

                        await item.save();
                    }
                }
                
                const nodes = this.sortByTimeStamp(pairs.concat(auctions).concat(bids).concat(events).concat(balances));               
                
                for (var index = 0; index < nodes.length; index++) {
                    const node = nodes[index];
                    if (node.pairId) {
                        // Pair node
                        const id = node.id;
                        const timestamp = node.timestamp;
                        const itemCollection = node.collection.toLowerCase();
                        const tokenId = node.tokenId;
                        const pairId = node.pairId;
                        const type = node.type;
                        const creator = node.creator.toLowerCase();
                        const owner = node.owner.toLowerCase();
                        const tokenAdr = node.tokenAdr.toLowerCase();
                        const balance = node.balance;
                        const price = node.price;
                        const creatorFee = node.creatorFee;
                        const bValid = node.bValid;

                        const token = await Token.findOne({address: tokenAdr});
                        var decimal = 18
                        var rate = 1.0
                        if (token) {
                            decimal = token.decimal
                            rate = token.rate
                        }                        
                        
                        if ((balance != 0) && bValid) {
                            await Pair.findOneAndUpdate({id: id},{
                                id: id,
                                timestamp: timestamp,
                                pairId: pairId,
                                itemCollection: itemCollection,
                                tokenId: tokenId,
                                type: type,
                                creator: creator,
                                owner: owner,
                                tokenAdr: tokenAdr,
                                tokenSymbol:token?.symbol,
                                balance: balance,
                                price: ethers.utils.formatUnits(price,decimal),
                                usdPrice: ethers.utils.formatUnits(price,decimal) * rate,
                                creatorFee: creatorFee,
                                bValid: bValid
                            }, {new: true, upsert: true})

                            await Item.findOneAndUpdate({tokenId: tokenId, itemCollection: itemCollection},{
                                usdPrice: ethers.utils.formatUnits(price,decimal) * rate                                
                            }, {new: true, upsert: true})

                        } else {
                            await Pair.findOneAndDelete({id: id})
                        }
                        
                    } else if (node.startPrice) {
                        // Auction node                        
                        const id = node.id;
                        const timestamp = node.timestamp;
                        const auctionId = node.auctionId;
                        const itemCollection = node.collection.toLowerCase();
                        const tokenId = node.tokenId;
                        const startTime = node.startTime;
                        const endTime = node.endTime;
                        const tokenAdr = node.tokenAdr.toLowerCase();
                        const startPrice = node.startPrice;
                        const creator = node.creator.toLowerCase();
                        const owner = node.owner.toLowerCase();
                        const active = node.active;   
                        
                        const token = await Token.findOne({address: tokenAdr});
                        var decimal = 18 
                        var rate = 1.0                       
                        if (token) {
                            decimal = token.decimal 
                            rate = token.rate                           
                        }
                        var auction = await Auction.findOne({id: id});      
                        
                        if (active) {
                            if (!auction) {
                                const newAuction = new Auction({
                                    id: id,
                                    timestamp: timestamp,
                                    auctionId: auctionId,
                                    itemCollection: itemCollection,
                                    tokenId: tokenId,
                                    startTime: startTime,
                                    endTime: endTime,
                                    tokenAdr: tokenAdr,
                                    tokenSymbol:token?.symbol,
                                    startPrice: ethers.utils.formatUnits(startPrice,decimal),
                                    creator: creator,
                                    owner: owner,
                                    active: active,
                                    lastPrice: ethers.utils.formatUnits(startPrice,decimal),
                                    bidded: false                                    
                                })
                                await newAuction.save();
                            }
                            await Item.findOneAndUpdate({tokenId: tokenId, itemCollection: itemCollection},{
                                usdPrice: ethers.utils.formatUnits(startPrice,decimal) * rate,
                                auctionEndTimestamp: endTime                                 
                            }, {new: true, upsert: true})                            
                        } else {
                            await Auction.findOneAndDelete({id: id})
                            await Item.findOneAndUpdate({tokenId: tokenId, itemCollection: itemCollection},{
                                auctionEndTimestamp: 0                                 
                            }, {new: true, upsert: true}) 
                            // delete all bids for this auction
                            await Bid.deleteMany({auctionId: auctionId})                            
                        }
                    } else if (node.bidPrice) {
                        // Bid node
                        const id = node.id;
                        const timestamp = node.timestamp;
                        const itemCollection = node.collection.toLowerCase();
                        const tokenId = node.tokenId;
                        const auctionId = node.auctionId;
                        const from = node.from.toLowerCase();
                        const tokenAdr = node.tokenAdr.toLowerCase();
                        const bidPrice = node.bidPrice; 
                        
                        const token = await Token.findOne({address: tokenAdr});
                        var decimal = 18 
                        var rate = 1.0                       
                        if (token) {
                            decimal = token.decimal 
                            rate = token.rate                           
                        }
                                                
                        await Bid.findOneAndUpdate({id: id},{
                            id: id,
                            timestamp: timestamp,
                            itemCollection: itemCollection,
                            tokenId: tokenId,
                            auctionId: auctionId,
                            from: from,
                            tokenAdr: tokenAdr,
                            tokenSymbol:token?.symbol,
                            bidPrice: ethers.utils.formatUnits(bidPrice,decimal)
                        }, {new: true, upsert: true})

                        // update auction lastPrice and bidded status
                        var auction = await Auction.findOne({auctionId: auctionId, tokenId: tokenId, itemCollection: itemCollection});        
                        if (auction) {          
                            auction.timestamp = timestamp;
                            auction.lastPrice = ethers.utils.formatUnits(bidPrice,decimal);
                            auction.bidded = true;                            
                            await auction.save();    
                        }

                        // update item usdPrice
                        await Item.findOneAndUpdate({tokenId: tokenId, itemCollection: itemCollection},{
                            usdPrice: ethers.utils.formatUnits(bidPrice,decimal) * rate                                
                        }, {new: true, upsert: true})  

                    } else if (node.actionAddress) {
                        // Event node
                        const id = node.id;
                        const timestamp = node.timestamp;
                        const itemCollection = node.collection.toLowerCase();
                        const tokenId = node.tokenId;
                        const action = node.action;
                        const actionAddress = node.actionAddress.toLowerCase();  
                        const params = node.params;  
                                                
                        // Register Event
                        const blackList = [ config.SingleFixed, config.SingleAuction, config.MultipleFixed ];
                        if ((action == "MultiTransfer") || (action == "SingleTransfer")) {
                            // register transfer event
                            const toAddress = params.split("-")[0].toLowerCase();
                            if ( blackList.includes(actionAddress) || blackList.includes(toAddress)) {
                                                                
                            } else {
                                await Event.findOneAndUpdate({id: id},{
                                    id: id,
                                    timestamp: timestamp,
                                    itemCollection: itemCollection,
                                    tokenId: tokenId,
                                    action: action,
                                    actionAddress: actionAddress,
                                    params: params
                                }, {new: true, upsert: true})
                            }                            
                        } else {
                            await Event.findOneAndUpdate({id: id},{
                                id: id,
                                timestamp: timestamp,
                                itemCollection: itemCollection,
                                tokenId: tokenId,
                                action: action,
                                actionAddress: actionAddress,
                                params: params
                            }, {new: true, upsert: true})
                        }
                        
                        // Update Sold Entity
                        const paramArray = params.split("-");   
                        var seller = ''
                        var amount = 1
                        var tokenAdr = ''
                        var price = '0'
                        var usdAmount = 0                        
                                             
                        switch (action) {
                            case "MultiItemSwapped":
                                seller = paramArray[0].toLowerCase();
                                amount = Number(paramArray[1]);
                                tokenAdr = paramArray[2].toLowerCase();
                                price = paramArray[3];

                                var token = await Token.findOne({address: tokenAdr});
                                var decimal = 18 
                                var rate = 1.0                       
                                if (token) {
                                    decimal = token.decimal    
                                    rate = token.rate                        
                                }
                                usdAmount = amount * ethers.utils.formatUnits(price,decimal) * rate;                     
                                
                                await Sold.findOneAndUpdate({timestamp: timestamp, seller: seller},{
                                    timestamp: timestamp,
                                    itemCollection: itemCollection,
                                    tokenId: tokenId,
                                    seller: seller,
                                    action: action,
                                    usdAmount: usdAmount
                                }, {new: true, upsert: true})
                                                                
                                break;

                            case "SingleSwapped":
                                seller = paramArray[0].toLowerCase();
                                tokenAdr = paramArray[1].toLowerCase();
                                price = paramArray[2];

                                var token = await Token.findOne({address: tokenAdr});
                                var decimal = 18 
                                var rate = 1.0                       
                                if (token) {
                                    decimal = token.decimal    
                                    rate = token.rate                        
                                }
                                usdAmount = ethers.utils.formatUnits(price,decimal) * rate;
                                
                                await Sold.findOneAndUpdate({timestamp: timestamp, seller: seller},{
                                    timestamp: timestamp,
                                    itemCollection: itemCollection,
                                    tokenId: tokenId,
                                    seller: seller,
                                    action: action,
                                    usdAmount: usdAmount
                                }, {new: true, upsert: true})
                                
                                break;

                            case "AuctionFinalized":
                                seller = paramArray[0].toLowerCase();
                                tokenAdr = paramArray[1].toLowerCase();
                                price = paramArray[2];

                                var token = await Token.findOne({address: tokenAdr});
                                var decimal = 18 
                                var rate = 1.0                       
                                if (token) {
                                    decimal = token.decimal    
                                    rate = token.rate                        
                                }
                                usdAmount = ethers.utils.formatUnits(price,decimal) * rate;
                                
                                await Sold.findOneAndUpdate({timestamp: timestamp, seller: seller},{
                                    timestamp: timestamp,
                                    itemCollection: itemCollection,
                                    tokenId: tokenId,
                                    seller: seller,
                                    action: action,
                                    usdAmount: usdAmount
                                }, {new: true, upsert: true})
                                break;                                                          

                            default:
                                break;
                        }

                    } else if (node.account) {
                        // Balance node                        
                        const itemCollection = node.collection.toLowerCase();
                        const tokenId = node.tokenId;
                        const account = node.account.toLowerCase();  
                        const value = node.value;    

                        let item = await Item.findOne({tokenId: tokenId, itemCollection: itemCollection}).lean();
                        if(!item) continue;
                        let holders = item.holders || [];
                        let index = holders.findIndex(({address, balance}) => address === account);
                        if( holders && index != -1 ) {
                            if (value == 0) {
                                holders.splice(index, 1);
                            } else {
                                holders[index].balance = value;
                            }                       
                            
                        } else {
                            if (value > 0) {
                                holders.push({
                                    address: account.toLowerCase(),
                                    balance: value
                                })
                            }                        
                        }
                        await Item.findOneAndUpdate({tokenId: tokenId, itemCollection: itemCollection}, {
                            holders: holders
                        });              
                    }                    
                } 

                const all_nodes = this.sortByTimeStamp(collections.concat(items).concat(nodes));
                
                if ( all_nodes.length > 0)
                {
                    setting.timestamp = all_nodes[all_nodes.length - 1].timestamp
                    await setting.save();  
                }                  
            }
            catch (ex) {
                console.log(ex);                
            }            
            await sleep(3000);
        }  
    },

    sortByTimeStamp: function(nodes) {
        return (nodes || []).sort((a, b) => a.timestamp - b.timestamp);
    }
}

module.exports = Sync;
