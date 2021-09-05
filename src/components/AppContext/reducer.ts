import { AppState } from 'components/AppContext/types'
import { ADD_NEW_TRACKER, UPDATE_COMPONENT_HIGHLIGHT, UPDATE_TRACKER, defaultState, MOUSE_TRACK } from './constants'

export const reducer = (state = defaultState, action: { type: string; payload?: any }): AppState => {
  const { payload, type } = action
  switch (type) {
    case ADD_NEW_TRACKER: {
      return state
    }

    case UPDATE_TRACKER: {
      return {
        ...state,
        [MOUSE_TRACK]: {
          ...state[MOUSE_TRACK],
          [payload.email]: { x: payload.pageX, y: payload.pageY, }
        }
      }
    }

    case UPDATE_COMPONENT_HIGHLIGHT: {
      return state
    }

    default: {
      return state
    }
  }
}
