const FCM = require('fcm-node');
const apns = require('apn');
const Path = require('path');
const apnDriver=require('../config/config').apnDriver;
const apnCertificate=require('../config/config').apnCertificate;
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
      
  }
}
const getCredential=async (superAdminId,appSettingData,isDriver)=>{
  try {
    let serviceCode=0;
    if(appSettingData && appSettingData.driverPushSerivceCode && isDriver)
    serviceCode=appSettingData.driverPushSerivceCode;
    if(appSettingData && appSettingData.userPushSerivceCode && !isDriver)
    serviceCode=appSettingData.userPushSerivceCode;
      let credentialData=await Model.Credentials.findOne({
          superAdminId:superAdminId,
          serviceType:constant.THIRD_PARTY_SERVICE_TYPE.PUSH,
          serviceCode:serviceCode,
          isActive:true,
          isDeleted:false,
          isBlocked:false},{credentials:1});
      return credentialData;   
  } catch (error) {
      
  }
}
const getPushMessage=async (superAdminId,messageType,lang)=>{
  try {
      let messageData=await Model.PushMessages.findOne({
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
async function sendAndroidPushNotifiction(payload,credentialData){
    let fcm = new FCM(credentialData.fcmKey);
    
    var message = {
        to: payload.token || '',
        collapse_key:'product',
        data:payload || {}
    };
    fcm.send(message, (err, response) => {
        if (err) {
      console.log('Something has gone wrong!', message,err);
        } else {
            console.log('Push successfully sent!');
        }
    });
}
async function sendIosPushNotification(payload,credentialData) {
  let fcm = new FCM(credentialData.fcmKey);  
  var message = {
      to: payload.token || '',
      collapse_key:'product',
      notification: {
        title: payload.title || 'product',
        body: payload.message || '',
        sound:'default'
      },
      data:payload || {}
  };
  fcm.send(message, (err, response) => {
      if (err) {
    console.log('Something has gone wrong! IOS', payload.token,err);
      } else {
          console.log('Push successfully sent! IOS');
      }
  });
}
const sendDriverPushNotifiction=async (payload)=>{
  try {
  
  let appSettingData=await getAppSetting(payload.superAdminId);
  if(appSettingData && !appSettingData.isDriverPushEnabled)
        return payload;
  let serviceCredentialData=await getCredential(payload.superAdminId,appSettingData,true);
  let messageData=await getPushMessage(payload.superAdminId,payload.messageType,payload.lang);
  if(messageData){
    payload.message=messageData.message || '';
    if(payload && payload.variableData)
    payload.message=await universalFunction.renderMessage(payload.message,payload.variableData)
  }
  let serviceCode= serviceCredentialData?serviceCredentialData.serviceCode: 0
  switch(serviceCode){
      case constant.THIRD_PARTY_SERVICE_CODE.FCM_USER:
        if(payload.deviceType ==constant.DEVICE_TYPE.ANDROID)
        await sendAndroidPushNotifiction(payload);
        if(payload.deviceType ==constant.DEVICE_TYPE.IOS)
        await sendIosPushNotification(payload);
      break;
      case constant.THIRD_PARTY_SERVICE_CODE.FCM_DRIVER:
        if(payload.deviceType ==constant.DEVICE_TYPE.ANDROID)
        await sendAndroidPushNotifiction(payload);
        if(payload.deviceType ==constant.DEVICE_TYPE.IOS)
        await sendIosPushNotification(payload);
      break;
      default:
      break;
  }
  return payload;
  } catch (error) {
    
  }
  
}
async function sendDriverBulkPushNotifictionDelayTime(payload,userId){
  setTimeout(async function () {
      console.log("delay chat 10 second");
      await sendDriverBulkPushNotifiction(payload,userId);
    }, 5000);
};
const sendDriverBulkPushNotifiction=async (payload,userId,isCredential)=>{
  try {
    
  let appSettingData=null;
  let serviceCredentialData=null;
  let messageData=null;
  if(isCredential){
    appSettingData=await getAppSetting(payload.superAdminId);
    if(appSettingData && !appSettingData.isDriverPushEnabled)
        return payload;
    serviceCredentialData=await getCredential(payload.superAdminId,appSettingData,true);
    messageData=await getPushMessage(payload.superAdminId,payload.messageType,payload.lang);
    if(messageData){
      payload.message=messageData.message || '';
      if(payload && payload.variableData)
      payload.message=await universalFunction.renderMessage(payload.message,payload.variableData)
    }
    payload.serviceCode= serviceCredentialData?serviceCredentialData.serviceCode: 0
  }
  let userIds=userId.splice(0,10);
  if(userIds && userIds.length){
    const userDeviceData=await Model.Device.find({userId:{$in:userIds}});
              if(userDeviceData && userDeviceData.length){
              for(let i=0;i<userDeviceData.length;i++){
                payload.deviceToken=userDeviceData[i].deviceToken;
                switch(payload.serviceCode){
                  case constant.THIRD_PARTY_SERVICE_CODE.FCM_USER:
                    if(userDeviceData.deviceType ==constant.DEVICE_TYPE.ANDROID)
                    await sendAndroidPushNotifiction(payload);
                    if(payload.deviceType ==constant.DEVICE_TYPE.IOS)
                    await sendIosPushNotification(payload);
                  break;
                  case constant.THIRD_PARTY_SERVICE_CODE.FCM_DRIVER:
                    if(userDeviceData.deviceType ==constant.DEVICE_TYPE.ANDROID)
                    await sendAndroidPushNotifiction(payload);
                    if(userDeviceData.deviceType ==constant.DEVICE_TYPE.IOS)
                    await sendIosPushNotification(payload);
                  break;
                  default:
                  break;
                }
              }
              await sendDriverBulkPushNotifictionDelayTime(payload,userId,false);
            }
  }
  return payload;
  } catch (error) {
    
  }
  
}


const sendUserPushNotifiction=async (payload)=>{
  try {
  
  let appSettingData=await getAppSetting(payload.superAdminId);
  if(appSettingData && !appSettingData.isUserPushEnabled)
        return payload;
  let serviceCredentialData=await getCredential(payload.superAdminId,appSettingData,false);
  let messageData=await getPushMessage(payload.superAdminId,payload.messageType,payload.lang);
  if(messageData){
    payload.message=messageData.message || '';
    if(payload && payload.variableData)
    payload.message=await universalFunction.renderMessage(payload.message,payload.variableData)
  }
  let serviceCode= serviceCredentialData?serviceCredentialData.serviceCode: 0
  switch(serviceCode){
      case constant.THIRD_PARTY_SERVICE_CODE.FCM_USER:
        if(payload.deviceType ==constant.DEVICE_TYPE.ANDROID)
        await sendAndroidPushNotifiction(payload);
        if(payload.deviceType ==constant.DEVICE_TYPE.IOS)
        await sendIosPushNotification(payload);
      break;
      case constant.THIRD_PARTY_SERVICE_CODE.FCM_DRIVER:
        if(payload.deviceType ==constant.DEVICE_TYPE.ANDROID)
        await sendAndroidPushNotifiction(payload);
        if(payload.deviceType ==constant.DEVICE_TYPE.IOS)
        await sendIosPushNotification(payload);
      break;
      default:
      break;
  }
  return payload;
  } catch (error) {
    
  }
  
}
async function sendUserBulkPushNotifictionDelayTime(payload,userId){
  setTimeout(async function () {
      console.log("delay chat 10 second");
      await sendUserBulkPushNotifiction(payload,userId);
    }, 5000);
};
const sendUserBulkPushNotifiction=async (payload,userId,isCredential)=>{
  try {
    
  let appSettingData=null;
  let serviceCredentialData=null;
  let messageData=null;
  if(isCredential){
    appSettingData=await getAppSetting(payload.superAdminId);
    if(appSettingData && !appSettingData.isUserPushEnabled)
        return payload;
    serviceCredentialData=await getCredential(payload.superAdminId,appSettingData,false);
    messageData=await getPushMessage(payload.superAdminId,payload.messageType,payload.lang);
    if(messageData){
      payload.message=messageData.message || '';
      if(payload && payload.variableData)
      payload.message=await universalFunction.renderMessage(payload.message,payload.variableData)
    }
    payload.serviceCode= serviceCredentialData?serviceCredentialData.serviceCode: 0
  }
  let userIds=userId.splice(0,10);
  if(userIds && userIds.length){
    const userDeviceData=await Model.UserDevice.find({userId:{$in:userIds}});
              if(userDeviceData && userDeviceData.length){
              for(let i=0;i<userDeviceData.length;i++){
                payload.deviceToken=userDeviceData[i].deviceToken;
                switch(payload.serviceCode){
                  case constant.THIRD_PARTY_SERVICE_CODE.FCM_USER:
                    if(userDeviceData.deviceType ==constant.DEVICE_TYPE.ANDROID)
                    await sendAndroidPushNotifiction(payload);
                    if(payload.deviceType ==constant.DEVICE_TYPE.IOS)
                    await sendIosPushNotification(payload);
                  break;
                  case constant.THIRD_PARTY_SERVICE_CODE.FCM_DRIVER:
                    if(userDeviceData.deviceType ==constant.DEVICE_TYPE.ANDROID)
                    await sendAndroidPushNotifiction(payload);
                    if(userDeviceData.deviceType ==constant.DEVICE_TYPE.IOS)
                    await sendIosPushNotification(payload);
                  break;
                  default:
                  break;
                }
              }
              await sendUserBulkPushNotifictionDelayTime(payload,userId,false);
            }
  }
  return payload;
  } catch (error) {
    
  }
  
}
module.exports = {
  sendDriverPushNotifiction: sendDriverPushNotifiction,
  sendDriverBulkPushNotifiction:sendDriverBulkPushNotifiction,
  sendUserPushNotifiction: sendUserPushNotifiction,
  sendUserBulkPushNotifiction:sendUserBulkPushNotifiction
};
