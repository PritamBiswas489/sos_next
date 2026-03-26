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

export const userListForNgo = async ({ page = 1, limit = 10 }) => {
  const response = await api.get(
    `auth-web/ngo/user-list-for-ngo?limit=${limit}&page=${page}`
  );
  return response;
};