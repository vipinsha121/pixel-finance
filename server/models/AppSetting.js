const mongoose = require('mongoose');
const appConstant = require("../constant");
const constant=appConstant.constant;
const Schema = mongoose.Schema;
const AppSettingModel = new Schema({
    superAdminId:{
        type: Schema.Types.ObjectId,
        ref: 'SuperAdmin'
    },
    adminId:{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    isSmsEnabled:{type:Boolean,default:false},
    isEmailEnabled:{type:Boolean,default:false},
    isDriverPushEnabled:{type:Boolean,default:false},
    isUserPushEnabled:{type:Boolean,default:false},
    isSuperForgotPasswordEnabled:{type:Boolean,default:false},
    isAdminForgotPasswordEnabled:{type:Boolean,default:false},
    isUserForgotPasswordEnabled:{type:Boolean,default:false},
    isDriverForgotPasswordEnabled:{type:Boolean,default:false},
    superAdminForGotPasswordUrl:{type:String,default:null},
    adminForGotPasswordUrl:{type:String,default:null},
    userForGotPasswordUrl:{type:String,default:null},
    driverForGotPasswordUrl:{type:String,default:null},
    isUserAutoVerifyEnabled:{type:Boolean,default:false},
    isDriverAutoVerifyEnabled:{type:Boolean,default:false},
    smsServiceCode:{type:Number,default:0},
    emailSerivceCode:{type:Number,default:0},
    driverPushSerivceCode:{type:Number,default:0},
    userPushSerivceCode:{type:Number,default:0},
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
const AppSetting = mongoose.model('AppSetting', AppSettingModel);
module.exports = AppSetting;
