import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {io} from 'socket.io-client'

export const SocketContext = createContext()

export const SocketProvider = ( {children} ) => {
    const [socket, setSocket] = useState(null)

    //connect socket
    const connectSocket = useCallback((token) => {
        if(!token || socket) return;
        try {
            const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
                auth : {token},
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5
            })
            newSocket.on('connect', () => console.log('socket connected'))
            newSocket.on('connect_error', (error) => console.error('socket error', error))
            setSocket(newSocket)
        } catch (error) {
            console.error('failed to connect socket:', error)
        }
    }, [socket])

    //disconnect socket
    const disconnectSocket = useCallback(() => {
        if(socket){
            socket.disconnect()
            setSocket(null)
        }
    }, [socket])

    //cleanup
    useEffect(() => {
        return () => {
           socket?.disconnect()
        }
    }, [socket])

    return (
        <SocketContext.Provider value={{socket, connectSocket, disconnectSocket}}>
            {children}
        </SocketContext.Provider>
    )
} 

export const useSocket = () => {
    const context = useContext(SocketContext)
    if(!context) {
        throw new Error('useSocket must be used within socketProvider')
    }
    return context
}