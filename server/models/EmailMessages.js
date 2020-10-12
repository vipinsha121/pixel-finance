const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EmailMessagesModel = new Schema({
    superAdminId:{
        type: Schema.Types.ObjectId,
        ref: 'SuperAdmin'
    },
    adminId:{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    message:{type:String,default:null},
    messageType:{type:Number,default:0},
    lang: { type: String, default: 'en' },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});
const EmailMessages = mongoose.model('EmailMessages',EmailMessagesModel);
module.exports = EmailMessages;
