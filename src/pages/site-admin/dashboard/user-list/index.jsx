import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { changeUserStatus, ngoList, rejectNgo, userList, verifyNgo } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit } from "react-icons/fa";
import NgoUpdateModal from "@/component/Popup/Admin/NgoUpdate";

export default function Userlist() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [showNgoUpdateModal, setShowNgoUpdateModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);

  const fetchUserList = async (page = 0) => {
    try {
      dispatch(SHOW_LOADER());

      const response = await userList({
        page: page + 1,
        limit: itemsPerPage,
      });

      const resData = response.data;

      if (resData?.status === 200) {
        setData(resData?.data?.rows || []);
        setTotalPages(resData?.data?.totalPages || 0);
        setCurrentPage((resData?.data?.currentPage || 1) - 1);
      } else {
        toast.error(resData?.error?.message || "Failed to fetch User list");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };
  useEffect(() => {
    fetchUserList(0);
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    fetchUserList(selected);
  };

  const updateTable = () => {
    fetchUserList(currentPage);
  };

  const handleStatusChange = async (item) => {
  try {
    dispatch(SHOW_LOADER());

    

    const newStatus = item.is_active === true ? "inactive" : "active";
    // console.log('item', newStatus);return;

    const response = await changeUserStatus({
      id: item.id,
      status: newStatus,
    });

    const resData = response.data;

    if (resData?.status === 200) {
      toast.success("Status updated successfully");

      // refresh table
      fetchUserList(currentPage);
    } else {
      toast.error(resData?.error?.message || "Failed to update status");
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
          <h2 className={styles.title}>User List</h2>
          {/* <button className="btn bg-warning btn-sm">Button</button> */}
        </div>

        <Row>
          <Col>
            {/* ✅ Table */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>License Code</th>
                  <th>Ngo Name</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Kyc Document</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item?.licenses?.license_key}</td>
                      <td>{item?.ngo?.name}</td>
                      <td>{item.name}</td>
                      <td>{item?.kyc_documents?.address}</td>
                      <td>{item?.phone_number}</td>
                      <td>{item?.email}</td>
                      <td>
                          {item?.kyc_documents?.document_path ? (
                              <a
                              href={item?.kyc_documents?.document_path}
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
                          <button
                            className={`btn btn-sm ${
                              item.is_active === true ? "btn-success" : "btn-secondary"
                            }`}
                            onClick={() => handleStatusChange(item)}
                          >
                            {item.is_active === true ? "Active" : "Inactive"}
                          </button>
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
