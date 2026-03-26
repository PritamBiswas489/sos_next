import React from "react";
import styles from "./InputErrorMsg.module.scss";
function InputErrorMsg(props) {
  return (
    <>
      <div
        className={`${styles["input-error"]} ${props.className ?? ``}`}
        style={{ color: props.color ?? "#f00" }}
      >
        {props.error}
      </div>
    </>
  );
}

export default InputErrorMsg;