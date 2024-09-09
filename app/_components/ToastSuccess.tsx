"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {};

const ToastSuccess = (props: Props) => {
  useEffect(() => {
    const paymentInitiated = sessionStorage.getItem("paymentInitiated");

    if (paymentInitiated === "true") {
      toast.success("Payment Successful!");
      sessionStorage.removeItem("paymentInitiated"); // Clean up
    }
  });
  return null;
};

export default ToastSuccess;
