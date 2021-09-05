import { AppContextType, AppState } from 'components/AppContext/types'

// reducer actions
export const UPDATE_TRACKER = 'UPDATE_POSITION'
export const ADD_NEW_TRACKER = 'ADD_NEW_TRACKER'
export const UPDATE_COMPONENT_HIGHLIGHT = 'UPDATE_COMPONENT_HIGHLIGHT'

// messages
export const COMPONENT_HIGHLIGHT = 'componentHighlight'
export const MOUSE_TRACK = 'mouseTrack'

export const defaultState: AppState = {}

export const defaultContext: AppContextType = {
  dispatch: ({ type }) => {
    console.warn(`${type} not available. Context hasn't been initialized.`)
  },
  helpers: {},
  state: defaultState,
}
