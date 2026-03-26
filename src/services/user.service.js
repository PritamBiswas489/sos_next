import api from "@/config/authApi.config";

export const getCode = async () => {
  const response = await api.get("auth-web/user/license/get-code");
  return response;
};

export const submitKycDocuments = async (data) => {
  const response = await api.post("auth-web/user/kyc/submit-documents", 
    data,
    {
      timeout: 120000, // 2 min for large APK
    }
  );
  return response;
};

export const getKycDocuments = async () => {
  const response = await api.get("auth-web/user/kyc/get-documents");
  return response;
};