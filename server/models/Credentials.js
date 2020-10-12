const mongoose = require('mongoose');
const appConstant = require("../constant");
const constant=appConstant.constant;
const Schema = mongoose.Schema;
const CredentialsModel = new Schema({
    superAdminId:{
        type: Schema.Types.ObjectId,
        ref: 'SuperAdmin'
    },
    adminId:{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    serviceType:  {
        type: Number,
        enum: [constant.THIRD_PARTY_SERVICE_TYPE.EMAIL,
            constant.THIRD_PARTY_SERVICE_TYPE.SMS,
            constant.THIRD_PARTY_SERVICE_TYPE.PUSH],
        default: constant.THIRD_PARTY_SERVICE_TYPE.DEFAULT
    },
    serviceCode:  {
        type: Number,
        enum: [constant.THIRD_PARTY_SERVICE_CODE.TWILLO,
            constant.THIRD_PARTY_SERVICE_CODE.MANDRILL,
            constant.THIRD_PARTY_SERVICE_CODE.SEND_GRID,
            constant.THIRD_PARTY_SERVICE_CODE.FCM],
        default: constant.THIRD_PARTY_SERVICE_CODE.DEFAULT
    },
    credentials:{type:Object,default:null},
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
const Credentials = mongoose.model('Credentials', CredentialsModel);
module.exports = Credentials;
