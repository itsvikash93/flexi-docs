import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const TestingIIC = () => {
  const { register, handleSubmit, control } = useForm();

  // ✅ Separate field arrays for Key Learnings & Expected Outcomes
  const {
    fields: keyTakeaways,
    append: addKeyTakeaways,
    remove: removeKeyTakeaways,
  } = useFieldArray({
    name: "keyTakeaways",
    control,
  });

  const {
    fields: expectedOutcomeFields,
    append: addExpectedOutcome,
    remove: removeExpectedOutcome,
  } = useFieldArray({
    name: "expectedOutcomes",
    control,
  });

  const [fileUrl, setFileUrl] = useState(null);

  // ✅ Files
  const [poster, setPoster] = useState(null);
  const [qSheet, setQSheet] = useState(null);
  const [notice, setNotice] = useState(null);
  const [glimpses, setGlimpses] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [feedbackAnalysis, setFeedbackAnalysis] = useState([]);
  // const [participants, setParticipants] = useState([]);

  // ✅ Handlers
  const handlePosterChange = (e) => setPoster(e.target.files[0]);
  const handleQSheetChange = (e) => setQSheet(e.target.files[0]);
  const handleNoticeChange = (e) => setNotice(e.target.files[0]);
  const handleGlimpsesChange = (e) => setGlimpses(Array.from(e.target.files));
  const handleAttendancesChange = (e) =>
    setAttendances(Array.from(e.target.files));
  const handleFeedbackChange = (e) =>
    setFeedbackAnalysis(Array.from(e.target.files));
  // const handleParticipantsChange = (e) =>
  //   setParticipants(Array.from(e.target.files));

  const onSubmit = async (data) => {
    try {
      if (data.date && data.duration?.start && data.duration?.end) {
        const dateObj = new Date(data.date);
        const formattedDate = dateObj.toLocaleDateString("en-GB"); // DD/MM/YYYY

        const formattedStart = new Date(
          "1970-01-01T" + data.duration.start
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        const formattedEnd = new Date(
          "1970-01-01T" + data.duration.end
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        // Combine into one string like: 31/10/2025 | 10:00 AM - 12:00 PM
        data.dateAndDuration = `${formattedDate} | ${formattedStart} - ${formattedEnd}`;
      }

      const formData = new FormData();

      // ✅ Append text fields
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "object" && data[key] !== null) {
          Object.keys(data[key]).forEach((subKey) => {
            formData.append(`${key}.${subKey}`, data[key][subKey]);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      // ✅ Append Key Learnings
      data.keyTakeaways?.forEach((item, index) => {
        formData.append(`keyTakeaways[${index}][takeaway]`, item.learning);
      });

      // ✅ Append Expected Outcomes
      data.expectedOutcomes?.forEach((item, index) => {
        formData.append(`expectedOutcomes[${index}][outcome]`, item.outcome);
      });

      // ✅ Append files
      if (poster) formData.append("poster", poster);
      if (qSheet) formData.append("qSheet", qSheet);
      if (notice) formData.append("notice", notice);

      glimpses.forEach((file) => formData.append("glimpses", file));
      attendances.forEach((file) => formData.append("attendances", file));
      feedbackAnalysis.forEach((file) =>
        formData.append("feedbackAnalysis", file)
      );
      // participants.forEach((file) => formData.append("participants", file));

      // ✅ Send to backend
      const res = await axios.post("/generate/testing", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Report generated successfully!");
      setFileUrl(res.data.downloadUrl);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl rounded-lg my-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
        SAMPLE Report
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
              className="mt-1 block w-full rounded-md border-purple-200 shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Title of Activity
            </label>
            <input
              type="text"
              {...register("titleOfActivity")}
              placeholder="Enter activity name"
              required
              className="mt-1 block w-full rounded-md border-purple-200 shadow-sm p-2"
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
              className="mt-1 block w-full rounded-md border-purple-200 shadow-sm p-2"
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
                required
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm p-2"
              />
              <input
                type="time"
                {...register("duration.end")}
                required
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm p-2"
              />
            </div>
          </div>
        </div>

        {/* Expected Outcomes */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <h2 className="text-xl font-semibold text-indigo-800">
            Expected Outcomes
          </h2>

          {expectedOutcomeFields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-purple-100"
            >
              <span className="text-gray-400 font-medium pt-3">
                {index + 1}.
              </span>
              <input
                {...register(`expectedOutcomes.${index}.outcome`)}
                placeholder="Enter expected outcome"
                className="flex-1 border border-purple-200 rounded-md p-2"
                required
              />
              <button
                type="button"
                onClick={() => removeExpectedOutcome(index)}
                className="p-2 text-rose-500 hover:text-rose-700"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addExpectedOutcome({ outcome: "" })}
            className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            + Add Expected Outcome
          </button>
        </div>

        {/* Media Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            Poster and Other Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Q-Sheet Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleQSheetChange}
                className="block w-full border border-purple-200 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Poster Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                className="block w-full border border-purple-200 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Brief Biodata Of Resource Person
              </label>
              <textarea
                {...register("dataOfResourcePerson")}
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 h-24"
                placeholder="Enter details"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Abstract Of The Session
              </label>
              <textarea
                {...register("abstractOfSession")}
                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 h-24"
                placeholder="Describe the activity details"
                required
              />
            </div>
          </div>
        </div>

        {/* Key Learnings */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <h2 className="text-xl font-semibold text-indigo-800">
            Key Takeaways
          </h2>

          {keyTakeaways.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-purple-100"
            >
              <span className="text-gray-400 font-medium pt-3">
                {index + 1}.
              </span>
              <input
                {...register(`keyTakeaways.${index}.learning`)}
                placeholder="Enter key takeaway"
                className="flex-1 border border-purple-200 rounded-md p-2"
                required
              />
              <button
                type="button"
                onClick={() => removeKeyTakeaways(index)}
                className="p-2 text-rose-500 hover:text-rose-700"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addKeyTakeaways({ takeaway: "" })}
            className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            + Add Key Takeaway
          </button>
        </div>

        {/* Files Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            Uploads
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Glimpses
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGlimpsesChange}
                className="block w-full border border-purple-200 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Attendance Sheets
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAttendancesChange}
                className="block w-full border border-purple-200 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Feedback Analysis
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFeedbackChange}
                className="block w-full border border-purple-200 rounded-md p-2"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                List of Participants
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleParticipantsChange}
                className="block w-full border border-purple-200 rounded-md p-2"
              />
            </div> */}

            {/* NOTICE Upload */}
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Notice
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleNoticeChange}
                className="block w-full border border-purple-200 rounded-md p-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600"
        >
          Generate Report
        </button>
      </form>

      {/* Download Link */}
      {fileUrl && (
        <div className="mt-6 text-center">
          <a
            href={fileUrl}
            download
            className="py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Download Generated Report
          </a>
        </div>
      )}
    </div>
  );
};

export default TestingIIC;
