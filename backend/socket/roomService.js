const clientRedis = require('../redis/redisService');

//create Room
let createRoom = (socket, roomInfo) => {
  // get roomList
  clientRedis.get('roomList', '.')
  .then((data) => {
    // check existed room
   if(data && JSON.parse(data)[roomInfo.roomId]) {
     socket.emit('fail', {
       message: 'Room Id already is existed'
     });
     return;
   }
   
  const roomList = JSON.stringify({
    ...JSON.parse(data),
    ...{[roomInfo.roomId]: roomInfo}
  });

  // add new room to roomList 
  clientRedis.set('roomList', '.', roomList)
  .then((dt) => {
    clientRedis.get('roomList', '.')
    .then((data) => {
      socket.broadcast.emit('reloadRoomList', {
        roomList: JSON.parse(data)
      })
    })
    socket.emit('room.created');
  })
}).catch((err) => {
    socket.emit('fail', {
      message: 'Error XXYYZZ'
    })
  })
}

// join room
let joinRoom = (socket, roomInfo, user, ns) => {
      // get room info
      clientRedis.get('roomList', '.')
      .then((data) => {
         // check existed room
         if(!data || !JSON.parse(data)[roomInfo.roomId]) {
          socket.emit('failGetRoom');
          return;
        }

        let room = JSON.parse(data)[roomInfo.roomId];
        room.activeUserList = {
          ...room.activeUserList,
          ...{[user.username]:user}
        }

        // add socket to userActiveList
        clientRedis.set('roomList', '.' + roomInfo.roomId + '.activeUserList', JSON.stringify(room.activeUserList))
        .then(() => {
          socket.join(roomInfo.roomId);
          console.log(`socketId: ${socket.user.username} joined ${socket.roomId}`);
          socket.to(roomInfo.roomId).emit('joined', user);
          clientRedis.get('roomList', '.' + roomInfo.roomId + '.activeUserList')
          .then((dt) => {
            ns.to(socket.roomId).emit('reloadMember', {
              data: JSON.parse(dt)
            })
          })
        })
      })
      .catch((err) => {
        socket.emit('failGetRoom');
      })
}

//leave room
let leaveRoom = (socket, ns, timeForRemove) => {
  socket.leave(socket.roomId);
      console.log(`socketId: ${socket.user.username} left ${socket.roomId}`);
      clientRedis.del('roomList', '.' + socket.roomId + '.activeUserList.' + socket.user.username)
      .then(() => {
        console.log(`remove ${socket.user.username} from activeUserList of ${socket.roomId}`);
        clientRedis.get('roomList', '.' + socket.roomId + '.activeUserList')
          .then((data) => {
            if(data === "{}") {
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

// remove Room
let removeRoom = (roomId,ns) => {
  let removedTime = Date.now();
  //get info removed room
  clientRedis.get('roomList', '.' + roomId)
  .then((info) => {
    let infor = JSON.parse(info);
  //get room list history
    clientRedis.get('roomListHistory', '.')
    .then((infoList) => {
      const roomListHistory = JSON.stringify({
        ...JSON.parse(infoList),
        ...{[infor.roomId + '-' + removedTime]: infor}
      });

      //add removed room to room list history
      clientRedis.set('roomListHistory', '.', roomListHistory)
      .then(() => {
        //remove room from room list
        clientRedis.del('roomList', '.' + roomId)
        .then(() => {
          //reload roomlist
          clientRedis.get('roomList', '')
          .then((rl) => {
            ns.emit('reloadRoomList', {
              roomList: JSON.parse(rl)
            })
          })
        })
      })
    })
  })
}

// check existed rooms
let checkExistedRooms = (ns, timeForRemove) => {
  clientRedis.get('roomList', '.')
  .then((res) => {
    let roomList = JSON.parse(res);
    for (const roomId in roomList) {
      setTimeout(() => {
        ns.in(roomId).clients((err, clients) => {
          if(clients.length === 0) {
            removeRoom(roomId, ns);
          }
        })
      }, timeForRemove)
    }
  })
}

module.exports = {
  removeRoom: removeRoom,
  checkExistedRooms: checkExistedRooms,
  createRoom: createRoom,
  joinRoom: joinRoom,
  leaveRoom: leaveRoom
}