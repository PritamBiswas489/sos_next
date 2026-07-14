import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "./index.module.scss";

import {
  FaAndroid,
  FaKey,
  FaUser,
  FaHome,
  FaFileAlt,
  FaIdCard,
  FaCar,
  FaPassport,
  FaCloudUploadAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTags,
} from "react-icons/fa";
import { donwloadLatestApk } from "@/services/common.service";
import { useDispatch } from "react-redux";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import DashboardLayout from "@/component/DashboardLayout";
import GooglePlaceInput from "@/component/GooglePlaceInput";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { getTrustedContacts } from "@/services/user.service";
import Image from "next/image";

function getInitials(name = "") {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

const TrustedContacts = () => {
 
  const dispatch = useDispatch();

  const [myTrustedContacts, setTrustedContacts] = useState([]);
  const [loadingMyRequests, setLoadingMyRequests] = useState(false);

  const fetchTrustedContacts = async (page = 0) => {
    try {
      setLoadingMyRequests(true);
      dispatch(SHOW_LOADER());

      const response = await getTrustedContacts();
      const resData = response?.data;

      if (resData?.status === 200) {
        const rows = resData?.data?.rows || resData?.data || [];
        setTrustedContacts(rows);
      } else {
        toast.error(resData?.error?.message || "Failed to fetch requests");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoadingMyRequests(false);
      dispatch(HIDE_LOADER());
    }
  };

 

 

  useEffect(() => {
    fetchTrustedContacts();
  }, []);

const capitalizeFirst = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";

  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <h2 className={styles.title}>Trusted Contacts</h2>

        {/* HERO */}
        <div className={styles.heroCard}>
            <div className={styles.listPanel}>
              {loadingMyRequests ? (
                <div className={styles.emptyState}>Loading requests...</div>
              ) : myTrustedContacts.length > 0 ? (
                <>
                  {myTrustedContacts.map((request) => (
                    <div key={request.id} className={styles.requestCard}>
                      <div className={styles.contactRow}>
                        <div className={styles.avatar}>
                          {request.profile_photo ? (
                            <Image 
                                height={'200'} 
                                width={'200'} 
                                src={request.profile_photo} 
                                alt={request.nickname || request.originalName}
                                className={styles.avatarImg}
                            />
                          ) : (
                            <div className={styles.initials}>
                              {getInitials(request.nickname || request.originalName)}
                            </div>
                          )}
                        </div>

                        <div className={styles.contactDetails}>
                          <h5>{request.nickname || request.originalName}</h5>
                          <p className={styles.requestMeta}>
                            {request.originalName && request.nickname
                              ? request.originalName
                              : request.phone_number}
                          </p>
                            <p className={styles.requestMeta}>
                                {capitalizeFirst(request.relationship)}
                            </p>
                        </div>

                        <div className={styles.contactMeta}>
                          {request.sos_alert && (
                            <div className={styles.sosBadge}>SOS</div>
                          )}
                          <div className={styles.phone}>{request.phone_number}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className={styles.emptyState}>
                  No contact yet.
                </div>
              )}
            </div>
        </div>

      </Container>
    </DashboardLayout>
  );
};

export default TrustedContacts;
