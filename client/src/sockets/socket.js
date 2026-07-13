import {io} from 'socket.io-client'


let socket =null;

export const connectSocket = () => {
    if(!socket){
        socket = io(import.meta.env.VITE_SERVER_URL, {
            autoConnect: false,
        })
        socket.connect();
    }
    return socket;
};

export const disconnectSocket = () => {
    if(socket){
        socket.disconnect();
        
        socket = null;
    }
};
export const getSocket = () => socket;