import React, { FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import { PositionValue } from '../../pages'

const Container = styled.div<{ pageY: PositionValue; pageX: PositionValue }>(
  ({ pageY, pageX }) => css`
    transform: translateY(${pageY}px) translateX(${pageX}px);
  `,
)

const User: FunctionComponent<{ pageX: PositionValue, pageY: PositionValue, email: string | null }> = ({ email, pageX, pageY  }) => {
  console.log(email, pageY, pageX)
  return <Container pageX={pageX} pageY={pageY}>email: {email}</Container>
}

export default User
