import React from "react";
import styles from "./index.module.scss";
// import logo from "../../assets/front/images/logo.svg";
import logo from "../../assets/front/images/logo.png";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaMapMarkerAlt,
  FaFileAlt,
  FaDownload,
  FaCog,
  FaLock,
  FaAndroid, 
  FaVoicemail,
  FaApple,
  FaCommentDots,
  FaHandsHelping,
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/router";
import { decryptData } from "@/utils/crypto";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdReport } from "react-icons/md";



const Sidebar = ({ isOpen, setIsOpen }) => {
  const router = useRouter();

  const encryptedRole = localStorage.getItem("role");
  const role = decryptData(encryptedRole);
  // console.log('role', role)

  

  const AdminMenu = [
    { icon: <FaHome />, label: "Dashboard", active: true, path: "/site-admin/dashboard" },
    { icon: <FaUsers />, label: "NGO List", path: "/site-admin/dashboard/ngo-list" },
    { icon: <FaUsers />, label: "User List", path: "/site-admin/dashboard/user-list" },
    { icon: <FaFileAlt />, label: "Pending KYC", path: "/site-admin/dashboard/pending-kyc" },
    { icon: <FaAndroid />, label: "Apk Management", path: "/site-admin/dashboard/apk-management" },
    { icon: <FaVoicemail />, label: "Messages From User", path: "/site-admin/dashboard/contact-list" },
    { icon: <FaApple />, label: "iOS Request List", path: "/site-admin/dashboard/ios-request-list" },
    { icon: <FaCommentDots />, label: "App Feedback List", path: "/site-admin/dashboard/app-feedback-list" },
    { icon: <FaMapMarkerAlt />, label: "Emergency Services Location", path: "/site-admin/dashboard/emergency-services-location-list" },
    { icon: <MdReport />, label: "Abouse Report", path: "/site-admin/dashboard/abouse-report-list" },
    { icon: <FaHandsHelping />, label: "SOS List", path: "/site-admin/dashboard/all-sos-list" },
    // { icon: <FaUser />, label: "Profile", path: "/dashboard/profile" },
    // { icon: <FaUsers />, label: "Family", path: "/dashboard/family" },
    // { icon: <FaMapMarkerAlt />, label: "Location", path: "/dashboard/location" },
    // { icon: <FaFileAlt />, label: "SOS History", path: "/dashboard/sos-history" },
    // { icon: <FaDownload />, label: "Downloads", path: "/dashboard/downloads" },
    // { icon: <FaCog />, label: "Settings", path: "/dashboard/settings" },
    // { icon: <FaLock />, label: "Privacy", path: "/dashboard/privacy" },

  ];

  const UserMenu = [
    { icon: <FaHome />, label: "Dashboard", active: true, path: "/dashboard" },
    // { icon: <FaUser />, label: "Profile", path: "/dashboard/profile" },
    // { icon: <FaUsers />, label: "Family", path: "/dashboard/family" },
    // { icon: <FaMapMarkerAlt />, label: "Location", path: "/dashboard/location" },
    // { icon: <FaFileAlt />, label: "SOS History", path: "/dashboard/sos-history" },
    { icon: <FaDownload />, label: "Downloads", path: "/dashboard/downloads" },
    { icon: <FaVoicemail />, label: "Contact Admin", path: "/dashboard/contact-admin" },
    { icon: <FaDownload />, label: "Request iOS", path: "/dashboard/request-ios" },
    { icon: <FaMapMarkerAlt />, label: "Request Emergency Location", path: "/dashboard/request-emergency-location" },
    // { icon: <FaLock />, label: "Privacy", path: "/dashboard/privacy" },
  ];

  const NgoMenu = [
    { icon: <FaHome />, label: "Dashboard", active: true, path: "/ngo/dashboard" },
    { icon: <FaUsers />, label: "Users", path: "/ngo/dashboard/users" },
    { icon: <FaHandsHelping />, label: "SOS List", path: "/ngo/dashboard/sos-list" },
    // { icon: <FaVoicemail />, label: "Contact Admin", path: "/ngo/dashboard/contact-admin" },
    // { icon: <FaMapMarkerAlt />, label: "Location", path: "/dashboard/location" },
    // { icon: <FaFileAlt />, label: "SOS History", path: "/dashboard/sos-history" },
    // { icon: <FaDownload />, label: "Downloads", path: "/dashboard/downloads" },
    // { icon: <FaCog />, label: "Settings", path: "/dashboard/settings" },
    // { icon: <FaLock />, label: "Privacy", path: "/dashboard/privacy" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    window.location.href = "/";
  };

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
      <div className={`${styles.sidebar} ${isOpen ? styles.showSidebar : ""}`}>
        <div className={styles.logoMenu}>
          <div className={styles.logo}>
            <Image src={logo} alt="SOS Logo" width={133} height={30} />
          </div>
          {role==='ADMIN' && (
            <ul className={styles.menu}>
              {AdminMenu.map((item, i) => (
                <li
                  key={i}
                  onClick={() => {
                    (router.push(item.path), setIsOpen(false));
                  }}
                  className={`${styles.menuItem} ${
                    router.pathname === item.path ? styles.active : ""
                  }`}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </li>
              ))}
              <li
                  onClick={handleLogout}
                  className={styles.menuItem}
                >
                  <span className={styles.icon}>
                    <FaLock />
                  </span>
                  <span className={styles.label}>Logout</span>
              </li>
            </ul>
          )}

          {role==='USER' && (
            <ul className={styles.menu}>
              {UserMenu.map((item, i) => (
                <li
                  key={i}
                  onClick={() => {
                    (router.push(item.path), setIsOpen(false));
                  }}
                  className={`${styles.menuItem} ${
                    router.pathname === item.path ? styles.active : ""
                  }`}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </li>
              ))}
              <li
                  onClick={handleLogout}
                  className={styles.menuItem}
                >
                  <span className={styles.icon}>
                    <FaLock />
                  </span>
                  <span className={styles.label}>Logout</span>
              </li>
            </ul>
          )}

          {role==='NGO' && (
            <ul className={styles.menu}>
              {NgoMenu.map((item, i) => (
                <li
                  key={i}
                  onClick={() => {
                    (router.push(item.path), setIsOpen(false));
                  }}
                  className={`${styles.menuItem} ${
                    router.pathname === item.path ? styles.active : ""
                  }`}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </li>
              ))}
              <li
                  onClick={handleLogout}
                  className={styles.menuItem}
                >
                  <span className={styles.icon}>
                    <FaLock />
                  </span>
                  <span className={styles.label}>Logout</span>
              </li>
            </ul>
          )}


        </div>
        {/* <div className={styles.userCard}>
          <div className={styles.avatar}>JD</div>
          <div>
            <div className={styles.name}>John Doe</div>
            <div className={styles.plan}>Premium Plan</div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;
