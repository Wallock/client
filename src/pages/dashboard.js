import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faServer, faEnvelope, faEye } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { format } from 'date-fns'
import Cookies from 'js-cookie'
import { th } from 'date-fns/locale'
import Label from '@/components/Label'
import dynamic from 'next/dynamic'
import { version } from '@/lib/config'
import 'plyr-react/plyr.css'

const Plyr = dynamic(() => import('plyr-react'), { ssr: false }) // Load Plyr only on the client-side

export default function Dashboard() {
    const [userData, setUserData] = useState(null) // Define userData state
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

                const token = Cookies.get('accessToken')
                if (!token) {
                    throw new Error('No access token found')
                }

                const response = await axios.get(
                    'https://server.wb.in.th/api/user',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )

                setUserData(response.data) // Save user data

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
            <div className="w-full p-5">
                <div className="stats stats-vertical lg:stats-horizontal w-full shadow-lg bg-white dark:bg-gray-800 dark:text-white">
                    <div className="stat">
                        <div className="stat-figure text-blue-500">
                            <FontAwesomeIcon
                                icon={faServer}
                                className="fa-2xl"
                            />
                        </div>
                        <div className="stat-title text-sm dark:text-white">
                            เซิฟเวอร์ NASA
                        </div>
                        <div className="stat-value text-success">
                            {loading ? (
                                <div className="skeleton h-6 w-16"> </div>
                            ) : (
                                databeta
                            )}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-blue-500">
                            <FontAwesomeIcon
                                icon={faServer}
                                className="fa-2xl"
                            />
                        </div>
                        <div className="stat-title text-sm dark:text-white">
                            เซิฟเวอร์ DDMaid
                        </div>
                        <div className="stat-value text-success">
                            {loading ? (
                                <div className="skeleton h-6 w-16"> </div>
                            ) : (
                                datadd
                            )}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-blue-500">
                            <FontAwesomeIcon
                                icon={faServer}
                                className="fa-2xl"
                            />
                        </div>
                        <div className="stat-title text-sm dark:text-white">
                            เซิฟเวอร์ Laos
                        </div>
                        <div className="stat-value text-success">
                            {loading ? (
                                <div className="skeleton h-6 w-16"> </div>
                            ) : (
                                datalaos
                            )}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-blue-500">
                            <FontAwesomeIcon
                                icon={faServer}
                                className="fa-2xl"
                            />
                        </div>
                        <div className="stat-title text-sm dark:text-white">
                            เซิฟเวอร์ ThaiOnline
                        </div>
                        <div className="stat-value text-success">
                            {loading ? (
                                <div className="skeleton h-6 w-16"> </div>
                            ) : (
                                datathai
                            )}
                        </div>
                    </div>
                </div>

                <div className="hero text-gray-300 dark:text-white">
                    <div className="hero-content my-3">
                        <div className="text-center p-3">
                            <h1 className="text-5xl font-bold font-2 m-0">
                                ยินดีต้อนรับ
                            </h1>
                            <p className="font-1 font-semibold">
                                ระบบจัดการพนักงานและองค์กรภายใน
                            </p>
                            <br />
                            <p className="font-lg font-semibold text-error">
                                หากเมนูด้านซ้ายไม่ขึ้น ให้รีเฟรชหน้าเว็บ 1
                                ทีครับ
                            </p>
                            <p className="font-md font-semibold text-error">
                                **ปิดการใช้งานโหมดมืด
                                ไม่งั้นจะทำให้ระบบบัคเมนูครับ
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full my-5 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="mockup-browser shadow-lg border bg-base-300 m-5">
                            <div className="mockup-browser-toolbar">
                                <div className="input font-2 font-semibold">
                                    ข่าวสาร & อัพเดทล่าสุด
                                </div>
                            </div>

                            <div className="card bg-base-100 px-4 m-2">
                                <ul
                                    role="list"
                                    className="divide-y divide-gray-100">
                                    {loading
                                        ? Array.from({
                                              length: itemsPerPage,
                                          }).map((_, index) => (
                                              <li
                                                  key={index}
                                                  className="flex justify-between items-center gap-x-6 py-2">
                                                  <div className="skeleton h-4 w-full">
                                                      {' '}
                                                  </div>
                                              </li>
                                          ))
                                        : currentItems.map(announcement => (
                                              <li
                                                  key={announcement.id}
                                                  className="flex justify-between items-center gap-x-6 py-2"
                                                  onClick={() =>
                                                      setSelectedAnnouncement(
                                                          announcement,
                                                      )
                                                  }>
                                                  <p className="font-semibold">
                                                      <FontAwesomeIcon
                                                          icon={faEnvelope}
                                                          className="me-2"
                                                      />
                                                      {announcement.title}
                                                      <Label className="text-xs">
                                                          อัพเดทเมื่อ :{' '}
                                                          {formatDate(
                                                              announcement.created_at,
                                                          )}
                                                      </Label>
                                                  </p>
                                                  <div className="btn text-sm text-gray-600">
                                                      <FontAwesomeIcon
                                                          icon={faEye}
                                                      />
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
                                                    currentPage === index + 1
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
                        <div className="mockup-code shadow-lg">
                            <pre className="text-lg font-semibold my-2">
                                <code>Patch Note : {version}</code>
                            </pre>
                            <pre data-prefix=">" className="text-sm">
                                <code>
                                    เพิ่มการอัพโหลดรูปการ์ด และลบรูปการ์ดได้แล้ว
                                </code>
                            </pre>
                            <pre data-prefix=">" className="text-sm">
                                <code>ปิดการใช้งานโหมดมืดชั่วคราว</code>
                            </pre>
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
                        <p className="py-4">{selectedAnnouncement.content}</p>
                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setSelectedAnnouncement(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
