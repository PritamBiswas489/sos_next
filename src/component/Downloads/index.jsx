import React, { useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import styles from "./index.module.scss";

import {
  FaAndroid,
  FaKey,
  FaUser,
  FaHome,
  FaFileAlt,
  FaIdCard,
  FaCar,
  FaPassport,
  FaCloudUploadAlt,
} from "react-icons/fa";

const DownloadsComponent = () => {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <Container fluid className={styles.page}>
      <h2 className={styles.title}>Downloads</h2>
      <p className={styles.subtitle}>
        Get the SOS app or request your license key
      </p>

      {/* HERO */}
      <div className={styles.heroCard}>
        <h3>📱 SOS Mobile App</h3>
        <p>
          Install the full-featured SOS Safety app or request a license code.
        </p>

        <div className={styles.actions}>
          <Button className={styles.androidBtn}>
            <span className={styles.btnIcon}>
              <FaAndroid />
            </span>
            <span>
              <small>Download for</small> Android APK
            </span>
          </Button>

          <Button className={styles.licenseBtn} onClick={() => setShow(true)}>
            <span className={styles.btnIcon}>
              <FaKey />
            </span>
            <span>
              <small>Request your</small> License Code
            </span>
          </Button>
        </div>
      </div>

      {/* INFO */}
      <Row className="mt-2 g-lg-4 g-4">
        <Col md={6}>
          <div className={styles.infoCard}>
            <p className={styles.label}>📦 APK Version</p>
            <h4>v4.2.1</h4>
            <span>Android 8.0+ • 48 MB</span>
          </div>
        </Col>

        <Col md={6}>
          <div className={styles.infoCard}>
            <p className={styles.label}>🔑 License Type</p>
            <h4>Premium Annual</h4>
            <span>Valid for 1 Year</span>
          </div>
        </Col>
      </Row>
      {/* FORM MODAL */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        dialogClassName={styles.customModal}
      >
        <Modal.Body className={styles.modalBody}>
          <div className={styles.modalHeader}>
            <h5>
              <FaKey className={styles.headerIcon} /> Request License Code
            </h5>
            <button className={styles.closeBtn} onClick={() => setShow(false)}>
              ✕
            </button>
          </div>

          <p className={styles.modalSubtitle}>
            Submit your details for verification. Your license will be issued
            within 24 hours.
          </p>

          {/* INPUTS */}
          <div className={styles.inputGroup}>
            <FaUser />
            <input placeholder="John Michael Doe" />
          </div>

          <div className={styles.inputGroup}>
            <FaHome />
            <input placeholder="123 Oak Street, New York, NY 10001" />
          </div>

          {/* DOCS */}
          <div className={styles.documents}>
            <p>Supporting Documents *</p>

            <div className={styles.docGrid}>
              <div className={`${styles.docItem} ${styles.active}`}>
                <FaFileAlt />
                <span>Utility Bill</span>
              </div>

              <div className={styles.docItem}>
                <FaIdCard />
                <span>National ID</span>
              </div>

              <div className={`${styles.docItem} ${styles.active}`}>
                <FaCar />
                <span>Driver's License</span>
              </div>

              <div className={styles.docItem}>
                <FaPassport />
                <span>Int'l Passport</span>
              </div>
            </div>
          </div>

          {/* UPLOAD */}
          <div className={styles.uploadBox}>
            <FaCloudUploadAlt />
            <p>
              Drop files here or <span>browse</span>
            </p>
            <small>PDF, JPG, PNG • Max 5MB each</small>
          </div>

          {/* SUBMIT */}
          <button
            className={styles.submitBtn}
            onClick={() => {
              setShow(false);
              setSuccess(true);
            }}
          >
            Submit Request →
          </button>
        </Modal.Body>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal
        show={success}
        onHide={() => setSuccess(false)}
        centered
        dialogClassName={styles.successModal}
      >
        <Modal.Body className={styles.successBody}>
          <div className={styles.successIcon}>✓</div>

          <h3>License Approved!</h3>
          <p>
            Your identity has been verified. Here is your unique license code.
          </p>

          <div className={styles.licenseBox}>
            <span className={styles.licenseLabel}>YOUR LICENSE KEY</span>

            <h2 className={styles.licenseKey}>
              SOS-4F7 <br /> K-X29M
            </h2>
            <h6>
              <span>Details</span>
            </h6>
            <div className={styles.licenseDetails}>
              <div>
                <small>Plan</small>
                <p>Premium Annual</p>
              </div>
              <div>
                <small>Valid Until</small>
                <p>Mar 13, 2027</p>
              </div>
              <div>
                <small>Devices</small>
                <p>Up to 5</p>
              </div>
            </div>
          </div>

          <button className={styles.copyBtn}>📋 Copy License Code</button>

          <small className={styles.footerText}>
            This code is tied to your account. Do not share it. <br />
            Need help? <span>Contact Support</span>
          </small>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DownloadsComponent;
