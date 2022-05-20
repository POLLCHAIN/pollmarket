const BaseController = require('./BaseController');

module.exports = BaseController.extend({
    name: 'SyncController',

    sync_block: async function (req, res, next) {
        try {
            console.log("---- SYNC DATA FOM API ----");              
            return res.status(200).send({ status: 'success' });
        }
        catch (ex) {
            console.log(ex);
            return res.status(500).send({ status: 'failed', exception: ex });
        }
    },

    sortByTimeStamp: function(nodes) {
        return (nodes || []).sort((a, b) => a.timestamp - b.timestamp);
    }
});
