import api from "@/config/api.config";

export const sendOtp = async (data) => {
  const response = await api.post("front-web/login/send-otp", data);
  return response;
};

export const verifyOtp = async (data) => {
  const response = await api.post("front-web/login/verify-otp", data);
  return response;
};

export const createUserAfterOtpVerification = async (data) => {
  const response = await api.post("front-web/login/create-user-after-otp-verification", data);
  return response;
};

export const registerNgo = async (data) => {
  const response = await api.post("front-web/ngo/register-ngo", data);
  return response;
};

export const loginNgo = async (data) => {
  const response = await api.post("front-web/ngo/login-ngo", data);
  return response;
};

export const loginAdminUser = async (data) => {
  const response = await api.post("front-web/admin/login-admin-user", data);
  return response;
};


