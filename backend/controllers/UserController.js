const mongoose = require('mongoose');
const ethers = require('ethers');
var jwt = require('jsonwebtoken');
var ethSignUtil = require('eth-sig-util');
var ethereumjsUtil = require('ethereumjs-util');

const config = require('../config')
const BaseController = require('./BaseController');
const User = require("../models/user.model");
const ItemCollection = require("../models/collection.model");
const Item = require("../models/item.model");
const Pair = require("../models/pair.model");
const Event = require("../models/event.model");
const Auction = require("../models/auction.model");
const Token = require('../models/token.model');


module.exports = BaseController.extend({
    name: 'UserController',

    login: async function(req, res, next) {
        let {address, signature } = req.body;
        if (!address || !signature) {
            return res.status(400).send({ error: 'invalid params'})
        }

        address = address.toLowerCase().trim();

        var user = await User.findOne({ address: address });
        if (!user) {
            return res
                .status(401)
                .send({ error: 'Signature verification failed' });
        }

        const msg = `I am signing my one-time nonce: ${user.nonce}`;

        const msgBufferHex = ethereumjsUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const publicAddress = ethSignUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

        // The signature verification is successful if the address found with
        // ecrecover matches the initial publicAddress
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
            user.nonce = Math.floor(Math.random() * 1000000);
            user.last_login = new Date();
            await user.save();

            var token = jwt.sign({ data: user.address }, config.secret, { expiresIn: '43200m' }); // expireIn 1month
            return res
                .status(200)
                .send({token: token});
        } else {
            return res
                .status(401)
                .send({ error: 'Signature verification failed' });
        }

    },

    check: async function(req, res, next) {
        const {address} = req.query;
        if (!address) {
            return res.status(400).send({ error: 'invalid address'})
        }

        let user = await UserModel.findOne({address: address.toLowerCase().trim()}).lean();
        if(!user || user.status !== 'active') {
            return res.sendStatus(404);
        }

        return res.status(200).send(user)
    },

    get: async function(req, res, next) {
        User.findOne({address: req.params.address}, {_id: 0, __v: 0},async (err, user) => {
            if (err) return res.status(500).send({message: err.message});
            
            if (!user){
              const newUser = new User({
                address: req.params.address,
                name: "NoName",
                profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                isApproved: false,
                nonce: Math.floor(Math.random() * 1000000)
              })
              await newUser.save();
              return res.status(200).send({user: newUser, following:0, followers:0})
            }
            res.status(200).send({user: user, following:user.following?.length, followers:user.followers?.length})
          })
    },

    update: async function(req, res, next) {
        if (!req.body.address) return res.status(400).send("No address")
        const name = req.body.name || "NoName"
        const bio = req.body.bio || ""
        const emailAddress = req.body.emailAddress || ""
        const personalLink = req.body.personalLink || ""
        const profilePic = req.body.profilePic || ""

        User.findOne({address: req.body.address}, async (err, user) => {
            if (err) return res.status(500).send({message: err.message});
            if (!user) return res.status(400).send({message: "User not found"});

            User.find({name: name}, async (err, docs) => {
            if (err) return res.status(500).send({message: err.message});
            if (docs.length != 0 && name && name != user.name) return res.status(400).send({message: "Username taken"})

            if (name && name != undefined || name === "") user.name = name
            if (bio && bio != undefined || bio === "") user.bio = bio
            if (emailAddress && emailAddress != undefined || emailAddress === "") user.emailAddress = emailAddress
            if (personalLink && personalLink != undefined || personalLink === "") user.personalLink = personalLink
            if (profilePic && profilePic != undefined || profilePic === "") user.profilePic = profilePic

            await user.save();
            return res.sendStatus(200);

            })
        })
    },

    follow: async function(req, res, next) {
        if (!req.body.from) return res.status(400).send("No From address")
        if (!req.body.to) return res.status(400).send("No To address")
        let fromAddress = req.body.from.toLowerCase()
        let toAddress = req.body.to.toLowerCase()

        var fromUser = await User.findOne({address: fromAddress});
        var toUser = await User.findOne({address: toAddress}); 
        if (!fromUser) return res.status(400).send("Invalid from address")
        if (!toUser) return res.status(400).send("Invalid to address")

        // update following of fromUser
        if (fromUser.following.includes(toAddress)) {
            fromUser.following.splice(
                fromUser.following.indexOf(toAddress),
                1
            );
        } else {
            fromUser.following.push(toAddress);
        }

        // update followers of toUser
        if (toUser.followers.includes(fromAddress)) {
            toUser.followers.splice(
                toUser.followers.indexOf(fromAddress),
                1
            );
        } else {
            toUser.followers.push(fromAddress);
        }        
        await fromUser.save();
        await toUser.save();

        res.status(200).send({ result: 'success' });
    },

    getFollowing: async function(req, res, next) {
        const page = req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let skip = (page - 1) * 12;

        if (!req.query.address) return res.status(400).send("No From address")        
        let address = req.query.address.toLowerCase()        

        var currentUser = await User.findOne({address: address});         
        if (!currentUser) return res.status(400).send("Invalid user address")

        let ret = []
        if (currentUser.following && currentUser.following?.length > skip) {
            for (let index = skip; index < Math.min(currentUser.following?.length,skip+12); index++) {
                const userAddress = currentUser.following[index];
                var user = await User.findOne({address: userAddress},{_id: 0, __v: 0}).lean();        
                if (!user) {          
                    const newUser = new User({
                        address: userAddress,
                        name: "NoName",
                        profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                        isApproved: false,
                        nonce: Math.floor(Math.random() * 1000000)
                    })
                    await newUser.save();         
                    ret.push(newUser);
                } else {
                    ret.push(user);                    
                }   
            }
            return res.status(200).send({ users: ret, count: currentUser.following?.length});
        } else {
            return res.status(404).send({ message: "No following found" });
        }        
    },

    getFollowers: async function(req, res, next) {
        const page = req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let skip = (page - 1) * 12;

        if (!req.query.address) return res.status(400).send("No From address")        
        let address = req.query.address.toLowerCase()        

        var currentUser = await User.findOne({address: address});         
        if (!currentUser) return res.status(400).send("Invalid user address")

        let ret = []
        if (currentUser.followers && currentUser.followers?.length > skip) {
            for (let index = skip; index < Math.min(currentUser.followers?.length,skip+12); index++) {
                const userAddress = currentUser.followers[index];
                var user = await User.findOne({address: userAddress},{_id: 0, __v: 0}).lean();        
                if (!user) {          
                    const newUser = new User({
                        address: userAddress,
                        name: "NoName",
                        profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                        isApproved: false,
                        nonce: Math.floor(Math.random() * 1000000)
                    })
                    await newUser.save();         
                    ret.push(newUser);
                } else {
                    ret.push(user);                    
                }   
            }
            return res.status(200).send({ users: ret, count: currentUser.followers?.length });
        } else {
            return res.status(404).send({ message: "No followers found" });
        }        
    },


    getOnSale: async function(req, res, next) {
        const that = this;
        let ret = [];
        const currentTimeStamp = Math.floor(Date.now() / 1000);  
        const owner = req.query.address.toLowerCase(); 
        const timestamp = req.query.timestamp && parseInt(req.query.timestamp) ? parseInt(req.query.timestamp) : currentTimeStamp;
        
        const pairQuery = [
            {'$match': { 'owner': owner, 'bValid': true }}
            , {'$group': { '_id': {
                    "itemCollection": "$itemCollection",
                    "tokenId": "$tokenId"
                    },
                    'timestamp': { $max: '$timestamp' },
                    'usdPrice': { $min: '$usdPrice' },
                    'count': { $sum: 1 },                    
                    'totalBalance': { $sum: '$balance' }           
                }}
            , {'$match': { 'timestamp': { $lt: timestamp } }}
            , {'$sort': { 'timestamp': -1 }}
            , { '$limit': 12 }            
            ];
        const pairCountQuery = [
            {'$match': { 'owner': owner, 'bValid': true }}
            , {'$group': { '_id': {
                    "itemCollection": "$itemCollection",
                    "tokenId": "$tokenId"
                    }           
                }}                      
            ];
        let pairs = await Pair.aggregate(pairQuery);
        const pairCount = await Pair.countDocuments(pairCountQuery);
            
        let auctions = await Auction.find({owner: owner, active: true, timestamp: { $lt: timestamp }},{ __v: 0, _id: 0 })
            .sort({ timestamp: -1 })
            .limit(12)
            .lean();
        const auctionCount = await Auction.countDocuments({owner: owner, active: true});

        const nodes = that.sortByTimeStamp(pairs.concat(auctions));

        for (let index = 0; index < Math.min(nodes.length,12) ; index++) {
            const node = nodes[index];
            if (node.tokenId) {
                // auction node
                const itemEntity = await that.getItemDetail(node.tokenId, node.itemCollection)  
                ret.push(itemEntity)
            } else {
                // pair node 
                const itemEntity = await that.getItemDetail(node._id.tokenId, node._id.itemCollection)  
                ret.push(itemEntity)
            }
                        
        }
        if (ret && ret?.length > 0) {
            res.status(200).send({ items: ret, lastTimeStamp: nodes[Math.min(nodes.length,12)-1].timestamp, count: pairCount + auctionCount });
        } else {
            return res.status(404).send({ message: "No Items found", count: pairCount + auctionCount });
        }  
    },

    getOwned: async function(req, res, next) {
        const that = this;
        const page = req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let skip = (page - 1) * 12;

        Item.find({'holders.address': req.query.address.toLowerCase(), 'holders.balance': { $gt: 0 } }, { __v: 0, _id: 0 })
            .sort({ timestamp: -1 })
            .limit(12)
            .skip(skip)
            .lean()
            .exec(async function (err, items) {
                if (err) return res.status(500).send({ message: err.message });
                if (!items) return res.status(404).send({ message: "No items found" });

                let ret = [];

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    const itemEntity = await that.getItemDetail(item.tokenId, item.itemCollection)  
                    ret.push(itemEntity);                 
                }

                Item.countDocuments({'holders.address': req.query.address.toLowerCase(), 'holders.balance': { $gt: 0 } }, function (err2, count) {
                    if (err2) return res.status(500).send({ message: err2.message });
                    res.status(200).send({ items: ret, count: count });
                });
            });
        
    },

    getCreated: async function(req, res, next) {
        const that = this;
        const page = req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let skip = (page - 1) * 12;

        Item.find({ 'creator': req.query.address.toLowerCase() }, { __v: 0, _id: 0 })
            .sort({ timestamp: -1 })
            .limit(12)
            .skip(skip)
            .lean()
            .exec(async function (err, items) {
                if (err) return res.status(500).send({ message: err.message });
                if (!items) return res.status(404).send({ message: "No items found" });

                let ret = [];

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    const itemEntity = await that.getItemDetail(item.tokenId,item.itemCollection)  
                    ret.push(itemEntity)                 
                }

                Item.countDocuments({ 'creator': req.query.address.toLowerCase() }, function (err2, count) {
                    if (err2) return res.status(500).send({ message: err2.message });
                    res.status(200).send({ items: ret, count: count });
                });
            });
        
    },

    getLiked: async function(req, res, next) {
        const that = this;
        const page = req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let skip = (page - 1) * 12;

        Item.find({ 'likes': req.query.address.toLowerCase() }, { __v: 0, _id: 0 })
            .sort({ timestamp: -1 })
            .limit(12)
            .skip(skip)
            .lean()
            .exec(async function (err, items) {
                if (err) return res.status(500).send({ message: err.message });
                if (!items) return res.status(404).send({ message: "No items found" });

                let ret = [];

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    const itemEntity = await that.getItemDetail(item.tokenId,item.itemCollection)  
                    ret.push(itemEntity)                 
                }

                Item.countDocuments({ 'likes': req.query.address.toLowerCase() }, function (err2, count) {
                    if (err2) return res.status(500).send({ message: err2.message });
                    res.status(200).send({ items: ret, count: count });
                });
            });
        
    },

    getActivities: async function(req, res, next) {
        const that = this;
        let data = this.handleEventGetRequest(req, 12);
        Event.find(data.query, { __v: 0, _id: 0 })
            .sort({ timestamp: -1 })
            .limit(12)
            .skip(data.skip)
            .lean()
            .exec(async function (err, events) {
                if (err) return res.status(500).send({ message: err.message });
                if (!events) return res.status(404).send({ message: "No events found" });
                let ret = [];

                for (let i = 0; i < events.length; i++) {
                    let event = events[i];
                    const eventEntity = await that.getEventDetail(event.id)  
                    ret.push(eventEntity)                 
                }

                Event.countDocuments(data.query, function (err2, count) {
                    if (err2) return res.status(500).send({ message: err2.message });
                    res.status(200).send({ events: ret, count: count });
                });
            });
        
    },

    getItemDetail: async function (tokenId, itemCollection) {
        // tokenId: Number, itemCollection: String
        const item = await Item.findOne({tokenId: tokenId, itemCollection: itemCollection}, {__v:0, _id:0}).lean();
        if (!item) return null
    
        // setup creator user
        var creator = await User.findOne({address: item.creator},{_id: 0, __v: 0}).lean();        
        if (!creator) {          
          const newUser = new User({
              address: item.creator.toLowerCase(),
              name: "NoName",
              profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
              isApproved: false,
              nonce: Math.floor(Math.random() * 1000000)
          })                 
            item.creatorUser = newUser;
        } else {
            item.creatorUser = creator;
        }   
        
        //set up collection
        var collection = await ItemCollection.findOne({address: itemCollection},{_id: 0, __v: 0}).lean();        
        item.collectionInfo = collection;
    
        //set up auction information
        var auction = await Auction.findOne({ tokenId: tokenId, itemCollection: itemCollection, active: true },{_id: 0, __v: 0}).lean();
        if (auction) {
          item.auctionInfo = auction
        }
    
        //set up pair information
        const pairQuery = [
          {'$match': { 'tokenId': tokenId,'itemCollection': itemCollection, 'bValid': true, 'balance': {$gt: 0} }}
          , {'$group': { '_id': {
                  "itemCollection": "$itemCollection",
                  "tokenId": "$tokenId"
                },
               'usdPrice': { $min: '$usdPrice' },
               'count': { $sum: 1 }, 
               'owner': { $first : '$owner' },
               'totalBalance': { $sum: '$balance' }           
              }}            
        ];
        const pairInfos = await Pair.aggregate(pairQuery);
        if (pairInfos && pairInfos?.length > 0) {
            item.pairInfo = pairInfos[0];
            let pairs = await Pair.find({itemCollection: itemCollection, tokenId: tokenId, bValid: true, balance: {$gt: 0}},{ __v: 0, _id: 0 }).sort({ usdPrice: 1 }).lean();    
            item.pairInfo.price = pairs[0].price;
            item.pairInfo.tokenSymbol = pairs[0].tokenSymbol;      
        }
    
        if (item.type == "single") {
          // set up owner address.
          var ownerAddress = ''
          if (auction) {
            ownerAddress = auction.owner
          } else if (pairInfos && pairInfos?.length > 0) {
            ownerAddress = item.pairInfo.owner;
          } else {
            ownerAddress = item.holders[0].address
          }
    
          // setup creator user
          var owner = await User.findOne({address: ownerAddress},{_id: 0, __v: 0}).lean();        
          if (!owner) {          
            const newUser = new User({
                address: ownerAddress,
                name: "NoName",
                profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                isApproved: false,
                nonce: Math.floor(Math.random() * 1000000)
            })                     
              item.ownerUser = newUser;
          } else {
              item.ownerUser = owner;
          }
        }
        return item
    },
    getEventDetail: async function (eventID) {
        // eventID: String
        const event = await Event.findOne({id: eventID}, {__v:0, _id:0}).lean();
        if (!event) return null;

        // get item information
        const item = await Item.findOne({tokenId: event.tokenId, itemCollection: event.itemCollection.toLowerCase()}, {__v:0, _id:0}).lean();
        if (item) {
            event.itemInfo = item;
        }
    
        // setup action user
        var actionUser = await User.findOne({address: event.actionAddress.toLowerCase()},{_id: 0, __v: 0}).lean();        
        if (!actionUser) {          
            const newUser = new User({
                address: event.actionAddress.toLowerCase(),
                name: "NoName",
                profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                isApproved: false,
                nonce: Math.floor(Math.random() * 1000000)
            })                   
            event.actionUser = newUser;
        } else {
            event.actionUser = actionUser;
        }   
        
        //setup params info
        let paramInfo = {};
        const paramArray = event.params.split("-"); 
        var price = '0';
        switch (event.action) {
            case "MultiTransfer":
                var userAddress = paramArray[0].toLowerCase();
                var amount = Number(paramArray[1]);
                
                var userInfo = await User.findOne({address: userAddress},{_id: 0, __v: 0}).lean();        
                if (!userInfo) {          
                    const newUser = new User({
                        address: userAddress,
                        name: "NoName",
                        profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                        isApproved: false,
                        nonce: Math.floor(Math.random() * 1000000)
                    })                            
                    paramInfo.userInfo = newUser;
                } else {
                    paramInfo.userInfo = userInfo;
                }

                paramInfo.amount = amount;
                
                break;
            case "MultiBurn":
                var amount = Number(paramArray[0]);
                paramInfo.amount = amount;
                
                break;
            case "SingleTransfer":
                var userAddress = paramArray[0].toLowerCase();
                var userInfo = await User.findOne({address: userAddress},{_id: 0, __v: 0}).lean();        
                if (!userInfo) {          
                    const newUser = new User({
                        address: userAddress,
                        name: "NoName",
                        profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                        isApproved: false,
                        nonce: Math.floor(Math.random() * 1000000)
                    })                          
                    paramInfo.userInfo = newUser;
                } else {
                    paramInfo.userInfo = userInfo;
                } 
                
                break;
            case "MultiItemCreated":
                var amount = Number(paramArray[0]);
                paramInfo.amount = amount;
                
                break;
            case "MultiItemListed":
                var amount = Number(paramArray[0]);
                var tokenAdr = paramArray[1].toLowerCase();
                price = paramArray[2];

                var token = await Token.findOne({address: tokenAdr});    
                if (token) {
                    paramInfo.tokenInfo = token;
                } 
                paramInfo.amount = amount;
                 
                break;
            case "SingleItemListed":
                var tokenAdr = paramArray[0].toLowerCase();
                price = paramArray[1];

                var token = await Token.findOne({address: tokenAdr});    
                if (token) {
                    paramInfo.tokenInfo = token;
                } 
                 
                break;
            case "MultiItemSwapped":
                var userAddress = paramArray[0].toLowerCase();
                var amount = Number(paramArray[1]);
                var tokenAdr = paramArray[2].toLowerCase();
                price = paramArray[3];

                var userInfo = await User.findOne({address: userAddress},{_id: 0, __v: 0}).lean();        
                if (!userInfo) {          
                    const newUser = new User({
                        address: userAddress,
                        name: "NoName",
                        profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                        isApproved: false,
                        nonce: Math.floor(Math.random() * 1000000)
                    })                          
                    paramInfo.userInfo = newUser;
                } else {
                    paramInfo.userInfo = userInfo;
                } 
                 
                var token = await Token.findOne({address: tokenAdr});    
                if (token) {
                    paramInfo.tokenInfo = token;
                } 
                paramInfo.amount = amount;
                 
                break;
            case "SingleSwapped":
                var userAddress = paramArray[0].toLowerCase();
                var tokenAdr = paramArray[1].toLowerCase();
                price = paramArray[2];

                var userInfo = await User.findOne({address: userAddress},{_id: 0, __v: 0}).lean();        
                if (!userInfo) {          
                    const newUser = new User({
                        address: userAddress,
                        name: "NoName",
                        profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                        isApproved: false,
                        nonce: Math.floor(Math.random() * 1000000)
                    })                         
                    paramInfo.userInfo = newUser;
                } else {
                    paramInfo.userInfo = userInfo;
                } 
                 
                var token = await Token.findOne({address: tokenAdr});    
                if (token) {
                    paramInfo.tokenInfo = token;
                } 
                 
                break;
            case "AuctionBidSuccess":
                var tokenAdr = paramArray[0].toLowerCase();
                price = paramArray[1];

                var token = await Token.findOne({address: tokenAdr});    
                if (token) {
                    paramInfo.tokenInfo = token;
                } 
                 
                break;
            case "AuctionCreated":
                var tokenAdr = paramArray[0].toLowerCase();
                price = paramArray[1];

                var token = await Token.findOne({address: tokenAdr});    
                if (token) {
                    paramInfo.tokenInfo = token;
                } 
                 
                break;
            case "AuctionFinalized":
                var userAddress = paramArray[0].toLowerCase();
                var tokenAdr = paramArray[1].toLowerCase();
                price = paramArray[2];

                var userInfo = await User.findOne({address: userAddress},{_id: 0, __v: 0}).lean();        
                if (!userInfo) {          
                    const newUser = new User({
                        address: userAddress,
                        name: "NoName",
                        profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                        isApproved: false,
                        nonce: Math.floor(Math.random() * 1000000)
                    })                           
                    paramInfo.userInfo = newUser;
                } else {
                    paramInfo.userInfo = userInfo;
                } 
                 
                var token = await Token.findOne({address: tokenAdr});    
                if (token) {
                    paramInfo.tokenInfo = token;
                } 
                 
                break;
            default:
                break;
        }
        if (paramArray?.length > 0) {
            if (price !== '0') {
                paramInfo.price = ethers.utils.formatUnits(price,paramInfo.tokenInfo.decimal);
            }
            event.paramInfo = paramInfo;
        } 
        event.actionMsg = this.getActionMsg(event.action)      
        
        return event;
    },

    handleEventGetRequest: function (req, limit) {        
        const page =
          req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let skip = (page - 1) * limit;   
        delete req.query.page;      
    
        var address = req.query.address;
        delete req.query.address;
        if (address) {
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            const addressRgx = rgx(address.toLowerCase());

            req.query['$or'] = [
                {actionAddress: address.toLowerCase()}, 
                {params: { $regex: addressRgx, $options: "i" }}
            ];
        }

        var itemCollection = req.query.itemCollection;
        delete req.query.itemCollection;
        if (itemCollection) {
            req.query.itemCollection = itemCollection.toLowerCase()
        }

        var filter = req.query.filter;
        delete req.query.filter;
        if (filter) {
            var filters = filter.split("_"); 
            req.query.action = { $in: filters};
        }                 
    
        return { query: req.query, skip: skip };
    },

    getActionMsg: function(actionStr) {
        switch (actionStr) {
          case 'MultiBurn':
            return 'burned by';        
          case 'MultiTransfer':
            return 'transferred from';        
          case 'MultiItemCreated':
            return 'minted by';        
          case 'MultiItemListed':
            return 'listed by';
          case 'MultiItemSwapped':
            return 'purchased by';
          case 'SingleTransfer':
            return 'transferred from';
          case 'SingleBurn':
            return 'burned by';
          case 'SingleItemCreated':
            return 'minted by';
          case 'SingleItemListed':
            return 'listed by';
          case 'SingleSwapped':
            return 'purchased by';
          case 'AuctionBidSuccess':
            return 'bidded by';
          case 'AuctionCreated':
            return 'listed by';
          case 'AuctionCanceled':
            return 'removed from sale by';
          case 'AuctionFinalized':
            return 'purchased by';
    
            default:
            break;
        }
    },

    sortByTimeStamp: function(nodes) {
        return (nodes || []).sort((a, b) => b.timestamp - a.timestamp);
    },

});
