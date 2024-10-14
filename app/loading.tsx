import React from "react";
import Image from "next/image";
import logo from "../public/assets/logo.svg";
import { LinearProgress } from "@mui/material";

const LoaderWithProgressBar = () => {
  return (
    <div className="2/4 flex flex-col justify-center items-center">
      <Image src={logo} alt="logo" width={450} height={450} />
      
    <LinearProgress
      variant="indeterminate"
      className="w-3/4 mt-8"
      />
    </div>
  );
};

export default function RouteLoader() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[99999999999999] flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark ">
      <LoaderWithProgressBar />
    </div>
  );
}
