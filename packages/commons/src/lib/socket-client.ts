import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export type TokenFetcher = () => Promise<string | null>;

export interface SocketConfig {
  url: string;
  token?: string;
  namespace?: string;
}

/**
 * Create a new Socket.IO client instance
 */
export function createSocketClient(config: SocketConfig): Socket {
  const { url, token, namespace = '' } = config;
  const socketUrl = namespace ? `${url}/${namespace}` : url;

  const socket = io(socketUrl, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    withCredentials: true,
    auth: token ? { token } : undefined,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  return socket;
}

/**
 * Get or create the default socket client instance
 * Uses singleton pattern for client-side
 */
export function getSocketClient(config: SocketConfig): Socket {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Always create a new client for SSR (though socket shouldn't be used server-side)
    return createSocketClient(config);
  }

  // Reuse client on the client-side, but recreate if token or url changes
  const currentAuth = socketInstance?.auth as { token?: string } | undefined;
  if (!socketInstance || (config.token && currentAuth?.token !== config.token)) {
    if (socketInstance) {
      socketInstance.disconnect();
    }
    socketInstance = createSocketClient(config);
  }

  return socketInstance;
}

/**
 * Disconnect and cleanup the socket client
 */
export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

/**
 * Reconnect the socket with a new token
 */
export function reconnectSocket(token: string): Socket | null {
  if (socketInstance) {
    socketInstance.auth = { token };
    socketInstance.connect();
    return socketInstance;
  }
  return null;
}
