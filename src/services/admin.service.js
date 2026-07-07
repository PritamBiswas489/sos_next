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
  const response = await api.get(
    `auth-web/admin/ngo-list?limit=${limit}&page=${page}`
  );
  return response;
};

export const verifyNgo = async (data) => {
  const response = await api.post("auth-web/admin/verify-ngo", data);
  return response;
};

export const rejectNgo = async (data) => {
  const response = await api.post("auth-web/admin/reject-ngo", data);
  return response;
};

export const changeStatusNgo = async (data) => {
  const response = await api.post("auth-web/admin/change-status", data);
  return response;
};

export const ngoUpgradeUserLimit = async (data) => {
  const response = await api.post("auth-web/admin/ngo-upgrade-user-limit", data);
  return response;
};

export const apkReleases = async ({ page = 1, limit = 10 }) => {
  const response = await api.get(
    `auth-web/admin/apk-releases?limit=${limit}&page=${page}`
  );
  return response;
};

export const uploadApk = async (data) => {
  const response = await api.post("auth-web/admin/upload-apk", 
    data,
    {
      timeout: 120000, // 2 min for large APK
    }
  );
  return response;
};

export const userList = async ({ page = 1, limit = 10 }) => {
  const response = await api.get(
    `auth-web/admin/user-list?limit=${limit}&page=${page}`
  );
  return response;
};
export const changeUserStatus = async (data) => {
  const response = await api.post("auth-web/admin/change-user-status", data);
  return response;
};
export const pendingKycDocuments = async ({ page = 1, limit = 10 }) => {
  const response = await api.get(
    `auth-web/admin/pending-kyc-documents?limit=${limit}&page=${page}`
  );
  return response;
};
export const changeKycDocumentStatus = async (data) => {
  const response = await api.post("auth-web/admin/change-kyc-document-status", data);
  return response;
};

export const ngoAutocomplete = async (name) => {
  const response = await api.get(
    `auth-web/admin/ngo-autocomplete-by-name?name=${name}`
  );
  return response;
};

export const contactList = async (params) => {
  const { page = 1, limit = 10, userId, mobileNumber, fromDate, toDate } = params;
  
  const queryParams = new URLSearchParams({
    limit,
    page,
  });

  // Add optional filters
  if (userId) queryParams.append("userId", userId);
  if (mobileNumber) queryParams.append("mobileNumber", mobileNumber);
  if (fromDate) queryParams.append("fromDate", fromDate);
  if (toDate) queryParams.append("toDate", toDate);

  const response = await api.get(
    `auth-web/admin/contact-admin-list?${queryParams.toString()}`
  );
  return response;
};

export const replyContactAdmin = async (data) => {
  const response = await api.post("auth-web/admin/reply-email-contact-admin", data);
  return response;
};

export const fetchIsoList = async (params) => {
  const { page = 1, limit = 10, user_id, mobileNumber, testFlightEmail, status } = params;
  
  const queryParams = new URLSearchParams({
    limit,
    page,
  });

  // Add optional filters
  if (user_id) queryParams.append("user_id", user_id);
  if (mobileNumber) queryParams.append("mobileNumber", mobileNumber);
  if (testFlightEmail) queryParams.append("testFlightEmail", testFlightEmail);
  if (status) queryParams.append("status", status);

  const response = await api.get(
    `auth-web/admin/request-ios-access-list?${queryParams.toString()}`
  );
  return response;
};

export const replyIsoReply = async (data) => {
  const response = await api.post("auth-web/admin/reply-email-request-ios-access", data);
  return response;
};

export const updateEmailForIosAccess = async (data) => {
  const response = await api.post("auth-web/admin/update-email-for-ios-access-request", data);
  return response;
};

export const changeIosAccessRequestStatus = async (data) => {
  const response = await api.post("auth-web/admin/request-ios-access-status-change", data);
  return response;
};



export const fetchAppFeedbackList = async (params) => {
  const { page = 1, limit = 10, user_id, status, fromDate, toDate } = params;
  
  const queryParams = new URLSearchParams({
    limit,
    page,
  });

  // Add optional filters
  if (user_id) queryParams.append("user_id", user_id);
  if (fromDate) queryParams.append("fromDate", fromDate);
  if (toDate) queryParams.append("toDate", toDate);
  if (status) queryParams.append("status", status);

  const response = await api.get(
    `auth-web/admin/app-feedback-list?${queryParams.toString()}`
  );
  return response;
};

export const replyAppFeedback = async (data) => {
  const response = await api.post("auth-web/admin/reply-email-app-feedback", data);
  return response;
};

export const updateAppFeedbackStatus = async (data) => {
  const response = await api.post("auth-web/admin/update-app-feedback-status", data);
  return response;
};


