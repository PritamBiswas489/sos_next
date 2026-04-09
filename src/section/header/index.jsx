import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import styles from "./index.module.scss";
// import logo from "../../assets/front/images/logo.svg";
import logo from "../../assets/front/images/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";
import OtpLoginModal from "@/component/OtpLoginModal";
import NgoLoginModal from "@/component/NgoLoginModal";
import NgoRegisterModal from "@/component/NgoRegisterModal";
import { useRouter } from "next/router";
import { decryptData } from "@/utils/crypto";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [ngoLoginModal, setNgoLoginModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log('token', token);

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleDashboard = () => {
    
    const encryptedRole = localStorage.getItem("role");

    if (!encryptedRole) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

      window.location.href = "/";
      return;
    }

    const role = decryptData(encryptedRole);

    if (role === "ADMIN") {
      router.push("/site-admin/dashboard");
    } else if (role === "USER") {
      router.push("/dashboard");
    } else if (role === "NGO") {
      router.push("/ngo/dashboard");
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      window.location.href = "/";
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("role");

  //   router.push("/");
  // };

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
                {/* <li className={styles.mobileOnly}>
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
                </li> */}
              </ul>
            </nav>

            {/* RIGHT - BUTTON */}
            <div className={styles.signinArea}>
              {isLoggedIn ? (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className={styles.signin}
                  >
                    My Account
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                     <Dropdown.Item
                      href="#"
                      onClick={handleDashboard}
                    >
                      Dashboard
                    </Dropdown.Item>
                    {/* <Dropdown.Item
                      href="#"
                      onClick={handleLogout}
                    >
                      Logout
                    </Dropdown.Item> */}
                  </Dropdown.Menu>
                </Dropdown>
                
              ) : (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className={styles.signin}
                  >
                    Sign In
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      href="#"
                      onClick={() => {
                        setShowOtpModal(true);
                      }}
                    >
                      As a User
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#"
                      onClick={() => {
                        setNgoLoginModal(true);
                      }}
                    >
                      As a NGO
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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

      <NgoLoginModal
        show={ngoLoginModal}
        handleClose={() => setNgoLoginModal(false)}
        openRegister={() => {
          setNgoLoginModal(false);
          setShowRegister(true);
        }}
      />

      <NgoRegisterModal
        show={showRegister}
        handleClose={() => setShowRegister(false)}
        openLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
};

export default Header;
