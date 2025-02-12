import { useForm, useFieldArray, set } from "react-hook-form";
import { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export default function WorkshopForm() {
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
        const formData = {
            ...data,
            dateAndDuration: `${data.date} & ${new Date('1970-01-01T' + data.duration.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${new Date('1970-01-01T' + data.duration.end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
            poster: poster?.url || null,
            glimpses: glimpses.map((img) => img.url),
            attendances: attendances.map((img) => img.url),
        };

        try {
            const res = await axios.post("/generate/workshop-template", formData);
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
                Workshop Report Generator
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
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                        Key Learnings
                    </h2>

                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex-1">
                                <input
                                    {...register(`keyLearnings.${index}.learning`)}
                                    className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                                    placeholder="Enter key learning point"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="mt-1 px-3 py-2 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 transition duration-200"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => append({ learning: "" })}
                        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md shadow-md hover:from-indigo-600 hover:to-purple-600 focus:ring focus:ring-purple-300 transition duration-200"
                    >
                        Add Learning Point
                    </button>
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
                    className="w-full mt-6 py-3 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:ring focus:ring-green-300 transition duration-200"
                >
                    Generate Workshop Report
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
}
