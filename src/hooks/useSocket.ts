import { requestIdleCallback } from 'next/dist/client/request-idle-callback'
import { useEffect } from 'react'
import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'

interface MessagesProps {
  messages?: { name: string, cb: (...args: any[]) => void }[]
  options: Partial<ManagerOptions & SocketOptions>
}

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined = undefined

const useSocket = ({ messages, options }: MessagesProps): Socket => {
  if (!socket) {
    socket = io(options)
  }

  useEffect(() => {
    if (socket) {
      messages?.forEach(({ cb, name }) => {
        socket?.on(name, cb)
      })
    }

    return function useSocketCleanup() {
      if (socket) {
        messages?.forEach(({ cb, name }) => {
          socket?.off(name, cb)
        })
      }
    }
  }, [messages])

  return socket
}

export { useSocket }
