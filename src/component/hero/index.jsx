import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from "./index.module.scss";

import { IoIosAlert } from "react-icons/io";
import { FaMapMarkerAlt, FaUsers, FaBell, FaLock } from "react-icons/fa";
import { useRouter } from "next/router";
import OtpLoginModal from "../OtpLoginModal";

const features = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Live Location",
    desc: "Real-time GPS tracking",
    link: "/live-location",
  },
  {
    icon: <IoIosAlert />,
    title: "SOS Alert",
    desc: "One-tap emergency",
    link: "/sos-alert",
  },
  {
    icon: <FaUsers />,
    title: "Family Circle",
    desc: "Group safety network",
    link: "/family-circle",
  },
  {
    icon: <FaBell />,
    title: "Alerts",
    desc: "Arrival notifications",
    link: "/alerts",
  },
  {
    icon: <FaLock />,
    title: "Privacy First",
    desc: "End-to-end encrypted",
    link: "/privacy",
  },
];

const Hero = () => {
  const router = useRouter();
  const [showOtpModal, setShowOtpModal] = useState(false);
  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.badge}>Trusted by 50M+ Families</div>

        <h1 className={styles.title}>
          Stay Connected.
          <br />
          <span>Stay Safe.</span> Always.
        </h1>

        <p className={styles.subtitle}>
          Real-time location sharing, emergency SOS alerts, and intelligent
          safety features for every member of your family.
        </p>

        <div className={styles.buttons}>
          <Button className={styles.primaryBtn}>🚀 Get Started Free</Button>

          <Button className={styles.secondaryBtn}>Watch Demo</Button>
        </div>
      </Container>

      {/* Features Row */}
      <section className={styles.featuresSection}>
        <Container className={styles.heroContent}>
          <Row className="g-0 justify-content-center">
            {features.map((item, index) => (
              <Col md={2} col xs={2} key={index} className={styles.col}>
                <div
                  className={styles.card}
                  // onClick={() => {
                  //   if (item.title === "Family Circle") {
                  //     setShowOtpModal(true);
                  //   } else {
                  //     router.push(item.link);
                  //   }
                  // }}
                >
                  <div className={styles.icon}>{item.icon}</div>

                  <h6>{item.title}</h6>

                  <p>{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <OtpLoginModal
        show={showOtpModal}
        handleClose={() => setShowOtpModal(false)}
      />
    </section>
  );
};

export default Hero;
