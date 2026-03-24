import React, { useRef } from "react";
import styles from "./index.module.scss";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { loginAdminUser, loginNgo } from "@/services/login.service";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { encryptData } from "@/utils/crypto";

const LoginPage = () => {
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
    

    try {
      dispatch(SHOW_LOADER());

      // if (!data.captcha) {
      //   toast.error("Please verify captcha");
      //   return;
      // }
      // const captchaRes = await fetch("/api/verify-captcha", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ captcha: data.captcha }),
      // });

      // const captchaData = await captchaRes.json();

      // if (!captchaRes.ok) {
      //   toast.error(captchaData.message || "Captcha failed");
      //   return;
      // }

      const payload = {
        email: data.email,
        password: data.password,
      };

      const response = await loginAdminUser(payload);
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
        router.push("/site-admin/dashboard");
        // console.log('resData', resData?.data);
      } else {
        toast.error(
          resData?.error?.message || "Invalid email or password"
        );
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(HIDE_LOADER());

      recaptchaRef.current?.reset();
      reset({
        email: "",
        password: "",
        captcha: null,
      });
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className={styles.card}>
              <h3 className={styles.title}>Admin Login</h3>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                  {errors.email && (
                    <InputErrorMsg error={errors.email.message} />
                  )}
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <InputErrorMsg error={errors.password.message} />
                  )}
                </Form.Group>

                {/* <Form.Group className="mb-3">
                  <Controller
                    name="captcha"
                    control={control}
                    rules={{ required: "Captcha is required" }}
                    render={({ field }) => (
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={
                          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                        }
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                  {errors.captcha && (
                    <InputErrorMsg error={errors.captcha.message} />
                  )}
                </Form.Group> */}

                {/* Button */}
                <button
                  className={styles.loginBtn}
                  // disabled={!watch("captcha")}
                >
                  Login →
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;