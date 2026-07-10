import React, { useEffect, useState } from "react";
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
  FaPhoneAlt,
  FaTags,
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

  const CATEGORIES = [
    { id: 'medical-emergency', label: 'Medical Emergency', icon: 'ambulance' },
    { id: 'police-station', label: 'Police Station', icon: 'police' },
    { id: 'fire-station', label: 'Fire Station', icon: 'fire' },
    { id: 'disaster-relief-center', label: 'Disaster Relief Center', icon: 'disaster' },
    { id: 'blood-bank', label: 'Blood Bank', icon: 'blood' },
    { id: 'pharmacy-24x7', label: 'Pharmacy (24x7)', icon: 'pharmacy' },
    { id: 'urgent-care-center', label: 'Urgent Care Center', icon: 'urgentCare' },
    { id: 'trauma-center', label: 'Trauma Center', icon: 'trauma' },
    { id: 'emergency-shelter', label: 'Emergency Shelter', icon: 'shelter' },
    { id: 'roadside-assistance', label: 'Roadside Assistance', icon: 'roadside' },
    { id: 'emergency-helpline', label: 'Emergency Helpline', icon: 'helpline' },
    { id: 'ambulance-pickup-point', label: 'Ambulance Pickup Point', icon: 'pickup' },
    { id: 'flood-cyclone-shelter', label: 'Flood/Cyclone Shelter', icon: 'flood' },
    { id: 'emergency-service-office', label: 'Emergency Service Office', icon: 'serviceOffice' },
    { id: 'child-help-center', label: 'Child Help Center', icon: 'child' },
    { id: 'womens-safety-center', label: "Women's Safety Center", icon: 'women' },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      location: "",
      phoneNumber: "",
      category: "",
    },
  });
   
  const onSubmit = async (data) => {
      
      const phoneNumber = data.phoneNumber || locationData?.phoneNumber || "";
      const category = data.category || "";

      try {
        dispatch(SHOW_LOADER());

        if (!locationData) {
          toast.error("Please select a location");
          return;
        }

        const formData = {
          locationName: locationData?.locationName,
          latitude: locationData?.latitude,
          longitude: locationData?.longitude,
          address: locationData?.address,
          phoneNumber,
          placeId: locationData?.placeId,
          serviceType: data?.category,
        };

        // console.log("formData", formData);
        // return;

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

  const location = watch("location");

  useEffect(() => {
    if (!location) {
      // setLocationData(null);
      setValue("phoneNumber", "");
    }
  }, [location, setValue]);



  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <h2 className={styles.title}>Request Emergency Location</h2>

        {/* HERO */}
        <div className={styles.heroCard}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group className={`${styles.requestCcode}`}>
                    <GooglePlaceInput
                      onPlaceSelected={(place) => {
                        console.log(place);
                        setLocationData(place);
                        if (place?.phoneNumber) {
                          setValue("phoneNumber", place.phoneNumber);
                        }
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
                </Col>
                <Col md={6}>
                  <Form.Group className={`mb-4 ${styles.requestCcode}`}>
                    <div className={styles.inputGroup}>
                      <FaPhoneAlt />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        {...register("phoneNumber", {
                          required: "Phone Number is required",
                        })}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <InputErrorMsg
                        className={styles.errorStyle}
                        error={errors.phoneNumber.message}
                        color="#f00"
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className={`mb-4 ${styles.requestCcode}`}>
                    <div className={styles.inputGroup}>
                      <FaTags />
                      <select
                        {...register("category", {
                          required: "Category is required",
                        })}
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.category && (
                      <InputErrorMsg
                        className={styles.errorStyle}
                        error={errors.category.message}
                        color="#f00"
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>
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
