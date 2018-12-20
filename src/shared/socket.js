import io from 'socket.io-client';
import { baseURL } from './config';

const socket = io(baseURL + '/channel');
socket.on('connect', () => {
  console.log('connect');
})

// socket.on('disconnect', (reason) => {
  
//   console.log('disconnect ' + reason)
//   // else the socket will automatically try to reconnect
//   document.getElementById('loaderContainer').style.display = "block";
// });

// socket.on('reconnect', (attemptNumber) => {
//   console.log('reconnect ' + attemptNumber)
//   document.getElementById('loaderContainer').style.display = "none";
// });


// socket.on('reconnect_error', (error) => {
//   console.log('err to reconnect ' + error)
//   if(document.getElementById('loaderContainer').style.display === "" ||  document.getElementById('loaderContainer').style.display === "none")
//   document.getElementById('loaderContainer').style.display = "block";
// });

export default socket;