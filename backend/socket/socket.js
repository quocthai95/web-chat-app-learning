const clientRedis = require('../redis/redisService');
const config = require('../config/config');
const roomService = require('./roomService');
const baseService = require('./baseService');

module.exports = function(io) {

let channelHandler = (namespace) => {
  console.log('Server is activating');
  // check existed rooms when start Server
  roomService.checkExistedRooms(namespace, config.timeForRemove);

  return (socket) => {
    // create room
    socket.on('room.create', (res, user) => {
      console.log(socket.id + ' create room ' + res.roomId);
      roomService.createRoom(socket, res);
    });

    // set socket info when join new room
    socket.on('room.join', (roomInfo, user) => {
      console.log(socket.id + ' joined room');
      user.socketId = socket.id;
      socket.roomId = roomInfo.roomId;
      socket.user = user;
      roomService.joinRoom(socket, roomInfo, user, namespace);
    });

    // get new message
    socket.on('sendMessage', (res) => {
       baseService.saveNewMessage(socket, res);
    })

    // notify someone is typing
    socket.on('typing', (res) => {
      socket.to(socket.roomId).emit('typing', res);
    })

    // leave room
    socket.on('room.leave', (res) => {
      roomService.leaveRoom(socket, namespace, config.timeForRemove);
    })


    // remove socket from activeUserList of Joined Room when disconnect
    socket.on('disconnect', (res) => {
      baseService.disconnectSocket(socket, roomService.removeRoom, config.timeForRemove, namespace);
    })
  }
}

// define new namspace
let channel = io.of('/channel');

// open connect to io
channel.on('connection', channelHandler(channel));
}