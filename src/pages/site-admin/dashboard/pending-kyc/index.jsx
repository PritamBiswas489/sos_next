import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { changeKycDocumentStatus, changeUserStatus, ngoList, pendingKycDocuments, rejectNgo, userList, verifyNgo } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit } from "react-icons/fa";
import NgoUpdateModal from "@/component/Popup/Admin/NgoUpdate";

export default function PendingKyc() {
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // 0-based
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;
    const [showModal, setShowModal] = useState(false);
    const [showNgoUpdateModal, setShowNgoUpdateModal] = useState(false);
    const [selectedNgo, setSelectedNgo] = useState(null);

    const fetchPendingKyc = async (page = 0) => {
        try {
        dispatch(SHOW_LOADER());

        const response = await pendingKycDocuments({
            page: page + 1,
            limit: itemsPerPage,
        });

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
        fetchPendingKyc(0);
    }, []);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
        fetchPendingKyc(selected);
    };

    const updateTable = () => {
        fetchPendingKyc(currentPage);
    };

    const handleKycStatusChange = async (item, status) => {
        try {
            if (!confirm(`Are you sure you want to ${status} this KYC?`)) return;

            dispatch(SHOW_LOADER());

            const response = await changeKycDocumentStatus({
            id: item.id,
            status: status, 
            });

            const resData = response.data;

            if (resData?.status === 200) {
                toast.success(`KYC ${status} successfully`);

                // refresh list
                fetchPendingKyc(currentPage);
            } else {
                toast.error(resData?.error?.message || "Failed to update KYC status");
            }
        } catch (error) {
            toast.error(error?.message || "Something went wrong");
        } finally {
            dispatch(HIDE_LOADER());
        }
    };

  

  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>Pending KYC</h2>
          {/* <button className="btn bg-warning btn-sm">Button</button> */}
        </div>

        <Row>
          <Col>
            {/* ✅ Table */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Document Type</th>
                  <th>Kyc Document</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item?.address}</td>
                      <td>{item?.user?.phone_number}</td>
                      <td>{item?.document_type}</td>
                      <td>
                          {item?.document_path ? (
                              <a
                              href={item?.document_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=""
                              download
                              >
                              View
                              </a>
                          ) : (
                              "No File"
                          )}
                      </td>
                        <td>
                            {item.status === "pending" ? (
                                <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleKycStatusChange(item, "approved")}
                                >
                                    Approve
                                </button>

                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleKycStatusChange(item, "rejected")}
                                >
                                    Reject
                                </button>
                                </div>
                            ) : (
                                <button
                                className={`btn btn-sm ${
                                    item.status === "approved" ? "btn-success" : "btn-danger"
                                }`}
                                disabled
                                >
                                {item.status === "approved" ? "Approved" : "Rejected"}
                                </button>
                            )}
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
