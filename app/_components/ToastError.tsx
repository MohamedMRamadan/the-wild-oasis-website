"use client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {};

const ToastError = (props: Props) => {
  useEffect(() => {
    if (sessionStorage?.getItem("paymentInitiated")) {
      sessionStorage.removeItem("paymentInitiated");
      toast.error("Failed to complete your Reservation!😞");
    }
  }, []);
  return null;
};

export default ToastError;
