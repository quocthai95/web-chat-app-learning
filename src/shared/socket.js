import io from 'socket.io-client';
import { baseURL } from './config';

const socket = io(baseURL + '/channel');

export default socket;