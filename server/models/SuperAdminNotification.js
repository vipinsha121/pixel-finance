const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SuperAdminNotificationModel = new Schema({
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'SuperAdmin'
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    message: { type: String },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});
const SuperAdminNotification = mongoose.model('SuperAdminNotification', SuperAdminNotificationModel);
module.exports = SuperAdminNotification;
