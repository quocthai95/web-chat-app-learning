import io from 'socket.io-client';
import { baseURL } from './config';

const socket = io(baseURL + '/channel');
socket.on('connect', () => {
  console.log('connect');
})

socket.on('disconnect', (reason) => {
  
  console.log('disconnect ' + reason)
  // else the socket will automatically try to reconnect
  document.getElementById('loaderContainer').style.display = "block";
});

socket.on('reconnect', (attemptNumber) => {
  console.log('reconnect ' + attemptNumber)
  document.getElementById('loaderContainer').style.display = "none";
});


socket.on('reconnect_attempt', (attemptNumber) => {
  console.log('reconnect_attempt ' + attemptNumber)
});


socket.on('reconnecting', (attemptNumber) => {
  // ...
  console.log('reconnecting ' + attemptNumber)
});

socket.on('reconnect_error', (error) => {
  console.log('err to reconnect ' + error)
});

export default socket;