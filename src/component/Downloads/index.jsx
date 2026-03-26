import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
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
import { getCode, getKycDocuments, submitKycDocuments } from "@/services/user.service";
import { useForm } from "react-hook-form";
import InputErrorMsg from "../InputErrorMsg/InputErrorMsg";

const DownloadsComponent = () => {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const [apkFile, setApkFile] = useState(null);
  const [data, setData] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [file, setFile] = useState(null);
  const [kycdata, setKycdata] = useState([]);
  const [licenseCode, setLicenseCode] = useState('');
  
  

    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
      reset,
    } = useForm();
   
   
    const handleDocSelect = (doc) => {
        setSelectedDoc(doc);
    };
   
    const handleFileChange = (e) => {
        const selected = e.target.files[0];

        if (!selected) return;

        const validTypes = ["image/jpeg", "image/png", "application/pdf"];

        if (!validTypes.includes(selected.type)) {
        toast.error("Only PDF, JPG, PNG allowed");
        return;
        }

        if (selected.size > 5 * 1024 * 1024) {
        toast.error("Max file size is 5MB");
        return;
        }

        setFile(selected);
    };
   
    const onSubmit = async (data) => {
        if (!selectedDoc) {
            toast.error("Please select a document");
            return;
        }

        if (!file) {
            toast.error("Please upload a file");
            return;
        }

        // console.log('data', selectedDoc);return;

        try {
            dispatch(SHOW_LOADER());
            

            // const formData = new FormData();
            // formData.append("fullName", data.fullName);
            // formData.append("residentialAddress", data.residentialAddress);
            // formData.append("documentType", selectedDoc);
            // formData.append("document", file);
            
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("residentialAddress", data.residentialAddress);
            formData.append("documentType", selectedDoc);

            if (file) {
              formData.append("document", file);
            }

            const response = await submitKycDocuments(formData);

            toast.success(response?.data?.message || "Success");

            
            setShow(false);
            reset();
            setSelectedDoc(null);
            setFile(null);

        } catch (error) {
            const resData = error?.response?.data;

            const errorMessage =
            resData?.error?.message ||
            resData?.error?.reason ||
            error?.message ||
            "Something went wrong";

            toast.error(errorMessage);
        } finally {
            dispatch(HIDE_LOADER());
        }
    };

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

  const getlicenceCode = async() => {
    try {
      dispatch(SHOW_LOADER());

      const response = await getCode();

      const resData = response.data;

      if (resData?.status === 200) {
        if(resData?.data?.licenseCode===null){
          setShow(true);
          getDocuments();
        }else{
          setSuccess(true);
          setLicenseCode(resData?.data?.licenseCode);
        }
      } else {
        toast.error(resData?.error?.message || "");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(HIDE_LOADER());
    }
  }

  const getDocuments = async() => {
    try {
      dispatch(SHOW_LOADER());

      const response = await getKycDocuments();

      const resData = response.data;

      if (resData?.status === 200) {
        setKycdata(resData?.data);
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
    if (kycdata && kycdata?.id) {
      reset({
        fullName: kycdata.name || "",
        residentialAddress: kycdata.address || "",
      });
      setSelectedDoc(kycdata.document_type || null);
      setFile({
        name: kycdata.document_originalname,
        url: kycdata.documentUrl,
        isExisting: true,
      });
    }
  }, [kycdata, reset]);

  useEffect(() => {
  const loadExistingFile = async () => {
    if (kycdata?.documentUrl) {
      const res = await fetch(kycdata.documentUrl);
      const blob = await res.blob();

      const existingFile = new File([blob], kycdata.document_originalname, {
        type: blob.type,
      });

      existingFile.isExisting = true; // mark it

      setFile(existingFile);
    }
  };

  loadExistingFile();
}, [kycdata]);

const handleCopy = async () => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(licenseCode);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = licenseCode;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  toast.success("License code copied!");
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

          <Button className={styles.licenseBtn} onClick={() => getlicenceCode()}>
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
              <button
                className={styles.closeBtn}
                onClick={() => setShow(false)}
              >
                ✕
              </button>
            </div>

            <p className={styles.modalSubtitle}>
              Submit your details for verification. Your license will be issued
              within 24 hours.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* NAME */}
              <Form.Group className={`mb-4 ${styles.requestCcode}`}>
                <div className={styles.inputGroup}>
                  <FaUser />
                  <input
                    type="text"
                    placeholder="John Michael Doe"
                    {...register("fullName", {
                      required: "Full Name is required",
                    })}
                  />
                </div>
                {errors.fullName && (
                  <InputErrorMsg className={styles.errorStyle} error={errors.fullName.message} color="#f00" />
                )}
              </Form.Group>

              {/* ADDRESS */}
              <Form.Group className={`mb-4 ${styles.requestCcode}`}>
              <div className={styles.inputGroup}>
                <FaHome />
                <input
                  type="text"
                  placeholder="Address"
                  {...register("residentialAddress", {
                    required: "Address is required",
                  })}
                />
              </div>
              {errors.residentialAddress && (
                <InputErrorMsg
                  error={errors.residentialAddress.message}
                  color="#f00"
                  className={styles.errorStyle}
                />
              )}
              </Form.Group>

              {/* DOCS */}
              <div className={styles.documents}>
                <p>Supporting Documents *</p>

                <div className={styles.docGrid}>
                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "Utility Bill" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("Utility Bill")}
                  >
                    <FaFileAlt />
                    <span>Utility Bill</span>
                  </div>

                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "National ID" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("National ID")}
                  >
                    <FaIdCard />
                    <span>National ID</span>
                  </div>

                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "Driver's License" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("Driver's License")}
                  >
                    <FaCar />
                    <span>Driver's License</span>
                  </div>

                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "Int'l Passport" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("Int'l Passport")}
                  >
                    <FaPassport />
                    <span>Int'l Passport</span>
                  </div>
                </div>
              </div>

              {/* UPLOAD */}
              <div className={styles.uploadBox}>
                <FaCloudUploadAlt />
                <p>
                  Drop files here or{" "}
                  <span
                    onClick={() =>
                      document.getElementById("fileInput").click()
                    }
                    style={{ cursor: "pointer" }}
                  >
                    browse
                  </span>
                </p>
                <small>PDF, JPG, PNG • Max 5MB</small>

                <input
                  id="fileInput"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />

                {file && (
                  <div className="mt-2 small text-muted">
                    Selected: {file.name}
                  </div>
                )}
              </div>

              {/* SUBMIT */}
              <button type="submit" className={styles.submitBtn}>
                Submit Request →
              </button>
            </form>
          </Modal.Body>
        </Modal>



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
              {licenseCode}
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

          <button className={styles.copyBtn} onClick={handleCopy}>
            📋 Copy License Code
          </button>

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
