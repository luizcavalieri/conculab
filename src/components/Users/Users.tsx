import React, { useContext } from 'react'
import AppContext from 'components/AppContext/AppContext'
import { MOUSE_TRACK } from 'components/AppContext/constants'
import User from 'components/User/User'

const Users = () => {
  const { state } = useContext(AppContext)
  const { [MOUSE_TRACK]: position } = state

  if (!position) return null

  return Object.keys(position).map(user =>
    <User key={user} email={user} pageX={position[user].x} pageY={position[user].y} />
  )
}

export default Users
