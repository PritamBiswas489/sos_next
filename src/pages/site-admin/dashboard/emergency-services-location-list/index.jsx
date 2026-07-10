import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table, Modal, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { fetchEmergencyServicesLocationList, updateAppFeedbackStatus, updateEmergencyServicesLocation } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit, FaReply, FaEnvelope, FaToggleOn, FaDownload } from "react-icons/fa";
import NgoUpdateModal from "@/component/Popup/Admin/NgoUpdate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EmergencyServicesLocation() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  // Filter states
  const [filters, setFilters] = useState({
    requestBy: "",
    serviceType: "",
    phoneNumber: "",
    placeId: "",
    locationName: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  
  const [allData, setAllData] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({});
  
  // Reply modal state
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const [updatingFeedbackId, setUpdatingFeedbackId] = useState(null);
  const statusOptions = ["pending", "approved"];

  const fetchAppFeedback = async (page = 0, activeFilters = filters) => {
    try {
      dispatch(SHOW_LOADER());

      const params = {
        page: page + 1,
        limit: itemsPerPage,
      };

      // Add filters if they have values
      if (activeFilters?.requestBy) params.requestBy = activeFilters.requestBy;
      if (activeFilters?.serviceType) params.serviceType = activeFilters.serviceType;
      if (activeFilters?.phoneNumber) params.phoneNumber = activeFilters.phoneNumber;
      if (activeFilters?.placeId) params.placeId = activeFilters.placeId;
      if (activeFilters?.locationName) params.locationName = activeFilters.locationName;
      if (activeFilters?.status) params.status = activeFilters.status;
      if (activeFilters?.fromDate) params.fromDate = activeFilters.fromDate;
      if (activeFilters?.toDate) params.toDate = activeFilters.toDate;

      // console.log("params", params);

      const response = await fetchEmergencyServicesLocationList(params);

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

 


  const handleStatusUpdate = async (feedbackId, selectedStatus) => {
    if (!feedbackId || !selectedStatus) return;

    try {
      setUpdatingFeedbackId(feedbackId);
      dispatch(SHOW_LOADER());

      const response = await updateEmergencyServicesLocation({
        id: Number(feedbackId),
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
      requestBy: "",
      serviceType: "",
      phoneNumber: "",
      placeId: "",
      locationName: "",
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
          <h2 className={styles.title}>Emergency Services Location</h2>
        </div>

        <Row>
          <Col>
            <div className="mb-4 p-3 border rounded">
              <Row className="g-3">
                <Col md={3}>
                  <input
                    type="text"
                    className="form-control"
                    name="requestBy"
                    placeholder="Enter User ID"
                    value={filters.requestBy}
                    onChange={handleFilterChange}
                  />
                </Col>

                <Col md={3}>
                  <input
                    type="text"
                    className="form-control"
                    name="serviceType"
                    placeholder="Service Type"
                    value={filters.serviceType}
                    onChange={handleFilterChange}
                  />
                </Col>

                <Col md={3}>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={filters.phoneNumber}
                    onChange={handleFilterChange}
                  />
                </Col>

                <Col md={3}>
                  <input
                    type="text"
                    className="form-control"
                    name="placeId"
                    placeholder="Place Id"
                    value={filters.placeId}
                    onChange={handleFilterChange}
                  />
                </Col>

                <Col md={3}>
                  <input
                    type="text"
                    className="form-control"
                    name="locationName"
                    placeholder="Location Name"
                    value={filters.locationName}
                    onChange={handleFilterChange}
                  />
                </Col>

                
                <Col md={3}>
                    <DatePicker
                    selected={filters.fromDate ? new Date(filters.fromDate) : null}
                    onChange={(date) => handleDateChange("fromDate", date)}
                    className="form-control"
                    placeholderText="From Date"
                    dateFormat="MM/dd/yyyy"
                    />
                </Col>

                <Col md={3}>
                    <DatePicker
                    selected={filters.toDate ? new Date(filters.toDate) : null}
                    onChange={(date) => handleDateChange("toDate", date)}
                    className="form-control"
                    placeholderText="To Date"
                    dateFormat="MM/dd/yyyy"
                    />
                </Col>

                <Col md={3}>
                  <select
                    className="form-control"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </Col>

                <Col md={2} className="d-flex justify-content-end align-items-end gap-2 ms-auto">
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
                  <th>Place Id</th>
                  <th>Location Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Service Type</th>
                  <th>Date</th>
                  <th style={{ width: "150px", minWidth: "150px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>

                      <td>#{item?.user?.id}</td>
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
                      <td>{item?.placeId}</td>
                      <td>{item?.locationName}</td>
                      <td>{item?.address}</td>
                      <td>{item?.phoneNumber}</td>
                      <td>{item?.serviceType}</td>
                      
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
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

      </Container>
    </DashboardLayout>
  );
}
