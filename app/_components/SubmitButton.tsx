"use client";

import React, { FC, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import SpinnerMini from "./SpinnerMini";

type Props = {
  pendingContent: string;
  children: ReactNode;
  spinner?: boolean;
};
// this component is indeed as useFormStatus hook only work inside a component that part of form component

const SubmitButton: FC<Props> = ({
  children,
  pendingContent,
  spinner = false,
}) => {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          {spinner && <SpinnerMini />}
          <p className="capitalize">{pendingContent}...</p>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
