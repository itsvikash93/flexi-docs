import { useForm, useFieldArray, set } from "react-hook-form";
import { useState } from "react";
import axios from "../utils/axios";

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
            alert("Poster uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading poster!");
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

            alert("Glimpses uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Error uploading glimpses!");
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

            alert("Attendances uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Error uploading attendances!");
        }
    };

    const onSubmit = async (data) => {
        const formData = {
            ...data,
            poster: poster?.url || null,
            glimpses: glimpses.map((img) => img.url),
            attendances: attendances.map((img) => img.url),
        };

        try {
            // console.log("Form Data:", formData);
            axios.post(
                "/generate/workshop-template",
                formData
            ).then(res => {
                setFileUrl(res.data.fileUrl)
                // console.log(res.data.fileUrl)
            });
            // alert("Report Submitted!");
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error submitting report.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center block text-indigo-700 mb-2">
                Dynamic Report Form
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Report Topic
                    </label>
                    <input
                        {...register("reportTopic")}
                        className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                        placeholder="Report Topic"
                        required
                    />
                </div>

                <div className="">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Name Of Activity
                    </label>
                    <input
                        {...register("nameOfActivity")}
                        className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                        placeholder="Name of Activity"
                        required
                    />
                </div>

                <input
                    type="date"
                    {...register("dateAndDuration")}
                    className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                    required
                />
                <div className="">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Type Of Activity
                    </label>
                    <input
                        {...register("typeOfActivity")}
                        className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                        placeholder="Type of Activity"
                        required
                    />
                </div>
                <div className="">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Activity Objective
                    </label>
                    <textarea
                        {...register("activityObjective")}
                        className="block w-full rounded-md border-purple-200 shadow-sm p-2 h-24 resize-none"
                        placeholder="Activity Objective"
                        required
                    />
                </div>

                <div className="">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Program Outcome
                    </label>
                    <textarea
                        {...register("programOutcome")}
                        className="block w-full rounded-md border-purple-200 shadow-sm p-2 h-24 resize-none"
                        placeholder="Program Outcome"
                        required
                    />
                </div>

                {/* Poster Upload */}
                <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Poster Image:
                </label>
                <input
                    type="file"
                    onChange={handlePosterChange}
                    accept="image/*"
                    className="mb-4 p-2 border rounded w-full"
                />
                {poster && typeof poster === "object" && (
                    <button
                        type="button"
                        onClick={handlePosterUpload}
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
                    >
                        Upload to Cloud
                    </button>
                )}

                <div className="">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Details Of Chief Speaker
                    </label>
                    <textarea
                        {...register("detailsOfChiefSpeaker")}
                        className="block w-full rounded-md border-purple-200 shadow-sm p-2 h-24 resize-none"
                        placeholder="Details of Chief Speaker"
                        required
                    />
                </div>

                <div className="">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Details Of Activity
                    </label>
                    <textarea
                        {...register("detailsOfActivity")}
                        className="block w-full rounded-md border-purple-200 shadow-sm p-2 h-24 resize-none"
                        placeholder="Details of Activity"
                        required
                    />
                </div>
                {/* Key Learnings */}
                <div className="p-6 bg-white rounded-lg shadow-sm space-y-4 border border-purple-100">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">Key Learnings:</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <input
                                {...register(`keyLearnings.${index}.learning`)}
                                className="mt-1 block w-full rounded-md border-purple-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                                placeholder="Learning"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="px-3 py-2 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 transition duration-200"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ learning: "" })}
                        className="w-fit py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md shadow-md hover:from-indigo-600 hover:to-purple-600 focus:ring focus:ring-purple-300 transition duration-200"
                    >
                        Add Learning
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Conclusion
                    </label>
                    <textarea
                        {...register("conclusion")}
                        className="block w-full rounded-md border-purple-200 shadow-sm p-2 h-24 resize-none"
                        placeholder="Conclusion"
                        required
                    />
                </div>

                {/* Glimpses Upload */}
                <div className="">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Glimpses:
                    </label>
                    <input
                        type="file"
                        multiple
                        onChange={handleGlimpsesChange}
                        accept="image/*"
                        className="w-full p-2 border rounded"
                    />
                    {glimpses.length > 0 && (
                        <button
                            type="button"
                            onClick={handleGlimpsesUpload}
                            className="mt-2 bg-blue-600 text-white py-1 px-4 rounded"
                        >
                            Upload to Cloud
                        </button>
                    )}
                </div>

                {/* Attendance Upload */}
                <div className="">
                    <label className="block text-sm font-medium text-indigo-700 mb-2">
                        Attendances:
                    </label>
                    <input
                        type="file"
                        multiple
                        onChange={handleAttendancesChange}
                        accept="image/*"
                        className="w-full p-2 border rounded"
                    />
                    {attendances.length > 0 && (
                        <button
                            type="button"
                            onClick={handleAttendancesUpload}
                            className="mt-2 bg-blue-600 text-white py-1 px-4 rounded"
                        >
                            Upload to Cloud
                        </button>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full mt-6 py-3 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:ring focus:ring-green-300 transition duration-200"
                >
                    Submit Report
                </button>
            </form>

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
}
