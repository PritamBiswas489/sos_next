import api from "@/config/api.config";

export const sendOtp = async (data) => {
  const response = await api.post("front/login/send-otp", data);
  return response;
};

export const verifyOtp = async (data) => {
  const response = await api.post("front/login/verify-otp", data);
  return response;
};

export const createUserAfterOtpVerification = async (data) => {
  const response = await api.post("front/login/create-user-after-otp-verification", data);
  return response;
};