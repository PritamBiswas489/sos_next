import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table, Modal, Button, Collapse } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { fetchabusersWithReportStats } from "@/services/admin.service";
import { FaFilter } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

export default function AbusersWithReportStats() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  const initialFilters = {
    abuserId: "",
    abuser_id: "",
    full_name: "",
    alias_name: "",
    gender: "",
    email: "",
    abuseType: "",
    threatLevel: "",
    history_of_violence: "",
    weapon_access: "",
    restraining_order: "",
    incidentFromDate: "",
    incidentToDate: "",
    fromDate: "",
    toDate: "",
    userId: "",
    userName: "",
    mobileNumber: "",
  };

  const [filters, setFilters] = useState(initialFilters);
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

      if (activeFilters?.fromDate) params.fromDate = activeFilters.fromDate;
      if (activeFilters?.toDate) params.toDate = activeFilters.toDate;
      if (activeFilters?.incidentFromDate) params.incidentFromDate = activeFilters.incidentFromDate;
      if (activeFilters?.incidentToDate) params.incidentToDate = activeFilters.incidentToDate;

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

      if (activeFilters?.full_name) params.full_name = activeFilters.full_name;
      if (activeFilters?.alias_name) params.alias_name = activeFilters.alias_name;
      if (activeFilters?.gender) params.gender = activeFilters.gender;
      if (activeFilters?.email) params.email = activeFilters.email;
      if (activeFilters?.abuseType) params.abuseType = activeFilters.abuseType;
      if (activeFilters?.threatLevel) params.threatLevel = activeFilters.threatLevel;
      if (activeFilters?.history_of_violence) params.history_of_violence = activeFilters.history_of_violence;
      if (activeFilters?.weapon_access) params.weapon_access = activeFilters.weapon_access;
      if (activeFilters?.restraining_order) params.restraining_order = activeFilters.restraining_order;
      if (activeFilters?.userName) params.userName = activeFilters.userName;
      if (activeFilters?.mobileNumber) params.mobileNumber = activeFilters.mobileNumber;

      const response = await fetchabusersWithReportStats(params);
      const resData = response.data;

      if (resData?.status === 200) {
        setData(resData?.data?.rows || []);
        setTotalPages(resData?.data?.totalPages || 0);
        setCurrentPage((resData?.data?.currentPage || 1) - 1);
      } else {
        toast.error(resData?.error?.message || "Failed to fetch abuser report stats");
      }
    } catch (error) {
      toast.error(error?.message, "Something went wrong");
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
    setFilters(initialFilters);
    setCurrentPage(0);
    fetchAbouseReport(0, initialFilters);
  };

  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>Abusers With Report Stats</h2>
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
                <input type="text" className="form-control" name="abuserId" placeholder="Abuser ID" value={filters.abuserId} onChange={handleFilterChange} />
              </Col>
              <Col md={3}>
                <input type="text" className="form-control" name="full_name" placeholder="Abuser Full Name" value={filters.full_name} onChange={handleFilterChange} />
              </Col>
              <Col md={3}>
                <input type="text" className="form-control" name="alias_name" placeholder="Alias Name" value={filters.alias_name} onChange={handleFilterChange} />
              </Col>
              <Col md={3}>
                <input type="text" className="form-control" name="gender" placeholder="Gender" value={filters.gender} onChange={handleFilterChange} />
              </Col>
              <Col md={3}>
                <input type="email" className="form-control" name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
              </Col>
              <Col md={3}>
                <input type="text" className="form-control" name="abuseType" placeholder="Abuse Type" value={filters.abuseType} onChange={handleFilterChange} />
              </Col>
              <Col md={3}>
                <select className="form-control" name="threatLevel" value={filters.threatLevel} onChange={handleFilterChange}>
                  <option value="">Threat Level</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </Col>
              <Col md={3}>
                <select className="form-control" name="history_of_violence" value={filters.history_of_violence} onChange={handleFilterChange}>
                  <option value="">History of Violence</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </Col>
              <Col md={3}>
                <select className="form-control" name="weapon_access" value={filters.weapon_access} onChange={handleFilterChange}>
                  <option value="">Weapon Access</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </Col>
              <Col md={3}>
                <select className="form-control" name="restraining_order" value={filters.restraining_order} onChange={handleFilterChange}>
                  <option value="">Restraining Order</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </Col>
              <Col md={3}>
                <DatePicker selected={filters.incidentFromDate ? new Date(filters.incidentFromDate) : null} onChange={(date) => handleDateChange("incidentFromDate", date)} className="form-control" placeholderText="Incident From" dateFormat="MM/dd/yyyy" />
              </Col>
              <Col md={3}>
                <DatePicker selected={filters.incidentToDate ? new Date(filters.incidentToDate) : null} onChange={(date) => handleDateChange("incidentToDate", date)} className="form-control" placeholderText="Incident To" dateFormat="MM/dd/yyyy" />
              </Col>
              <Col md={3}>
                <DatePicker selected={filters.fromDate ? new Date(filters.fromDate) : null} onChange={(date) => handleDateChange("fromDate", date)} className="form-control" placeholderText="Created From" dateFormat="MM/dd/yyyy" />
              </Col>
              <Col md={3}>
                <DatePicker selected={filters.toDate ? new Date(filters.toDate) : null} onChange={(date) => handleDateChange("toDate", date)} className="form-control" placeholderText="Created To" dateFormat="MM/dd/yyyy" />
              </Col>
              <Col md={3}>
                <input type="text" className="form-control" name="userId" placeholder="User ID" value={filters.userId} onChange={handleFilterChange} />
              </Col>
              <Col md={3}>
                <input type="text" className="form-control" name="userName" placeholder="User Name" value={filters.userName} onChange={handleFilterChange} />
              </Col>
              <Col md={3}>
                <input type="text" className="form-control" name="mobileNumber" placeholder="Mobile Number" value={filters.mobileNumber} onChange={handleFilterChange} />
              </Col>
              <Col md={2} className="d-flex justify-content-end align-items-end gap-2 ms-auto">
                <button className="btn btn-primary" onClick={handleApplyFilters}>Search</button>
                <button className="btn btn-outline-secondary" onClick={handleClearFilters}>Clear</button>
              </Col>
            </Row>
          </div>
        </Collapse>

        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Abuser</th>
              <th>Alias</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Reports</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {item.photo ? (
                        <Image 
                          height={'100'} 
                          width={'100'}
                          src={item.photo} 
                          alt={item.full_name ?? "Abuser"} 
                          style={{ width: 36, height: 36, objectFit: "cover", borderRadius: "50%" }} 
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
                          {getInitials(item.full_name)}
                        </div>
                      )}
                      <span>{item.full_name ?? "-"}</span>
                    </div>
                  </td>
                  <td>{item.alias_name ?? "-"}</td>
                  <td>{item.gender ?? "-"}</td>
                  <td>{item.phone ?? "-"}</td>
                  <td>{item.email ?? "-"}</td>
                  <td>{item.report_count ?? 0}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => openDetailModal(item)}>Show More</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No Data Found</td>
              </tr>
            )}
          </tbody>
        </Table>

        <Modal show={showDetailModal} onHide={closeDetailModal} centered dialogClassName={styles.customModal} contentClassName={styles.modalContent}>
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title>Abuser Report Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            {selectedReport ? (
              <>
                <div className={styles.modalSection}>
                  <div className={styles.sectionTitle}>Abuser Overview</div>
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}><span className={styles.detailLabel}>Full Name</span><span className={styles.detailValue}>{selectedReport.full_name ?? "-"}</span></div>
                    <div className={styles.detailItem}><span className={styles.detailLabel}>Alias</span><span className={styles.detailValue}>{selectedReport.alias_name ?? "-"}</span></div>
                    <div className={styles.detailItem}><span className={styles.detailLabel}>Gender</span><span className={styles.detailValue}>{selectedReport.gender ?? "-"}</span></div>
                    <div className={styles.detailItem}><span className={styles.detailLabel}>Phone</span><span className={styles.detailValue}>{selectedReport.phone ?? "-"}</span></div>
                    <div className={styles.detailItem}><span className={styles.detailLabel}>Email</span><span className={styles.detailValue}>{selectedReport.email ?? "-"}</span></div>
                    <div className={styles.detailItem}><span className={styles.detailLabel}>Report Count</span><span className={styles.detailValue}>{selectedReport.report_count ?? 0}</span></div>
                  </div>
                </div>

                <div className={styles.modalSection}>
                  <div className={styles.sectionTitle}>Profile Photo</div>
                  {selectedReport.photo ? (
                    <Image 
                      height={'100'} 
                      width={'100'} 
                      src={selectedReport.photo} 
                      alt={selectedReport.full_name ?? "Abuser"} 
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    /> 
                    ) : (
                    <div className={styles.detailValue}>No profile photo available</div>
                  )}
                </div>

                <div className={styles.modalSection}>
                  <div className={styles.sectionTitle}>Victims</div>
                  {selectedReport.victims && selectedReport.victims.length > 0 ? (
                    selectedReport.victims.map((victim) => (
                      <div key={victim.id} className={styles.detailItem} style={{ marginBottom: 12 }}>
                        <span className={styles.detailLabel}>Name</span>
                        <span className={styles.detailValue}>{victim.name ?? "-"}</span>
                        <span className={styles.detailLabel}>Email</span>
                        <span className={styles.detailValue}>{victim.email ?? "-"}</span>
                        <span className={styles.detailLabel}>Phone</span>
                        <span className={styles.detailValue}>{victim.phone_number ?? "-"}</span>
                        {victim.profile_photo ? (
                          <Image 
                            height={'100'} 
                            width={'100'} 
                            src={victim.profile_photo} 
                            alt={victim.name ?? "Victim"} 
                            style={{
                              borderRadius: "50%",
                              objectFit: "cover",
                            }} 
                          /> 
                        ):( 
                          null
                        )}
                      </div>
                    ))
                  ) : (
                    <div className={styles.detailValue}>No victim details found</div>
                  )}
                </div>
              </>
            ) : null}
          </Modal.Body>
        </Modal>

        {totalPages > 1 ?? (
          <ReactPaginate previousLabel={"← Prev"} nextLabel={"Next →"} breakLabel={"..."} pageCount={totalPages} forcePage={currentPage} onPageChange={handlePageClick} containerClassName={styles.pagination} activeClassName={styles.active} pageClassName={styles.pageItem} previousClassName={styles.pageItem} nextClassName={styles.pageItem} disabledClassName={styles.disabled} />
        )}
      </Container>
    </DashboardLayout>
  );
}