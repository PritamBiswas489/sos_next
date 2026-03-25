import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { changeStatusNgo, ngoUpgradeUserLimit } from "@/services/admin.service";
import { FaEye, FaEdit } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";

const NgoUpdateModal = ({
  show,
  handleClose,
  selectedNgo,
  updateTable,
}) => {
  const dispatch = useDispatch();

  const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      control,
      reset,
      setValue, // ✅ ADD THIS
    } = useForm();
  
    const onSubmit = async (data) => {
  
      try {
        dispatch(SHOW_LOADER());
        const formData = {
          id: selectedNgo?.id,
          additional_limit: data?.additional_limit,
        };
        const response = await ngoUpgradeUserLimit(formData);
        const resData = response.data;
  
        if (resData?.status === 200) {
          toast.success(resData?.message || "");
          handleClose();
          updateTable();
        } else {
          const errorMessage =
            resData?.error?.reason ||
            resData?.error?.message ||
            "Something went wrong";
          toast.error(errorMessage);
        }
      } catch (error) {
        const resData = error?.response?.data;
        const errorMessage =
          resData?.error?.reason ||
          resData?.error?.message ||
          error?.message ||
          "Something went wrong";
        toast.error(errorMessage);
      } finally {
        dispatch(HIDE_LOADER());
      }
    };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update</Modal.Title>
      </Modal.Header>

      <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                <Form.Label>User Limit</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="User Limit"
                    {...register("additional_limit", {
                    required: "Additional limit is required",
                    })}
                />
                {errors.additional_limit && (
                    <InputErrorMsg error={errors.additional_limit.message} color="#f00" />
                )}
                </Form.Group>
               <Button variant="success" type="submit">
                    Submit
                </Button>
          </form>
      </Modal.Body>
    </Modal>
  );
};

export default NgoUpdateModal;