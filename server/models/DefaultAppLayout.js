const mongoose = require('mongoose');
const appConstant = require("../constant");
const constant=appConstant.constant;
const Schema = mongoose.Schema;
const DefaultAppLayoutModel = new Schema({
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});
const DefaultAppLayout = mongoose.model('DefaultAppLayout', DefaultAppLayoutModel);
module.exports = DefaultAppLayout;
