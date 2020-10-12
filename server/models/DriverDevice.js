const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const appConstant = require("../constant");
const constant = appConstant.constant;
const DriverDeviceModel = new Schema({
    driverId: {
        type: Schema.Types.ObjectId,
        ref: 'Driver'
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
const DriverDevice = mongoose.model('DriverDevice', DriverDeviceModel);
module.exports = DriverDevice;
