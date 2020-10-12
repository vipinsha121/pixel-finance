const mongoose = require('mongoose');
const appConstant = require("../constant");
const constant=appConstant.constant;
const Schema = mongoose.Schema;
const AppLayoutModel = new Schema({
    adminId:{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    isActive: {
        type: Boolean,
        default: false
    },
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
const AppLayout = mongoose.model('AppLayout', AppLayoutModel);
module.exports = AppLayout;
