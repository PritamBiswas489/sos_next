import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.scss";
import { FaMobileAlt, FaKey } from "react-icons/fa";

const OtpLoginModal = ({ show, handleClose }) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      dialogClassName={styles.customModal}
    >
      <Modal.Body className={styles.modalBody}>
        <div className={styles.card}>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className={styles.iconBox}>
                <FaMobileAlt />
              </div>

              <h3 className={styles.title}>Welcome Back</h3>

              <p className={styles.subtitle}>
                Enter your mobile number to continue
              </p>

              <div className={styles.label}>Mobile Number</div>

              <div className={styles.phoneBox}>
                <span>US +1</span>
                <input placeholder="000 000 0000" />
              </div>

              <button className={styles.primaryBtn} onClick={() => setStep(2)}>
                Send OTP →
              </button>

              <div className={styles.footerText}>
                New here? <span>Create account</span>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className={styles.iconBox}>
                <FaKey />
              </div>

              <h3 className={styles.title}>Enter OTP</h3>

              <p className={styles.subtitle}>
                6-digit code sent to +1 *** *** 8821
              </p>

              <div className={styles.otpLabel}>Verification Code</div>

              <div className={styles.otpContainer}>
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={val}
                    maxLength="1"
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                  />
                ))}
              </div>

              <button className={styles.primaryBtn}>Verify & Login ✓</button>

              <div className={styles.footerText}>
                Didn’t receive? <span>Resend (0:45)</span>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OtpLoginModal;
