import AppLayout from '@/components/Layouts/AppLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCircleCheck,
    faCirclePause,
    faFileCircleCheck,
    faClock,
    faArrowRightArrowLeft,
    faPersonCircleExclamation,
    faUserCheck,
    faCircleXmark,
    faQuestion,
} from '@fortawesome/free-solid-svg-icons'

export default function Page() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const { user } = useAuth({ middleware: 'auth' })
    const [data, setData] = useState(null)

    const token = `1amwall0ck`
    const f_url = `https://beta.wb.in.th`
    const getname = `48`

    const fetchData = async () => {
        try {
            setLoading(true)

            let apiUrl = `${f_url}/api/i_worker?token=${token}&data_id=${router.query.id}`

            const response = await axios.get(apiUrl)
            const newData = response.data
            setData(newData[0])
            console.log(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user?.type48 !== 1) {
            router.push('/')
        }
        fetchData()
    }, [])
    const getStatusData = status => {
        switch (status) {
            case 'wait':
                return {
                    styles: 'bg-red-100 text-red-500',
                    text: 'ว่างงาน',
                }
            case 'save':
                return {
                    styles: 'bg-amber-100 text-amber-500',
                    text: 'จอง',
                }
            case 'incomplete':
                return {
                    styles: 'bg-blue-100 text-blue-500',
                    text: 'รอทำสัญญา',
                }
            case 'woker':
                return {
                    styles: 'bg-emerald-100 text-emerald-500',
                    text: 'ได้งานแล้ว',
                }
            case 'retry':
                return {
                    styles: 'bg-purple-100 text-purple-500',
                    text: 'เคลม',
                }
            case 'changepp':
                return {
                    styles: 'bg-gray-100 text-black',
                    text: 'เปลี่ยน',
                }
            case 'bfprocess':
                return {
                    styles: 'bg-sky-100 text-sky-500',
                    text: 'สพ.แล้ว',
                }
            case 'export':
                return {
                    styles: 'bg-red-100 text-red-500',
                    text: 'ห้ามส่งงาน',
                }
            default:
                return {
                    styles: '',
                    text: 'Unknown Status',
                }
        }
    }
    return (
        <AppLayout>
            {loading ? (
                <div className="w-full p-3">
                    <div className="flex items-center justify-center flex-wrap gap-4">
                        {[...Array(30)].map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-4 w-full lg:w-48 mx-1">
                                <div className="skeleton h-32 w-full"></div>
                                <div className="skeleton h-4 w-28"></div>
                                <div className="skeleton h-4 w-full"></div>
                                <div className="skeleton h-4 w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-100 p-0">
                    {/* Header Section with Background Image */}
                    <div className="rounded-lg bg-gradient-to-t from-indigo-500 to-blue-500 h-52 w-full relative ">
                        <div className="ribbon ribbon-top-left">
                            {(() => {
                                const { styles, icon, text } = getStatusData(
                                    data?.worker_status,
                                )
                                return (
                                    <span className={`font-bold ${styles}`}>
                                        {text}
                                    </span>
                                )
                            })()}
                        </div>
                        <h1 className="title-font m-0 font-extrabold text-center text-2xl sm:text-7xl text-white opacity-20 pt-10 sm:pt-3 px-2">
                            {data?.worker_id}
                        </h1>
                        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-25"></div>
                        <img
                            className="rounded-full object-cover border-4 border-white absolute bottom-0 transform translate-y-1/2 w-52 h-52 mx-auto left-0 right-0"
                            src={`${f_url}/${data?.worker_image}`}
                            alt={data?.worker_id}
                        />
                    </div>
                    <div className="flex flex-wrap  justify-between mx-auto pt-28 sm:pt-7 pb-6 ">
                        <div className="w-full sm:w-1/2">
                            {/* Profile Summary Section */}
                            <div className="px-6">
                                <h1 className="text-2xl font-bold">
                                    {data?.worker_fullname} (
                                    {data?.worker_nickname})
                                </h1>
                                <p className="text-gray-700 mt-1">
                                    {data?.worker_nationality} -{' '}
                                    {data?.worker_race}
                                </p>
                                <span className="mx-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    ฉีดวัคซีนแล้ว {data?.worker_covid} เข็ม
                                </span>
                                {data?.worker_namelist === 1 ? (
                                    <span className="mx-1 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        NameList
                                    </span>
                                ) : null}

                                <p className="mt-2">
                                    หมายเหตุ : {data?.worker_detailother}
                                </p>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2">
                            {/* Action Button Section */}
                            <div className="px-6 text-right">
                                <button className="btn btn-active btn-neutral">
                                    จอง
                                </button>
                                <button className="btn btn-active btn-neutral">
                                    เปลี่ยน
                                </button>
                                <button className="btn btn-actiหve btn-neutral">
                                    เคลม
                                </button>
                                <button className="btn btn-active btn-neutral">
                                    สัมภาษณ์แล้วรอ นจ.
                                </button>
                                <button className="btn btn-active btn-neutral">
                                    รอทำ สย. ส่งตัวคนงาน
                                </button>
                                <button className="btn btn-active btn-neutral">
                                    ได้งานแล้ว
                                </button>
                                <button className="btn btn-active btn-neutral">
                                    ไม่รับงาน
                                </button>
                                <button className="btn btn-active btn-neutral">
                                    ว่างงาน
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="bg-white p-6 shadow-sm mb-6">
                        <h2 className="text-xl font-bold mb-4">
                            ประวัติการทำงาน
                        </h2>
                        {/* Repeat this for each experience item */}
                        <div className="mb-4">
                            <h3 className="text-lg font-bold">
                                Job Title at Company
                            </h3>
                            <p className="text-gray-600">Duration</p>
                            <p>Description of your role and achievements...</p>
                        </div>
                        {/* Experience item ends */}
                    </div>

                    {/* Education Section */}
                    <div className="bg-white p-6 shadow-sm mb-6">
                        <h2 className="text-xl font-bold mb-4">ทักษะ</h2>
                        {/* Repeat this for each education item */}
                        <div className="mb-4">
                            <h3 className="text-lg font-bold">
                                Degree, University/College
                            </h3>
                            <p className="text-gray-600">Duration</p>
                        </div>
                        {/* Education item ends */}
                    </div>

                    {/* Skills Section */}
                    <div className="bg-white p-6 shadow-sm mb-6">
                        <h2 className="text-xl font-bold mb-4">สัญญา</h2>
                        <div className="flex flex-wrap">
                            {/* Repeat this for each skill */}
                            <span className="m-1 bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                                Skill Name
                            </span>
                            {/* Skill ends */}
                        </div>
                    </div>

                    {/* Footer or Additional Sections */}
                    {/* Add more sections as needed */}
                </div>
            )}
        </AppLayout>
    )
}
