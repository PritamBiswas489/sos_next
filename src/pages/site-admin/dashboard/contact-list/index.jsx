import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table, Modal, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { contactList, replyContactAdmin } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit, FaReply } from "react-icons/fa";
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
    userId: "",
    mobileNumber: "",
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

  const fetchContactList = async (page = 0) => {
    try {
      dispatch(SHOW_LOADER());

      const params = {
        page: page + 1,
        limit: itemsPerPage,
      };

      // Add filters if they have values
      if (filters.userId) params.userId = filters.userId;
      if (filters.mobileNumber) params.mobileNumber = filters.mobileNumber;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      console.log("params", params);

      const response = await contactList(params);

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
    fetchContactList(0);
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    fetchContactList(selected);
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
      const response = await replyContactAdmin({
        contact_id: selectedContact.id,
        message: replyMessage,
      });

      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success("Reply sent successfully");
        setShowReplyModal(false);
        setReplyMessage("");
        fetchContactList(currentPage);
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

  const handleApplyFilters = () => {
    setCurrentPage(0);
    fetchContactList(0);
  };

  const handleClearFilters = () => {
    setFilters({
      userId: "",
      mobileNumber: "",
      fromDate: "",
      toDate: "",
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
          <h2 className={styles.title}>Contact List</h2>
          {/* <button className="btn bg-warning btn-sm">Button</button> */}
        </div>

        <Row>
          <Col>
            {/* Filter Section */}
            <div className="mb-4 p-3 border rounded">
              {/* <h5 className="mb-3">Filters</h5> */}
              <Row className="g-3">
                <Col md={2}>
                  <label className="form-label">User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="userId"
                    placeholder="Enter User ID"
                    value={filters.userId}
                    onChange={handleFilterChange}
                  />
                </Col>

                <Col md={2}>
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobileNumber"
                    placeholder="Enter Mobile Number"
                    value={filters.mobileNumber}
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

                <Col md={4} className="d-flex align-items-end gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleApplyFilters}
                    style={{ flex: 1 }}
                  >
                    Apply Filters
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleClearFilters}
                    style={{ flex: 1 }}
                  >
                    Clear Filters
                  </button>
                </Col>
              </Row>
            </div>

            {/* ✅ Table */}
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>

                      <td>{item?.userId}</td>
                      <td>{item?.user?.name}</td>
                      <td>{item?.user?.phone_number}</td>
                      <td>
                        <MessageCell message={item.message} itemId={item.id} />
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="">
                        <ul className="d-flex align-items-center">
                          <li>
                            <FaReply
                              size={18}
                              className="text-success cursor-pointer"
                              onClick={() => handleReplyClick(item)}
                              title="Reply"
                            />
                          </li>
                          {/* <li>
                            <FaEye
                              size={20}
                              className="text-primary cursor-pointer"
                              onClick={() => handleView(item)}
                            />
                          </li>
                          <li>
                            <FaEdit
                              size={20}
                              className="text-success cursor-pointer ms-3"
                              onClick={() => handleEdit(item)}
                            />
                          </li> */}
                        </ul>
                        

                        
                      </td>
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

        {/* Reply Modal */}
        <Modal show={showReplyModal} onHide={handleCloseReplyModal} centered>
            <div className={styles.card}>
                <Modal.Header closeButton>
                    <Modal.Title>Reply to Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedContact && (
                    <div className="mb-3">
                        <div className="mb-2">
                        <strong>From:</strong> {selectedContact?.user?.name}
                        </div>
                        <div className="mb-3">
                        <strong>Message:</strong>
                        <p className="mt-2 p-2 rounded">{selectedContact?.message}</p>
                        </div>
                        <label className="form-label">Your Reply</label>
                        <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Enter your reply message..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        style={{ resize: "vertical" }}
                        />
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
