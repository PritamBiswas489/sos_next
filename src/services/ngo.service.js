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

export const contactAdmin = async (data) => {
  const response = await api.post("auth-web/user/contact-admin", data);
  return response;
};


export const sOsList = async (params) => {
  const { page = 1, limit = 10, mobileNumber, status, fromDate, toDate } = params;
  
  const queryParams = new URLSearchParams({
    limit,
    page,
  });

  // Add optional filters
  if (mobileNumber) queryParams.append("mobileNumber", mobileNumber);
  if (status) queryParams.append("status", status);
  if (fromDate) queryParams.append("fromDate", fromDate);
  if (toDate) queryParams.append("toDate", toDate);

  const response = await api.get(
    `auth-web/ngo/ngo-sos-list?${queryParams.toString()}`
  );
  return response;
};