import api from "@/config/authApi.config";

export const ngoCreateUser = async (data) => {
  const response = await api.post("auth-web/ngo/ngo-create-user", 
    data,
    {
      timeout: 120000, // 2 min for large APK
    }
  );
  return response;
};