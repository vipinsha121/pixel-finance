const superAdmin = require('./superAdminSockets');
const Model = require('../models/index');
const io = require('socket.io');

async function messaageSendToAdmin(io,payload){
  if(payload && payload.socketType){
    switch(payload.socketType){
      case 'BROAD_CAST':
        if(payload && payload.receiverId ){
          io.to(payload.receiverId).emit('sendAdminNotificationMessage',payload);
          if(payload && payload.isNotificationSave){
            Model.AdminNotification(payload).save();
          }
        }
      break;
      case 'USER':
        if(payload && payload.receiverId ){
          io.in(payload.receiverId).emit('sendAdminNotificationMessage',payload);
          if(payload && payload.isNotificationSave){
            Model.AdminNotification(payload).save();
          }
      }
      break;
      default:
      break;
    }
  }
}
module.exports =(io)=>{
    io.on('connection',(socket)=>{
        console.log('connected to sockets');
        superAdmin(io,socket);
        socket.on('disconnect', function () {
            console.log("Disconnect")
        });
    });
    process.on('sendNotificationToAdmin', async (payload) => {
      if(payload && payload.eventType){
        switch(payload.eventType){
          case 'DEFAULT':
            messaageSendToAdmin(io,payload);
            break;
          default:
          break;
        }
      }
  });
} 