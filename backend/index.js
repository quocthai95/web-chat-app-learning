const http = require('http'),
      app = require('express')(),
      bodyParser = require('body-parser'),
      server = http.createServer(app),
      userRouter = require('./api/userService'),
      roomRouter = require('./api/roomService'),
      io = require('socket.io')(server);

require('./socket/socket')(io);

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


server.listen(process.env.PORT || 8000, () => {
  console.log("Server Running!", process.env.PORT || 8000 );
})



module.exports = app;