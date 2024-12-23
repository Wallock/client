import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import React from 'react'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

/***
 *     ___       __   ________  ___       ___       ________  ________  ________ _________
 *    |\  \     |\  \|\   __  \|\  \     |\  \     |\   ____\|\   __  \|\  _____\\___   ___\
 *    \ \  \    \ \  \ \  \|\  \ \  \    \ \  \    \ \  \___|\ \  \|\  \ \  \__/\|___ \  \_|
 *     \ \  \  __\ \  \ \   __  \ \  \    \ \  \    \ \_____  \ \  \\\  \ \   __\    \ \  \
 *      \ \  \|\__\_\  \ \  \ \  \ \  \____\ \  \____\|____|\  \ \  \\\  \ \  \_|     \ \  \
 *       \ \____________\ \__\ \__\ \_______\ \_______\____\_\  \ \_______\ \__\       \ \__\
 *        \|____________|\|__|\|__|\|_______|\|_______|\_________\|_______|\|__|        \|__|
 *                                                    \|_________|
 *
 *
 */

const Home = () => {
    const router = useRouter()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('accessToken')

            if (!token) {
                router.push('/login')
                return
            } else {
                router.push('/dashboard')
                return
            }
            const response = await axios.get(
                'https://server.wb.in.th/api/user',
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            )

            setUserData(response.data)
        }

        fetchUserData()
    }, [])

    return (
        <div className=" bg-gradient-to-b from-blue-800 to-indigo-700 font-lineSeed">
            <Head>
                <title>JS-System v3</title>
            </Head>
            <main>
                <div className="snowflakes" aria-hidden="true">
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                    <div className="snowflake">
                        <div className="inner">❅</div>
                    </div>
                </div>
                <div className="flex items-center justify-center h-screen">
                    <div>
                        <h1 className="title-font m-0 font-semibold text-5xl  drop-shadow-xl text-transparent py-1 bg-clip-text bg-gradient-to-r from-slate-50 to-gray-400 text-left">
                            <FontAwesomeIcon
                                icon={faGear}
                                shake
                                className="text-white"
                            />{' '}
                            JS-System
                            <sup className="text-red-500 lg:text-1xl  drop-shadow-md text-sm">
                                v3
                            </sup>
                        </h1>
                        <p className="leading-relaxed  drop-shadow-lg text-lg lg:max-w-xl text-slate-50 font-semibold text-center ">
                            ระบบจัดการพนักงานและองค์กรภายใน
                        </p>
                    </div>
                </div>
                <div className="toast toast-top toast-center lg:toast-end">
                    <div className="alert bg-white text-blue-600 font-1 font-semibold px-3 shadow-lg ">
                        <span className="loading loading-bars loading-sm" />
                        <span>กำลังดาวน์โหลดข้อมูล กรุณารอสักครู่...</span>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home
