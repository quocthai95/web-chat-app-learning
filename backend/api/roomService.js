const clientRedis = require('../redis/redisService'),
      router = require('express').Router();


router.get('/getRoomList', (req, res) => {
  clientRedis.get('roomList', '.')
  .then((data) => {
    res.send(JSON.parse(data));
  })
  .catch((err) => {
    res.send(false);
  })
})

router.get('/:roomId', (req, res) => {
  clientRedis.get('roomList', '.' + req.params.roomId)
  .then((data) => {
    res.send(JSON.parse(data));
  })
  .catch((err) => {
    res.send(false);
  })
})

module.exports = router;