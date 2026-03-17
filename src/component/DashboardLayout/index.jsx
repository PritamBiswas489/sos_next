import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../Sidebar";
import styles from "./index.module.scss";
import { FaBars } from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.dashboard}>
      {/* ✅ MOBILE BUTTON (OUTSIDE GRID) */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FaBars />
      </button>

      <Row className="g-0">
        {/* SIDEBAR */}
        <Col md={3}>
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </Col>

        {/* MAIN */}
        <Col md={9} className={styles.main}>
          <Container fluid>{children}</Container>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardLayout;
