import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import {
  FaFire,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import logo from "../../assets/front/images/logo.svg";
import styles from "./index.module.scss";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.statsWrapper}>
          <Row className={styles.statsSection}>
            <Col lg md sm={6} xs={6} className="text-center">
              <div className={styles.stat}>Footer</div>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
