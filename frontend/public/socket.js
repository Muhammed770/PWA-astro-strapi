import { io } from 'socket.io-client';

const socket = io('http://localhost:1337');

socket.on('connect', () => {
    console.log('Connected to WebSocket');
});

socket.on('product:create', (data) => {
    console.log('Product created:', data);
});

socket.on('product:update', (data) => {
    console.log('Product updated:', data);
});

socket.on('product:delete', (data) => {
    console.log('Product deleted:', data);
});