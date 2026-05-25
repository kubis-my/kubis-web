'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
    useMemo,
} from 'react';
import { Socket } from 'socket.io-client';
import { createSocketClient, disconnectSocket } from '@repo/commons/lib/socket-client';
import { getToken, ACCESS_TOKEN_KEY } from '@repo/commons/utils/storage-helpers';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    connect: (token?: string) => Promise<void>;
    disconnect: () => void;
    emit: <T = unknown>(event: string, data?: T) => void;
    on: <T = unknown>(event: string, callback: (data: T) => void) => void;
    off: (event: string, callback?: (...args: unknown[]) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: React.ReactNode;
    url: string;
    namespace?: string;
    autoConnect?: boolean;
}

export function SocketProvider({
    children,
    url,
    namespace,
    autoConnect = false,
}: SocketProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const socketRef = useRef<Socket | null>(null);
    const isConnectingRef = useRef(false);

    const isConnected = connectionStatus === 'connected';

    const fetchSocketToken = useCallback((): string | null => {
        return getToken(ACCESS_TOKEN_KEY);
    }, []);

    const connect = useCallback(async (providedToken?: string) => {
        if (socketRef.current?.connected || isConnectingRef.current) {
            return;
        }

        isConnectingRef.current = true;
        setConnectionStatus('connecting');

        try {
            const token = providedToken ?? fetchSocketToken();

            if (!token) {
                console.error('[Socket] No token available');
                isConnectingRef.current = false;
                setConnectionStatus('error');
                return;
            }

            const newSocket = createSocketClient({ url, token, namespace });

            newSocket.on('connect', () => {
                console.log('[Socket] Connected');
                isConnectingRef.current = false;
                setConnectionStatus('connected');
            });

            newSocket.on('disconnect', (reason) => {
                console.log('[Socket] Disconnected:', reason);
                setConnectionStatus('disconnected');
            });

            newSocket.on('connect_error', (error) => {
                console.error('[Socket] Connection error:', error.message);
                isConnectingRef.current = false;
                setConnectionStatus('error');
            });

            newSocket.on('reconnect', (attemptNumber) => {
                console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
                setConnectionStatus('connected');
            });

            newSocket.io.on('reconnect_attempt', async () => {
                console.log('[Socket] Reconnection attempt - refreshing token');
                setConnectionStatus('connecting');
                const freshToken = fetchSocketToken();
                if (freshToken) {
                    newSocket.auth = { token: freshToken };
                }
            });

            newSocket.on('reconnect_failed', () => {
                console.error('[Socket] Reconnection failed');
                setConnectionStatus('error');
            });

            socketRef.current = newSocket;
            setSocket(newSocket);
            newSocket.connect();
        } catch (error) {
            console.error('[Socket] Failed to connect:', error);
            isConnectingRef.current = false;
            setConnectionStatus('error');
        }
    }, [fetchSocketToken, url, namespace]);

    const disconnect = useCallback(() => {
        isConnectingRef.current = false;
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
            setConnectionStatus('disconnected');
        }
        disconnectSocket();
    }, []);

    const emit = useCallback(<T = unknown,>(event: string, data?: T) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit(event, data);
        } else {
            console.warn('[Socket] Cannot emit - not connected');
        }
    }, []);

    const on = useCallback(<T = unknown,>(event: string, callback: (data: T) => void) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback as (...args: unknown[]) => void);
        }
    }, []);

    const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
        if (socketRef.current) {
            if (callback) {
                socketRef.current.off(event, callback);
            } else {
                socketRef.current.off(event);
            }
        }
    }, []);

    useEffect(() => {
        if (autoConnect) {
            connect();
        }
    }, [autoConnect, connect]);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    const contextValue = useMemo<SocketContextType>(
        () => ({
            socket,
            isConnected,
            connectionStatus,
            connect,
            disconnect,
            emit,
            on,
            off,
        }),
        [socket, isConnected, connectionStatus, connect, disconnect, emit, on, off],
    );

    return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
