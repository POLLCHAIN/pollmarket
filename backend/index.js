const express = require('express');
const router = express.Router();
const path = require("path");

const user_controller = require('./controllers/UserController');
const explore_controller = require('./controllers/ExploreController');
const item_controller = require('./controllers/ItemController');
const collection_controller = require('./controllers/CollectionController');
const bug_controller = require('./controllers/BugController');
const sync_controller = require('./controllers/SyncController');

const multer = require('multer')

const storage = multer.memoryStorage({
    destination: function (req, file, callback){
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')


/**
 *  User Management
 */
router.post('/api/login', (req, res, next) => {
    user_controller.login(req, res, next);
});
router.get('/api/user/check', (req, res, next) => {
    user_controller.check(req, res, next);
});
router.get("/api/user_info/:address", (req, res, next) => {
    user_controller.get(req, res, next);
});
router.post("/api/user/update", [upload, user_controller.authenticateToken], (req, res, next) => {
    user_controller.update(req, res, next)
})
router.post("/api/user/follow", [upload, user_controller.authenticateToken], (req, res, next) => {
  user_controller.follow(req, res, next)
})

router.get("/api/user/following", (req, res, next) => {
  user_controller.getFollowing(req, res, next)
})

router.get("/api/user/followers", (req, res, next) => {
  user_controller.getFollowers(req, res, next)
})


router.get('/api/user/sale', (req, res, next) => {
  user_controller.getOnSale(req, res, next);
});
router.get('/api/user/owned', (req, res, next) => {
  user_controller.getOwned(req, res, next);
});
router.get('/api/user/created', (req, res, next) => {
  user_controller.getCreated(req, res, next);
});
router.get('/api/user/liked', (req, res, next) => {
  user_controller.getLiked(req, res, next);
});
router.get('/api/user/activities', (req, res, next) => {
  user_controller.getActivities(req, res, next);
});



/**
 *  Explore Management
 */
router.get("/api/hots", (req, res, next) => {
  explore_controller.getHotItems(req, res, next);
});

router.get("/api/hot_collections", (req, res, next) => {
  explore_controller.getHotCollections(req, res, next);
});
router.get("/api/top_sellers", (req, res, next) => {
  explore_controller.getTopSellers(req, res, next);
});
router.get("/api/auctions", (req, res, next) => {
  explore_controller.getLiveAuctions(req, res, next);
});
router.get("/api/explore", (req, res, next) => {
  explore_controller.getExploreItems(req, res, next);
});


/**
 *  Search Management
 */

router.get("/api/search_collections", (req, res, next) => {
  explore_controller.searchCollections(req, res, next);
});
router.get("/api/search_items", (req, res, next) => {
  explore_controller.searchItems(req, res, next);
});
router.get("/api/search_users", (req, res, next) => {
  explore_controller.searchUsers(req, res, next);
});



/**
 *  Item Management
 */

router.get("/api/item_detail/:collection/:tokenId", async (req, res, next) => {
  item_controller.detail(req, res, next)
})

router.post("/api/item/like", [user_controller.authenticateToken], async (req, res, next) => {
  item_controller.like(req, res, next)
})
router.get("/api/tokens", async (req, res, next) => {
  item_controller.getTokens(req, res, next)
});
router.get("/api/categories", async (req, res, next) => {
  item_controller.categories(req, res, next)
})


/**
 *  Collection Management
 */


router.get("/api/collection", async (req, res, next) => {
    collection_controller.get(req, res, next)
});

router.get("/api/collection/exist", async (req, res, next) => {
    collection_controller.isExist(req, res, next)
});

router.get("/api/collection/detail", async (req, res, next) => {
    collection_controller.detail(req, res, next)
});

/**
 *  Bug Management
 */


router.post("/api/bug", async (req, res, next) => {
  bug_controller.post(req, res, next)
})


/**
 *  Sync  Management
 */

 router.get("/api/sync_block", async (req, res, next) => {
    sync_controller.sync_block(req, res, next)
  })




router.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});





module.exports = router;
