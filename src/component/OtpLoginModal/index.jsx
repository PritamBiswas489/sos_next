import React, { useEffect, useRef, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import styles from "./index.module.scss";
import { FaMobileAlt, FaKey, FaTimes } from "react-icons/fa";
import { PhoneInput } from "react-international-phone";
import { useForm, Controller } from "react-hook-form";
import InputErrorMsg from "../InputErrorMsg/InputErrorMsg";
import { toast } from "react-toastify";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import { useDispatch, useStore } from "react-redux";
import axios from "axios";
import {
  createUserAfterOtpVerification,
  sendOtp,
  verifyOtp,
} from "@/services/login.service";
import { useRouter } from "next/navigation";
import { encryptData } from "@/utils/crypto";
import { setUser } from "@/redux/userSlice";

const OtpLoginModal = ({ show, handleClose, setIsLoggedIn }) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [phone, setPhone] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [autoFillOTP, setAutoFillOTP] = useState("");
  const [defaultCountry, setDefaultCountry] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [tmpAccessToken, setTmpAccessToken] = useState(null);
  const [tmpRefreshToken, setTmpRefreshToken] = useState(null);
  const [tmpRole, setTmpRole] = useState(null);

  const store = useStore();

  useEffect(() => {
    fetch("/api/get-country")
      .then((res) => res.json())
      .then((data) => {
        console.log("Country code from API:", data?.country_code);  
        if (data?.country_code) {
          setDefaultCountry(data.country_code.toLowerCase());
        }
      })
      .catch(() => {});
  }, []);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
    setValue, // ✅ ADD THIS
  } = useForm();

  const onSubmit = async (data) => {
    // setStep(2);
    // startTimer();
    // return;

    try {
      dispatch(SHOW_LOADER());
      setPhone(data.phone);
      const formData = {
        phoneNumber: data.phone,
        messageType: "sms",
        appHash: "",
      };
      const response = await sendOtp(formData);
      const resData = response.data;

      if (resData?.status === 200) {
        toast.success(resData?.msg || "OTP sent successfully");
        setStep(2);
        setAutoFillOTP(resData?.data?.otpCode);
        startTimer();
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

  const onVerifyOtp = async (data) => {
    const otpValue = data.otp.join("");

    if (otpValue.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      dispatch(SHOW_LOADER());

      const formData = {
        phoneNumber: phone,
        otp: otpValue,
      };

      const response = await verifyOtp(formData);
      const resData = response.data;

      if (resData?.status === 200) {
        toast.success(resData?.msg || "OTP verified successfully");

        const formDataUser = {
          phoneNumber: phone,
        };
        const responseUser = await createUserAfterOtpVerification(formDataUser);
        const resDataUser = responseUser.data;

        if (resDataUser?.status === 200) {
          console.log("resDataUser?.data", resDataUser?.data);
          // return;

          const accessToken = resDataUser?.data?.accessToken;
          const refreshToken = resDataUser?.data?.refreshToken;
          const role = resDataUser?.data?.user?.role;
          const encryptedRole = encryptData(role);

          // console.log("Before dispatch:", resDataUser.data);
          localStorage.setItem(
            "userRecord",
            JSON.stringify(resDataUser.data.user)
          );
          dispatch(setUser(resDataUser.data.user));

          setTmpAccessToken(resDataUser?.data?.accessToken);
          setTmpRefreshToken(resDataUser?.data?.refreshToken);
          setTmpRole(encryptedRole);

          // console.log("resDataUser?.data?.user?.name", resDataUser?.data?.user?.name);
          // return;

          if(resDataUser?.data?.user?.name==null && resDataUser?.data?.user?.email==null){
            setStep(3);
            return;
          }
          

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("role", encryptedRole);

          toast.success("Login successful");
          
          router.push("/dashboard");
          handleClose();
          setIsLoggedIn(true);
        } else {
          const errorMessage =
            resDataUser?.error?.reason ||
            resDataUser?.error?.message ||
            "Something went wrong";
          toast.error(errorMessage);
        }
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

  const onUpdateProfile = async (data) => {
    try {
      dispatch(SHOW_LOADER());

      const accessToken = tmpAccessToken || "";
      const refreshToken = tmpRefreshToken || "";
      const encryptedRole = tmpRole || "";

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);

      // Optional image
      if (data.profileImage?.length > 0) {
        formData.append("profile_image", data.profileImage[0]);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_PROFILE_BASE_URL}api-mobile/auth/user/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            refreshtoken: refreshToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      if (response.data?.status === 200) {

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", encryptedRole);

        localStorage.setItem(
          "userRecord",
          JSON.stringify(response.data?.data)
        );

        toast.success(response.data?.message || "Profile updated successfully");
        router.push("/dashboard");

      } else {
        toast.error(response.data?.error?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.error?.message ||
        error?.message ||
        "Something went wrong"
      );
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimer(60);
    setCanResend(false);

    let count = 60;

    timerRef.current = setInterval(() => {
      count--;

      setTimer(count);

      if (count <= 0) {
        clearInterval(timerRef.current);
        setCanResend(true);
      }
    }, 1000);
  };

  const handleResend = async () => {
    try {
      dispatch(SHOW_LOADER());

      const formData = {
        phoneNumber: phone,
        messageType: "sms",
        appHash: "",
      };

      await sendOtp(formData);

      toast.success("OTP resent successfully");

      startTimer();
    } catch (error) {
      const resData = error?.response?.data;

      const errorMessage =
        resData?.error?.reason ||
        resData?.error?.message ||
        "Something went wrong";

      toast.error(errorMessage);
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (autoFillOTP) {
      const otpArray = autoFillOTP.toString().split("");

      otpArray.forEach((digit, index) => {
        setValue(`otp.${index}`, digit);
      });

      // optional focus
      document.getElementById(`otp-${otpArray.length - 1}`)?.focus();
    }
  }, [autoFillOTP]);

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
          {/* ✅ CLOSE BUTTON */}
          {(step === 1 || step === 2) && (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleClose}
            >
              <FaTimes />
            </button>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.iconBox}>
                <FaMobileAlt />
              </div>

              <h3 className={styles.title}>Welcome Back</h3>

              <p className={styles.subtitle}>
                Enter your mobile number to continue
              </p>

              <div className={styles.label}>Mobile Number</div>

              <div className={styles.phoneBox}>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Phone number is required",
                    validate: (value) =>
                      value?.replace(/\D/g, "").length >= 9 ||
                      "Enter valid phone number",
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      defaultCountry={defaultCountry}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="700 000 000"
                      className={styles.phoneInput}
                    />
                  )}
                />
              </div>

              {errors.phone && (
                <InputErrorMsg error={errors.phone?.message} color={`#f00`} />
              )}

              <button className={styles.primaryBtn}>Send OTP →</button>

              <div className={styles.footerText}>
                New here? <span>Create account</span>
              </div>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className={styles.iconBox}>
                <FaKey />
              </div>

              <h3 className={styles.title}>Enter OTP</h3>

              <p className={styles.subtitle}>4-digit code sent to {phone}</p>

              <div className={styles.otpLabel}>Verification Code</div>

              <form onSubmit={handleSubmit(onVerifyOtp)}>
                <div className={styles.otpContainer}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Controller
                      key={i}
                      name={`otp.${i}`}
                      control={control}
                      rules={{
                        required: "Required",
                        pattern: {
                          value: /^[0-9]$/,
                          message: "Only numbers",
                        },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          id={`otp-${i}`}
                          maxLength={1}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (!/^[0-9]?$/.test(value)) return;

                            field.onChange(value);

                            if (value && i < 3) {
                              document.getElementById(`otp-${i + 1}`)?.focus();
                            }

                            if (!value && i > 0) {
                              document.getElementById(`otp-${i - 1}`)?.focus();
                            }
                          }}
                        />
                      )}
                    />
                  ))}
                </div>

                {errors.otp && (
                  <p style={{ color: "red", marginTop: "5px" }}>
                    Please enter valid OTP
                  </p>
                )}

                <button type="submit" className={styles.primaryBtn}>
                  Verify & Login ✓
                </button>
              </form>

              <div className={styles.footerText}>
                Didn’t receive?{" "}
                {canResend ? (
                  <span
                    onClick={handleResend}
                    style={{ cursor: "pointer", color: "#11b0ca" }}
                  >
                    Resend OTP
                  </span>
                ) : (
                  <span>Resend (0:{timer < 10 ? `0${timer}` : timer})</span>
                )}
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 3 && (
            <>

              <h3 className={styles.title}>Profile Details</h3>

              <form onSubmit={handleSubmit(onUpdateProfile)} className="mt-4">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Name *"
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />
                  {errors.name && (
                    <InputErrorMsg error={errors.name.message} color="#f00" />
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email *"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                  {errors.email && (
                    <InputErrorMsg error={errors.email.message} color="#f00" />
                  )}
                </Form.Group>

                <Form.Group>
                  <Controller
                    name="profileImage"
                    control={control}
                    rules={{
                      validate: {
                        fileType: (files) => {
                          if (!files?.length) return true;

                          return (
                            files[0].type.startsWith("image/") ||
                            "Only image files are allowed"
                          );
                        },
                        fileSize: (files) => {
                          if (!files?.length) return true;

                          return (
                            files[0].size <= 2 * 1024 * 1024 ||
                            "Image size must be less than 2 MB"
                          );
                        },
                      },
                    }}
                    render={({ field: { onChange } }) => (
                      <>
                        <label className={styles.uploadBox}>
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className={styles.previewImage}
                            />
                          ) : (
                            <>
                              {/* <div className={styles.uploadIcon}>📷</div> */}
                              <h6>Upload Profile Photo</h6>
                              <span>PNG, JPG, JPEG (Max 2MB)</span>
                            </>
                          )}

                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                              const file = e.target.files[0];

                              onChange(e.target.files);

                              if (file) {
                                setImagePreview(URL.createObjectURL(file));
                              } else {
                                setImagePreview(null);
                              }
                            }}
                          />
                        </label>
                      </>
                    )}
                  />

                  {errors.profileImage && (
                    <InputErrorMsg
                      error={errors.profileImage.message}
                      color="#f00"
                    />
                  )}
                </Form.Group>

                <button type="submit" className={styles.primaryBtn}>
                  Submit & Login ✓
                </button>
              </form>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OtpLoginModal;
