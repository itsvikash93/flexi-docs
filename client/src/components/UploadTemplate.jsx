import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const UploadTemplate = () => {
    const { register, handleSubmit } = useForm();

    const onSubmit = data => {
        console.log(data);
        const formData = { name: data.name, description: data.description };
        try {
            axios.post('https://flexi-docs.onrender.com/api/templates', formData).then((res) => {
                // console.log(res.data);
                axios.put(res.data.uploadUrl, data.template[0], {
                    headers: {
                        'Content-Type': data.template[0].type,
                    },
                }).then((res) => {
                    alert('Template uploaded successfully!');
                })
            })
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Upload Template</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register('name', { required: true })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...register('description', { required: true })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="template">
                        Template File
                    </label>
                    <input
                        type="file"
                        id="template"
                        {...register('template', { required: true })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Upload to Cloud
                </button>

            </form>
        </div>
    );
};

export default UploadTemplate;