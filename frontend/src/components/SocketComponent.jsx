
import { useEffect } from 'react';
import { io } from 'socket.io-client';
//access env variables in the frontend


const SocketComponent = ({ serverUrl }) => {
    console.log('PUBLIC_SERVER_URL:', serverUrl);
    useEffect(() => {
        console.log('Connecting to WebSocket:', serverUrl);
        const socket = io(serverUrl);
        
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

        return () => {
            socket.disconnect(); // Clean up on unmount
        };
    }, []);

    return (
        <>
            hello {serverUrl}
        </>
    ) // This component doesn't render anything, it's just for WebSocket
};

export default SocketComponent;
