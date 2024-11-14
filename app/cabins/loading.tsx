import React from "react";
import Spinner from "../_components/Spinner";

type Props = {};

const loading = (props: Props) => {
  return (
    <div className="grid items-center justify-center">
      <Spinner />
      <p className="text-primary-200">Loading Cabins Data...</p>
    </div>
  );
};

export default loading;
