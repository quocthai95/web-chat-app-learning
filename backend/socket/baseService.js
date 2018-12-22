const clientRedis = require('../redis/redisService');

// save new message
let saveNewMessage = (socket, data) => {
  socket.to(socket.roomId).emit('newMessage', {
    user: data.user,
    message: data.message
  })
  clientRedis.client.json_arrappend('roomList', '.' + socket.roomId + '.messHistory', JSON.stringify([data.user.nickname, data.message]));
}

// react to disconnect sockets
let disconnectSocket = (socket, removeRoom, timeForRemove, ns) => {
  if (socket.user && socket.user.username && socket.roomId) {
    console.log(socket.user.username + ' has left ' + socket.roomId);
  clientRedis.del('roomList', '.' + socket.roomId + '.activeUserList.' + socket.user.username)
  .then((data) => {
    console.log(`remove ${socket.user.username} from activeUserList of ${socket.roomId}`);
    clientRedis.get('roomList', '.' + socket.roomId + '.activeUserList')
      .then((data) => {
        if(data === '{}') {
          // remove room
          setTimeout(() => {
            clientRedis.get('roomList', '.' + socket.roomId + '.activeUserList')
            .then((retry) => {
              if(retry === '{}') {
                removeRoom(socket.roomId, ns);
              }
            })
          }, timeForRemove);
        }
        else {
           // reload member list in room
        socket.to(socket.roomId).emit('reloadMember', {
          data: JSON.parse(data)
        })

        //emit someone leave to room
        socket.to(socket.roomId).emit('someoneLeaveRoom', {
          user: socket.user
        })
        }
      })
    
  })
  }
}

module.exports = {
  disconnectSocket: disconnectSocket,
  saveNewMessage: saveNewMessage
}