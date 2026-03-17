import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/front/fonts/stylesheet.css";
import "@/assets/front/styles/style.scss";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
