import api from "@/config/authApi.config";

// export const ngoList = async (params) => {
//   try {
//     const response = await api.get("auth-web/admin/ngo-list", {
//       params, // ✅ send query params
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

export const ngoList = async ({ page = 1, limit = 10 }) => {
  try {
    const response = await api.get(
      `auth-web/admin/ngo-list?limit=${limit}&page=${page}`
    );
    return response;
  } catch (error) {
    return error;
  }
};