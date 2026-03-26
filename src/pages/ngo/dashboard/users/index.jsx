import React, { useEffect, useState } from "react";
import { Container, Row, Button, Modal, Col, Table } from "react-bootstrap";
import styles from "./index.module.scss";

import {
  FaKey,
  FaUser,
  FaHome,
  FaFileAlt,
  FaIdCard,
  FaCar,
  FaPassport,
  FaCloudUploadAlt,
  FaEye,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import DashboardLayout from "@/component/DashboardLayout";
import { Controller, useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { ngoCreateUser, userListForNgo } from "@/services/ngo.service";
import ReactPaginate from "react-paginate";

export default function Downloads() {
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);


    const [selectedDoc, setSelectedDoc] = useState(null);
    const [file, setFile] = useState(null);
  
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // 0-based
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm();


    const handleDocSelect = (doc) => {
        setSelectedDoc(doc);
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];

        if (!selected) return;

        const validTypes = ["image/jpeg", "image/png", "application/pdf"];

        if (!validTypes.includes(selected.type)) {
        toast.error("Only PDF, JPG, PNG allowed");
        return;
        }

        if (selected.size > 5 * 1024 * 1024) {
        toast.error("Max file size is 5MB");
        return;
        }

        setFile(selected);
    };

    const onSubmit = async (data) => {
        if (!selectedDoc) {
            toast.error("Please select a document");
            return;
        }

        if (!file) {
            toast.error("Please upload a file");
            return;
        }

        try {
            dispatch(SHOW_LOADER());

            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("phoneNumber", data.phone);
            formData.append("emailAddress", data.emailAddress);
            formData.append("residentialAddress", data.residentialAddress);
            formData.append("documentType", selectedDoc);
            formData.append("document", file);

            const response = await ngoCreateUser(formData);

            toast.success(response?.data?.message || "Success");

            
            setShow(false);
            reset();
            setSelectedDoc(null);
            setFile(null);
            fetchUserList(0);

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


    const fetchUserList = async (page = 0) => {
        try {
          dispatch(SHOW_LOADER());
    
          const response = await userListForNgo({
            page: page + 1,
            limit: itemsPerPage,
          });
    
          const resData = response.data;
    
          if (resData?.status === 200) {
            setData(resData?.data?.rows || []);
            setTotalPages(resData?.data?.totalPages || 0);
            setCurrentPage((resData?.data?.currentPage || 1) - 1);
          } else {
            toast.error(resData?.error?.message || "Failed to fetch data");
          }
        } catch (error) {
          toast.error(error?.message || "Something went wrong");
        } finally {
          dispatch(HIDE_LOADER());
        }
      };
      useEffect(() => {
        fetchUserList(0);
      }, []);

  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>Users</h2>
          <button className="btn bg-warning btn-sm" onClick={() => setShow(true)}>Create Users</button>
        </div>

        <Row>
          <Col>
            {/* ✅ Table */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>License</th>
                  <th>Address</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item?.name}</td>
                      <td>{item?.email}</td>
                      <td>{item?.phone_number}</td>
                      <td>{item?.licenses?.license_key}</td>
                      <td>{item?.kyc_documents?.address}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <ReactPaginate
                previousLabel={"← Prev"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={totalPages}
                forcePage={currentPage}
                onPageChange={handlePageClick}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                pageClassName={styles.pageItem}
                previousClassName={styles.pageItem}
                nextClassName={styles.pageItem}
                disabledClassName={styles.disabled}
              />
            )}
          </Col>
        </Row>

        <Modal
          show={show}
          onHide={() => setShow(false)}
          centered
          dialogClassName={styles.customModal}
        >
          <Modal.Body className={styles.modalBody}>
            <div className={styles.modalHeader}>
              <h5>
                <FaKey className={styles.headerIcon} /> Request License Code
              </h5>
              <button
                className={styles.closeBtn}
                onClick={() => setShow(false)}
              >
                ✕
              </button>
            </div>

            <p className={styles.modalSubtitle}>
              Submit your details for verification. Your license will be issued
              within 24 hours.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* NAME */}
              <div className={styles.inputGroup}>
                <FaUser />
                <input
                  type="text"
                  placeholder="John Michael Doe"
                  {...register("fullName", {
                    required: "Full Name is required",
                  })}
                />
              </div>
              {errors.fullName && (
                <InputErrorMsg error={errors.fullName.message} color="#f00" />
              )}

              {/* PHONE */}
              <div className={styles.phoneBox}>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue="+254"
                  rules={{
                    required: "Phone number is required",
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      defaultCountry="KE"
                      value={field.value}
                      onChange={field.onChange}
                      className={styles.phoneInput}
                    />
                  )}
                />
              </div>
              {errors.phone && (
                <InputErrorMsg
                  error={errors.phone.message}
                  color="#f00"
                />
              )}

              {/* EMAIL */}
              <div className={`${styles.inputGroup} mt-3`}>
                <MdEmail />
                <input
                  type="email"
                  placeholder="Email"
                  {...register("emailAddress", {
                    required: "Email is required",
                  })}
                />
              </div>
              {errors.emailAddress && (
                <InputErrorMsg
                  error={errors.emailAddress.message}
                  color="#f00"
                />
              )}

              {/* ADDRESS */}
              <div className={styles.inputGroup}>
                <FaHome />
                <input
                  type="text"
                  placeholder="Address"
                  {...register("residentialAddress", {
                    required: "Address is required",
                  })}
                />
              </div>
              {errors.residentialAddress && (
                <InputErrorMsg
                  error={errors.residentialAddress.message}
                  color="#f00"
                />
              )}

              {/* DOCS */}
              <div className={styles.documents}>
                <p>Supporting Documents *</p>

                <div className={styles.docGrid}>
                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "utility" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("utility")}
                  >
                    <FaFileAlt />
                    <span>Utility Bill</span>
                  </div>

                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "nid" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("nid")}
                  >
                    <FaIdCard />
                    <span>National ID</span>
                  </div>

                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "license" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("license")}
                  >
                    <FaCar />
                    <span>Driver's License</span>
                  </div>

                  <div
                    className={`${styles.docItem} ${
                      selectedDoc === "passport" ? styles.active : ""
                    }`}
                    onClick={() => handleDocSelect("passport")}
                  >
                    <FaPassport />
                    <span>Int'l Passport</span>
                  </div>
                </div>
              </div>

              {/* UPLOAD */}
              <div className={styles.uploadBox}>
                <FaCloudUploadAlt />
                <p>
                  Drop files here or{" "}
                  <span
                    onClick={() =>
                      document.getElementById("fileInput").click()
                    }
                    style={{ cursor: "pointer" }}
                  >
                    browse
                  </span>
                </p>
                <small>PDF, JPG, PNG • Max 5MB each</small>

                <input
                  id="fileInput"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />

                {file && (
                  <div className="mt-2 small text-muted">
                    Selected: {file.name}
                  </div>
                )}
              </div>

              {/* SUBMIT */}
              <button type="submit" className={styles.submitBtn}>
                Submit Request →
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </Container>
    </DashboardLayout>
  );
}