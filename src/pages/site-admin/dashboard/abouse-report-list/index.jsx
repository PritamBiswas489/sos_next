import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table, Modal, Button, Collapse } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { fetchAbouseReportList } from "@/services/admin.service";
import { FaFilter } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

export default function AbouseReport() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  // Filter states
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    userId: "",
    user_id: "",
    abuserId: "",
    abuser_id: "",
    abuseType: "",
    threatLevel: "",
    history_of_violence: "",
    weapon_access: "",
    restraining_order: "",
    userName: "",
    mobileNumber: "",
    abuserName: "",
    abuserPhone: "",
    abuserEmail: "",
    incidentFromDate: "",
    incidentToDate: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const openDetailModal = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedReport(null);
    setShowDetailModal(false);
  };

  const formatBoolean = (value) => {
    if (value === null || value === undefined) return "N/A";
    return value ? "Yes" : "No";
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const fetchAbouseReport = async (page = 0, activeFilters = filters) => {
    try {
      dispatch(SHOW_LOADER());

      const params = {
        page: page + 1,
        limit: itemsPerPage,
      };

      // Add filters if they have values
      if (activeFilters?.fromDate) params.fromDate = activeFilters.fromDate;
      if (activeFilters?.toDate) params.toDate = activeFilters.toDate;
      const userIdentifier = activeFilters?.userId || activeFilters?.user_id;
      if (userIdentifier) {
        params.userId = userIdentifier;
        params.user_id = userIdentifier;
      }

      const abuserIdentifier = activeFilters?.abuserId || activeFilters?.abuser_id;
      if (abuserIdentifier) {
        params.abuserId = abuserIdentifier;
        params.abuser_id = abuserIdentifier;
      }

      if (activeFilters?.abuseType) params.abuseType = activeFilters.abuseType;
      if (activeFilters?.threatLevel) params.threatLevel = activeFilters.threatLevel;
      if (activeFilters?.history_of_violence) params.history_of_violence = activeFilters.history_of_violence;
      if (activeFilters?.weapon_access) params.weapon_access = activeFilters.weapon_access;
      if (activeFilters?.restraining_order) params.restraining_order = activeFilters.restraining_order;
      if (activeFilters?.userName) params.userName = activeFilters.userName;
      if (activeFilters?.mobileNumber) params.mobileNumber = activeFilters.mobileNumber;
      if (activeFilters?.abuserName) params.abuserName = activeFilters.abuserName;
      if (activeFilters?.abuserPhone) params.abuserPhone = activeFilters.abuserPhone;
      if (activeFilters?.abuserEmail) params.abuserEmail = activeFilters.abuserEmail;
      if (activeFilters?.incidentFromDate) params.incidentFromDate = activeFilters.incidentFromDate;
      if (activeFilters?.incidentToDate) params.incidentToDate = activeFilters.incidentToDate;

      // console.log("params", params);

      const response = await fetchAbouseReportList(params);

      const resData = response.data;

      if (resData?.status === 200) {
        setData(resData?.data?.rows || []);
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
    fetchAbouseReport(0);
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    fetchAbouseReport(selected);
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



  const handleApplyFilters = () => {
    setCurrentPage(0);
    fetchAbouseReport(0, filters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      fromDate: "",
      toDate: "",
      userId: "",
      user_id: "",
      abuserId: "",
      abuser_id: "",
      abuseType: "",
      threatLevel: "",
      history_of_violence: "",
      weapon_access: "",
      restraining_order: "",
      userName: "",
      mobileNumber: "",
      abuserName: "",
      abuserPhone: "",
      abuserEmail: "",
      incidentFromDate: "",
      incidentToDate: "",
    };

    setFilters(emptyFilters);
    setCurrentPage(0);
    fetchAbouseReport(0, emptyFilters);
  };

  useEffect(() => {
    handleApplyFilters();
  }, []);


  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>Abouse Report</h2>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <FaFilter className="me-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <Collapse in={showFilters}>
          <div className={`${styles.filterPanel} mb-4 p-3 border rounded`}>
            <Row className="g-3">
              <Col md={3}>
                <input
                  type="text"
                  className="form-control"
                  name="userId"
                  placeholder="Reporting User ID"
                  value={filters.userId}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={3}>
                <input
                  type="text"
                  className="form-control"
                  name="abuserId"
                  placeholder="Abuser ID"
                  value={filters.abuserId}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={3}>
                <input
                  type="text"
                  className="form-control"
                  name="userName"
                  placeholder="Reporting User Name"
                  value={filters.userName}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={3}>
                <input
                  type="text"
                  className="form-control"
                  name="mobileNumber"
                  placeholder="Reporting Mobile"
                  value={filters.mobileNumber}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={3}>
                <input
                  type="text"
                  className="form-control"
                  name="abuserName"
                  placeholder="Abuser Full Name"
                  value={filters.abuserName}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={3}>
                <input
                  type="text"
                  className="form-control"
                  name="abuserPhone"
                  placeholder="Abuser Phone"
                  value={filters.abuserPhone}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={3}>
                <input
                  type="email"
                  className="form-control"
                  name="abuserEmail"
                  placeholder="Abuser Email"
                  value={filters.abuserEmail}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={3}>
                <input
                  type="text"
                  className="form-control"
                  name="abuseType"
                  placeholder="Abuse Type"
                  value={filters.abuseType}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={3}>
                <select
                  className="form-control"
                  name="threatLevel"
                  value={filters.threatLevel}
                  onChange={handleFilterChange}
                >
                  <option value="">Threat Level</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </Col>

              <Col md={3}>
                <select
                  className="form-control"
                  name="history_of_violence"
                  value={filters.history_of_violence}
                  onChange={handleFilterChange}
                >
                  <option value="">History of Violence</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </Col>

              <Col md={3}>
                <select
                  className="form-control"
                  name="weapon_access"
                  value={filters.weapon_access}
                  onChange={handleFilterChange}
                >
                  <option value="">Weapon Access</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </Col>

              <Col md={3}>
                <select
                  className="form-control"
                  name="restraining_order"
                  value={filters.restraining_order}
                  onChange={handleFilterChange}
                >
                  <option value="">Restraining Order</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </Col>

              <Col md={3}>
                <DatePicker
                  selected={filters.incidentFromDate ? new Date(filters.incidentFromDate) : null}
                  onChange={(date) => handleDateChange("incidentFromDate", date)}
                  className="form-control"
                  placeholderText="Incident From"
                  dateFormat="MM/dd/yyyy"
                />
              </Col>

              <Col md={3}>
                <DatePicker
                  selected={filters.incidentToDate ? new Date(filters.incidentToDate) : null}
                  onChange={(date) => handleDateChange("incidentToDate", date)}
                  className="form-control"
                  placeholderText="Incident To"
                  dateFormat="MM/dd/yyyy"
                />
              </Col>

              <Col md={3}>
                <DatePicker
                  selected={filters.fromDate ? new Date(filters.fromDate) : null}
                  onChange={(date) => handleDateChange("fromDate", date)}
                  className="form-control"
                  placeholderText="Created From"
                  dateFormat="MM/dd/yyyy"
                />
              </Col>

              <Col md={3}>
                <DatePicker
                  selected={filters.toDate ? new Date(filters.toDate) : null}
                  onChange={(date) => handleDateChange("toDate", date)}
                  className="form-control"
                  placeholderText="Created To"
                  dateFormat="MM/dd/yyyy"
                />
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
        </Collapse>
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Threat</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {item?.abuser?.photo ? (
                            // <img
                            //   src={item.abuser.photo}
                            //   alt={item.abuser.full_name}
                            //   style={{
                            //     width: "40px",
                            //     height: "40px",
                            //     borderRadius: "50%",
                            //     objectFit: "cover",
                            //   }}
                            // />
                            <Image 
                              height={'100'} 
                              width={'100'} 
                              src={item.abuser.photo} 
                              alt={item.abuser.full_name} 
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
                      <td>{formatDateTime(item.incident_date || item.created_at)}</td>
                      <td>{item.threat_level || "-"}</td>
                      <td>{item.incident_location || "-"}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openDetailModal(item)}
                        >
                          Show More
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <Modal
              show={showDetailModal}
              onHide={closeDetailModal}
              centered
              dialogClassName={styles.customModal}
              contentClassName={styles.modalContent}
            >
              <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title>Report Details</Modal.Title>
              </Modal.Header>
              <Modal.Body className={styles.modalBody}>
                {selectedReport ? (
                  <>
                    <div className={styles.modalSection}>
                      <div className={styles.sectionTitle}>Incident Overview</div>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Report ID</span>
                          <span className={styles.detailValue}>#{selectedReport.id}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Abuse Type</span>
                          <span className={styles.detailValue}>{selectedReport.abuse_type || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Incident Date</span>
                          <span className={styles.detailValue}>{formatDateTime(selectedReport.incident_date)}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Threat Level</span>
                          <span className={styles.detailValue}>{selectedReport.threat_level || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Location</span>
                          <span className={styles.detailValue}>{selectedReport.incident_location || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.modalSection}>
                      <div className={styles.sectionTitle}>Victim & Witness Details</div>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Reported By</span>
                          <span className={styles.detailValue}>{selectedReport.user?.name || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Reporter Contact</span>
                          <span className={styles.detailValue}>{selectedReport.user?.phone_number || selectedReport.user?.email || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Witness Information</span>
                          <span className={styles.detailValue}>{selectedReport.witness_information || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Notes</span>
                          <span className={styles.detailValue}>{selectedReport.notes || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.modalSection}>
                      <div className={styles.sectionTitle}>Risk & History</div>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>History of Violence</span>
                          <span className={styles.detailValue}>{formatBoolean(selectedReport.history_of_violence)}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Weapon Access</span>
                          <span className={styles.detailValue}>{formatBoolean(selectedReport.weapon_access)}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Restraining Order</span>
                          <span className={styles.detailValue}>{selectedReport.restraining_order || "None"}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.modalSection}>
                      <div className={styles.sectionTitle}>Location & Description</div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Incident Description</span>
                        <span className={styles.detailValue}>{selectedReport.description || "-"}</span>
                      </div>
                    </div>

                    <div className={styles.modalSection}>
                      <div className={styles.sectionTitle}>Abuser Details</div>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                          {selectedReport?.abuser?.photo ? (
                            <Image
                              src={selectedReport.abuser.photo}
                              alt={selectedReport.abuser?.full_name || "Abuser"}
                              width={80}
                              height={80}
                              style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div>
                            </div>
                          )}
                          <span className={styles.detailLabel}>Name</span>
                          <span className={styles.detailValue}>{selectedReport.abuser?.full_name || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Alias</span>
                          <span className={styles.detailValue}>{selectedReport.abuser?.alias_name || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Gender</span>
                          <span className={styles.detailValue}>{selectedReport.abuser?.gender || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Phone</span>
                          <span className={styles.detailValue}>{selectedReport.abuser?.phone || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Email</span>
                          <span className={styles.detailValue}>{selectedReport.abuser?.email || "-"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Address</span>
                          <span className={styles.detailValue}>{selectedReport.abuser?.address || "-"}</span>
                        </div>
                      </div>
                    </div>

                    {selectedReport.evidence_files?.length > 0 && (
                      <div className={styles.modalSection}>
                        <div className={styles.sectionTitle}>Evidence Files</div>
                        <div className={styles.detailItem}>
                          {selectedReport.evidence_files.map((file, index) => (
                            <div key={index} className={styles.fileEntry}>
                              {file.file_url ? (
                                <a href={file.file_url} target="_blank" rel="noreferrer" className={styles.fileLink}>
                                  {file.file_type ? `${file.file_type.toUpperCase()} file` : "Download file"}
                                </a>
                              ) : (
                                <span>{file.file_type || "Unknown file"}</span>
                              )}
                              {file.created_at ? (
                                <small className={styles.fileMeta}>{new Date(file.created_at).toLocaleString()}</small>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </Modal.Body>
            </Modal>

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
          {/* </Col>
        </Row> */}

      </Container>
    </DashboardLayout>
  );
}
