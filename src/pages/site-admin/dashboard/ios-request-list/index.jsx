import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table, Modal, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { contactList, fetchIsoList, replyContactAdmin, replyIsoReply, updateEmailForIosAccess, changeIosAccessRequestStatus } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit, FaReply, FaEnvelope, FaToggleOn } from "react-icons/fa";
import NgoUpdateModal from "@/component/Popup/Admin/NgoUpdate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Ngolist() {
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
  const [selectedItemForStatus, setSelectedItemForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const statusOptions = ["new", "added", "failed"];

  const fetchIso = async (page = 0) => {
    try {
      dispatch(SHOW_LOADER());

      const params = {
        page: page + 1,
        limit: itemsPerPage,
      };

      // Add filters if they have values
      if (filters.user_id) params.user_id = filters.user_id;
      if (filters.mobileNumber) params.mobileNumber = filters.mobileNumber;
      if (filters.testFlightEmail) params.testFlightEmail = filters.testFlightEmail;
      if (filters.status) params.status = filters.status;

      console.log("params", params);

      const response = await fetchIsoList(params);

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
    fetchIso(0);
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    fetchIso(selected);
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
      const response = await replyIsoReply({
        request_id: selectedContact.id,
        message: replyMessage,
      });

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success("Reply sent successfully");
        setShowReplyModal(false);
        setReplyMessage("");
        fetchIso(currentPage);
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

  const handleUpdateEmailClick = (item) => {
    setSelectedItemForEmail(item);
    setUpdateEmail(item?.testFlightEmail || "");
    setShowUpdateEmailModal(true);
  };

  const handleCloseUpdateEmailModal = () => {
    setShowUpdateEmailModal(false);
    setUpdateEmail("");
    setSelectedItemForEmail(null);
  };

  const handleSaveUpdateEmail = async () => {
    if (!updateEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updateEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      dispatch(SHOW_LOADER());
      const response = await updateEmailForIosAccess({
        id: selectedItemForEmail.id,
        testFlightEmail: updateEmail,
      });

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success("Email updated successfully");
        setShowUpdateEmailModal(false);
        setUpdateEmail("");
        fetchIso(currentPage);
      } else {
        toast.error(response.data?.error?.message || "Failed to update email");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  const handleStatusChangeClick = (item) => {
    setSelectedItemForStatus(item);
    setNewStatus(item?.status || "");
    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setNewStatus("");
    setSelectedItemForStatus(null);
  };

  const handleSaveStatusChange = async () => {
    if (!newStatus.trim()) {
      toast.error("Please select a status");
      return;
    }

    try {
      dispatch(SHOW_LOADER());
      const response = await changeIosAccessRequestStatus({
        id: selectedItemForStatus.id,
        status: newStatus,
      });

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success("Status updated successfully");
        setShowStatusModal(false);
        setNewStatus("");
        fetchIso(currentPage);
      } else {
        toast.error(response.data?.error?.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    fetchIso(0);
  };

  const handleClearFilters = () => {
    setFilters({
      user_id: "",
      mobileNumber: "",
      testFlightEmail: "",
      status: "",
    });
    setCurrentPage(0);
  };

  useEffect(() => {
    handleApplyFilters();
  }, []);

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value.trim()) {
      const filtered = allData.filter(
        (item) =>
          item?.user?.name?.toLowerCase().includes(value.toLowerCase()) ||
          item?.user?.phone_number?.includes(value)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectNgo = (item) => {
    setSearch(item?.user?.name || "");
    setSuggestions([]);
    setShowDropdown(false);
  };
  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>iSO Request List</h2>
          {/* <button className="btn bg-warning btn-sm">Button</button> */}
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
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    value={filters.mobileNumber}
                    onChange={handleFilterChange}
                  />
                </Col>
                <Col md={2}>
                  <label className="form-label">Request Email</label>
                  <input
                    type="text"
                    className="form-control"
                    name="testFlightEmail"
                    placeholder="Enter Email"
                    value={filters.testFlightEmail}
                    onChange={handleFilterChange}
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
                  <th>Name</th>
                  {/* <th>Phone</th> */}
                  <th>Email</th>
                  <th>Request Email</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>

                      <td>#{item?.userId}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
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
                      {/* <td>{item?.user?.phone_number}</td> */}
                      <td>{item?.user?.email}</td>
                      <td>{item?.testFlightEmail}</td>
                      <td>
                        <span className={`badge bg-${item?.status === 'approved' ? 'success' : item?.status === 'rejected' ? 'danger' : item?.status === 'pending' ? 'warning' : 'info'}`}>
                          {item?.status || 'New'}
                        </span>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        <ul className="d-flex align-items-center gap-3 list-unstyled mb-0">
                          <li>
                            <FaToggleOn
                              size={18}
                              className="text-primary cursor-pointer"
                              onClick={() => handleStatusChangeClick(item)}
                              title="Change Status"
                            />
                          </li>
                          <li>
                            <FaReply
                              size={18}
                              className="text-success cursor-pointer"
                              onClick={() => handleReplyClick(item)}
                              title="Reply"
                            />
                          </li>
                          <li>
                            <FaEnvelope
                              size={18}
                              className="text-success cursor-pointer"
                              onClick={() => handleUpdateEmailClick(item)}
                              title="Update Email"
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
              <Modal.Title className="fw-bold">Reply to Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedContact && (
                <div>
                  <div className="mb-3 p-2 bg-light rounded">
                    <small className="text-muted">From: {selectedContact?.user?.email}</small>
                  </div>
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

        {/* Update Email Modal */}
        <Modal show={showUpdateEmailModal} onHide={handleCloseUpdateEmailModal} centered>
          <div className={styles.card}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Update TestFlight Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedItemForEmail && (
                <div>
                  <div className="mb-3 p-2 bg-light rounded">
                    <div className="mb-2">
                      <small className="text-muted d-block">User: <strong>{selectedItemForEmail?.user?.name}</strong></small>
                    </div>
                    <div>
                      <small className="text-muted d-block">ID: <strong>{selectedItemForEmail?.userId}</strong></small>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">TestFlight Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter TestFlight email address..."
                      value={updateEmail}
                      onChange={(e) => setUpdateEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUpdateEmailModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveUpdateEmail}>
                Update Email
              </Button>
            </Modal.Footer>
          </div>
        </Modal>

        {/* Status Change Modal */}
        <Modal show={showStatusModal} onHide={handleCloseStatusModal} centered>
          <div className={styles.card}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Change Request Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedItemForStatus && (
                <div>
                  <div className="mb-3 p-2 bg-light rounded">
                    <div className="mb-2">
                      <small className="text-muted d-block">User: <strong>{selectedItemForStatus?.user?.name}</strong></small>
                    </div>
                    <div>
                      <small className="text-muted d-block">Current Status: <strong className={`text-${selectedItemForStatus?.status === 'approved' ? 'success' : selectedItemForStatus?.status === 'rejected' ? 'danger' : selectedItemForStatus?.status === 'pending' ? 'warning' : 'info'}`}>{selectedItemForStatus?.status || 'new'}</strong></small>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">New Status</label>
                    <select
                      className="form-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="">Select a status...</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseStatusModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveStatusChange}>
                Update Status
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </Container>
    </DashboardLayout>
  );
}
