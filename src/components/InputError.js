import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const InputError = ({ messages = [], className = '' }) => {
    useEffect(() => {
        // Ensure messages is an array and not null or undefined
        if (Array.isArray(messages)) {
            // Display toast notifications for each error message
            messages.forEach((message, index) => {
                toast.error(message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            })
        }
    }, [messages])

    return (
        <>
            <div className={`text-red-500 ${className}`}>
                {messages.map((message, index) => (
                    <span key={index} className="block">
                        {message}
                    </span>
                ))}
            </div>
            <ToastContainer />
        </>
    )
}

export default InputError
