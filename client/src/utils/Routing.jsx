import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home'
import DynamicBlock from '../components/DynamicBlock'
import ImageComp from '../components/ImageComp'
import UploadTemplate from '../components/UploadTemplate'
import WorkshopForm from '../components/WorkshopForm'

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/" element={<ImageComp />} /> */}
            <Route path="/upload/template" element={<UploadTemplate />} />
            {/* <Route path="/" element={<WorkshopForm />} /> */}
            <Route path="/templates/dynamic-block" element={<DynamicBlock />} />
            <Route path="/templates/workshop" element={<WorkshopForm />} />
        </Routes>
    )
}

export default Routing