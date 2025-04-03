import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "../utils/axios";
const NSPReportForm = () => {
  const { register, handleSubmit, control } = useForm();
  const [fileUrl, setFileUrl] = useState(null);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/generate/nsp-report-template", data);
      if (res.status === 200) {
        setFileUrl(res.data.fileUrl);
        toast.success("Report Generated Successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl rounded-lg my-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
        NSP Third Year Guidelines and Report
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Project Title
            </label>
            <input
              type="text"
              {...register("projectTitle")}
              placeholder="Enter project title"
              required
              className="mt-1 block w-full rounded-md border border-purple-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 transition duration-200"
            />
          </div>
          <div className="grid ">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="grid mb-2 grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="">
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Student {index + 1} Name
                  </label>
                  <input
                    type="text"
                    {...register(`student${index + 1}`)}
                    placeholder={`Enter student ${index + 1} name`}
                    required
                    className="mt-1 block w-full rounded-md border border-purple-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 transition duration-200"
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-indigo-700 mb-2 ">
                    Student {index + 1} Registration Number
                  </label>
                  <input
                    type="text"
                    {...register(`regNo${index + 1}`)}
                    placeholder={`Enter student ${
                      index + 1
                    } registration number`}
                    required
                    className="mt-1 block w-full rounded-md border border-purple-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 transition duration-200"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Guide Name
            </label>
            <input
              type="text"
              {...register("guideName")}
              required
              placeholder="Enter guide name"
              className="mt-1 block w-full rounded-md border border-purple-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Guide Designation
            </label>
            <input
              type="text"
              {...register("guideDesignation")}
              required
              placeholder="Enter guide designation"
              className="mt-1 block w-full rounded-md border border-purple-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-3 transition duration-200"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:ring focus:ring-green-300 transition duration-200"
        >
          Generate Report
        </button>
      </form>

      {/* Download Link */}
      {fileUrl && (
        <div className="mt-8 text-center">
          <a
            href={fileUrl}
            download
            className="py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200"
          >
            Download Generated Report
          </a>
        </div>
      )}
    </div>
  );
};

export default NSPReportForm;
