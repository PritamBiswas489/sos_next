import React, { useEffect, useState } from "react";
import { Container, Row, Button, Modal, Col, Table, Form } from "react-bootstrap";
import styles from "./index.module.scss";

import { MdEmail } from "react-icons/md";
import DashboardLayout from "@/component/DashboardLayout";
import { Controller, useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import InputErrorMsg from "@/component/InputErrorMsg/InputErrorMsg";
import { useDispatch } from "react-redux";
import { SHOW_LOADER, HIDE_LOADER } from "@/redux/loaderSlice";
import { toast } from "react-toastify";
import { contactAdmin, ngoCreateUser, userListForNgo } from "@/services/ngo.service";
import ReactPaginate from "react-paginate";

export default function Downloads() {
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm();



    const onSubmit = async (data) => {

        try {
            dispatch(SHOW_LOADER());
            const formData = {
                message: data.message,
            }
            const response = await contactAdmin(formData);

            if(response?.data?.status===200) {
                toast.success(response?.data?.message || "Success");
                reset();
            }else{
                toast.error(response?.data?.error?.message || "Something went wrong");
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


    

  return (
    <DashboardLayout>
      <Container fluid className={styles.page}>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className={styles.title}>Users</h2>
        </div>

        <Row>
          <Col>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* NAME */}
                <Form.Group className={`mb-4 ${styles.requestCcode}`}>
                    <div>
                        <textarea 
                            className="form-control"
                            rows={5}
                            placeholder="Enter your message"
                            {...register("message", {
                            required: "Message is required",
                            })}
                        >
                        </textarea>
                    </div>
                    {errors.message && (
                        <InputErrorMsg className={styles.errorStyle} error={errors.message.message} color="#f00" />
                    )}
                </Form.Group>
                <button type="submit" className={styles.submitBtn}>
                    Submit Request →
                </button>
            </form>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
}