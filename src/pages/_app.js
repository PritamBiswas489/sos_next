import { Fragment, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/front/fonts/stylesheet.css";
import "@/assets/front/styles/style.scss";
import "@/styles/globals.css";

import 'react-international-phone/style.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { Provider } from 'react-redux';
import store from "@/redux/store";
import PageLoader from "@/component/loader";



export default function App({ Component, pageProps }) {
  return (
    <>
    <Provider store={store}>
        <Component {...pageProps} />

        <PageLoader
					color={'#11b0ca'}
					sx={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						backgroundColor: 'rgba(0, 0, 0, 0.9)',
						zIndex: 9999,
					}}
				/>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </Provider>
    </>
  );
}