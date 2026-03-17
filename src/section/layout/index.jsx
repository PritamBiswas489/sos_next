import React from "react";
import Header from "../header";
import Footer from "../footer";
// import NextTopLoader from 'nextjs-toploader';

const Layout = ({ children }) => {
  return (
    <>
      {/* <NextTopLoader color="#ff6600" /> */}
      <Header />
      {children}
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
