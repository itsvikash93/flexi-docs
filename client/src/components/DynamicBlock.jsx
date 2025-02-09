import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "../utils/axios";

const DynamicBlock = () => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      topic_name: "",
      department_name: "",
      session_time: "",
      date: "",
      activities: [{ sno: 1, activity: "", duration: "", timing: "" }],
      blocks: [{ sno: 1, heading: "", paragraph: "" }],
    },
  });
  const [fileUrl, setFileUrl] = useState(null); // State to store file URL after generation

  const {
    fields: blockFields,
    append: appendBlock,
    remove: removeBlock,
    move: moveBlock,
    update: updateBlock,
  } = useFieldArray({
    control,
    name: "blocks",
  });

  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
    move: moveActivity,
    update: updateActivity,
  } = useFieldArray({
    control,
    name: "activities",
  });

  const onSubmit = (data) => {
    const dateParts = data.date.split("-");
    data.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    // console.log("Form Data:", data);

    axios
      .post("/generate/doc-template", data)
      .then((res) => {
        // console.log("File generated:", res);
        setFileUrl(res.data.fileUrl); // Assuming the response contains the URL to the generated file
      })
      .catch((err) => {
        console.error("Error generating file:", err);
      });
  };

  const updateSNOs = (fields, updateFn) => {
    fields.forEach((field, i) => {
      updateFn(i, { ...field, sno: i + 1 });
    });
  };

  const moveBlockUp = (index) => {
    if (index > 0) {
      moveBlock(index, index - 1);
      const blocks = watch("blocks");
      updateSNOs(blocks, updateBlock);
    }
  };

  const moveBlockDown = (index) => {
    if (index < blockFields.length - 1) {
      moveBlock(index, index + 1);
      const blocks = watch("blocks");
      updateSNOs(blocks, updateBlock);
    }
  };

  const moveActivityUp = (index) => {
    if (index > 0) {
      moveActivity(index, index - 1);
      const activities = watch("activities");
      updateSNOs(activities, updateActivity);
    }
  };

  const moveActivityDown = (index) => {
    if (index < activityFields.length - 1) {
      moveActivity(index, index + 1);
      const activities = watch("activities");
      updateSNOs(activities, updateActivity);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl rounded-lg my-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
        Content Blocks
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Topic Name
            </label>
            <input
              type="text"
              {...register("topic_name")}
              placeholder="Enter topic name"
              required
              className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Department Name
            </label>
            <input
              type="text"
              {...register("department_name")}
              placeholder="Enter department name"
              required
              className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Session Time
            </label>
            <input
              type="text"
              {...register("session_time")}
              placeholder="e.g., 09:30 AM - 11:45 AM"
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
            />
          </div>
        </div>

        {/* Activities Section */}
        <h2 className="text-xl font-semibold text-indigo-800 mt-8 mb-4">
          Activities
        </h2>
        <div className="space-y-4">
          {activityFields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm"
            >
              {/* Activity Inputs */}
              <div className="w-16">
                <label className="block text-sm font-medium text-indigo-700 mb-2">
                  S.No
                </label>
                <input
                  {...register(`activities.${index}.sno`)}
                  value={field.sno}
                  readOnly
                  required
                  className="mt-1 block w-full rounded-md border-purple-200 bg-purple-50 shadow-sm p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-indigo-700 mb-2">
                  Activity
                </label>
                <input
                  type="text"
                  {...register(`activities.${index}.activity`)}
                  placeholder="Enter activity"
                  required
                  className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-indigo-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  {...register(`activities.${index}.duration`)}
                  placeholder="Duration"
                  required
                  className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-indigo-700 mb-2">
                  Timing
                </label>
                <input
                  type="text"
                  {...register(`activities.${index}.timing`)}
                  placeholder="Timing"
                  required
                  className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                />
              </div>
              <div className="flex flex-col gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => moveActivityUp(index)}
                  disabled={index === 0}
                  className="px-2 py-1 text-indigo-500 hover:text-indigo-700 disabled:text-gray-400"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveActivityDown(index)}
                  disabled={index === activityFields.length - 1}
                  className="px-2 py-1 text-indigo-500 hover:text-indigo-700 disabled:text-gray-400"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  removeActivity(index);
                  const activities = watch("activities");
                  updateSNOs(activities, updateActivity);
                }}
                className="mt-8 px-3 py-2 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 transition duration-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendActivity({
                sno: activityFields.length + 1,
                activity: "",
                duration: "",
                timing: "",
              })
            }
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md shadow-md hover:from-indigo-600 hover:to-purple-600 focus:ring focus:ring-purple-300 transition duration-200"
          >
            Add Activity
          </button>
        </div>

        {/* Content Blocks Section */}
        <h2 className="text-xl font-semibold text-indigo-800 mt-8 mb-4">
          Content Blocks
        </h2>
        {blockFields.length === 0 ? (
          <p className="text-indigo-500 text-center py-4 bg-white rounded-lg shadow-sm">
            No content blocks added yet. Click "Add Block" below to add content.
          </p>
        ) : (
          <div className="space-y-4">
            {blockFields.map((block, index) => (
              <div
                key={block.id}
                className="p-6 bg-white rounded-lg shadow-sm space-y-4 border border-purple-100"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-indigo-700">
                      Block {block.sno}
                    </span>
                    <input
                      {...register(`blocks.${index}.sno`)}
                      value={block.sno}
                      type="hidden"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => moveBlockUp(index)}
                        disabled={index === 0}
                        className="px-2 py-1 text-indigo-500 hover:text-indigo-700 disabled:text-gray-400"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlockDown(index)}
                        disabled={index === blockFields.length - 1}
                        className="px-2 py-1 text-indigo-500 hover:text-indigo-700 disabled:text-gray-400"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeBlock(index);
                      const blocks = watch("blocks");
                      updateSNOs(blocks, updateBlock);
                    }}
                    className="px-3 py-2 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 transition duration-200"
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Heading
                  </label>
                  <input
                    {...register(`blocks.${index}.heading`)}
                    placeholder="Enter heading"
                    required
                    className="block w-full rounded-md border-purple-200 shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Paragraph
                  </label>
                  <textarea
                    {...register(`blocks.${index}.paragraph`)}
                    placeholder="Enter paragraph"
                    required
                    className="block w-full rounded-md border-purple-200 shadow-sm p-2 h-24 resize-none"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendBlock({
                  sno: blockFields.length + 1,
                  heading: "",
                  paragraph: "",
                })
              }
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md shadow-md hover:from-indigo-600 hover:to-purple-600 focus:ring focus:ring-purple-300 transition duration-200"
            >
              Add Block
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:ring focus:ring-green-300 transition duration-200"
        >
          Submit Form
        </button>
      </form>

      {/* Display Download Link if File is Generated */}
      {fileUrl && (
        <div className="mt-8 text-center">
          <a
            href={fileUrl}
            download
            className="py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200"
          >
            Download Generated File
          </a>
        </div>
      )}
    </div>
  );
};

export default DynamicBlock;
