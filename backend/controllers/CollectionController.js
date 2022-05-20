
const BaseController = require('./BaseController');
const ItemCollection = require("../models/collection.model");

module.exports = BaseController.extend({
    name: 'CollectionController',

    get: async function(req, res, next) {
        const isVerified = req.query.isVerified
        const ownerAddress = req.query.ownerAddress
        delete req.query.ownerAddress
        delete req.query.isVerified
        if (isVerified) {
            req.query.isVerified = true
        } else {
            req.query['$or'] = [{ownerAddress: ownerAddress?.toLowerCase()}, {isPublic: true}];
        }
        ItemCollection.find(req.query, async (err, collections) => {
            if (err) return res.status(500).send({message: err.message});
            if (!collections) return res.status(404).send({message: "No collections found"})

            res.status(200).send({collections: collections})
        })
    },

    isExist: async function(req, res, next) {
        ItemCollection.find({name: req.query.name}, async (err, collections) => {
            if (err) return res.status(500).send({message: err.message});
            if (!collections || collections.length == 0) return res.status(404).send({message: "No collections found"})

            res.status(200).send({collections: collections})
        })
    },

    detail: async function(req, res, next) {
      ItemCollection.findOne(req.query, async (err, collection) => {
          if (err) return res.status(500).send({message: err.message});
          if (!collection) return res.status(404).send({message: "No collections found"})

          res.status(200).send({collection: collection})
      })
    },
});
