import React, { useEffect, useState } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import styles from "./index.module.scss";
import { Col, Container, Row, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { ngoAutocomplete, ngoList, rejectNgo, verifyNgo } from "@/services/admin.service";
import NgoDetailsModal from "@/component/Popup/Admin/NgoDetails";
import { FaEye, FaEdit } from "react-icons/fa";
import NgoUpdateModal from "@/component/Popup/Admin/NgoUpdate";

export default function Ngolist() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [showNgoUpdateModal, setShowNgoUpdateModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allData, setAllData] = useState([]);

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
    fetchNgoList(0);
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    fetchNgoList(selected);
  };

  const handleView = (item) => {
    setSelectedNgo(item);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedNgo(null);
  };

  const handleEdit = (item) => {
    setSelectedNgo(item);
    setShowNgoUpdateModal(true);
  };

  const handleAccept = async (ngo) => {
    try {
      dispatch(SHOW_LOADER());
      const formData = {
        id: ngo?.id,
      };
      const response = await verifyNgo(formData);
      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message);
        handleClose();
        fetchNgoList(currentPage);
      } else {
        toast.error(resData?.error?.message || "");
      }
    } catch (err) {
      console.log("err", err);
      toast.error("Failed to accept NGO");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  const handleReject = async (ngo) => {
    try {
      dispatch(SHOW_LOADER());
      const formData = {
        id: ngo?.id,
      };
      const response = await rejectNgo(formData);
      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message);
        handleClose();
        fetchNgoList(currentPage);
      } else {
        toast.error(resData?.error?.message || "");
      }
    } catch (err) {
      console.log("err", err);
      toast.error("Failed to accept NGO");
    } finally {
      dispatch(HIDE_LOADER());
    }
  };

  const updateTable = () => {
    fetchNgoList(currentPage);
  };

  // const handleSearchChange = async (value) => {
  //   setSearch(value);

  //   if (!value) {
  //     setSuggestions([]);
  //     return;
  //   }

  //   try {
  //     const response = await ngoAutocomplete(value);
  //     const resData = response.data;

  //     if (resData?.status === 200) {
  //       setSuggestions(resData?.data || []);
  //       setShowDropdown(true);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSearchChange = async (value) => {
  setSearch(value);

  // ✅ reset when empty
  if (!value.trim()) {
    setSuggestions([]);
    setShowDropdown(false);
    setData(allData);
    return;
  }


  if (value.length < 2) {
    setSuggestions([]);
    setShowDropdown(false);
    return;
  }

  try {
    const response = await ngoAutocomplete(value);
    const resData = response.data;

    if (resData?.status === 200) {
      setSuggestions(resData?.data || []);
      setShowDropdown(true);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  if (!search) {
    setData(allData);
  }
}, [search]);

  const handleSelectNgo = (item) => {
    setSearch(item.name);
    setShowDropdown(false);

    const filtered = allData.filter(
      (ngo) => ngo.id === item.id
    );

    setData(filtered);
  };

  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>NGO List</h2>
          {/* <button className="btn bg-warning btn-sm">Button</button> */}
        </div>

        <Row>
          <Col>

            <div className="position-relative" style={{ width: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search NGO..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />

              {showDropdown && suggestions.length > 0 && (
                <div
                  className="border bg-white position-absolute w-100 search-dd"
                  style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                >
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 cursor-pointer hover-bg dropdown-item"
                      onClick={() => handleSelectNgo(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ Table */}
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Assigned Users</th>
                  <th>Registered Users</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone_number}</td>
                      <td>{item.ngo_number_of_user_assigned}</td>
                      <td>
                        {item.ngo_number_of_user_registered === null
                          ? 0
                          : item.ngo_number_of_user_registered}
                      </td>
                      <td className="">
                        <ul className="d-flex align-items-center">
                          <li>
                            <FaEye
                              size={20}
                              className="text-primary cursor-pointer"
                              onClick={() => handleView(item)}
                            />
                          </li>
                          <li>
                            <FaEdit
                              size={20}
                              className="text-success cursor-pointer ms-3"
                              onClick={() => handleEdit(item)}
                            />
                          </li>
                        </ul>
                        

                        
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
      <NgoDetailsModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        selectedNgo={selectedNgo}
        onAccept={handleAccept}
        onReject={handleReject}
        updateTable={updateTable}
      />

      <NgoUpdateModal
        show={showNgoUpdateModal}
        handleClose={() => setShowNgoUpdateModal(false)}
        selectedNgo={selectedNgo}
        updateTable={updateTable}
      />
    </DashboardLayout>
  );
}
