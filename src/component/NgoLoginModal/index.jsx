import React, { useRef } from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.scss";
import { FaMobileAlt, FaTimes } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import InputErrorMsg from "../InputErrorMsg/InputErrorMsg";
import { toast } from "react-toastify";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import { useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import { loginNgo } from "@/services/login.service";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { encryptData } from "@/utils/crypto";

const NgoLoginModal = ({ show, handleClose, openRegister }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const recaptchaRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    if (!data.captcha) {
      toast.error("Please verify captcha");
      return;
    }

    try {
      dispatch(SHOW_LOADER());
      const captchaRes = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ captcha: data.captcha }),
      });

      const captchaData = await captchaRes.json();

      if (!captchaRes.ok) {
        toast.error(captchaData.message || "Captcha failed");
        return;
      }
      const formData = {
        email: data.email,
        password: data.password,
      };

      const response = await loginNgo(formData);
      const resData = response.data;

      if (resData?.status === 200) {
        const accessToken = resData?.data?.accessToken;
        const refreshToken = resData?.data?.refreshToken;

        const role = resData?.data?.user?.role;
        const encryptedRole = encryptData(role);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", encryptedRole);

        toast.success(resData?.msg || "Login successful");

        router.push("/ngo/dashboard");
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
      recaptchaRef.current?.reset();
      reset({
        captcha: null,
      });
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
          <button className={styles.closeBtn} onClick={handleClose}>
            <FaTimes />
          </button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.iconBox}>
              <FaMobileAlt />
            </div>

            <h3 className={styles.title}>Welcome Back</h3>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <InputErrorMsg error={errors.email.message} color="#f00" />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <InputErrorMsg error={errors.password.message} color="#f00" />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Controller
                name="captcha"
                control={control}
                rules={{ required: "Captcha is required" }}
                render={({ field }) => (
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.captcha && (
                <InputErrorMsg error={errors.captcha.message} color="#f00" />
              )}
            </Form.Group>
            <button className={styles.primaryBtn} disabled={!watch("captcha")}>
              Login →
            </button>
            <div className={styles.footerText}>
              New here?{" "}
              <span onClick={openRegister} style={{ cursor: "pointer" }}>
                Create account
              </span>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NgoLoginModal;
