const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const appConstant = require("../constant");
const constant = appConstant.constant;
const UserDeviceModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    adminId:{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    deviceType: {
        type: Number,
        enum: [constant.DEVICE_TYPE.ANDROID,constant.DEVICE_TYPE.IOS],
        default: 0
    },
    deviceToken: {
        type: String
    }
}, {
    timestamps: true
});
const UserDevice = mongoose.model('UserDevice', UserDeviceModel);
module.exports = UserDevice;
