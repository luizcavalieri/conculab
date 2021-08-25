import type { NextPage } from 'next'
import { FocusEventHandler, useEffect, useState } from 'react'
import { io } from "socket.io-client"
import Head from 'next/head'
import Image from 'next/image'
import styled, { css } from 'styled-components'
import styles from '../styles/Home.module.css'
import User from '../components/User/User'

export type PositionValue = null | number

const COMPONENT_HIGHLIGHT = 'componentHighlight'
const MOUSE_MOVE = 'mouseMove'
const INPUT_FIELD_ID = 'inputField'

const socket = io('ws://localhost:3006', {
  transports: ["websocket"],
})


const FormGroup = styled.div<{ isFocused: boolean }>(
  ({ isFocused }) => css`
    position: relative;

  ${isFocused && css`
    &::after {
      content: '';  
      width: 8px;
      height: 8px;
      border-radius: 4px;
      display: block;
      background: green;
      position: absolute;
      top: -4px;
      right: -4px;
    }
  `}
  `,
)
const HighlightInput = styled.input<{ isFocused: boolean }>(
  ({ isFocused }) => css`
    border: 3px solid ${isFocused ? 'lightgreen' : 'black'};
    
    &:disabled {
      cursor: not-allowed;
      background: grey;
    }
  `,
)
const getCookie = (name: string): string | null => {
  const nameLenPlus = (name.length + 1);
  return document.cookie
    .split(';')
    .map(c => c.trim())
    .filter(cookie => {
      return cookie.substring(0, nameLenPlus) === `${name}=`;
    })
    .map(cookie => {
      return decodeURIComponent(cookie.substring(nameLenPlus));
    })[0] || null;
}

const Home: NextPage = () => {
  const [position, setPosition] = useState<{ email: string | null; pageX: PositionValue; pageY: PositionValue }>({ email: null, pageX: null, pageY: null })
  const [components, setComponent] = useState({ [INPUT_FIELD_ID]: null })
  const handleMouseMove = ({ pageX, pageY }: MouseEvent) => {
    socket.emit('mouseover', { type: MOUSE_MOVE, pageX, pageY, email: getCookie('user_email') })
  }

  const handleComponentFocused: FocusEventHandler<HTMLInputElement> = ({ currentTarget: { id } }) => {
    socket.emit('mouseover', { type: COMPONENT_HIGHLIGHT, details: { id, isFocus: true, email: getCookie('user_email') }})
  }

  const handleComponentBlurred: FocusEventHandler<HTMLInputElement> = ({ currentTarget: { id } }) => {
    socket.emit('mouseover', { type: COMPONENT_HIGHLIGHT, details: { id, isFocus: false, email: null }})
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    })

    socket.on('newhighlight', (data) => {

      switch (data.type) {
        case MOUSE_MOVE:
          setPosition(data)
          break
        case COMPONENT_HIGHLIGHT:
          console.log({ data })
          console.log('COMPONENT HIGHLIGHT')
          setComponent({ ...components, [data?.details?.id]: data?.details?.email })
          break
        default:
          return

      }
    })

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      console.log('Remove event listener')
      window.removeEventListener('mousemove', handleMouseMove, false)
    }
  }, [])

  return (
    <>
      <User {...position} />
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome 🏖
          </h1>

          <p className={styles.description}>
            Get started by editing{' '}
            <code className={styles.code}>pages/index.js</code>
          </p>

          <FormGroup isFocused={!!components[INPUT_FIELD_ID]}>
            <label htmlFor={INPUT_FIELD_ID}>Description</label>
            <HighlightInput
              id={INPUT_FIELD_ID}
              disabled={!!components[INPUT_FIELD_ID]}
              isFocused={!!components[INPUT_FIELD_ID]}
              onBlur={handleComponentBlurred}
              onFocus={handleComponentFocused}
              type="text"
            />
          </FormGroup>


        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div>
    </>
  )
}

export default Home
