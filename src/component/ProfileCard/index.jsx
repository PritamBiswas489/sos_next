import React from "react";
import styles from "./index.module.scss";
import Image from "next/image";

const ProfileCard = () => {
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userRecord") || "{}")
      : {};

    console.log("User Data from localStorage:", userData);

  const phone = userData?.phoneNumber ?? userData?.phone_number ?? "";

  // const avatarLetter = userData?.name
  //   ? userData.name.trim().charAt(0).toUpperCase()
  //   : "?";

  const avatarLetter = userData?.name?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  // const profileImage = userData?.profile_photo
  //   ? `${process.env.NEXT_PUBLIC_API_PROFILE_BASE_URL}${userData.profile_photo}`
  //   : null;

  const profileImage = userData?.profile_photo
  ? `${process.env.NEXT_PUBLIC_API_PROFILE_BASE_URL.replace(/\/$/, "")}/${userData.profile_photo.replace(/^\//, "")}`
  : null;

  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        {userData?.profile_photo ? (
          // <img
          //   src="{profileImage}"
          //   alt="Profile"
          //   className={styles.avatarImage}
          //   onError={(e) => {
          //     console.log("Image failed:", e);
          //     console.log(profileImage);
          //   }}
          // />

          <Image 
            height={'100'} 
            width={'100'} 
            src={userData?.profile_photo} 
            alt="Profile"
            // className={styles.avatarImage}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
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