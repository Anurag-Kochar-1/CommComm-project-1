import '../styles/globals.css'
import type { AppProps } from 'next/app'
import BaseOneLayout from '../components/layouts/BaseOne/BaseOneLayout'
import { Provider } from 'react-redux'
import store from "../redux/store"

import 'react-toastify/dist/ReactToastify.css';
import 'react-alice-carousel/lib/alice-carousel.css';
import { ToastContainer } from 'react-toastify';

// import { Bebas_Neue } from "@next/font/google"
// import { Roboto } from "@next/font/google"


export default function App({ Component, pageProps }: AppProps) {

  return (
    <Provider store={store}>
      <BaseOneLayout >
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BaseOneLayout>
    </Provider>
  )
}
