import React, { useEffect, useState } from "react";
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
import { donwloadLatestApk } from "@/services/common.service";
import { useDispatch } from "react-redux";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";

const DownloadsComponent = () => {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
   const [apkFile, setApkFile] = useState(null);
   const [data, setData] = useState([]);

  const downloadApk = async() => {
      try {
        dispatch(SHOW_LOADER());
  
        const response = await donwloadLatestApk();
  
        const resData = response.data;
  
        if (resData?.status === 200) {
          // toast.success(response?.data?.message || "Success");
          setApkFile(resData?.data?.apkFile);
          setData(resData?.data);
        } else {
          toast.error(resData?.error?.message || "");
        }
      } catch (error) {
        toast.error(error?.message || "Something went wrong");
      } finally {
        dispatch(HIDE_LOADER());
      }
  }

  useEffect(() => {
    downloadApk();
  }, []);

  const downloadApkfile = () => {
      if (!apkFile) {
        toast.error("APK not available");
        return;
      }
      const link = document.createElement("a");
      link.href = apkFile;
      link.download = `sos-app-${data?.version || "latest"}.apk`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

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
          <Button className={styles.androidBtn} onClick={() => downloadApkfile()}>
            <span className={styles.btnIcon}>
              <FaAndroid />
            </span>
            <span>
              <small>Download for</small> Android APK
            </span>
          </Button>

          {/* <Button className={styles.licenseBtn} onClick={() => setShow(true)}>
            <span className={styles.btnIcon}>
              <FaKey />
            </span>
            <span>
              <small>Request your</small> License Code
            </span>
          </Button> */}
        </div>
      </div>

      {/* INFO */}
      <Row className="mt-2 g-lg-4 g-4">
        <Col md={6}>
          <div className={styles.infoCard}>
            <p className={styles.label}>📦 APK Version</p>
            <h4>{data?.version}</h4>
            {/* <span>Android 8.0+ • 48 MB</span> */}
          </div>
        </Col>

        <Col md={6}>
          <div className={styles.infoCard}>
            <p className={styles.label}>🔑 License Type</p>
            <h4>Premium Annual</h4>
            {/* <span>Valid for 1 Year</span> */}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DownloadsComponent;
