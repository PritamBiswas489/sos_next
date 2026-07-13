import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import styles from "./index.module.scss";

import {
  FaAndroid,
  FaKey,
  FaUser,
  FaHome,
  FaFileAlt,
  FaIdCard,
  FaCar,
  FaPassport,
  FaCloudUploadAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTags,
} from "react-icons/fa";
import { donwloadLatestApk } from "@/services/common.service";
import { useDispatch } from "react-redux";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import DashboardLayout from "@/component/DashboardLayout";
import GooglePlaceInput from "@/component/GooglePlaceInput";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { registerNewLocation, getMyRequestedEmergencyServices } from "@/services/ngo.service";

const NgoRequestEmergencyLocation = () => {
 
  const dispatch = useDispatch();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [requestStatusData, setRequestStatusData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [activeTab, setActiveTab] = useState("new-request");
  const [myRequests, setMyRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [loadingMyRequests, setLoadingMyRequests] = useState(false);

  const CATEGORIES = [
    { id: 'medical-emergency', label: 'Medical Emergency', icon: 'ambulance' },
    { id: 'police-station', label: 'Police Station', icon: 'police' },
    { id: 'fire-station', label: 'Fire Station', icon: 'fire' },
    { id: 'disaster-relief-center', label: 'Disaster Relief Center', icon: 'disaster' },
    { id: 'blood-bank', label: 'Blood Bank', icon: 'blood' },
    { id: 'pharmacy-24x7', label: 'Pharmacy (24x7)', icon: 'pharmacy' },
    { id: 'urgent-care-center', label: 'Urgent Care Center', icon: 'urgentCare' },
    { id: 'trauma-center', label: 'Trauma Center', icon: 'trauma' },
    { id: 'emergency-shelter', label: 'Emergency Shelter', icon: 'shelter' },
    { id: 'roadside-assistance', label: 'Roadside Assistance', icon: 'roadside' },
    { id: 'emergency-helpline', label: 'Emergency Helpline', icon: 'helpline' },
    { id: 'ambulance-pickup-point', label: 'Ambulance Pickup Point', icon: 'pickup' },
    { id: 'flood-cyclone-shelter', label: 'Flood/Cyclone Shelter', icon: 'flood' },
    { id: 'emergency-service-office', label: 'Emergency Service Office', icon: 'serviceOffice' },
    { id: 'child-help-center', label: 'Child Help Center', icon: 'child' },
    { id: 'womens-safety-center', label: "Women's Safety Center", icon: 'women' },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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
   
  const onSubmit = async (data) => {
      
      const phoneNumber = data.phoneNumber || locationData?.phoneNumber || "";
      const category = data.category || "";

      try {
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
          serviceType: data?.category,
        };

        // console.log("formData", formData);
        // return;
          

        const response = await registerNewLocation(formData);

        if(response?.data?.status===200){
          toast.success(response?.data?.message || "Success");
          // setMyRequests((prev) => [submittedRequest, ...prev]);
          reset();
          fetchMyRequests();
          setActiveTab("my-request");
        }else{
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
  };

  const location = watch("location");

  const getCategoryLabel = (value) => {
    return CATEGORIES.find((item) => item.id === value)?.label || value;
  };

  const fetchMyRequests = async (page = 0) => {
    try {
      setLoadingMyRequests(true);
      dispatch(SHOW_LOADER());

      const params = {
        page: page + 1,
        limit: itemsPerPage,
      };

      const response = await getMyRequestedEmergencyServices(params);
      const resData = response?.data;

      if (resData?.status === 200) {
        const rows = resData?.data?.rows || resData?.data || [];
        setMyRequests(rows);
        setTotalPages(resData?.data?.totalPages || resData?.data?.totalPages || 0);
        setCurrentPage((resData?.data?.currentPage || page + 1) - 1);
      } else {
        toast.error(resData?.error?.message || "Failed to fetch requests");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoadingMyRequests(false);
      dispatch(HIDE_LOADER());
    }
  };

  const handleMyRequestPageClick = ({ selected }) => {
    setCurrentPage(selected);
    fetchMyRequests(selected);
  };

  const handleMyRequestTabClick = () => {
    setActiveTab("my-request");
    fetchMyRequests(0);
  };

  useEffect(() => {
    if (!location) {
      // setLocationData(null);
      setValue("phoneNumber", "");
    }
  }, [location, setValue]);



  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <h2 className={styles.title}>Request Emergency Location</h2>

        <div className={styles.tabBar}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "new-request" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("new-request")}
          >
            New Request
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "my-request" ? styles.tabButtonActive : ""}`}
            onClick={handleMyRequestTabClick}
          >
            My Request
          </button>
        </div>

        {/* HERO */}
        <div className={styles.heroCard}>
          {activeTab === "new-request" ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group className={`${styles.requestCcode}`}>
                    <GooglePlaceInput
                      onPlaceSelected={(place) => {
                        console.log(place);
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
                  <Form.Group className={`mb-4 ${styles.requestCcode}`}>
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
                    {errors.category && (
                      <InputErrorMsg
                        className={styles.errorStyle}
                        error={errors.category.message}
                        color="#f00"
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitBtn}>
                  Submit Request →
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.listPanel}>
              {loadingMyRequests ? (
                <div className={styles.emptyState}>Loading requests...</div>
              ) : myRequests.length > 0 ? (
                <>
                  {myRequests.map((request) => (
                    <div key={request.id} className={styles.requestCard}>
                      <div className={styles.requestHead}>
                        <h5>{request.locationName}</h5>
                        <span className={styles.statusBadge}>{request.status}</span>
                      </div>
                      <p className={styles.requestMeta}>Phone: {request.phoneNumber || "—"}</p>
                      <p className={styles.requestMeta}>Address: {request.address || "—"}</p>
                      <p className={styles.requestMeta}>Category: {getCategoryLabel(request.serviceType)}</p>
                      <p className={styles.requestMeta}>Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}

                  {totalPages > 1 && (
                    <ReactPaginate
                      pageCount={totalPages}
                      forcePage={currentPage}
                      onPageChange={handleMyRequestPageClick}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={2}
                      containerClassName={styles.paginationContainer}
                      pageClassName={styles.paginationPage}
                      pageLinkClassName={styles.paginationLink}
                      activeClassName={styles.paginationActive}
                      previousClassName={styles.paginationPage}
                      nextClassName={styles.paginationPage}
                      previousLinkClassName={styles.paginationLink}
                      nextLinkClassName={styles.paginationLink}
                      disabledClassName={styles.paginationDisabled}
                      breakLabel="..."
                      breakClassName={styles.paginationPage}
                      breakLinkClassName={styles.paginationLink}
                      previousLabel="Prev"
                      nextLabel="Next"
                    />
                  )}
                </>
              ) : (
                <div className={styles.emptyState}>
                  No requests yet. Submit a new request to see it here.
                </div>
              )}
            </div>
          )}
        </div>

      </Container>
    </DashboardLayout>
  );
};

export default NgoRequestEmergencyLocation;
