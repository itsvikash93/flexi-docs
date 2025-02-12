import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

const Home = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get("/uploads/templates");
                setTemplates(response.data);
            } catch (error) {
                console.error("Error fetching templates:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const features = [
        {
            title: 'Workshop Report Generator',
            description: 'Create professional workshop reports with ease. Upload media, add activities, and generate comprehensive documents.',
            path: '/templates/workshop',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: 'Dynamic Content Blocks',
            description: 'Build structured content with customizable blocks. Perfect for creating organized and detailed documentation.',
            // path: '/dynamic-block',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-indigo-800 mb-4">
                      FlexiDocs - Document Generator
                    </h1>
                    <p className="text-lg text-indigo-600 max-w-2xl mx-auto">
                        Create professional documents and reports with our easy-to-use templates and tools
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <Link
                            key={index}
                            to={feature.path}
                            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-purple-100 hover:border-purple-200"
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h2 className="text-xl font-semibold text-indigo-800 ml-4">
                                    {feature.title}
                                </h2>
                            </div>
                            <p className="text-indigo-600">
                                {feature.description}
                            </p>
                            <div className="mt-4 flex items-center text-indigo-500 group-hover:text-indigo-600">
                                <span>Get Started</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Templates Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-indigo-800 mb-8 text-center">
                        Available Templates
                    </h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {templates.map((template) => (
                                <div key={template._id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                                    {/* Preview Image */}
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <img
                                            src={template.previewImage}
                                            alt={template.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Template Info */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                                            {template.name}
                                        </h3>
                                        <p className="text-indigo-600 text-sm mb-4 line-clamp-2">
                                            {template.description}
                                        </p>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex gap-4">
                                            <Link
                                                to={template.formUrl}
                                                className="flex-1 px-4 py-2 bg-indigo-500 text-white text-center rounded-lg hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Use Template
                                            </Link>
                                            <a
                                                href={template.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 px-4 py-2 border border-indigo-200 text-indigo-600 text-center rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Preview
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="bg-white rounded-xl shadow-md p-8 border border-purple-100">
                    <h2 className="text-2xl font-bold text-indigo-800 mb-4">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-semibold">
                                1
                            </div>
                            <h3 className="font-semibold text-indigo-800">Choose Template</h3>
                            <p className="text-indigo-600 text-sm">
                                Select from our available document templates
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-semibold">
                                2
                            </div>
                            <h3 className="font-semibold text-indigo-800">Fill Details</h3>
                            <p className="text-indigo-600 text-sm">
                                Input your content and upload necessary files
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-semibold">
                                3
                            </div>
                            <h3 className="font-semibold text-indigo-800">Generate</h3>
                            <p className="text-indigo-600 text-sm">
                                Download your professionally formatted document
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;