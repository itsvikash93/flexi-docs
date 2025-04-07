import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const DepartmentalActivityForm = () => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      abstractOfSession: [{ value: "" }],
    },
  });

  const {
    fields: abstractFields,
    append: appendAbstract,
    remove: removeAbstract,
  } = useFieldArray({
    name: "abstractOfSession",
    control,
    rules: { required: true },
  });
  const [fileUrl, setFileUrl] = useState(null);
  const [poster, setPoster] = useState(null);
  const [glimpses, setGlimpses] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const handlePosterChange = (e) => setPoster(e.target.files[0]);

  const handleGlimpsesChange = (e) => setGlimpses(Array.from(e.target.files));

  const handleAttendancesChange = (e) =>
    setAttendances(Array.from(e.target.files));

  const handleFeedbackChange = (e) => setFeedbacks(Array.from(e.target.files));

  const handlePosterUpload = async () => {
    if (!poster) return alert("No file selected!");

    try {
      const { data } = await axios.post("/uploads/presigned-urls", {
        files: [{ name: poster.name, type: poster.type }],
      });

      await axios.put(data.urls[0].uploadUrl, poster, {
        headers: { "Content-Type": poster.type },
      });

      setPoster({ name: poster.name, url: data.urls[0].fileUrl });
      toast.success("Poster uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading poster!");
    }
  };

  const handleGlimpsesUpload = async () => {
    if (glimpses.length === 0) return alert("Please select files!");

    try {
      const { data } = await axios.post("/uploads/presigned-urls", {
        files: glimpses.map((file) => ({ name: file.name, type: file.type })),
      });

      await Promise.all(
        data.urls.map((urlObj, index) =>
          axios.put(urlObj.uploadUrl, glimpses[index], {
            headers: { "Content-Type": glimpses[index].type },
          })
        )
      );

      setGlimpses(data.urls.map((u) => ({ name: u.name, url: u.fileUrl })));

      toast.success("Glimpses uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading glimpses!");
    }
  };

  const handleAttendancesUpload = async () => {
    if (attendances.length === 0) return alert("Please select files!");

    try {
      const { data } = await axios.post("/uploads/presigned-urls", {
        files: attendances.map((file) => ({
          name: file.name,
          type: file.type,
        })),
      });

      await Promise.all(
        data.urls.map((urlObj, index) =>
          axios.put(urlObj.uploadUrl, attendances[index], {
            headers: { "Content-Type": attendances[index].type },
          })
        )
      );

      setAttendances(data.urls.map((u) => ({ name: u.name, url: u.fileUrl })));

      toast.success("Attendance Sheets uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading attendance sheets!");
    }
  };

  const handleFeedbackUpload = async () => {
    if (feedbacks.length === 0) return alert("Please select files!");

    try {
      const { data } = await axios.post("/uploads/presigned-urls", {
        files: feedbacks.map((file) => ({
          name: file.name,
          type: file.type,
        })),
      });

      await Promise.all(
        data.urls.map((urlObj, index) =>
          axios.put(urlObj.uploadUrl, feedbacks[index], {
            headers: { "Content-Type": feedbacks[index].type },
          })
        )
      );

      setFeedbacks(data.urls.map((u) => ({ name: u.name, url: u.fileUrl })));

      toast.success("Feedbacks uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading Feedbacks!");
    }
  };

  const onSubmit = async (data) => {
    const dateParts = data.date.split("-");
    const formData = {
      ...data,
      dateAndDuration: `${dateParts[2]}-${dateParts[1]}-${
        dateParts[0]
      } & ${new Date("1970-01-01T" + data.duration.start).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      )} - ${new Date("1970-01-01T" + data.duration.end).toLocaleTimeString(
        "en-US",
        { hour: "numeric", minute: "2-digit", hour12: true }
      )}`,
      poster: poster?.url || null,
      glimpses: glimpses.map((img) => img.url),
      attendances: attendances.map((img) => img.url),
      feedbacks: feedbacks.map((img) => img.url),
    };

    try {
      const res = await axios.post(
        "/generate/departmental-activity-report-template",
        formData
      );
      console.log(res);
      setFileUrl(res.data.fileUrl);
      toast.success("Report Generated Successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error submitting report.");
    }
  };
  // useEffect(() => {
  //   if (abstractFields.length === 0) {
  //     appendAbstract({ value: "" }); // Initialize with empty object
  //   }
  // }, []);
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl rounded-lg my-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
        Departmental Activity Report
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <div className="flex gap-6 my-5 items-center">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Report Topic
              </label>
              <input
                type="text"
                {...register("reportTopic")}
                placeholder="Enter report topic"
                required
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Name of Activity
              </label>
              <input
                type="text"
                {...register("nameOfActivity")}
                placeholder="Enter activity name"
                required
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
              />
            </div>
          </div>

          <div className="flex gap-6 my-5 items-center">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Date
              </label>
              <input
                type="date"
                {...register("date")}
                required
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                onClick={(e) => e.target.showPicker()}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Duration
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  {...register("duration.start")}
                  className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                  required
                  onClick={(e) => e.target.showPicker()}
                />
                <input
                  type="time"
                  {...register("duration.end")}
                  className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                  required
                  onClick={(e) => e.target.showPicker()}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Expected Outcome
            </label>
            <input
              type="text"
              {...register("expectedOutcome")}
              className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
              placeholder="Enter the session outcome"
              required
            />
          </div>
        </div>

        {/* Media Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            Media Upload
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Flyer/Poster Image
                <span className="text-green-600 ml-1">*Only 1 photo</span>
              </label>
              <div className="flex gap-4">
                <input
                  type="file"
                  onChange={handlePosterChange}
                  accept="image/*"
                  required
                  className="flex-1 p-2 border border-purple-200 rounded-md"
                />
                {poster && typeof poster === "object" && (
                  <button
                    type="button"
                    onClick={handlePosterUpload}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200"
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Brief Biodata of Resource Person
              </label>
              <textarea
                {...register("detailsOfResourcePerson")}
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 h-24"
                placeholder="Enter Resource Person details"
                required
              />
            </div>

            <div className="p-4 bg-zinc-100 rounded-md border-2 border-zinc-400">
              <label className="block text-sm font-medium text-indigo-700 mb-2 ">
                Abstract/Brief Details of the Session
              </label>

              {abstractFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 mb-3 ">
                  <textarea
                    {...register(`abstractOfSession.${index}.value`)} // Updated registration
                    className="w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                    placeholder={`Paragraph ${index + 1}`}
                    required={index === 0}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeAbstract(index)}
                      className="text-white px-3 py-2 bg-red-600 rounded"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => appendAbstract({ value: "" })} // Append new object
                className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
              >
                Add Paragraph
              </button>
            </div>
          </div>
        </div>

        {/* Additional Files Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            Additional Files
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Glimpses
                <span className="text-green-600 ml-1">
                  *Can upload multiple photos
                </span>
              </label>
              <div className="flex gap-4">
                <input
                  type="file"
                  multiple
                  onChange={handleGlimpsesChange}
                  accept="image/*"
                  required
                  className="flex-1 p-2 border border-purple-200 rounded-md"
                />
                {glimpses.length > 0 && (
                  <button
                    type="button"
                    onClick={handleGlimpsesUpload}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Attendance Sheets
                <span className="text-green-600 ml-1">
                  *Can upload multiple photos
                </span>
              </label>
              <div className="flex gap-4">
                <input
                  type="file"
                  multiple
                  onChange={handleAttendancesChange}
                  accept="image/*"
                  required
                  className="flex-1 p-2 border border-purple-200 rounded-md"
                />
                {attendances.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAttendancesUpload}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Feedback Analysis Photos
                <span className="text-green-600 ml-1">
                  *Can upload multiple photos
                </span>
              </label>
              <div className="flex gap-4">
                <input
                  type="file"
                  multiple
                  required
                  onChange={handleFeedbackChange}
                  accept="image/*"
                  className="flex-1 p-2 border border-purple-200 rounded-md"
                />
                {feedbacks.length > 0 && (
                  <button
                    type="button"
                    onClick={handleFeedbackUpload}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:ring focus:ring-green-300 transition duration-200 uppercase font-semibold"
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

export default DepartmentalActivityForm;
