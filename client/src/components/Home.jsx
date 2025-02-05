import axios from '../utils/axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const [templates, setTemplates] = useState(null)
    useEffect(() => {
        axios.get("/templates").then(res => {
            setTemplates(res.data)
            // console.log(res.data)
        })
    }, [])
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Home</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates && templates.map(template => (
                    <div key={template._id} className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                        <p className="text-gray-700 mb-4">{template.description}</p>
                        <div className="flex justify-between items-center">
                            <Link to="/templates/dynamic-block" className="px-5 py-2 bg-green-500 rounded text-white mt-2">Use Template</Link>
                            <Link to={template.fileUrl} target="_blank" rel="noreferrer" className="px-5 py-2 bg-green-500 rounded text-white">Download Template</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home