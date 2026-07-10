import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table, Modal, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { allSOSList, contactList, ngoSOSList, replyContactAdmin } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit, FaReply } from "react-icons/fa";
import NgoUpdateModal from "@/component/Popup/Admin/NgoUpdate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

export default function AllSoslist() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [showNgoUpdateModal, setShowNgoUpdateModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    ngo_id: "",
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

  const statusOptions = ["active", "expired", "cancelled", "resolved"];

  const fetchNgoSosList = async (page = 0) => {
    try {
      dispatch(SHOW_LOADER());

      const params = {
        page: page + 1,
        limit: itemsPerPage,
      };

      // Add filters if they have values
      if (filters.ngo_id) params.ngo_id = filters.ngo_id;
      if (filters.status) params.status = filters.status;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      console.log("params", params);

      const response = await allSOSList(params);

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
    fetchNgoSosList(0);
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    fetchNgoSosList(selected);
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

 



  const handleApplyFilters = () => {
    setCurrentPage(0);
    fetchNgoSosList(0);
  };

  const handleClearFilters = () => {
    setFilters({
      ngo_id: "",
      status: "",
      fromDate: "",
      toDate: "",
    });
    setCurrentPage(0);
    fetchNgoSosList(0);
  };

  useEffect(() => {
    handleApplyFilters();
  }, []);


  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };



  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>SOS List</h2>
          {/* <button className="btn bg-warning btn-sm">Button</button> */}
        </div>

        <Row>
          <Col>
            {/* Filter Section */}
            <div className="mb-4 p-3 border rounded">
              {/* <h5 className="mb-3">Filters</h5> */}
              <Row className="g-3">
                <Col md={2}>
                  <label className="form-label">NGO ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ngo_id"
                    placeholder="NGO ID"
                    value={filters.ngo_id}
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
                    Search
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleClearFilters}
                    style={{ flex: 1 }}
                  >
                    Clear
                  </button>
                </Col>
              </Row>
            </div>

            {/* ✅ Table */}
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Location</th>
                  <th>Audio</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
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
                              {getInitials(item?.user?.name)}
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold">{item?.user?.name || "Unknown"}</div>
                            <div className="small">{item?.user?.phone_number || item?.user?.email || "-"}</div>
                          </div>
                        </div>

                      </td>
                      <td>{item?.location}</td>
                      <td>
                        {item?.audio_records?.length > 0 ? (
                          <div className="d-flex flex-column">
                            {item.audio_records.map((audio) => (
                              <div key={audio.id}>
                                <audio controls preload="none" style={{ width: "250px" }}>
                                  <source src={audio.file_url} type="audio/mpeg" />
                                  Your browser does not support the audio element.
                                </audio>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>No Audio</span>
                        )}
                      </td>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            item?.status === "active"
                              ? "bg-success"
                              : item?.status === "expired"
                              ? "bg-warning text-dark"
                              : item?.status === "cancelled"
                              ? "bg-danger"
                              : item?.status === "resolved"
                              ? "bg-primary"
                              : "bg-secondary"
                          }`}
                        >
                          {item?.status}
                        </span>
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

      </Container>
    </DashboardLayout>
  );
}
