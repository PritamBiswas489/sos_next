import { useRouter } from "next/router";
import { useEffect } from "react";
import { decryptData } from "@/utils/crypto";

const AuthGuard = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const path = router.asPath;

    // ✅ Protect only dashboard areas (exclude login pages)
    const isProtectedRoute =
      (path.startsWith("/dashboard") ||
        path.startsWith("/ngo") ||
        path.startsWith("/site-admin")) &&
      !path.includes("login");

    // ✅ Public routes → allow
    if (!isProtectedRoute) return;

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const encryptedRole = localStorage.getItem("role");

    // ❌ If token missing → logout
    if (!accessToken || !refreshToken || !encryptedRole) {
      logout();
      return;
    }

    const role = decryptData(encryptedRole);

    // 🔥 Define allowed prefix + correct redirect path
    let allowedPrefix = "";
    let redirectPath = "";

    if (role === "ADMIN") {
      allowedPrefix = "/site-admin";
      redirectPath = "/site-admin/dashboard";
    } else if (role === "USER") {
      allowedPrefix = "/dashboard";
      redirectPath = "/dashboard";
    } else if (role === "NGO") {
      allowedPrefix = "/ngo";
      redirectPath = "/ngo/dashboard";
    } else {
      logout();
      return;
    }

    // ❌ Block access to other role routes
    if (!path.startsWith(allowedPrefix)) {
      router.replace(redirectPath);
      return;
    }

  }, [router.isReady, router.asPath]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    window.location.href = "/";
  };

  return children;
};

export default AuthGuard;