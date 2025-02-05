import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home'
import DynamicBlock from '../components/DynamicBlock'

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates/dynamic-block" element={<DynamicBlock />} />
        </Routes>
    )
}

export default Routing