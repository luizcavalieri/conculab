import React, { FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import { PositionValue } from '../../pages'

const Container = styled.div<{ pageY: PositionValue; pageX: PositionValue }>(
  ({ pageY, pageX }) => css`
    transform: translateY(${pageY}px) translateX(${pageX}px);
  `,
)

const User: FunctionComponent<{ pageX: PositionValue, pageY: PositionValue, email: string | null }> = ({ email, pageX, pageY  }) => {
  return <Container pageX={pageX && pageX + 10} pageY={pageY && pageY + 10}>email: {email}</Container>
}

export default User
