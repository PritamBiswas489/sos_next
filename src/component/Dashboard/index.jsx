import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from "./index.module.scss";
import { FaAndroid, FaKey } from "react-icons/fa";
import TopCards from "../TopCards";
import ProfileCard from "../ProfileCard";

const DashboardComponent = () => {
  return (
    <Container fluid className={styles.page}>
      <h2 className={styles.title}>My Account</h2>
      <p className={styles.subtitle}>
        Welcome back, John. Here's your safety overview.
      </p>

      <TopCards />
      <ProfileCard />
    </Container>
  );
};

export default DashboardComponent;
