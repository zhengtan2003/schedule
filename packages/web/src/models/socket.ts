import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const connect = () => {
    const authorization = localStorage.getItem('authorization');
    if (!authorization) return;
    const socket = io({
      path: '/api/socket.io',
      extraHeaders: {
        authorization: localStorage.getItem('authorization') || '',
      },
    });
    socket.on('connect', () => {
      console.log('socket.io：已连接到服务器');
    });
    socket.on('disconnect', () => {
      console.log('socket.io：已断开与服务器的连接');
    });
    setSocket(socket);
  };
  const disconnect = () => {
    if (!socket) return;
    socket.disconnect();
    setSocket(null);
  };

  useEffect(() => {
    connect();
    return () => {
      socket?.disconnect();
      setSocket(null);
    };
  }, []);

  return { socket, connect, disconnect };
}
