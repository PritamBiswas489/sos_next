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
} from "react-icons/fa";
import { donwloadLatestApk } from "@/services/common.service";
import { useDispatch } from "react-redux";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { getCode, getKycDocuments, getRequestStatus, requestisoAccess, submitKycDocuments } from "@/services/user.service";
import { useForm } from "react-hook-form";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import DashboardLayout from "@/component/DashboardLayout";

const RequestIos = () => {
 
  const dispatch = useDispatch();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [requestStatusData, setRequestStatusData] = useState(null);

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
            
            const formData = {
              emailAddress: data.emailAddress,
            }
            

            const response = await requestisoAccess(formData);

            if(response?.data?.status===200){
              toast.success(response?.data?.message || "Success");
              reset();
              checkRequestStatus();
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

  const checkRequestStatus = async () => {
    try {
      dispatch(SHOW_LOADER());
      const response = await getRequestStatus();
      const payload = response?.data?.data;

      if (response?.data?.status === 200 && payload?.hasRequest) {
        setRequestStatusData(payload?.request || null);
        setShowStatusModal(true);
        // toast.success(response?.data?.message || "Request found");
      } else {
        setRequestStatusData(null);
        setShowStatusModal(false);
        // toast.info(response?.data?.message || "No iOS request found");
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
  }

  useEffect(() => {
    checkRequestStatus();
  }, []);

  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <h2 className={styles.title}>Request iOS Access</h2>

        {/* HERO */}
        <div className={styles.heroCard}>

            {showStatusModal ? (
              
              <>
                {requestStatusData ? (
                  <>
                    <p className="text-white">
                      <strong className="text-white">Status:</strong> {requestStatusData.status}
                    </p>

                    <p className="text-white mt-2">
                      <strong className="text-white">Email:</strong> {requestStatusData.testFlightEmail}
                    </p>

                    <p className="text-white mt-2">
                      <strong className="text-white">Request Date:</strong>{" "}
                      {new Date(requestStatusData.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-danger">
                      Want to change Email? Contact Admin.
                    </p>
                  </>
                ) : (
                  <p>No request details available.</p>
                )}
              </>

            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
              {/* NAME */}
              <Form.Group className={`mb-4 ${styles.requestCcode}`}>
                <div className={styles.inputGroup}>
                  <FaEnvelope />
                  <input
                    type="text"
                    placeholder="Enter Email"
                    {...register("emailAddress", {
                      required: "Email is required",
                    })}
                  />
                </div>
                {errors.emailAddress && (
                  <InputErrorMsg className={styles.errorStyle} error={errors.emailAddress.message} color="#f00" />
                )}
              </Form.Group>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.submitBtn}>
                    Submit Request →
                  </button>
                </div>
              </form>  
            )}

            
            
        </div>

      </Container>
    </DashboardLayout>
  );
};

export default RequestIos;
