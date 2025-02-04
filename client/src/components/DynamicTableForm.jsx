import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
export default function DynamicForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      topic_name: "",
      department_name: "",
      session_time: "",
      date: "",
      activities: [
        { sno: 1, activity: "", duration: "", timing: "" }, // Initial row
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities",
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Send data to backend
    axios.post("http://localhost:3000/generate", data).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Event Details</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic Name
            </label>
            <input
              type="text"
              {...register("topic_name")}
              placeholder="Enter topic name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Name
            </label>
            <input
              type="text"
              {...register("department_name")}
              placeholder="Enter department name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Time
            </label>
            <input
              type="text"
              {...register("session_time")}
              placeholder="e.g., 09:30 AM - 11:45 AM"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              {...register("date")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">
          Activities
        </h2>
        <div className="space-y-4">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center space-x-6 p-6 bg-gray-50 rounded-md shadow-sm"
            >
              <div className="w-12 text-center">
                <span className="text-sm font-medium text-gray-700">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity
                </label>
                <input
                  type="text"
                  {...register(`activities.${index}.activity`)}
                  placeholder="Enter activity name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  {...register(`activities.${index}.duration`)}
                  placeholder="e.g., 5 Min"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timing
                </label>
                <input
                  type="text"
                  {...register(`activities.${index}.timing`)}
                  placeholder="e.g., 09:30 AM - 09:35 AM"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-6 px-3 py-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              sno: fields.length + 1,
              activity: "",
              duration: "",
              timing: "",
            })
          }
          className="w-full py-3 px-6 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300 mt-4"
        >
          Add Activity
        </button>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:ring focus:ring-green-300 mt-8"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
