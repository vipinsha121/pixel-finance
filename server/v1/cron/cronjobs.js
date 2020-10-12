
const appConstant = require('../../constant');
const moment=require('moment');
const Model = require('../../models/index');
const Service = require('../../services/index');
const mongoose = require('mongoose');
const request = require('request');
const statusCodeList = require("../../statusCodes");
const constant = appConstant.constant;
const statusCode = statusCodeList.statusCodes.STATUS_CODE;

const Agenda = require('agenda');
exports.startCronJobs=startCronJobs;

const agenda = new Agenda({db: {address:'mongodb://localhost:27017/product',collection: 'scheduledevents'}});

agenda.define('scheduledBet', async job => {
    const betData=job.attrs.data;
    if(betData && betData.betId){
        let bool=1;
        if(bool){
            job.remove(function(err) {
                if(!err) console.log("Successfully removed bet from collection");
            })
        }
    }
  });
  agenda.define('scheduledBetEvent', async job => {
    const betEventData=job.attrs.data;
    if(betEventData && betEventData.betEventId){
        let bool=1;
        if(bool){
            job.remove(function(err) {
                if(!err) console.log("Successfully removed bet event from collection");
            })   
        }
    }
  });
async function startCronJobs(){
    await agenda.start();
    
}
//23 hours 5 seconds
process.on('scheduledBet',async(betData)=>{
    const repeat =await agenda.create('scheduledBet',{betId:betData._id});
    repeat.repeatEvery('23 hours').save();
})
process.on('scheduledBetEvent',async(betEventData)=>{
    const repeat=await agenda.create('scheduledBetEvent',{betEventId:betEventData._id});
    repeat.repeatEvery('23 hours').save();
})