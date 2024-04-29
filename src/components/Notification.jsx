import React from "react";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import classNames from "classnames";
import { MdOutlineClose } from "react-icons/md";
import { HiBellAlert } from "react-icons/hi2";


import styles from "../App.module.css";

const Notification = ({message}) => {
  toast.custom(
    (t) => (
      <div
        className={classNames([
          styles.notificationWrapper,
          t.visible ? "top-0" : "-top-96",
        ])}
      >
        <div className={styles.iconWrapper}>
          <HiBellAlert className="text-gray-900" />
        </div>
        <div className={styles.contentWrapper}>
          <h1>Notification</h1>
          <p>
            {message}
          </p>
        </div>
        <div className={styles.closeIcon} onClick={() => toast.dismiss(t.id)}>
          <MdOutlineClose className="text-gray-900" />
        </div>
      </div>
    ),
    { id: "unique-notification", position: "top-center" }
  );
};

export default Notification;
