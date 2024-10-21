import React from 'react'

const Loading = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center p-3">
            <span className="loading loading-bars loading-lg button-js"></span>
            <p className="mt-2 font-semibold">
                กำลังดาวน์โหลดข้อมูล รอสักครู่...
            </p>
        </div>
    )
}

export default Loading
