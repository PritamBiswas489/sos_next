import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.scss";
import { FaMobileAlt, FaKey } from "react-icons/fa";
import { PhoneInput } from "react-international-phone";
import { useForm, Controller } from "react-hook-form";
import InputErrorMsg from "../InputErrorMsg/InputErrorMsg";
import { toast } from "react-toastify";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import { useDispatch } from "react-redux";
import Form from 'react-bootstrap/Form';
import {
  createUserAfterOtpVerification,
  registerNgo,
  sendOtp,
  verifyOtp,
} from "@/services/login.service";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";

const NgoRegisterModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm();

  // Timer functions (example – you can implement as needed)
  const startTimer = () => {
    // your timer logic here
  };

  // Manual validation for the certificate file
  const validateCertificateFile = (file) => {
    if (!file) {
      toast.error("Certificate is required");
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return false;
    }
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG or PDF allowed");
      return false;
    }
    return true;
  };

  const onSubmit = async (data) => {
    
    if (!captchaValue) {
      toast.error("Please verify captcha");
      return;
    }

    // Validate the certificate file
    if (!validateCertificateFile(certificateFile)) {
      return;
    }

    try {
      dispatch(SHOW_LOADER());

      // Verify captcha with your backend (optional, but recommended)
      const captchaRes = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ captcha: captchaValue }),
      });
      const captchaData = await captchaRes.json();
      if (!captchaRes.ok) {
        toast.error(captchaData.message || "Captcha failed");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber); 
      formData.append("password", data.password);
      formData.append("numberOfUser", data.numberOfUser);
      formData.append("certificate", certificateFile);

    //   console.log('formData', formData);return;

      const response = await registerNgo(formData);
      const resData = response.data;

      if (resData?.status === 200) {
        toast.success(resData?.message);
        resetForm();
        handleClose();
      } else {
        const errorMessage =
          resData?.error?.reason ||
          resData?.error?.message ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      const resData = error?.response?.data;
      const errorMessage =
        resData?.error?.reason ||
        resData?.error?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  const resetForm = () => {
    reset({
      name: "",
      email: "",
      phoneNumber: "+254",
      password: "",
      numberOfUser: "",
      captcha: "",
    });
    setCertificateFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setCaptchaValue(null);
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className={styles.title}>Registration</h3>

            {/* Name */}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <InputErrorMsg error={errors.name?.message} color={`#f00`} />
              )}
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <InputErrorMsg error={errors.email?.message} color={`#f00`} />
              )}
            </Form.Group>

            {/* Phone Number */}
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Phone Number</Form.Label>
              <div className={styles.phoneBox}>
                <Controller
                  name="phoneNumber"   // changed from "phone" to "phoneNumber"
                  control={control}
                  defaultValue="+254"
                  rules={{
                    required: "Phone number is required",
                    validate: (value) =>
                      value?.replace(/\D/g, "").length >= 9 ||
                      "Enter valid phone number",
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      defaultCountry="KE"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="700 000 000"
                      className={styles.phoneInput}
                    />
                  )}
                />
              </div>
              {errors.phoneNumber && (
                <InputErrorMsg error={errors.phoneNumber?.message} color={`#f00`} />
              )}
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" controlId="formBasicpassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <InputErrorMsg error={errors.password?.message} color={`#f00`} />
              )}
            </Form.Group>

            {/* Number of Users */}
            <Form.Group className="mb-3" controlId="formBasicusers">
              <Form.Label>Number Of User</Form.Label>
              <Form.Select
                aria-label="Select number of users"
                defaultValue=""
                {...register("numberOfUser", {
                  required: "Number Of User is required",
                })}
              >
                <option value="">Select Option</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
                <option value="1500">1500</option>
                <option value="2000">2000</option>
              </Form.Select>
              {errors.numberOfUser && (
                <InputErrorMsg error={errors.numberOfUser?.message} color="#f00" />
              )}
            </Form.Group>

            {/* Certificate (File) */}
            <Form.Group className="mb-3">
              <Form.Label>Certificate</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setCertificateFile(file);
                  // You can also trigger manual validation here if desired
                }}
                accept="image/jpeg,image/png,application/pdf"
              />
              {/* Optionally show file name after selection */}
              {certificateFile && (
                <div className="mt-1 small text-muted">
                  Selected: {certificateFile.name}
                </div>
              )}
            </Form.Group>

            {/* reCAPTCHA */}
            <Form.Group className="mb-3">
              <Controller
                name="captcha"
                control={control}
                rules={{ required: "Captcha is required" }}
                render={({ field }) => (
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={(value) => {
                      field.onChange(value);
                      setCaptchaValue(value);
                    }}
                  />
                )}
              />
              {errors.captcha && (
                <InputErrorMsg error={errors.captcha.message} color="#f00" />
              )}
            </Form.Group>

            <button className={styles.primaryBtn}>Submit</button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NgoRegisterModal;