import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

export default function System() {
    return (
        <AppLayout>
            <ToastContainer />
            <div className="w-full p-4">
                <h1 className="text-2xl font-bold mb-4">
                    <FontAwesomeIcon icon={faUsers} /> System
                </h1>
                <div className="mb-4">Not available</div>
            </div>
        </AppLayout>
    )
}
