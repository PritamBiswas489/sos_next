import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../Sidebar";
import TopCards from "../TopCards";
import ProfileCard from "../ProfileCard";
import styles from "./index.module.scss";

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.dashboard}>
      <Row className="g-0">
        <Col md={3}>
          <Sidebar />
        </Col>

        <Col md={9} className={styles.main}>
          <Container fluid>{children}</Container>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardLayout;
