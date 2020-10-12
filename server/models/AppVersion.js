const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var AppVersionModelSchema = new Schema({
  latestIOSVersion: { type: Number },
  latestAndroidVersion: { type: Number },
  criticalAndroidVersion: { type: Number },
  criticalIOSVersion: { type: Number },
  latestWebID: { type: Number },
  criticalWebID: { type: Number },
  timeStamp: { type: Date, default: Date.now },
  updateMessageAtPopup: { type: String, required: true },
  updateTitleAtPopup: { type: String, required: true },  
  contactUs:{ type: String},
  termsAndConditions:{ type: String},
  privacyPolicy:{ type: String}
}, { timestamps: true })

module.exports = mongoose.model('AppVersion',AppVersionModelSchema);