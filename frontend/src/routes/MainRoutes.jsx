import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import Hostel from '../pages/hostels/Hostel'
import Home from '../pages/home/Home'
import HostelPage from '../components/HostelDetails'
import ContactPage from '../pages/contact/Contact'

const MainRoutes=() =>
{
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/hostel' element={<Hostel />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/hostel/:id' element={<HostelPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default MainRoutes
