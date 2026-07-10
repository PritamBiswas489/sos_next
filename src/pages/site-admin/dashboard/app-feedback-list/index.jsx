import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table, Modal, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { contactList, fetchAppFeedbackList, replyContactAdmin, replyIsoReply, updateEmailForIosAccess, changeIosAccessRequestStatus, replyAppFeedback, updateAppFeedbackStatus } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit, FaReply, FaEnvelope, FaToggleOn, FaDownload } from "react-icons/fa";
import NgoUpdateModal from "@/component/Popup/Admin/NgoUpdate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

export default function AppFeedback() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [showNgoUpdateModal, setShowNgoUpdateModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    user_id: "",
    mobileNumber: "",
    testFlightEmail: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allData, setAllData] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({});
  
  // Reply modal state
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Update Email modal state
  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);
  const [selectedItemForEmail, setSelectedItemForEmail] = useState(null);
  const [updateEmail, setUpdateEmail] = useState("");

  // Status Change modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState(null);
  const statusOptions = ["new", "reviewed", "resolved", "ignored"];

  const fetchAppFeedback = async (page = 0, activeFilters = filters) => {
    try {
      dispatch(SHOW_LOADER());

      const params = {
        page: page + 1,
        limit: itemsPerPage,
      };

      // Add filters if they have values
      if (activeFilters?.user_id) params.user_id = activeFilters.user_id;
      if (activeFilters?.status) params.status = activeFilters.status;
      if (activeFilters?.fromDate) params.fromDate = activeFilters.fromDate;
      if (activeFilters?.toDate) params.toDate = activeFilters.toDate;

      console.log("params", params);

      const response = await fetchAppFeedbackList(params);

      const resData = response.data;

      if (resData?.status === 200) {
        setData(resData?.data?.rows || []);
        setAllData(resData?.data?.rows || []);
        setTotalPages(resData?.data?.totalPages || 0);
        setCurrentPage((resData?.data?.currentPage || 1) - 1);
      } else {
        toast.error(resData?.error?.message || "Failed to fetch NGO list");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };
  useEffect(() => {
    fetchAppFeedback(0);
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    fetchAppFeedback(selected);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setFilters((prev) => ({
      ...prev,
      [name]: formattedDate,
    }));
  };

  const toggleMessageExpand = (itemId) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const MessageCell = ({ message, itemId }) => {
    const isExpanded = expandedMessages[itemId];
    const maxLength = 80;
    const isLong = message?.length > maxLength;

    return (
      <div>
        <span>
          {isExpanded ? message : message?.substring(0, maxLength)}
          {isLong && !isExpanded && "..."}
        </span>
        {isLong && (
          <button
            className="btn btn-link btn-sm ms-2 p-0"
            style={{ textDecoration: "none", color: "#0d6efd" }}
            onClick={() => toggleMessageExpand(itemId)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    );
  };

  const handleReplyClick = (contact) => {
    setSelectedContact(contact);
    setReplyMessage("");
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      dispatch(SHOW_LOADER());
      const response = await replyAppFeedback({
        feedback_id: selectedContact.id,
        message: replyMessage,
      });

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success("Reply sent successfully");
        setShowReplyModal(false);
        setReplyMessage("");
        fetchAppFeedback(currentPage);
      } else {
        toast.error(response.data?.error?.message || "Failed to send reply");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  const handleCloseReplyModal = () => {
    setShowReplyModal(false);
    setReplyMessage("");
    setSelectedContact(null);
  };



  const handleStatusUpdate = async (feedbackId, selectedStatus) => {
    if (!feedbackId || !selectedStatus) return;

    try {
      setUpdatingFeedbackId(feedbackId);
      dispatch(SHOW_LOADER());

      const response = await updateAppFeedbackStatus({
        feedback_id: Number(feedbackId),
        status: selectedStatus,
      });

      if (response?.data?.status === 200 || response?.data?.status === 201) {
        toast.success("Status updated successfully");
        fetchAppFeedback(currentPage);
      } else {
        toast.error(response?.data?.error?.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setUpdatingFeedbackId(null);
      dispatch(HIDE_LOADER());
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    fetchAppFeedback(0, filters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      user_id: "",
      mobileNumber: "",
      testFlightEmail: "",
      status: "",
      fromDate: "",
      toDate: "",
    };

    setFilters(emptyFilters);
    setCurrentPage(0);
    fetchAppFeedback(0, emptyFilters);
  };

  useEffect(() => {
    handleApplyFilters();
  }, []);


  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>App Feedback List</h2>
        </div>

        <Row>
          <Col>
            <div className="mb-4 p-3 border rounded">
              <Row className="g-3">
                <Col md={2}>
                  <label className="form-label">User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="user_id"
                    placeholder="Enter User ID"
                    value={filters.user_id}
                    onChange={handleFilterChange}
                  />
                </Col>

                
                <Col md={2}>
                    <label className="form-label">From Date</label>
                    <DatePicker
                    selected={filters.fromDate ? new Date(filters.fromDate) : null}
                    onChange={(date) => handleDateChange("fromDate", date)}
                    className="form-control"
                    placeholderText="Select From Date"
                    dateFormat="MM/dd/yyyy"
                    />
                </Col>

                <Col md={2}>
                    <label className="form-label">To Date</label>
                    <DatePicker
                    selected={filters.toDate ? new Date(filters.toDate) : null}
                    onChange={(date) => handleDateChange("toDate", date)}
                    className="form-control"
                    placeholderText="Select To Date"
                    dateFormat="MM/dd/yyyy"
                    />
                </Col>

                <Col md={2}>
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </Col>

                <Col md={2} className="d-flex align-items-end gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleApplyFilters}
                  >
                    Search
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </button>
                </Col>
              </Row>
            </div>
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>File</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>

                      <td>#{item?.user_id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {item?.user?.profile_photo ? (
                            <Image 
                              height={'100'} 
                              width={'100'} 
                              src={item.user.profile_photo} 
                              alt={item.user.name} 
                                style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          ) : null}
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              display: item?.user?.profile_photo ? "none" : "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#007bff",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            {/* {item?.user?.name?.split(" ")[0]?.charAt(0).toUpperCase()} */}
                            {
                              item?.user?.name
                                ?.split(" ")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((word) => word.charAt(0).toUpperCase())
                                .join("")
                            }
                          </div>
                          <div>
                            <div className="fw-semibold">{item?.user?.name}</div>
                            <div className="small">{item?.user?.phone_number}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item?.rating}</td>
                      <td>{item?.feedback_type}</td>
                      <td>{item?.message}</td>
                      <td>
                        {item?.feedback_files?.length > 0 ? (
                          <div className="d-flex flex-column gap-2">
                            {item.feedback_files.map((file) => (
                              <button
                                key={file.id}
                                onClick={async () => {
                                  try {
                                    const response = await fetch(file.file_url);
                                    const blob = await response.blob();
                                    const blobUrl = window.URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = blobUrl;
                                    link.download = file.file_url.split("/").pop() || "download";
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(blobUrl);
                                  } catch (error) {
                                    console.error("Download failed:", error);
                                    toast.error("Failed to download file");
                                  }
                                }}
                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
                                style={{ textDecoration: "none", cursor: "pointer" }}
                              >
                                <FaDownload size={12} />
                                {file.file_type || "Download"}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-white">No files</span>
                        )}
                      </td>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex flex-column gap-2">
                          <select
                            className="form-select form-select-sm"
                            value={item?.status || "new"}
                            onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                            disabled={updatingFeedbackId === item.id}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <ul className="d-flex align-items-center gap-3 list-unstyled mb-0">
                            <li>
                              <FaReply
                                size={18}
                                className="text-success cursor-pointer"
                                onClick={() => handleReplyClick(item)}
                                title="Reply"
                              />
                            </li>
                        </ul>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
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

        {/* Reply Modal */}
        <Modal show={showReplyModal} onHide={handleCloseReplyModal} centered>
          <div className={styles.card}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Reply</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedContact && (
                <div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Your Reply</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Enter your reply message..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      style={{ resize: "vertical" }}
                    />
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseReplyModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSendReply}>
                Send Reply
              </Button>
            </Modal.Footer>
          </div>
        </Modal>

      </Container>
    </DashboardLayout>
  );
}
