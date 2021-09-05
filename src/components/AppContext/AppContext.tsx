import { COMPONENT_HIGHLIGHT, MOUSE_TRACK } from 'components/AppContext/constants'
import React, { createContext } from 'react'

const AppContext = createContext({
  dispatch: ({ type, payload }: { type: string, payload: any }) => {
    console.warn(`${type} not available. Context hasn't been initialized.`)
  },
  state: {},
})

export default AppContext
