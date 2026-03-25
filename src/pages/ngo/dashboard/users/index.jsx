import React, { useState } from "react";
import { Container, Row, Button, Modal } from "react-bootstrap";
import styles from "./index.module.scss";

import {
  FaKey,
  FaUser,
  FaHome,
  FaFileAlt,
  FaIdCard,
  FaCar,
  FaPassport,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import DashboardLayout from "@/component/DashboardLayout";
import { Controller, useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { ngoCreateUser } from "@/services/ngo.service";

export default function Downloads() {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ NEW STATES
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  // ✅ DOC SELECT (ONLY ONE)
  const handleDocSelect = (doc) => {
    setSelectedDoc(doc);
  };

  // ✅ FILE SELECT
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
    // ✅ VALIDATIONS
    if (!selectedDoc) {
      toast.error("Please select a document");
      return;
    }

    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    try {
        dispatch(SHOW_LOADER());

        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("phoneNumber", data.phone);
        formData.append("emailAddress", data.emailAddress);
        formData.append("residentialAddress", data.residentialAddress);
        formData.append("documentType", selectedDoc);
        formData.append("document", file);

        console.log("FORM DATA:", formData);

        const response = await ngoCreateUser(formData);
        const resData = response.data;

        console.log('resData', resData);

        if (resData?.status === 200) {
            toast.success(resData?.message);
            resetForm();
            setShow(false);
            reset();
            setSelectedDoc(null);
            setFile(null);
        } else {
            const errorMessage =
            resData?.error?.reason ||
            resData?.error?.message ||
            "Something went wrong";
            toast.error(errorMessage);
        }
    } catch (error) {
        console.log('error', error)
      toast.error("Something went wrong");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <h2 className={styles.title}>Users</h2>

        <Button variant="success" onClick={() => setShow(true)}>
          Create User
        </Button>

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
                <InputErrorMsg error={errors.fullName.message} color="#f00" />
              )}

              {/* PHONE */}
              <div className={styles.phoneBox}>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue="+254"
                  rules={{
                    required: "Phone number is required",
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      defaultCountry="KE"
                      value={field.value}
                      onChange={field.onChange}
                      className={styles.phoneInput}
                    />
                  )}
                />
              </div>
              {errors.phone && (
                <InputErrorMsg
                  error={errors.phone.message}
                  color="#f00"
                />
              )}

              {/* EMAIL */}
              <div className={`${styles.inputGroup} mt-3`}>
                <MdEmail />
                <input
                  type="email"
                  placeholder="Email"
                  {...register("emailAddress", {
                    required: "Email is required",
                  })}
                />
              </div>
              {errors.emailAddress && (
                <InputErrorMsg
                  error={errors.emailAddress.message}
                  color="#f00"
                />
              )}

              {/* ADDRESS */}
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
                />
              )}

              {/* DOCS */}
              <div className={styles.documents}>
                <p>Supporting Documents *</p>

                <div className={styles.docGrid}>
                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "utility" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("utility")}
                  >
                    <FaFileAlt />
                    <span>Utility Bill</span>
                  </div>

                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "nid" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("nid")}
                  >
                    <FaIdCard />
                    <span>National ID</span>
                  </div>

                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "license" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("license")}
                  >
                    <FaCar />
                    <span>Driver's License</span>
                  </div>

                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "passport" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("passport")}
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
                <small>PDF, JPG, PNG • Max 5MB each</small>

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
      </Container>
    </DashboardLayout>
  );
}