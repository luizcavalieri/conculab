import { Dispatch, FocusEventHandler } from 'react'
import { COMPONENT_HIGHLIGHT, MOUSE_TRACK } from 'components/AppContext/constants'

export interface AppState {
  [COMPONENT_HIGHLIGHT]?: {
    [key: string]: string[]
  }
  [MOUSE_TRACK]?: {
    [key: string]: {
      y: number
      x: number
    }
  }
}

export interface AppContextType {
  dispatch: Dispatch<{ type: string, payload: any }>
  helpers?: {
    handleComponentBlurred?: FocusEventHandler<HTMLInputElement>
    handleComponentFocused?: FocusEventHandler<HTMLInputElement>
  }
  state: AppState
}
