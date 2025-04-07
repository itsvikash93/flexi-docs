import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const IICActivityReportForm = () => {
  const { register, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "keyLearnings",
    control,
  });
  const [fileUrl, setFileUrl] = useState(null);
  const [poster, setPoster] = useState(null);
  const [glimpses, setGlimpses] = useState([]);
  const [attendances, setAttendances] = useState([]);

  const handlePosterChange = (e) => setPoster(e.target.files[0]);

  const handleGlimpsesChange = (e) => setGlimpses(Array.from(e.target.files));

  const handleAttendancesChange = (e) =>
    setAttendances(Array.from(e.target.files));

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
    };

    try {
      const res = await axios.post(
        "/generate/iic-activity-report-template",
        formData
      );
      setFileUrl(res.data.fileUrl);
      toast.success("Report Generated Successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error submitting report.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl rounded-lg my-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
        IIC Activity Report
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
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
          <div>
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
          <div>
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
          <div>
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
        {/* Activity Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            Activity Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Type of Activity
              </label>
              <input
                type="text"
                {...register("typeOfActivity")}
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                placeholder="Enter activity type"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Activity Objective
              </label>
              <textarea
                {...register("activityObjective")}
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 h-24"
                placeholder="Describe the objective of this activity"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Program Outcome
              </label>
              <textarea
                {...register("programOutcome")}
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 h-24"
                placeholder="Describe the program outcomes"
                required
              />
            </div>
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
                Poster Image
              </label>
              <div className="flex gap-4">
                <input
                  type="file"
                  onChange={handlePosterChange}
                  accept="image/*"
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
                Brief Details About Chief Speaker
              </label>
              <textarea
                {...register("detailsOfChiefSpeaker")}
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 h-24"
                placeholder="Enter speaker details"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Brief Details About Activity
              </label>
              <textarea
                {...register("detailsOfActivity")}
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 h-24"
                placeholder="Describe the activity details"
                required
              />
            </div>
          </div>
        </div>

        {/* Key Learnings Section */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-indigo-800">
              Key Learnings
            </h2>
            <span className="text-sm text-gray-500">
              {fields.length} points added
            </span>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors duration-200"
              >
                <span className="text-gray-400 font-medium pt-3">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <input
                    {...register(`keyLearnings.${index}.learning`)}
                    className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 bg-white"
                    placeholder="Enter key learning point"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-1 p-2 text-rose-500 hover:text-rose-700 rounded-full hover:bg-rose-50 transition duration-200"
                  title="Remove this point"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ learning: "" })}
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md shadow-md hover:from-indigo-600 hover:to-purple-600 focus:ring focus:ring-purple-300 transition duration-200 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Learning Point
          </button>

          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Conclusion
            </label>
            <textarea
              {...register("conclusion")}
              className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 h-24"
              placeholder="Summarize the key takeaways and overall impact of the workshop"
              required
            />
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
              </label>
              <div className="flex gap-4">
                <input
                  type="file"
                  multiple
                  onChange={handleGlimpsesChange}
                  accept="image/*"
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
              </label>
              <div className="flex gap-4">
                <input
                  type="file"
                  multiple
                  onChange={handleAttendancesChange}
                  accept="image/*"
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

export default IICActivityReportForm;
