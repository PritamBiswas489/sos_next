import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./index.module.scss";
import logo from "../../assets/front/images/logo.svg";
import { FaBars, FaTimes } from "react-icons/fa";
import OtpLoginModal from "@/component/OtpLoginModal";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <>
    <header className={styles.header}>
      <Container fluid="xxl">
        <Row className="align-items-center justify-content-between">
          {/* LEFT - LOGO */}
          <div className={styles.logoArea}>
            <Link href="/" className={styles.logo}>
              <Image src={logo} alt="SOS Logo" width={133} height={30} />
            </Link>
          </div>

          {/* CENTER - NAV */}
          <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
            <ul>
              <li>
                <Link href="#">Features</Link>
              </li>
              <li>
                <Link href="#">Family</Link>
              </li>
              <li>
                <Link href="#">Safety</Link>
              </li>
              <li>
                <Link href="#">Pricing</Link>
              </li>

              {/* MOBILE SIGN IN */}
              <li className={styles.mobileOnly}>
                 {isLoggedIn ? (
                    <Link href="/dashboard" className={styles.mobileSignin}>
                      My Account
                    </Link>
                  ) : (
                    <Link 
                      href="#" 
                      className={styles.mobileSignin}
                      onClick={() => {
                        setShowOtpModal(true);
                      }}
                      >
                      Sign In
                    </Link>
                  )}
              </li>
            </ul>
          </nav>

          {/* RIGHT - BUTTON */}
          <div className={styles.signinArea}>
            {isLoggedIn ? (
              <Link href="/dashboard" className={styles.signin}>
                My Account
              </Link>
            ) : (
              <Link 
                href="#" 
                className={styles.signin}
                onClick={() => {
                  setShowOtpModal(true);
                }}
              >
                Sign In
              </Link>
            )}
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </Row>
      </Container>
    </header>

    <OtpLoginModal
      show={showOtpModal}
      handleClose={() => setShowOtpModal(false)}
      setIsLoggedIn={setIsLoggedIn}
    />
    </>
  );
};

export default Header;
