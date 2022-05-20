const mongoose = require("mongoose");
const BaseController = require("./BaseController");
const User = require("../models/user.model");
const ItemCollection = require("../models/collection.model");
const Item = require("../models/item.model");
const Pair = require("../models/pair.model");
const Sold = require("../models/sold.model");
const Auction = require("../models/auction.model");
const Event = require("../models/event.model");
const config = require("../config");

const SingleFixed = config.SingleFixed;
const SingleAuction = config.SingleAuction;
const MultipleFixed = config.MultipleFixed;

module.exports = BaseController.extend({
  name: "ExploreController",

  getExploreItems: async function (req, res, next) {      
    const that = this;    
    let data = this.handleItemGetRequest(req, 12);
    Item.find(data.query, { __v: 0, _id: 0 })
      .sort(data.sort)
      .limit(12)
      .skip(data.skip)
      .lean()
      .exec(async function (err, items) {
        if (err) return res.status(500).send({ message: err.message });
        if (!items) return res.status(404).send({ message: "No Items found" });

        let ret = [];

        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          const itemEntity = await that.getItemDetail(item.tokenId,item.itemCollection)  
          ret.push(itemEntity) 
        }

        Item.countDocuments(data.query, function (err2, count) {
          if (err2) return res.status(500).send({ message: err2.message });
          res.status(200).send({ items: ret, count: count });
        });
      });
  },
  getHotItems: async function (req, res, next) {      
    const that = this;    
    let ret = [];

    // const hotIds = [
    //   {
    //     itemCollection: '0xe64b3966dc99a02d7ce7b6996c84201fb83e5f8e',
    //     tokenId: 1,        
    //   },
    //   {
    //     itemCollection: '0xe64b3966dc99a02d7ce7b6996c84201fb83e5f8e',
    //     tokenId: 2,        
    //   },
    //   {
    //     itemCollection: '0xe64b3966dc99a02d7ce7b6996c84201fb83e5f8e',
    //     tokenId: 3,        
    //   },
    //   {
    //     itemCollection: '0xe64b3966dc99a02d7ce7b6996c84201fb83e5f8e',
    //     tokenId: 4,        
    //   },
    //   {
    //     itemCollection: '0xe64b3966dc99a02d7ce7b6996c84201fb83e5f8e',
    //     tokenId: 5,        
    //   },
    //   {
    //     itemCollection: '0xe64b3966dc99a02d7ce7b6996c84201fb83e5f8e',
    //     tokenId: 6,        
    //   },
    //   {
    //     itemCollection: '0xe64b3966dc99a02d7ce7b6996c84201fb83e5f8e',
    //     tokenId: 7,        
    //   }
    // ]
    // for (let index = 0; index < hotIds.length; index++) {
    //   var hotId = hotIds[index];
    //   var tokenId = hotId.tokenId
    //   var itemCollection = hotId.itemCollection
    //   const itemEntity = await that.getItemDetail(tokenId,itemCollection)  
    //   ret.push(itemEntity)         
    // }
    
    const eventQuery = [
      {'$group': { '_id': {
                      'itemCollection': '$itemCollection',
                      'tokenId': '$tokenId'
                  },
           'totalActions': { $sum: 1 }}}
      , {'$sort': { 'totalActions': -1 }}
      , { '$limit': 7 }      
    ];

    const idList = await Event.aggregate(eventQuery);

    if (idList && idList?.length > 0) {
      for (let index = 0; index < idList.length; index++) {
        var ItemId = idList[index];
        var tokenId = ItemId._id.tokenId
        var itemCollection = ItemId._id.itemCollection
        const itemEntity = await that.getItemDetail(tokenId,itemCollection)  
        ret.push(itemEntity)         
      }
    }
    
    if (ret && ret?.length > 0) {
      res.status(200).send({ items: ret, count: ret?.length });
    } else {
      return res.status(404).send({ message: "No Hot items found" });
    } 
  },

  getHotCollections: async function (req, res, next) {
    let ret = []    
    const itemQuery = [
      {'$group': { '_id': '$itemCollection',
           'totalItems': { $sum: 1 }}}
      , {'$sort': { 'totalItems': -1 }}
      , { '$limit': 12 }      
    ];
    const collectionIds = await Item.aggregate(itemQuery);
    if (collectionIds && collectionIds?.length > 0) {
      for (let index = 0; index < collectionIds.length; index++) {
        const collectionAddress = collectionIds[index]._id
        let collection = await ItemCollection.findOne({ address: collectionAddress },{_id: 0, __v: 0}).lean(); 
        var owner = await User.findOne({address: collection.ownerAddress},{_id: 0, __v: 0}).lean();        
        if (!owner) {          
          const newUser = new User({
            address: collection.ownerAddress.toLowerCase(),
            name: "NoName",
            profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
            isApproved: false,
            nonce: Math.floor(Math.random() * 1000000)
          })                
          collection.owner = newUser;
        } else {
          collection.owner = owner;
        }
        ret.push(collection)          
      }
      
    }
    if (ret && ret?.length > 0) {
      res.status(200).send({ collections: ret, count: ret?.length });
    } else {
      return res.status(404).send({ message: "No Hot Collections found" });
    }  
  },

  getTopSellers: async function (req, res, next) {
    let ret = []    
    const soldQuery = [
      {'$group': { '_id': '$seller',
           'totalSold': { $sum: '$usdAmount' }}}
      , {'$sort': { 'totalSold': -1 }}
      , { '$limit': 12 }      
    ];
    const topUsers = await Sold.aggregate(soldQuery);
    if (topUsers && topUsers?.length > 0) {
      for (let index = 0; index < topUsers.length; index++) {
        let topUserData = topUsers[index];

        var user = await User.findOne({address: topUserData._id},{_id: 0, __v: 0}).lean();        
        if (!user) {          
          const newUser = new User({
            address: topUserData._id,
            name: "NoName",
            profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
            isApproved: false,
            nonce: Math.floor(Math.random() * 1000000)
          })          
          topUserData.userInfo = newUser;
        } else {
          topUserData.userInfo = user;
        }
        ret.push(topUserData)  
      }
    }

    if (ret && ret?.length > 0) {
      res.status(200).send({ users: ret, count: ret?.length });
    } else {
      return res.status(404).send({ message: "No Top Users found" });
    }
  },

  getLiveAuctions: async function (req, res, next) {
    const that = this;
    let ret = [];
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    let auctions = await Auction.find({ 
      endTime: { $gt: currentTimeStamp }, 
      startTime: { $lt: currentTimeStamp }, 
      bidded: true, 
      active: true
    },{ __v: 0, _id: 0 }).sort({ endTime: 1 }).limit(12).lean();
    if (auctions && auctions?.length > 0) {
      for (let index = 0; index < auctions.length; index++) {
        let auction = auctions[index];
        const item = await that.getItemDetail(auction.tokenId, auction.itemCollection)
        ret.push(item)
      }
    }
    if (ret && ret?.length > 0) {
      res.status(200).send({ items: ret, count: ret?.length });
    } else {
      return res.status(404).send({ message: "No Live Auction found" });
    }

  },


  searchCollections: async function (req, res, next) {
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * 12;

    const search = req.query.search;  

    let dataQuery = {};
    if(search) {
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(search);
      const searchQuery = [
        { name: { $regex: searchRgx, $options: "i" } }
      ]
      dataQuery = { $or: searchQuery}
    }

    ItemCollection.find(dataQuery, { __v: 0, _id: 0 })
      .sort({ timestamp: -1 })
      .limit(12)
      .skip(skip)
      .lean()
      .exec(async function (err, collections) {
        if (err) return res.status(500).send({ message: err.message });
        if (!collections) return res.status(404).send({ message: "No Collections found" });

        let ret = [];

        for (let i = 0; i < collections.length; i++) {
          let collection = collections[i];
          var owner = await User.findOne({address: collection.ownerAddress},{_id: 0, __v: 0}).lean();        
          if (!owner) {          
            const newUser = new User({
              address: collection.ownerAddress.toLowerCase(),
              name: "NoName",
              profilePic: "https://pollchain.mypinata.cloud/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67",
              isApproved: false,
              nonce: Math.floor(Math.random() * 1000000)
            })            
            collection.owner = newUser;
          } else {
            collection.owner = owner;
          }  
          ret.push(collection) 
        }

        ItemCollection.countDocuments(dataQuery, function (err2, count) {
          if (err2) return res.status(500).send({ message: err2.message });
          res.status(200).send({ collections: ret, count: count });
        });
      });
  },

  searchItems: async function (req, res, next) {
    const that = this;
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * 12;

    const search = req.query.search;  

    let dataQuery = {};
    if(search) {
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(search);
      const searchQuery = [
        { name: { $regex: searchRgx, $options: "i" } }
      ]
      dataQuery = { $or: searchQuery}
    }

    Item.find(dataQuery, { __v: 0, _id: 0 })
      .sort({ timestamp: -1 })
      .limit(12)
      .skip(skip)
      .lean()
      .exec(async function (err, items) {
        if (err) return res.status(500).send({ message: err.message });
        if (!items) return res.status(404).send({ message: "No Items found" });

        let ret = [];

        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          const itemEntity = await that.getItemDetail(item.tokenId,item.itemCollection)  
          ret.push(itemEntity)
        }
        Item.countDocuments(dataQuery, function (err2, count) {
          if (err2) return res.status(500).send({ message: err2.message });
          res.status(200).send({ items: ret, count: count });
        });
      });
  },

  searchUsers: async function (req, res, next) {
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * 12;

    const search = req.query.search;  

    let dataQuery = {};
    if(search) {
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(search);
      const searchQuery = [
        { name: { $regex: searchRgx, $options: "i" } }
      ]
      dataQuery = { $or: searchQuery}
    }

    User.find(dataQuery, { __v: 0, _id: 0 })
      .sort({ timestamp: -1 })
      .limit(12)
      .skip(skip)
      .lean()
      .exec(async function (err, users) {
        if (err) return res.status(500).send({ message: err.message });
        if (!users) return res.status(404).send({ message: "No Users found" });

        User.countDocuments(dataQuery, function (err2, count) {
          if (err2) return res.status(500).send({ message: err2.message });
          res.status(200).send({ users: users, count: count });
        });
      });
  },
  
  handleItemGetRequest: function (req, limit) {
    delete req.query.ownerAddress;
    const page =
      req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limit;

    let sortDir =
      req.query.sortDir === "asc" || req.query.sortDir === "desc"
        ? req.query.sortDir
        : "desc";

    const sortBy =
      req.query.sortBy === "timestamp" ||
      req.query.sortBy === "usdPrice" ||
      req.query.sortBy === "auctionEndTimestamp"
        ? req.query.sortBy
        : "timestamp";
    
    delete req.query.page;
    delete req.query.sortBy;
    delete req.query.sortDir;

    if (sortDir === "asc") sortDir = 1;
    else if (sortDir === "desc") sortDir = -1;

    let sort;
    if (sortBy === "usdPrice") {
      sort = { usdPrice: sortDir };
    } else if (sortBy === "auctionEndTimestamp") {
      sort = { auctionEndTimestamp: sortDir };
    } else {
      sort = { timestamp: sortDir };
    }

    var saleType = req.query.saleType;
    delete req.query.saleType;

    var priceFrom = req.query.priceFrom;
    var priceTo = req.query.priceTo;
    delete req.query.priceFrom;
    delete req.query.priceTo;

    if (sortBy === "usdPrice") {
      req.query.usdPrice = { $gt: 0 };
    }

    if (priceFrom || priceTo) {
      saleType = "market"
      req.query.usdPrice = { $gt: priceFrom , $$lt: priceTo};
    }

    if (sortBy === "auctionEndTimestamp") {
      saleType = "auction"
    }

    if (saleType == "auction") { 

      req.query["holders.address"] = SingleAuction;
      req.query["holders.balance"] = { $gt: 0 };

    } else if (saleType == "fixed") {

      req.query["holders.address"] = { $in: [SingleFixed.toLowerCase(),
        MultipleFixed.toLowerCase()
      ]};
      req.query["holders.balance"] = { $gt: 0 };
       
    } else if (saleType == "not_sale") {  
      
      req.query.holders = { 
        $elemMatch: { 
          "address" : { 
            $nin: [SingleAuction.toLowerCase(),
              SingleFixed.toLowerCase(),
              MultipleFixed.toLowerCase()] 
          },
          "balance" : { $gt: 0 }   
        } 
      }

    } else {
      // get all listed items
      req.query["holders.address"] = { $in: [SingleAuction.toLowerCase(),
        SingleFixed.toLowerCase(),
        MultipleFixed.toLowerCase()
      ]};
      req.query["holders.balance"] = { $gt: 0 };

    }

    if (req.query.category) {
      req.query.category = req.query.category;
    }

    if (req.query.itemCollection) {
      req.query.itemCollection = req.query.itemCollection.toLowerCase();
    }

    const searchTxt = req.query.searchTxt;      
    delete req.query.searchTxt;
    if (searchTxt) {
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(searchTxt);
      req.query.name = { $regex: searchRgx, $options: "i" };
    }

    return { query: req.query, sort: sort, skip: skip };
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

});

