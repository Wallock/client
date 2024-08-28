import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faServer } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function dashboard() {
    const [databeta, setDataBeta] = useState(null)
    const [datadd, setDataDD] = useState(null)
    const [datalaos, setDataLaos] = useState(null)
    const [datathai, setDataThai] = useState(null)
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const formatDate = dateString => {
        return format(new Date(dateString), 'd MMM yyyy เวลา HH:mm', {
            locale: th,
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const token = localStorage.getItem('accessToken')
                if (!token) {
                    throw new Error('No access token found')
                }

                const [
                    response1,
                    response2,
                    response3,
                    response4,
                ] = await Promise.all([
                    axios.get(`https://beta.wb.in.th/api/status_sv`),
                    axios.get(`https://dd.wb.in.th/api/status_sv`),
                    axios.get(`https://laos.wb.in.th/api/status_sv`),
                    axios.get(`https://thai.wb.in.th/api/status_sv`),
                ])

                setDataBeta(response1.data)
                setDataDD(response2.data)
                setDataLaos(response3.data)
                setDataThai(response4.data)

                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }

                const responseAnnouncements = await axios.get(
                    'https://server.wb.in.th/api/announcements',
                    { headers },
                )
                setAnnouncements(
                    responseAnnouncements.data.data.sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at),
                    ),
                )

                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = announcements.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(announcements.length / itemsPerPage)

    const paginate = pageNumber => setCurrentPage(pageNumber)

    return (
        <AppLayout>
            {loading ? (
                <div className="w-full p-3">
                    <div className="flex items-center justify-center flex-wrap gap-4">
                        <div className="skeleton h-32 w-full"></div>
                        <div className="skeleton h-4 w-28"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-full"></div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-full p-3">
                        <div className="flex items-center justify-center flex-wrap gap-4">
                            <div className="stats stats-vertical lg:stats-horizontal w-full shadow-lg">
                                <div className="stat">
                                    <div className="stat-figure text-blue-500">
                                        <FontAwesomeIcon
                                            icon={faServer}
                                            className="fa-2xl"
                                        />
                                    </div>
                                    <div className="stat-title text-sm">
                                        ฐานข้อมูล 48
                                    </div>
                                    <div className="stat-value text-success">
                                        {databeta}
                                    </div>
                                    <div className="stat-desc">
                                        ทั้งหมด : 05 Record
                                    </div>
                                </div>

                                <div className="stat">
                                    <div className="stat-figure text-blue-500">
                                        <FontAwesomeIcon
                                            icon={faServer}
                                            className="fa-2xl"
                                        />
                                    </div>
                                    <div className="stat-title text-sm">
                                        ฐานข้อมูล 82
                                    </div>
                                    <div className="stat-value text-success">
                                        {datadd}
                                    </div>
                                    <div className="stat-desc">
                                        ทั้งหมด : 05 Record
                                    </div>
                                </div>

                                <div className="stat">
                                    <div className="stat-figure text-blue-500">
                                        <FontAwesomeIcon
                                            icon={faServer}
                                            className="fa-2xl"
                                        />
                                    </div>
                                    <div className="stat-title text-sm">
                                        ฐานข้อมูล Laos
                                    </div>
                                    <div className="stat-value text-success">
                                        {datalaos}
                                    </div>
                                    <div className="stat-desc">
                                        ทั้งหมด : 05 Record
                                    </div>
                                </div>

                                <div className="stat">
                                    <div className="stat-figure text-blue-500">
                                        <FontAwesomeIcon
                                            icon={faServer}
                                            className="fa-2xl"
                                        />
                                    </div>
                                    <div className="stat-title text-sm">
                                        ฐานข้อมูล ThaiOnline
                                    </div>
                                    <div className="stat-value text-success">
                                        {datathai}
                                    </div>
                                    <div className="stat-desc">
                                        ทั้งหมด : 05 Record
                                    </div>
                                </div>
                            </div>

                            <div className="hero text-gray-300">
                                <div className="hero-content my-3">
                                    <div className="text-center p-3">
                                        <h1 className="text-6xl font-bold font-2 m-0">
                                            Welcome Back
                                        </h1>
                                        <p className="font-1 font-semibold">
                                            ระบบจัดการพนักงานและองค์กรภายใน
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mockup-browser w-full lg:w-1/2 shadow-lg border bg-base-300">
                                <div className="mockup-browser-toolbar">
                                    <div className="input font-2 font-semibold">
                                        ข่าวสาร & อัพเดทล่าสุด
                                    </div>
                                </div>
                                <div className="card bg-base-100 px-4 m-2">
                                    <ul
                                        role="list"
                                        className="divide-y divide-gray-100">
                                        {currentItems.map(announcement => (
                                            <li
                                                key={announcement.id}
                                                className="flex justify-between gap-x-6 py-5"
                                                onClick={() =>
                                                    setSelectedAnnouncement(
                                                        announcement,
                                                    )
                                                }>
                                                <div className="text-lg font-semibold">
                                                    {announcement.title}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {formatDate(
                                                        announcement.created_at,
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex justify-center my-2">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, index) => (
                                                <button
                                                    key={index + 1}
                                                    className={`btn btn-sm mx-1 ${
                                                        currentPage ===
                                                        index + 1
                                                            ? 'btn-active'
                                                            : ''
                                                    }`}
                                                    onClick={() =>
                                                        paginate(index + 1)
                                                    }>
                                                    {index + 1}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {selectedAnnouncement && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">
                                    {selectedAnnouncement.title}
                                </h3>
                                <p className="py-4">
                                    {selectedAnnouncement.content}
                                </p>
                                <div className="modal-action">
                                    <button
                                        className="btn"
                                        onClick={() =>
                                            setSelectedAnnouncement(null)
                                        }>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </AppLayout>
    )
}
