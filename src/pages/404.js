import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faGear,
    faTriangleExclamation,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'

const NotFoundPage = () => (
    <div className=" bg-gradient-to-b from-blue-800 to-indigo-700">
        <Head>
            <title>JS-System v3</title>
        </Head>
        <main>
            <div className="flex items-center justify-center h-screen">
                <div>
                    <h1 className="title-font m-0 font-extrabold text-5xl py-1 text-gray-200 text-center drop-shadow-xl">
                        <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className="text-amber-500 drop-shadow-md"
                        />{' '}
                        <label className="text-amber-500">404</label> Not found
                    </h1>
                    <p className="leading-relaxed text-lg lg:max-w-xl text-slate-50 font-semibold text-center drop-shadow-md">
                        ไม่พบหน้านี้ กรุณาลองใหม่อีกครั้ง!
                    </p>
                    <Link href="/">
                        <p className="mt-3 text-sm text-slate-50 text-center">
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                className="text-white px-1"
                            />{' '}
                            กลับหน้าหลัก
                        </p>
                    </Link>
                </div>
            </div>
        </main>
    </div>
)

export default NotFoundPage
