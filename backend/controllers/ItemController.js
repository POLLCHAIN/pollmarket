const BaseController = require("./BaseController");
const User = require("../models/user.model");
const Item = require("../models/item.model");
const Pair = require("../models/pair.model");
const Token = require('../models/token.model');
const Category = require("../models/category.model");
const ItemCollection = require("../models/collection.model");
const Auction = require("../models/auction.model");
const Bid = require('../models/bid.model');
const config = require("../config");

const swapContractAddress = config.igarataArtNFTSwap;

module.exports = BaseController.extend({
  name: "ItemController",

  detail: async function (req, res) {
    let tokenId = Number(req.params.tokenId);
    let itemCollection = req.params.collection.toLowerCase()
    Item.findOne(
      { tokenId: tokenId, itemCollection: itemCollection },
      { __v: 0, _id: 0 }
    )
      .lean()
      .exec(async function (err, item) {
        if (err) return res.status(500).send({ message: err.message });
        if (!item) return res.status(404).send({ message: "No item found" });

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
          let bids = await Bid.find({ auctionId: auction.auctionId },{_id: 0, __v: 0}).sort({ bidPrice: -1 }).lean();
          for (let index = 0; index < bids.length; index++) {
            const bid = bids[index];
            var fromUser = await User.findOne({address: bid.from},{_id: 0, __v: 0}).lean();        
            if (!fromUser) {          
              const newUser = new User({
                address: bid.from.toLowerCase(),
                name: "NoName",
                profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                isApproved: false,
                nonce: Math.floor(Math.random() * 1000000)
              })                 
              bid.fromUser = newUser;
            } else {
              bid.fromUser = fromUser;
            }
          }          
          auction.bids = bids          

          let user = await User.findOne({address: auction.owner},{_id: 0, __v: 0}).lean();
          if (!user) {
            const newUser = new User({
              address: auction.owner.toLowerCase(),
              name: "NoName",
              profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
              isApproved: false,
              nonce: Math.floor(Math.random() * 1000000)
            })            
            auction.user = newUser; //if not user --> store contract is holder                
          } else {
            auction.user = user; //if not user --> store contract is holder                
          }        
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
               'totalBalance': { $sum: '$balance' }           
              }}            
        ];
        const pairInfos = await Pair.aggregate(pairQuery);
        if (pairInfos && pairInfos?.length > 0) {
          item.pairInfo = pairInfos[0]      
        }    

        //set pairs array        
        
        let pairs = await Pair.find({itemCollection: itemCollection, tokenId: tokenId, bValid: true, balance: {$gt: 0}},{ __v: 0, _id: 0 }).sort({ usdPrice: 1 }).lean();
        if (pairs && pairs?.length > 0) {
          item.pairInfo.price = pairs[0].price;
          item.pairInfo.tokenSymbol = pairs[0].tokenSymbol;
        }
        let ret = [];
        for (let i = 0; i < pairs.length; i++) {
          let pair = pairs[i];  
          if (pair.owner.toLowerCase() != swapContractAddress?.toLowerCase())
          {
            let user = await User.findOne({address: pair.owner},{_id: 0, __v: 0}).lean();
            if (!user) {
              const newUser = new User({
                address: pair.owner.toLowerCase(),
                name: "NoName",
                profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                isApproved: false,
                nonce: Math.floor(Math.random() * 1000000)
              })             
              pair.user = newUser; //if not user --> store contract is holder                
            } else {
              pair.user = user; //if not user --> store contract is holder                
            }          
            ret.push(pair);
          }          
        }
        if (pairs) {
          item.pairs = ret;
        }
        
        // setup holders
        let ret_holders = [];
        const blackList = [ config.SingleFixed, config.SingleAuction, config.MultipleFixed ];                
        for (let i = 0; i < item.holders.length; i++) {
          if (!blackList.includes(item.holders[i].address)) {
            let user = await User.findOne({address: item.holders[i].address},{_id: 0, __v: 0}).lean();
            if (!user) {
              const newUser = new User({
                address: item.holders[i].address.toLowerCase(),
                name: "NoName",
                profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
                isApproved: false,
                nonce: Math.floor(Math.random() * 1000000)
              })              
              item.holders[i].user = newUser; //if not user --> store contract is holder                
            } else {
              item.holders[i].user = user; //if not user --> store contract is holder                
            }
            ret_holders.push(item.holders[i]);    
          }          
        }
        item.holders = ret_holders
        res.status(200).send({ item: item });
      });
  },

  like: async function (req, res, next) {
    if (!req.body.address || !req.body.tokenId || !req.body.itemCollection)
      return res.status(400).send("missing params");

    Item.findOne(
      { tokenId: req.body.tokenId, itemCollection: req.body.itemCollection.toLowerCase() },
      async (err, item) => {
        if (err) return res.status(500).send({ message: err.message });
        if (!item) return res.status(404).send({ message: "No item found" });

        if (item.likes.includes(req.body.address.toLowerCase())) {
          item.likes.splice(
            item.likes.indexOf(req.body.address.toLowerCase()),
            1
          );
        } else {
          item.likes.push(req.body.address);
        }

        await item.save();

        res.status(200).send({ item: item });
      }
    );
  },

  getTokens: async function(req, res, next) {
    Token.find({}, async (err, tokens) => {
        if (err) return res.status(500).send({message: err.message});
        if (!tokens) return res.status(404).send({message: "No rate data found"})        
        
        res.status(200).send({tokens: tokens})
    })
  },
  categories: async function(req, res, next) {
    Category.find({}, {_id: 0, __v: 0}, async (err, items) => {
      if (err) return res.status(500).send({message: err.message});
      if (!items) return res.status(404).send({message: "No item found"})

      res.status(200).send({categories: items})
    })
  },
});

