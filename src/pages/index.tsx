import type { NextPage } from 'next'
import { FocusEventHandler, useEffect, useState } from 'react'
import { io } from "socket.io-client"
import Head from 'next/head'
import Image from 'next/image'
import styled, { css } from 'styled-components'
import styles from '../styles/Home.module.css'
import User from '../components/User/User'
import env from '../config/environment.client'

export type PositionValue = null | number

interface InteractiveComponents {
  isFocused?: boolean
}

const COMPONENT_HIGHLIGHT = 'componentHighlight'
const MOUSE_MOVE = 'mouseMove'
const INPUT_FIELD_ID = 'inputField'
const INPUT_FIELD_USER_NAME = 'userName'

const FormGroup = styled.div<InteractiveComponents>(
  ({ isFocused }) => css`
    position: relative;
    display: flex;
    justify-content: space-around;
    
    > * {
      margin-left: 8px;
    }

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

// const { API_WS_PORT, API_WS_URL } = env

const socket = io({
  transports: ['websocket'],
})

const HighlightInput = styled.input<InteractiveComponents>(
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
            Welcome ????
          </h1>

          <div className={styles.description}>
            You can get started by:
            <div className={styles.body}>
              <ol>
                <li>Adding a new cookie to your browser with the chrome plugin
                  <code className={styles.code}>
                    <a href="https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg" target="__blank">
                      EditThisCookie
                    </a>
                  </code>.
                </li>
                <li>
                  Using the plugin from the step 1 you can add a new cookie with the following details:
                  <ul>
                    <li><strong>name</strong> <code className={styles.code}>user_email</code>.</li>
                    <li>in <strong>value</strong> you will add your email (or whatever you want to be seem by others).</li>
                    <li>Change the option <strong>No restriction</strong> to <code className={styles.code}>strict</code>.</li>
                    <li>And mark ??? the option bellow <code className={styles.code}>session</code>.</li>
                  </ul>
                </li>
                <li>
                  Refresh your browser.
                </li>
                <li>
                  Start moving your mouse, or try to edit the <code className={styles.code}>Description</code> field bellow if nobody else got the lock ???? ????.
                </li>
              </ol>
            </div>
          </div>

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
