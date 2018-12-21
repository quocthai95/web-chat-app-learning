const http = require('http'),
      app = require('express')(),
      bodyParser = require('body-parser'),
      server = http.createServer(app),
      userRouter = require('./api/userService'),
      roomRouter = require('./api/roomService'),
      io = require('socket.io')(server),
      redisAdapter = require('socket.io-redis'),
      config = require('./config/config');

require('./socket/socket')(io);
io.adapter(redisAdapter({host: config.redis_host, port: config.redis_port}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// use routers
app.use('/user', userRouter);
app.use('/room', roomRouter);


server.listen(8000, () => {
  console.log("Server Running!",  8000 );
})

module.exports = app;