import React from "react";
import styles from "./index.module.scss";

const ProfileCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.avatar}>JD</div>

      <div>
        <h4>John Doe</h4>
        <p>johndoe@email.com · +1 555 888 2210</p>

        <span className={styles.verified}>✔ Verified Account</span>
      </div>
    </div>
  );
};

export default ProfileCard;
