import React, { useState } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
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
} from "react-icons/fa";
import { donwloadLatestApk } from "@/services/common.service";
import { useDispatch } from "react-redux";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { getCode, getKycDocuments, getRequestStatus, requestisoAccess, submitKycDocuments } from "@/services/user.service";
import { useForm } from "react-hook-form";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import DashboardLayout from "@/component/DashboardLayout";
import GooglePlaceInput from "@/component/GooglePlaceInput";
import axios from "axios";

const RequestEmergencyLocation = () => {
 
  const dispatch = useDispatch();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [requestStatusData, setRequestStatusData] = useState(null);
  const [locationData, setLocationData] = useState(null);

    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
      reset,
    } = useForm();
   
    const onSubmit = async (data) => {
       

        try {
          dispatch(SHOW_LOADER());

          if (!locationData) {
            toast.error("Please select a location");
            return;
          }

          console.log(locationData);

          const formData = {
            "locationName": locationData?.locationName ,
            "latitude": locationData?.latitude,
            "longitude": locationData?.longitude,
            "address": locationData?.address,
            "phoneNumber": locationData?.phoneNumber,
            "placeId": locationData?.placeId,
            "serviceType": locationData?.serviceType
          }

          console.log("formData", formData);

          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");
            

            const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_PROFILE_BASE_URL}api-mobile/auth/emergency-services/request-register-new-location`,
            formData,
            {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              refreshtoken: refreshToken,
              "Content-Type": "application/json",
            },
            }
            );

          if(response?.data?.status===200){
            toast.success(response?.data?.message || "Success");
            reset();
          }else{
            toast.error(response?.data?.message || "Something went wrong");
          }

        } catch (error) {
            const resData = error?.response?.data;

            const errorMessage =
            resData?.error?.message ||
            resData?.error?.reason ||
            error?.message ||
            "Something went wrong";

            toast.error(errorMessage);
        } finally {
            dispatch(HIDE_LOADER());
        }
    };



  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <h2 className={styles.title}>Request Emergency Location</h2>

        {/* HERO */}
        <div className={styles.heroCard}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className={`mb-4 ${styles.requestCcode}`}>
                <GooglePlaceInput
                  onPlaceSelected={(place) => {
                    console.log(place);
                    setLocationData(place);
                  }}
                >
                  <div className={styles.inputGroup}>
                    <FaMapMarkerAlt />
                    <input
                      type="text"
                      placeholder="Search emergency location"
                      {...register("location", {
                        required: "Please select a location",
                      })}
                    />
                  </div>
                </GooglePlaceInput>

                {errors.location && (
                  <InputErrorMsg
                    className={styles.errorStyle}
                    error={errors.location.message}
                    color="#f00"
                  />
                )}
              </Form.Group>
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitBtn}>
                  Submit Request →
                </button>
              </div>
            </form>  
            
        </div>

      </Container>
    </DashboardLayout>
  );
};

export default RequestEmergencyLocation;
