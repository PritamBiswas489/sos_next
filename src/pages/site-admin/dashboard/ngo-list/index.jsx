import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { ngoList } from "@/services/admin.service";

export default function Ngolist() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;


  const fetchNgoList = async (page = 0) => {
    try {
      dispatch(SHOW_LOADER());

      const response = await ngoList({
        page: page + 1, 
        limit: itemsPerPage,
      });

      const resData = response.data;

      if (resData?.status === 200) {
        setData(resData?.data?.rows || []);
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
    fetchNgoList(0);
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    fetchNgoList(selected);
  };

  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <h2 className={styles.title}>NGO List</h2>

        <Row>
          <Col>
            {/* ✅ Table */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>No. of Users</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{currentPage * itemsPerPage + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone_number}</td>
                      <td>{item.ngo_number_of_user_assigned}</td>
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