import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import GooglePlaceInput from "@/component/GooglePlaceInput";
import { fetchEmergencyServicesLocationList, updateAppFeedbackStatus, updateEmergencyServicesLocation, registerNewLocationAdmin, deleteEmergencyServicesLocation } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit, FaReply, FaEnvelope, FaToggleOn, FaDownload, FaMapMarkerAlt, FaPhoneAlt, FaTags, FaTrash } from "react-icons/fa";
import NgoUpdateModal from "@/component/Popup/Admin/NgoUpdate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EmergencyServicesLocation() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);

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

  const CATEGORIES = [
    { id: 'medical-emergency', label: 'Medical Emergency' },
    { id: 'police-station', label: 'Police Station' },
    { id: 'fire-station', label: 'Fire Station' },
    { id: 'disaster-relief-center', label: 'Disaster Relief Center' },
    { id: 'blood-bank', label: 'Blood Bank' },
    { id: 'pharmacy-24x7', label: 'Pharmacy (24x7)' },
    { id: 'urgent-care-center', label: 'Urgent Care Center' },
    { id: 'trauma-center', label: 'Trauma Center' },
    { id: 'emergency-shelter', label: 'Emergency Shelter' },
    { id: 'roadside-assistance', label: 'Roadside Assistance' },
    { id: 'emergency-helpline', label: 'Emergency Helpline' },
    { id: 'ambulance-pickup-point', label: 'Ambulance Pickup Point' },
    { id: 'flood-cyclone-shelter', label: 'Flood/Cyclone Shelter' },
    { id: 'emergency-service-office', label: 'Emergency Service Office' },
    { id: 'child-help-center', label: 'Child Help Center' },
    { id: 'womens-safety-center', label: "Women's Safety Center" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const handleDeleteLocation = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this location?")) return;

    try {
      dispatch(SHOW_LOADER());
      const response = await deleteEmergencyServicesLocation({ id });
      if (response?.data?.status === 200 || response?.data?.status === 201) {
        toast.success(response?.data?.message || "Location deleted successfully");
        fetchAppFeedback(currentPage);
      } else {
        toast.error(response?.data?.error?.message || "Failed to delete location");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  const onSubmit = async (data) => {
    const phoneNumber = data.phoneNumber || locationData?.phoneNumber || "";

    try {
      setLoadingCreate(true);
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
        serviceType: data.category,
      };

      const response = await registerNewLocationAdmin(formData);

      if (response?.data?.status === 200) {
        toast.success(response?.data?.message || "Location added successfully");
        setShowAddLocationModal(false);
        reset();
        setLocationData(null);
        fetchAppFeedback(0);
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
      setLoadingCreate(false);
      dispatch(HIDE_LOADER());
    }
  };

  const location = watch("location");

  useEffect(() => {
    if (!location) {
      setValue("phoneNumber", "");
    }
  }, [location, setValue]);

  const getCategoryLabel = (value) => {
    return CATEGORIES.find((item) => item.id === value)?.label || value;
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
          <Button
            className="btn btn-primary outline-primary"
            onClick={() => setShowAddLocationModal(true)}
          >
            Add New location
          </Button>
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
                  <th>Action</th>
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
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteLocation(item.id)}
                          title="Delete location"
                        >
                          <FaTrash />
                        </button>
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

        {/* <Modal show={showAddLocationModal} onHide={() => setShowAddLocationModal(false)} centered> */}
        <Modal
          show={showAddLocationModal}
          onHide={() => setShowAddLocationModal(false)}
          centered
          enforceFocus={false}
          restoreFocus={false}
          size="lg"
        >
          <div className={styles.card}>
            <Modal.Header closeButton className={styles.modalHeader}>
              <Modal.Title>Add New Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <GooglePlaceInput
                        onPlaceSelected={(place) => {
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
                    <Form.Group className="mb-4">
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
                      
                    </Form.Group>
                    {errors.category && (
                      <InputErrorMsg
                        className={styles.errorStyle}
                        error={errors.category.message}
                        color="#f00"
                      />
                    )}
                  </Col>
                </Row>

                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.submitBtn} disabled={loadingCreate}>
                    {loadingCreate ? "Submitting..." : "Submit Request →"}
                  </button>
                </div>
              </form>
            </Modal.Body>
          </div>
        </Modal>

      </Container>
    </DashboardLayout>
  );
}
