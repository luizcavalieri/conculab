import 'styles/globals.css'
import AppContextProvider from 'components/AppContext/AppContextProvider'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  )
}
export default MyApp
