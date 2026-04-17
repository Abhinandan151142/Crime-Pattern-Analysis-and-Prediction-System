import { io, Socket } from 'socket.io-client';
import type { Crime, Alert, Prediction, DashboardStats } from '../types';
import { API_CONFIG, isDevelopment } from '../config/api.config';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(url: string = API_CONFIG.SOCKET_URL) {
    if (this.socket?.connected) return;

    this.socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      if (isDevelopment) console.log('Socket.IO connected');
    });

    this.socket.on('disconnect', () => {
      if (isDevelopment) console.log('Socket.IO disconnected');
    });

    // Set up event listeners
    this.socket.on('new_crime_alert', (crime: Crime) => {
      this.emit('new_crime_alert', crime);
    });

    this.socket.on('prediction_update', (predictions: Prediction[]) => {
      this.emit('prediction_update', predictions);
    });

    this.socket.on('hotspot_update', (hotspots: any) => {
      this.emit('hotspot_update', hotspots);
    });

    this.socket.on('dashboard_refresh', (stats: DashboardStats) => {
      this.emit('dashboard_refresh', stats);
    });

    this.socket.on('risk_alert', (alert: Alert) => {
      this.emit('risk_alert', alert);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  joinRoom(room: string) {
    if (this.socket?.connected) {
      this.socket.emit('join_room', room);
    }
  }

  leaveRoom(room: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave_room', room);
    }
  }

  // Simulate real-time updates for demo
  simulateRealtime() {
    // Simulate new crime every 10 seconds
    setInterval(() => {
      const types = ['Theft', 'Assault', 'Burglary', 'Vandalism'];
      const districts = ['Downtown', 'North', 'South', 'East', 'West'];
      const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
      
      const newCrime: Crime = {
        id: `crime-${Date.now()}`,
        type: types[Math.floor(Math.random() * types.length)],
        location: `${Math.floor(Math.random() * 9999)} Main St`,
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        timestamp: new Date(),
        severity: severities[Math.floor(Math.random() * severities.length)],
        status: 'active',
        district: districts[Math.floor(Math.random() * districts.length)]
      };

      this.emit('new_crime_alert', newCrime);
    }, 10000);

    // Simulate alerts
    setInterval(() => {
      const alert: Alert = {
        id: `alert-${Date.now()}`,
        type: (['info', 'warning', 'danger'][Math.floor(Math.random() * 3)]) as any,
        message: 'New alert from crime analysis system',
        timestamp: new Date()
      };
      this.emit('risk_alert', alert);
    }, 30000);
  }
}

export const socketService = new SocketService();
