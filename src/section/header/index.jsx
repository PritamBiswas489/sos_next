import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./index.module.scss";
import logo from "../../assets/front/images/logo.svg";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
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
                <Link href="#" className={styles.mobileSignin}>
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>

          {/* RIGHT - BUTTON */}
          <div className={styles.signinArea}>
            <Link href="#" className={styles.signin}>
              Sign In
            </Link>
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
  );
};

export default Header;
