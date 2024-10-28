import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faEye, faSearch } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataId, setDataId] = useState('')
    const token = `1amwall0ck`
    const systems = {
        'dd.wb.in.th': 'ระบบ82',
        'laos.wb.in.th': 'ระบบลาว',
        'beta.wb.in.th': 'ระบบ48',
        'thai.wb.in.th': 'ระบบออนไลน์',
    }

    const fetchData = async () => {
        if (!dataId) {
            toast.warning('Please enter a Data ID to search')
            return
        }

        setLoading(true)
        setUsers([])
        try {
            const apiUrls = Object.keys(systems).map(
                key =>
                    `https://${key}/api/i_worker?token=${token}&data_id=${dataId}`,
            )

            const responses = await Promise.all(
                apiUrls.map(url => axios.get(url).catch(() => null)),
            )

            const results = responses
                .map((res, index) => {
                    if (res && res.data && res.data.length > 0) {
                        // ตรวจสอบว่าข้อมูลไม่เป็น null และไม่ใช่อาร์เรย์ว่าง
                        return {
                            system: systems[Object.keys(systems)[index]], // แสดงระบบที่ได้มา
                            data: res.data[0], // เข้าถึงข้อมูลในออบเจกต์ตัวแรกของอาร์เรย์
                        }
                    }
                    return null
                })
                .filter(item => item) // กรองเฉพาะรายการที่มีข้อมูล

            setUsers(results)
        } catch (error) {
            toast.error('Error fetching data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AppLayout>
            <ToastContainer />
            <div className="w-full p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    <FontAwesomeIcon icon={faUsers} /> Worker Management
                </h1>
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="กรอก Data ID เพื่อค้นหา"
                        value={dataId}
                        onChange={e => setDataId(e.target.value)}
                    />
                    <button onClick={fetchData} className="btn button-js">
                        <FontAwesomeIcon icon={faSearch} /> ค้นหา
                    </button>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="card bg-base-100 dark:glass dark:text-white shadow-xl p-1 overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="text-center dark:text-white font-bold text-lg">
                                    <th>ผ่านระบบ</th>
                                    <th>รูป</th>
                                    <th>ไอดี</th>
                                    <th>ชื่อเต็ม</th>
                                    <th>ชื่อเล่น</th>
                                    <th>สถานะ</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody className="hover">
                                {users.map(user => (
                                    <tr
                                        key={user.data.worker_id}
                                        className="cursor-pointer hover:bg-gray-100">
                                        <td className="text-center">
                                            {user.system}
                                        </td>
                                        <td className="text-center">
                                            <div className="avatar">
                                                <div className="w-16 h-16 mask mask-squircle">
                                                    <img
                                                        src={`https://${Object.keys(
                                                            systems,
                                                        ).find(
                                                            key =>
                                                                systems[key] ===
                                                                user.system,
                                                        )}/${
                                                            user.data
                                                                .worker_image
                                                        }`}
                                                        alt="Worker"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {user.data.worker_id}
                                        </td>
                                        <td className="text-center">
                                            {user.data.worker_fullname}
                                        </td>
                                        <td className="text-center">
                                            {user.data.worker_nickname}
                                        </td>
                                        <td className="text-center">
                                            {user.data.worker_status}
                                        </td>
                                        <td className="space-x-1 text-center">
                                            <Link
                                                href={`/${
                                                    user.system === 'ระบบ48'
                                                        ? '48'
                                                        : user.system ===
                                                          'ระบบ82'
                                                        ? '82'
                                                        : user.system ===
                                                          'ระบบลาว'
                                                        ? 'laos'
                                                        : 'online'
                                                }/info/${user.data.worker_id}`}
                                                rel="noopener noreferrer"
                                                className="btn btn-square button-js-outline">
                                                <FontAwesomeIcon
                                                    icon={faEye}
                                                    className="fa-lg"
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
