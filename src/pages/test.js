import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faServer, faEnvelope, faEye } from '@fortawesome/free-solid-svg-icons'

export default function test() {
    return (
        <AppLayout>
            <div className="flex-warp h-full content-center items-center justify-center">
                <div className="hero text-gray-700 drop-shadow-lg">
                    <div className="hero-content my-3">
                        <div className="text-center p-3">
                            <h1 className="text-5xl font-bold font-2 m-0">
                                Test Functions
                            </h1>
                            <p className="font-1 font-semibold">
                                ทดสอบระบบใหม่ ก่อนใคร
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center pb-5 w-full overflow-hidden">
                    test
                </div>
            </div>
        </AppLayout>
    )
}
