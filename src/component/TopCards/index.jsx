import React from "react";
import { Row, Col } from "react-bootstrap";
import styles from "./index.module.scss";

const TopCards = () => {
  return (
    <Row className="mb-4">
      <Col md={4}>
        <div className={styles.card}>
          <p>Family Members</p>
          <h3>5</h3>
        </div>
      </Col>

      <Col md={4}>
        <div className={styles.card}>
          <p>Safety Score</p>
          <h3 className={styles.green}>98%</h3>
        </div>
      </Col>

      <Col md={4}>
        <div className={styles.card}>
          <p>Plan Status</p>
          <h3 className={styles.orange}>Active</h3>
        </div>
      </Col>
    </Row>
  );
};

export default TopCards;
