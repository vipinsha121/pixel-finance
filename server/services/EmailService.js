const nodeMailer = require('nodemailer');
const sendGrid = require('@sendgrid/mail');
const Model = require('../models/index');
const universalFunction = require('../lib/universal-function');
const appConstant = require("../constant");
const constant = appConstant.constant;

const getAppSetting=async (superAdminId)=>{
    try {
    let appSettingData=await Model.AppSetting.findOne({
        superAdminId:superAdminId,
        isDeleted:false
    })
    return appSettingData;   
    } catch (error) {
        console.log(error)   
    }
}
const getCredential=async (superAdminId,appSettingData)=>{
    try {
        let credentialData=await Model.Credentials.findOne({
            superAdminId:superAdminId,
            serviceType:constant.THIRD_PARTY_SERVICE_TYPE.EMAIL,
            serviceCode:appSettingData?appSettingData.emailSerivceCode:0,
            isActive:true,
            isDeleted:false,
            isBlocked:false},{credentials:1,serviceCode:1});
        return credentialData;   
    } catch (error) {
        console.log(error)
    }
}
const getEmailMessage=async (superAdminId,messageType,lang)=>{
    try {
        let messageData=await Model.EmailMessages.findOne({
            superAdminId:superAdminId,
            messageType:messageType,
            lang:lang || 'en',
            isDeleted:false,
            isBlocked:false},{message:1});
        return messageData;   
    } catch (error) {
        console.log(error)
    }
}
const sendEmailFromSendGrid=async(payload,credentialData)=>{
    let apiKey=null;
    let html ='';
    if(credentialData && credentialData.apiKey)
    apiKey=credentialData.apiKey;

    sendGrid.setApiKey(apiKey);
    const message = {
        from: credentialData?credentialData.fromMail:null,
        to: payload?payload.email: null,
        subject: payload?payload.subject:null ,
        html: ''
    };
    if(payload && payload.message){
        html = payload.message;
    }
    
    message.html = html;
    sendGrid.send(message).then(info => {
        console.log('Email Sent successfully!');
    }).catch(error => {
        console.log('Email not sent.', error);
    });
}

const sendEmail=async(payload)=>{
    try {
    let appSettingData=await getAppSetting(payload.superAdminId);
    if(appSettingData && !appSettingData.isEmailEnabled)
        return payload;
    let serviceCredentialData=await getCredential(payload.superAdminId,appSettingData);
    let messageData=await getEmailMessage(payload.superAdminId,payload.messageType,payload.lang);
    if(messageData){
        payload.message=messageData.message || '';
        if(payload && payload.variableData)
        payload.message=await universalFunction.renderMessage(payload.message,payload.variableData);
        console.log(payload.message)
    }

    let serviceCode= serviceCredentialData?serviceCredentialData.serviceCode: 0;
    switch(serviceCode){
        case constant.THIRD_PARTY_SERVICE_CODE.SEND_GRID:
        await sendEmailFromSendGrid(payload);
        break;
        default:
        break;
    }
    return payload;
    } catch (error) {
     console.log(error)   
    }
}
module.exports = {
    sendEmail:sendEmail
};
