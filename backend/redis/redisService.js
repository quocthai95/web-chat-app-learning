const redis = require('redis'),
      rejson = require('redis-rejson'),
      config = require('../config/config');

// add rejson module
rejson(redis);

// create redis client
let client = redis.createClient(config.redis_port, config.redis_host);

let promiser = (resolve, reject) => {
  return (err, data) => {
    if(err) {
      reject(err);
    }
    else {
      resolve(data);
    }
  }
}


//get data
let get = (key, path) => {
  return new Promise((resolve, reject) => {
    client.json_get(key, path, promiser(resolve, reject));
  })
}

//set data
let set = (key, path, data) => {
  return new Promise((resolve, reject) => {
    client.json_set(key, path, data, promiser(resolve, reject));
  })
}

//remove data
let del = (key, path) => {
  return new Promise((resolve, reject) => {
    client.json_del(key, path, promiser(resolve, reject));
  })
}


module.exports = {
  get: get,
  set: set,
  del: del,
  client: client
}