const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingSchema = new Schema({
    id: {type: Number, index: true},
    timestamp: { type: Number, required: true, default: 1 },
    updated_at: { type: Date, default: new Date() },
});

SettingSchema.pre("update", function(next) {
    this.getUpdate().$set.updated_at = new Date();
    next();
});

module.exports = mongoose.model('setting', SettingSchema);
