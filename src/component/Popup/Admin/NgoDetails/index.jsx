import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { changeStatusNgo } from "@/services/admin.service";
import { FaEye, FaEdit, FaTimes } from "react-icons/fa";
import styles from "./index.module.scss";

const NgoDetailsModal = ({
  show,
  handleClose,
  selectedNgo,
  onAccept,
  onReject,
  updateTable,
}) => {
  const dispatch = useDispatch();

  const [isActive, setIsActive] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ Sync state when NGO changes
  useEffect(() => {
    if (selectedNgo) {
      setIsActive(selectedNgo.is_active === true);
    }
  }, [selectedNgo]);

  const handleStatusChange = async (checked) => {
    if (!selectedNgo) return;

    try {
      setIsUpdating(true);
      dispatch(SHOW_LOADER());

      const newStatus = checked ? 1 : 0;
      const formData = {
        id: selectedNgo?.id,
        status: newStatus === 0 ? "inactive" : "active",
      };
      const response = await changeStatusNgo(formData);

      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message);
        setIsActive(checked);
        updateTable();
      } else {
        toast.error(resData?.error?.message || "");
      }
    } catch (error) {
      // console.log('error', error)
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
      dispatch(HIDE_LOADER());
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* <Modal.Header closeButton>
        <Modal.Title>NGO Details</Modal.Title>
      </Modal.Header> */}
      <div className={styles.card}>
        <Modal.Body className={styles.modalBody}>
          <h3>NGO Details</h3>
          <button className={styles.closeBtn} onClick={handleClose}>
            <FaTimes />
          </button>
          {selectedNgo && (
            <>
              <p>
                <strong>Name:</strong> {selectedNgo.name}
              </p>

              <p>
                <strong>Email:</strong> {selectedNgo.email}
              </p>

              <p>
                <strong>Phone:</strong> {selectedNgo.phone_number}
              </p>

              <p>
                <strong>No. of Users:</strong>{" "}
                {selectedNgo.ngo_number_of_user_assigned}
              </p>

              <p>
                <strong>Certificate:</strong>{" "}
                <a
                  href={selectedNgo.ngo_certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Certificate
                </a>
              </p>

              {/* ✅ STATUS SWITCH */}
              <p className="d-flex justify-content-center">
                <strong className="me-3">Status:</strong>
                <Form.Check
                  type="switch"
                  id="ngo-status-switch"
                  label={isActive ? "Active" : "Inactive"}
                  checked={isActive}
                  disabled={isUpdating}
                  onChange={(e) => handleStatusChange(e.target.checked)}
                />
              </p>
            </>
          )}
        </Modal.Body>

        {/* ✅ ACCEPT / REJECT BUTTONS */}
        {selectedNgo?.is_verified === false && (
          <Modal.Footer className={styles.modalFooter}>
            <Button
              variant="danger"
              onClick={() => onReject(selectedNgo)}
              disabled={isUpdating}
            >
              Reject
            </Button>

            <Button
              variant="success"
              onClick={() => onAccept(selectedNgo)}
              disabled={isUpdating}
            >
              Accept
            </Button>
          </Modal.Footer>
        )}
      </div>
    </Modal>
  );
};

export default NgoDetailsModal;
