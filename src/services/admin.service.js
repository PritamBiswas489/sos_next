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

export const fetchEmergencyServicesLocationList = async (params) => {
  const { page = 1, limit = 10, requestBy, serviceType, phoneNumber, placeId, locationName, status, fromDate, toDate } = params;
  
  const queryParams = new URLSearchParams({
    limit,
    page,
  });

  // Add optional filters
  if (requestBy) queryParams.append("requestBy", requestBy);
  if (serviceType) queryParams.append("serviceType", serviceType);
  if (phoneNumber) queryParams.append("phoneNumber", phoneNumber);
  if (placeId) queryParams.append("placeId", placeId);
  if (locationName) queryParams.append("locationName", locationName);
  if (fromDate) queryParams.append("fromDate", fromDate);
  if (toDate) queryParams.append("toDate", toDate);
  if (status) queryParams.append("status", status);

  const response = await api.get(
    `auth-web/admin/emergency-services-location-list?${queryParams.toString()}`
  );
  return response;
};

export const updateEmergencyServicesLocation = async (data) => {
  const response = await api.post("auth-web/admin/change-emergency-services-location-status", data);
  return response;
};

export const fetchAbouseReportList = async (params) => {
  const { page = 1, limit = 10, userId, user_id, abuserId, abuser_id, abuseType, threatLevel, history_of_violence, weapon_access, restraining_order, userName, mobileNumber, abuserName, abuserPhone, abuserEmail, incidentFromDate, incidentToDate, fromDate, toDate } = params;
  
  const queryParams = new URLSearchParams({
    limit,
    page,
  });

  // Add optional filters
  if (userId) queryParams.append("userId", userId);
  if (user_id) queryParams.append("user_id", user_id);
  if (abuserId) queryParams.append("abuserId", abuserId);
  if (abuser_id) queryParams.append("abuser_id", abuser_id);
  if (abuseType) queryParams.append("abuseType", abuseType);
  if (threatLevel) queryParams.append("threatLevel", threatLevel);
  if (history_of_violence) queryParams.append("history_of_violence", history_of_violence);
  if (weapon_access) queryParams.append("weapon_access", weapon_access);
  if (restraining_order) queryParams.append("restraining_order", restraining_order);
  if (userName) queryParams.append("userName", userName);
  if (mobileNumber) queryParams.append("mobileNumber", mobileNumber);
  if (abuserName) queryParams.append("abuserName", abuserName);
  if (abuserPhone) queryParams.append("abuserPhone", abuserPhone);
  if (abuserEmail) queryParams.append("abuserEmail", abuserEmail);
  if (incidentFromDate) queryParams.append("incidentFromDate", incidentFromDate);
  if (incidentToDate) queryParams.append("incidentToDate", incidentToDate);
  if (fromDate) queryParams.append("fromDate", fromDate);
  if (toDate) queryParams.append("toDate", toDate);

  const response = await api.get(
    `auth-web/admin/get-abouse-report-list?${queryParams.toString()}`
  );
  return response;
};


export const allSOSList = async (params) => {
  const { page = 1, limit = 10, ngo_id, status, fromDate, toDate } = params;
  
  const queryParams = new URLSearchParams({
    limit,
    page,
  });

  // Add optional filters
  if (ngo_id) queryParams.append("ngo_id", ngo_id);
  if (status) queryParams.append("status", status);
  if (fromDate) queryParams.append("fromDate", fromDate);
  if (toDate) queryParams.append("toDate", toDate);

  const response = await api.get(
    `auth-web/admin/all-sos-list?${queryParams.toString()}`
  );
  return response;
};




