import {
  ADD_NEW_TRACKER, COMPONENT_HIGHLIGHT, MOUSE_TRACK, UPDATE_COMPONENT_HIGHLIGHT, UPDATE_TRACKER,
} from './constants'

interface AppState {
  [COMPONENT_HIGHLIGHT]?: {
    [key: string]: string[]
  },
  [MOUSE_TRACK]?: {
    [key: string]: {
      y: number
      x: number
    }
  }
}

export const reducer = (state: AppState = {}, action: { type: string; payload?: any }): AppState => {
  const { payload, type } = action
  switch (type) {
    case ADD_NEW_TRACKER: {
      return state
    }

    case UPDATE_TRACKER: {
      return state
    }

    case UPDATE_COMPONENT_HIGHLIGHT: {
      return state
    }

    default: {
      return state
    }
  }
}
