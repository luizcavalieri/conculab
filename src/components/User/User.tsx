import React, { FunctionComponent } from 'react'
import { PositionValue } from '../../pages'

const getProps = ({ pageY, pageX }: { pageX: PositionValue, pageY: PositionValue }) => ({
  style: {
    transform:
      `translateY(${pageY && pageY * window.outerHeight + 30}px) translateX(${pageX && pageX * window.outerHeight + 30}px)`,
  }
})

const User: FunctionComponent<{ pageX: PositionValue, pageY: PositionValue, email: string | null }> = ({ email, pageX, pageY  }) => {
  return <div {...getProps({ pageX, pageY })}>{email}</div>
}

export default User
