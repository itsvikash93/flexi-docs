import { useState } from "react";
import { useForm } from "react-hook-form";
import { CloudUpload } from "lucide-react";
import axios from "../utils/axios";

const UploadTemplate = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);

  const handlePreviewChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    const formData = {
      name: data.name,
      description: data.description,
      formUrl: data.formUrl,
    }
    try {
      axios.post('/uploads/templates', formData).then((res) => {
        // console.log(res.data);
        axios.put(res.data.templateUrl, data.file[0]).then(console.log("File Uploaded Successfully"));
        axios.put(res.data.previewImgUrl, data.previewImage[0]).then(console.log("Preview Image Uploaded Successfully"));
      })
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Upload Template
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* File Upload Section */}
          <label className="border-dashed border-2 border-gray-300 p-6 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-gray-50">
            <CloudUpload className="text-gray-400 w-12 h-12" />
            <p className="mt-2 text-gray-600">Click or Drag file to upload</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              {...register("file", { required: "File is required" })}
            />
          </label>
          {errors.file && (
            <p className="text-red-500 text-sm">{errors.file.message}</p>
          )}
          {watch("file") && (
            <p className="mt-2 text-sm text-gray-700">
              Selected File: {watch("file")[0]?.name}
            </p>
          )}

          {/* Preview Image Upload */}
          <input
            type="file"
            accept="image/*"
            {...register("previewImage")}
            onChange={handlePreviewChange}
            className="w-full p-2 border rounded-lg mt-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* Input Fields */}
          <input
            type="text"
            placeholder="Template Name"
            {...register("name", { required: "Template name is required" })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">
              {errors.templateName.message}
            </p>
          )}

          <input
            type="text"
            placeholder="Template Description"
            {...register("description", {
              required: "Template description is required",
            })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <input
            type="text"
            placeholder="Form URL"
            {...register("formUrl", { required: "Form URL is required" })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.formUrl && (
            <p className="text-red-500 text-sm">{errors.formUrl.message}</p>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Upload Template
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadTemplate;
