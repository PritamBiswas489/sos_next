import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./index.module.scss";
import logo from "../../assets/front/images/logo.svg";

const Header = () => {
  return (
    <header className={styles.header}>
      <Container fluid="xxl">
        <Row className="align-items-center">
          {/* Logo */}
          <Col md={3}>
            <Link href="/" className={styles.logo}>
              <Image src={logo} alt="SOS Logo" width={133} height={30} />
            </Link>
          </Col>

          {/* Navigation */}
          <Col md={6}>
            <nav className={styles.nav}>
              <Link href="#">Features</Link>
              <Link href="#">Family</Link>
              <Link href="#">Safety</Link>
              <Link href="#">Pricing</Link>
            </nav>
          </Col>

          {/* Button */}
          <Col md={3} className="text-end">
            <Link href="#" className={styles.signin}>
              Sign In
            </Link>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
