import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaMobileAlt, FaKey } from "react-icons/fa";
import { PhoneInput } from "react-international-phone";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { HIDE_LOADER, SHOW_LOADER } from "@/redux/loaderSlice";
import { useDispatch } from "react-redux";
import {
  createUserAfterOtpVerification,
  sendOtp,
  verifyOtp,
} from "@/services/login.service";
import { useRouter } from "next/navigation";
import { encryptData } from "@/utils/crypto";

const NgoDetailsModal = ({ show, handleClose, selectedNgo }) => {
    console.log('selectedNgo', selectedNgo)
  return (
    <>
       <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>NGO Details</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {selectedNgo && (
                <>
                    <p><strong>Name:</strong> {selectedNgo.name}</p>
                    <p><strong>Email:</strong> {selectedNgo.email}</p>
                    <p><strong>Phone:</strong> {selectedNgo.phone_number}</p>
                    <p>
                    <strong>No. of Users:</strong>{" "}
                    {selectedNgo.ngo_number_of_user_assigned}
                    </p>
                    <p><strong>Certificate:</strong> <a href={selectedNgo.ngo_certificate} target="_blank">View Certificate</a></p>
                </>
                )}
            </Modal.Body>

            <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
                Close
                </Button> */}
            </Modal.Footer>
            </Modal> 
    </>
  );
};

export default NgoDetailsModal;
