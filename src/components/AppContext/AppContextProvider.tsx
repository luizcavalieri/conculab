import React, { FocusEventHandler, FunctionComponent, useEffect, useReducer } from 'react'
import {
  COMPONENT_HIGHLIGHT,
  MOUSE_TRACK,
  UPDATE_COMPONENT_HIGHLIGHT,
  UPDATE_TRACKER,
} from 'components/AppContext/constants'
import { useSocket } from 'hooks/useSocket'
import env from 'config/environment.client'
import AppContext from './AppContext'
import { reducer } from './reducer'
import { getCookie } from './utils'

const { API_WS_PORT, API_WS_URL } = env

const AppContextProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {})
  const socket = useSocket({
      messages: [
        {
          cb: (data) => {
            console.log(socket.id)
          },
          name: 'connect',
        },
        {
          cb: (data) => {
            switch (data.type) {
              case MOUSE_TRACK:
                dispatch({
                  type: UPDATE_TRACKER,
                  payload: data,
                })
                break
              case COMPONENT_HIGHLIGHT:
                dispatch({
                  type: UPDATE_COMPONENT_HIGHLIGHT,
                  payload: { ...state[COMPONENT_HIGHLIGHT], [data?.details?.id]: data?.details?.email }
                })
                break
              default:
                return
            }
          },
          name: 'newhighlight',
        },
      ],
      options: {
        host: API_WS_URL,
        port: API_WS_PORT,
        transports: ['websocket'],
      }
    },
  )

  const handleMouseMove = ({ pageX, pageY }: MouseEvent) => {
    socket.emit('mouseover', { type: MOUSE_TRACK, pageX: pageX / window.outerWidth, pageY: pageY / window.outerHeight, email: getCookie('user_email') })
  }

  const handleComponentFocused: FocusEventHandler<HTMLInputElement> = ({ currentTarget: { id } }) => {
    socket.emit('mouseover', { type: COMPONENT_HIGHLIGHT, details: { id, isFocus: true, email: getCookie('user_email') }})
  }

  const handleComponentBlurred: FocusEventHandler<HTMLInputElement> = ({ currentTarget: { id } }) => {
    socket.emit('mouseover', { type: COMPONENT_HIGHLIGHT, details: { id, isFocus: false, email: null }})
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      console.log('Remove event listener')
      window.removeEventListener('mousemove', handleMouseMove, false)
    }
  }, [])

  return (
    <AppContext.Provider value={{ dispatch, state }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
