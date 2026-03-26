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


