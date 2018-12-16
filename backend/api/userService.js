const clientRedis = require('../redis/redisService'),
      router = require('express').Router();


// create new account
router.post('/createAccount', (req, res) => {
  clientRedis.get('userList', '.')
  .then((data) => {
   if(data && JSON.parse(data)[req.body.username]) {
     res.send('EXISTED');
     return;
   }
  const userList = JSON.stringify({
    ...JSON.parse(data),
    ...{[req.body.username]: req.body}
  })
  clientRedis.set('userList', '.', userList)
  .then((dt) => {
    res.send(dt);
  })
  })
  .catch((err) => {
    res.send('FAILED');
    res.end();
  })
  
})

// check account info
router.post('/checkAccount', (req, res) => {
  clientRedis.get('userList', '.' + req.body.username)
  .then((data) => {
    let dt = JSON.parse(data);
    if (req.body.username === dt.username && req.body.password === dt.password) {
      res.send(dt);
    }
    else {
      res.send(false);
    }
  })
  .catch((err) => {
    res.send(false);
  })
})

module.exports = router;