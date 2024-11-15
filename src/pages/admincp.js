import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faServer, faEnvelope, faEye } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Link from 'next/link'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import Label from '@/components/Label'
import dynamic from 'next/dynamic'
import 'plyr-react/plyr.css'

const Plyr = dynamic(() => import('plyr-react'), { ssr: false }) // Load Plyr only on the client-side

const mainVideoSrc = {
    type: 'video',
    title: 'Example Title',
    sources: [
        {
            src: '/ads/ads.mp4',
            type: 'video/mp4',
        },
    ],
}

const options = {}

export default function admincp() {
    const [databeta, setDataBeta] = useState('ออฟไลน์')
    const [datadd, setDataDD] = useState('ออฟไลน์')
    const [datalaos, setDataLaos] = useState('ออฟไลน์')
    const [datathai, setDataThai] = useState('ออฟไลน์')
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

                setDataBeta(response1.data === 'ONLINE' ? 'ปกติ' : 'ออฟไลน์')
                setDataDD(response2.data === 'ONLINE' ? 'ปกติ' : 'ออฟไลน์')
                setDataLaos(response3.data === 'ONLINE' ? 'ปกติ' : 'ออฟไลน์')
                setDataThai(response4.data === 'ONLINE' ? 'ปกติ' : 'ออฟไลน์')

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
            <div className="flex-warp h-full content-center items-center justify-center">
                <div className="hero text-gray-700 drop-shadow-lg">
                    <div className="hero-content my-3">
                        <div className="text-center p-3">
                            <h1 className="text-5xl font-bold font-2 m-0">
                                Admin Control Panel
                            </h1>
                            <p className="font-1 font-semibold">
                                ระบบจัดการพนักงานและองค์กรภายใน
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center pb-5 w-full overflow-hidden">
                    <ul className="menu text-lg font-1 menu-vertical lg:menu-horizontal text-slate-800 bg-white rounded-box shadow-lg">
                        <li>
                            <Link href="/settings/users">ผู้ใช้งาน</Link>
                        </li>
                        <li>
                            <Link href="/settings/worker">ค้นหาคนงาน</Link>
                        </li>
                        <li>
                            <Link href="/settings/system">ตั้งค่าระบบ</Link>
                        </li>
                        <li>
                            <Link href="/settings/system">ตั้งค่าระบบ</Link>
                        </li>
                        <li>
                            <Link href="/settings/announcements">ประกาศ</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </AppLayout>
    )
}
