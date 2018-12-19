import io from 'socket.io-client';
import { baseURL } from './config';

const socket = io(baseURL + '/channel');

socket.on('connect', () => {
  console.log(socket.connected);
})

export default socket;