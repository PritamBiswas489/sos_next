import DashboardLayout from "@/component/DashboardLayout";
import ProfileCard from "@/component/ProfileCard";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Modal, Pagination, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import styles from "./index.module.scss";
import Image from "next/image";

const Dashboard = () => {
  const dispatch = useDispatch();
  const pageSize = 10;
  const [incommingSosNotification, setIncommingSosNotification] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatDate = (value) => {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const truncateText = (value, maxLength = 40) => {
    if (!value) return "—";
    return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
  };

  const openDetails = (item) => {
    setSelectedNotification(item);
    setShowDetailsModal(true);
  };

  const closeDetails = () => {
    setShowDetailsModal(false);
    setSelectedNotification(null);
  };

  const fetchIncommingSosNotification = useCallback(async (page = 1) => {
    try {
      dispatch(SHOW_LOADER());

      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      const formData = {
        limit: pageSize,
        page,
        status: "active",
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_PROFILE_BASE_URL}api-mobile/auth/sos/incomming-sos-notification`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            refreshtoken: refreshToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status === 200) {
        const notifications = response?.data?.data?.notifications || [];
        const paginationData = response?.data?.data?.pagination || response?.data?.data?.meta || {};
        const totalItems =
          paginationData?.total ||
          paginationData?.total_items ||
          paginationData?.count ||
          response?.data?.data?.total ||
          0;

        setIncommingSosNotification(notifications);
        setCurrentPage(page);
        setTotalPages(
          totalItems > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : Math.max(1, page)
        );
      } else {
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
  }, [dispatch, pageSize]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchIncommingSosNotification(page);
  };

  useEffect(() => {
    fetchIncommingSosNotification(currentPage);
  }, [currentPage, fetchIncommingSosNotification]);

  const handleDownloadAudio = async (url) => {
    try {
      dispatch(SHOW_LOADER());
  
      const response = await fetch(url);
      const blob = await response.blob();
  
      const blobUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop() || "audio.mp3";
  
      document.body.appendChild(link);
      link.click();
  
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error("Failed to download audio.");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <>
      <DashboardLayout>
        <Container fluid className={styles.page}>
          <h2 className={styles.title}>My Account</h2>
          <p className={styles.subtitle}>Welcome back.</p>

          <ProfileCard />

          <Row>
            <Col md={12} lg={12}>
              <div className={styles.tableWrapper}>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <h3 className={styles.title}>Incoming SOS Notification</h3>
                </div>
                <Table striped bordered hover responsive className={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Alert #</th>
                      <th>Location</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incommingSosNotification.length > 0 ? (
                      incommingSosNotification.map((item) => (
                        <tr key={item.id}>
                          <td>#{item.id}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {item?.sos_session?.user?.profile_photo ? (
                                <Image 
                                  height={'100'} 
                                  width={'100'} 
                                  src={item.sos_session?.user.profile_photo} 
                                  alt={item.sos_session?.user.name} 
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                  }}
                                >
                                  {getInitials(item.sos_session?.user?.name)}
                                </div>
                              )}
                              <div>
                                <div className="fw-semibold">{item.sos_session?.user?.name || "Unknown user"}</div>
                                <div className="small">{item.sos_session?.user?.phone_number || "—"}</div>
                              </div>
                            </div>
    
                          </td>
                          <td>
                            <span className={styles.statusBadge}>{item.response_status || "pending"}</span>
                          </td>
                          <td>{item.alert_number ?? "—"}</td>
                          <td>{truncateText(item.sos_session?.location, 40)}</td>
                          <td>{formatDate(item.created_at)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-light"
                              className={styles.actionBtn}
                              onClick={() => openDetails(item)}
                            >
                              Show More
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <div className={styles.paginationWrapper}>
                <Pagination className={styles.pagination}>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
              </div>
            </Col>

            <Col md={12} lg={12} className="mt-4">
              

              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>My SOS Sessions</h3>
              </div>
            </Col>
          </Row>
        </Container>
      </DashboardLayout>

      <Modal show={showDetailsModal} onHide={closeDetails} centered size="lg">
        <div className={styles.card}>
          <Modal.Body>
            {selectedNotification ? (
              <div className={styles.modalContent}>
                <div className={styles.modalSection}>
                  <h6>Basic Information</h6>
                  <ul className={styles.detailList}>
                    <li>
                      <strong>ID:</strong> {selectedNotification.id}
                    </li>
                    <li>
                      <strong>Response Status:</strong> {selectedNotification.response_status || "pending"}
                    </li>
                    <li>
                      <strong>Alert Number:</strong> {selectedNotification.alert_number ?? "—"}
                    </li>
                    <li>
                      <strong>Created At:</strong> {formatDate(selectedNotification.created_at)}
                    </li>
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <h6>SOS Session</h6>
                  <ul className={styles.detailList}>
                    <li>
                      <strong>Session ID:</strong> {selectedNotification.sos_session?.id || "—"}
                    </li>
                    <li>
                      <strong>User:</strong> {selectedNotification.sos_session?.user?.name || "Unknown user"}
                    </li>
                    <li>
                      <strong>Phone:</strong> {selectedNotification.sos_session?.user?.phone_number || "—"}
                    </li>
                    <li>
                      <strong>Location:</strong> {selectedNotification.sos_session?.location || "—"}
                    </li>
                    <li>
                      <strong>Coordinates:</strong> {selectedNotification.sos_session?.latitude || "—"}, {selectedNotification.sos_session?.longitude || "—"}
                    </li>
                    <li>
                      <strong>Audio Records:</strong> {selectedNotification.sos_session?.audio_records?.length || 0}
                    </li>
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <h6>Audio Records</h6>
                  {selectedNotification.sos_session?.audio_records?.length ? (
                    <div className={styles.audioList}>
                      {selectedNotification.sos_session.audio_records.map((audio, index) => (
                        <div key={audio.id || `${audio.file_name || "audio"}-${index}`} className={styles.audioItem}>
                          <div className={styles.audioInfo}>
                            <strong>{audio.file_name || `Audio ${index + 1}`}</strong>
                            <span>{formatDate(audio.created_at)}</span>
                          </div>
                          <div className={styles.audioActions}>
                            {audio.file_url ? (
                              <>
                                {/* <a
                                  href={audio.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.downloadLink}
                                  download
                                >
                                  Download
                                </a> */}
                                <Button
                                    className="btn btn-primary btn-sm w-100"
                                    onClick={() => handleDownloadAudio(audio.file_url)}
                                  >
                                    Download Audio {index + 1}
                                  </Button>
                              </>
                            ) : (
                              <span className={styles.emptyState}>No file available</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.emptyState}>No audio records available.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className={styles.emptyState}>No details selected.</p>
            )}
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default Dashboard;
