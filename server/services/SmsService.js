var Model = require('../models/index');
const twilio = require('twilio');
const config = require('../config/config');
const appConstant = require("../constant");
const mongoose = require('mongoose');
const universalFunction = require('../lib/universal-function');

const constant = appConstant.constant;

const getAppSetting=async (superAdminId)=>{
    try {
    let appSettingData=await Model.AppSetting.findOne({
        superAdminId:superAdminId,
        isDeleted:false
    })
    return appSettingData;   
    } catch (error) {
        
    }
}
const getCredential=async (superAdminId,appSettingData)=>{
    try {
        let credentialData=await Model.Credentials.findOne({
            superAdminId:superAdminId,
            serviceType:constant.THIRD_PARTY_SERVICE_TYPE.SMS,
            serviceCode:appSettingData?appSettingData.smsServiceCode:0,
            isActive:true,
            isDeleted:false,
            isBlocked:false},{credentials:1});
        return credentialData;   
    } catch (error) {
        
    }
}
const getSmsMessage=async (superAdminId,messageType,lang)=>{
    try {
        let messageData=await Model.SmsMessages.findOne({
            superAdminId:superAdminId,
            messageType:messageType,
            lang:lang || 0,
            isDeleted:false,
            isBlocked:false},{message:1});
        return messageData;   
    } catch (error) {
        console.log(error)
    }
}
const sendTwilloSMS=async (payload,credentialData)=>{
    return new Promise(async (resolve, reject) => {
        const client = twilio(credentialData.accountSid, credentialData.authToken);
        const smsOptions = {
            from: credentialData.senderNumber,
            to: payload.countryCode + (payload.phoneNo).toString(),
            body: null,
          };
          smsOptions.body = payload.message;
        client.messages.create(smsOptions);
        return resolve(message);
    });
};


const sendSMS=async (payload)=>{
    try {
        let appSettingData=await getAppSetting(payload.superAdminId);
        if(appSettingData && !appSettingData.isSmsEnabled)
        return payload;
        
        let serviceCredentialData=await getCredential(payload.superAdminId,appSettingData);
        let messageData=await getSmsMessage(payload.superAdminId,payload.messageType,payload.lang);
        if(messageData){
            payload.message=messageData.message || '';
            if(payload && payload.variableData)
            payload.message=await universalFunction.renderMessage(payload.message,payload.variableData)
        }
        let serviceCode= serviceCredentialData?serviceCredentialData.serviceCode: 0
        switch(serviceCode){
            case constant.THIRD_PARTY_SERVICE_CODE.TWILLO:
            await sendTwilloSMS(payload,credentialData);
            break;
            default:
            break;
        }
        return payload;  
    } catch (error) {
        
    }
}

module.exports = {
    sendSMS:sendSMS
}