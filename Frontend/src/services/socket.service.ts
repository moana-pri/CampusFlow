import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected && this.userId === userId) {
      return this.socket;
    }

    this.userId = userId;
    const token = localStorage.getItem('accessToken');

    this.socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected');
      // Join user's personal room
      this.socket?.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  onNotification(callback: (notification: any) => void) {
    this.socket?.on('notification', callback);
  }

  onEventUpdate(callback: (update: any) => void) {
    this.socket?.on('event_update', callback);
  }

  offNotification(callback?: (notification: any) => void) {
    if (callback) {
      this.socket?.off('notification', callback);
    } else {
      this.socket?.off('notification');
    }
  }

  offEventUpdate(callback?: (update: any) => void) {
    if (callback) {
      this.socket?.off('event_update', callback);
    } else {
      this.socket?.off('event_update');
    }
  }
}

export const socketService = new SocketService();
