const clientRedis = require('../redis/redisService');

module.exports = function(io) {

let channelHandler = (namespace) => {
  return (socket) => {

    // create room
    socket.on('room.create', (res, user) => {
      // get roomList
        clientRedis.get('roomList', '.')
        .then((data) => {
          // check existed room
         if(data && JSON.parse(data)[res.roomId]) {
           socket.emit('fail', {
             message: 'Room Id already is existed'
           });
           return;
         }
         
        const roomList = JSON.stringify({
          ...JSON.parse(data),
          ...{[res.roomId]: res}
        });

        // add new room to roomList 
        clientRedis.set('roomList', '.', roomList)
        .then((dt) => {
          socket.emit('success', {
            message: 'Room is created'
          });
        })
      }).catch((err) => {
          socket.emit('fail', {
            message: 'Error XXYYZZ'
          })
        })
      
    });

    // set socket info when join new room
    socket.on('room.join', (res, user) => {
      user.socketId = socket.id;
      socket.username = user.username;
      socket.roomId = res.roomId;

      // get room info
      clientRedis.get('roomList', '.' + res.roomId)
      .then((data) => {
        let room = JSON.parse(data);
        room.activeUserList = {
          ...room.activeUserList,
          ...{[user.username]:user}
        }

        // add socket to userActiveList
        clientRedis.set('roomList', '.' + res.roomId + '.activeUserList', JSON.stringify(room.activeUserList))
        .then((data) => {
          socket.join(res.roomId);
          console.log(`socketId: ${socket.username} joined ${res.roomId}`);
          socket.to(res.roomId).emit('joined', user);
          clientRedis.get('roomList', '.' + res.roomId + '.activeUserList')
          .then((data) => {
            namespace.to(socket.roomId).emit('reloadMember', {
              data: JSON.parse(data)
            })
          })
        })
      })
    });

    // remove socket from activeUserList of Joined Room when disconnect
    socket.on('disconnect', (res) => {
      if (socket.username && socket.roomId) {
        console.log(socket.username + ' leave!');
      clientRedis.del('roomList', '.' + socket.roomId + '.activeUserList.' + socket.username)
      .then((data) => {
        console.log(`remove ${socket.username} from activeUserList of ${socket.roomId}`);
      })
      }
    })
  }
}

// define new namspace
let channel = io.of('/channel');

// open connect to io
channel.on('connection', channelHandler(channel));
}