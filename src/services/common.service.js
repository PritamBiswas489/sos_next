import api from "@/config/api.config";

export const donwloadLatestApk = async () => {
  const response = await api.get("front-web/donwload-latest-apk");
  return response;
};