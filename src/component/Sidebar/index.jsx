import React from "react";
import styles from "./index.module.scss";
import logo from "../../assets/front/images/logo.svg";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaMapMarkerAlt,
  FaFileAlt,
  FaDownload,
  FaCog,
  FaLock,
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/router";

const menu = [
  { icon: <FaHome />, label: "Dashboard", active: true, path: "/dashboard" },
  { icon: <FaUser />, label: "Profile", path: "/dashboard/profile" },
  { icon: <FaUsers />, label: "Family", path: "/dashboard/family" },
  { icon: <FaMapMarkerAlt />, label: "Location", path: "/dashboard/location" },
  { icon: <FaFileAlt />, label: "SOS History", path: "/dashboard/sos-history" },
  { icon: <FaDownload />, label: "Downloads", path: "/dashboard/downloads" },
  { icon: <FaCog />, label: "Settings", path: "/dashboard/settings" },
  { icon: <FaLock />, label: "Privacy", path: "/dashboard/privacy" },
];

const Sidebar = () => {
  const router = useRouter();
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoMenu}>
        <div className={styles.logo}>
          <Image src={logo} alt="SOS Logo" width={133} height={30} />
        </div>
        <ul className={styles.menu}>
          {menu.map((item, i) => (
            <li
              key={i}
              onClick={() => router.push(item.path)}
              className={`${styles.menuItem} ${
                router.pathname === item.path ? styles.active : ""
              }`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.userCard}>
        <div className={styles.avatar}>JD</div>
        <div>
          <div className={styles.name}>John Doe</div>
          <div className={styles.plan}>Premium Plan</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
