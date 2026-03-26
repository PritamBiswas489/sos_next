import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { changeStatusNgo, ngoUpgradeUserLimit, uploadApk } from "@/services/admin.service";
import { FaEye, FaEdit, FaTimes } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import styles from "./index.module.scss";

const UploadApkModal = ({
  show,
  handleClose,
  selectedNgo,
  updateTable,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [apkFile, setApkFile] = useState(null);

  const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      control,
      reset,
      setValue, // ✅ ADD THIS
    } = useForm();
  
    const onSubmit = async (data) => {
        try {
          dispatch(SHOW_LOADER());
    
          const formData = new FormData();
          formData.append("version", data.version);
          formData.append("apkFile", apkFile);
    
          const response = await uploadApk(formData);
          const resData = response.data;
    
          if (resData?.status === 200) {
            toast.success(resData?.message);
            handleClose();
            resetForm();
            updateTable();
            
          } else {
            const errorMessage =
              resData?.error?.reason ||
              resData?.error?.message ||
              "Something went wrong";
            toast.error(errorMessage);
          }
        } catch (error) {
          const resData = error?.response?.data;
          const errorMessage =
            resData?.error?.reason ||
            resData?.error?.message ||
            error?.message ||
            "Something went wrong";
          toast.error(errorMessage);
        } finally {
          dispatch(HIDE_LOADER());
        }
      };

    const resetForm = () => {
        reset({
            version: ""
        });
        setApkFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* <Modal.Header closeButton>
        <Modal.Title>Upload APK</Modal.Title>
      </Modal.Header> */}

      <div className={styles.card}>
        <Modal.Body className={styles.modalBody}>
            <h3>Upload APK</h3>
            <button className={styles.closeBtn} onClick={handleClose}>
              <FaTimes />
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                      <Col md={6}>
                          <Form.Group className="mb-3">
                              <Form.Label>APK File</Form.Label>
                              <Form.Control
                              type="file"
                              onChange={(e) => {
                                  const file = e.target.files[0];
                                  setApkFile(file);
                              }}
                              accept=".apk,application/vnd.android.package-archive"
                              />
                              {apkFile && (
                              <div className="mt-1 small text-muted">
                                  Selected: {apkFile.name}
                              </div>
                              )}
                              {errors.version && (
                                  <InputErrorMsg error={errors.version.message} color="#f00" />
                              )}
                          </Form.Group>
                          
                      </Col>
                      <Col md={6}>
                          <Form.Group className="mb-3">
                              <Form.Label>Version</Form.Label>
                              <Form.Control
                                  type="text"
                                  placeholder="Version"
                                  {...register("version", {
                                  required: "version is required",
                                  })}
                              />
                              {errors.version && (
                                  <InputErrorMsg error={errors.version.message} color="#f00" />
                              )}
                          </Form.Group>
                      </Col>
                  </Row>
                  
                <Button variant="success" type="submit">
                      Submit
                  </Button>
            </form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default UploadApkModal;