import React from "react";
import styles from "./index.module.scss";

const ProfileCard = () => {
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userRecord") || "{}")
      : {};

    console.log("User Data from localStorage:", userData);

  const phone = userData?.phoneNumber ?? userData?.phone_number ?? "";

  const avatarLetter = userData?.name
    ? userData.name.trim().charAt(0).toUpperCase()
    : "?";

  // const profileImage = userData?.profile_photo
  //   ? `${process.env.NEXT_PUBLIC_API_PROFILE_BASE_URL}${userData.profile_photo}`
  //   : null;

  const profileImage = userData?.profile_photo
  ? `${process.env.NEXT_PUBLIC_API_PROFILE_BASE_URL.replace(/\/$/, "")}/${userData.profile_photo.replace(/^\//, "")}`
  : null;

  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        {profileImage ? (
          // <img
          //   src={profileImage}
          //   alt={userData?.name || "Profile"}
          //   className={styles.avatarImage}
          //   width={133} height={30}
          // />
          <img
            src="{profileImage}"
            alt="Profile"
            className={styles.avatarImage}
            onError={(e) => {
              console.log("Image failed:", e);
              console.log(profileImage);
            }}
          />
        ) : (
          avatarLetter
        )}
      </div>
      {/* <div className={styles.avatar}>{avatarLetter ?? ''}</div> */}

      <div>
        <h4>{userData?.name ?? ""}</h4>
        <p>
          {userData?.email ?? ""} {phone && `· ${phone}`}
        </p>

        <span className={styles.verified}>✔ Verified Account</span>
      </div>
    </div>
  );
};

export default ProfileCard;