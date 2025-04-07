import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import DynamicBlock from "../components/DynamicBlock";
import ImageComp from "../components/ImageComp";
import UploadTemplate from "../components/UploadTemplate";
// import WorkshopForm from '../components/IICActivityReportForm'
// import IICActivityReport from '../components/IICActivityReport'
import NSPReportForm from "../components/NSPReportForm";
import IICActivityReportForm from "../components/IICActivityReportForm";
import DepartmentalActivityForm from "../components/DepartmentalActivityForm";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/" element={<ImageComp />} /> */}
      <Route path="/upload/template" element={<UploadTemplate />} />
      {/* <Route path="/" element={<WorkshopForm />} /> */}
      <Route path="/templates/dynamic-block" element={<DynamicBlock />} />
      <Route
        path="/templates/departmental-activity-report"
        element={<DepartmentalActivityForm />}
      />
      <Route
        path="/templates/iic-activity-report"
        element={<IICActivityReportForm />}
      />
      <Route path="/templates/nsp-report" element={<NSPReportForm />} />
    </Routes>
  );
};

export default Routing;
