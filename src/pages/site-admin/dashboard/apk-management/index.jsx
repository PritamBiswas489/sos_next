import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { apkReleases, ngoList, rejectNgo, verifyNgo } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit } from "react-icons/fa";
import NgoUpdateModal from "@/component/Popup/Admin/NgoUpdate";
import UploadApkModal from "@/component/Popup/Admin/UploadApk";


export default function Ngolist() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [showNgoUpdateModal, setShowNgoUpdateModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);


    const fetchApkList = async (page = 0) => {
        try {
        dispatch(SHOW_LOADER());

        const response = await apkReleases({
            page: page + 1, 
            limit: itemsPerPage,
        });

        const resData = response.data;

        if (resData?.status === 200) {
            setData(resData?.data || []);
            setTotalPages(resData?.data?.totalPages || 0);
            setCurrentPage((resData?.data?.currentPage || 1) - 1);
        } else {
            toast.error(
            resData?.error?.message || "Failed to fetch NGO list"
            );
        }
        } catch (error) {
        toast.error(error?.message || "Something went wrong");
        } finally {
        dispatch(HIDE_LOADER());
        }
    };

    useEffect(() => {
        fetchApkList(0);
    }, []);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
        fetchApkList(selected);
    };

    const updateTable = () => {
        fetchApkList(currentPage);
    }

    const handleView = (item) => {
        setSelectedNgo(item);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedNgo(null);
    };


  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>Apk Management</h2>
          <button className="btn bg-warning btn-sm" onClick={() => setShowModal(true)}>Upload APK</button>
        </div>
        <Row>
          <Col>
            {/* ✅ Table */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Version</th>
                  <th>APK File</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                    
                        <td>{item?.version}</td>
                        <td>
                            {item?.apkFile ? (
                                <a
                                href={item.apkFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className=""
                                download
                                >
                                Download
                                </a>
                            ) : (
                                "No File"
                            )}
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
      <UploadApkModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        updateTable={updateTable}
      />

    </DashboardLayout>
  );
}