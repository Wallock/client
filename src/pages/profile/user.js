import AppLayout from '@/components/Layouts/AppLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '@/lib/loading'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

export default function Profile() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState(null)

    const getBadgeProps = role => {
        const numericRole = Number(role) // Convert role to a number

        switch (numericRole) {
            case 0:
                return { color: 'ghost', text: 'ไม่มี' }
            case 1:
                return { color: 'primary', text: 'แอดมิน' }
            case 2:
                return { color: 'secondary', text: 'เซลล์' }
            case 3:
                return { color: 'warning', text: 'ผู้แก้ไข' }
            case 4:
                return { color: 'danger', text: 'ผู้จัดการ' }
            case 5:
                return { color: 'accent', text: 'ผู้ดูแล' }
            case 99:
                return { color: 'gold', text: 'ผู้พัฒนา' }
            default:
                return { color: 'gray', text: 'Unknown Role' }
        }
    }
    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const token = Cookies.get('accessToken') // Get token from localStorage

            if (!token) {
                router.push('/login') // If no token, redirect to login
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

            setUserData(response.data) // Save user data
            setLoading(false) // Set loading to false when data is fetched
        } catch (error) {
            //console.error('Error fetching user data:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, []) // Fetch data on component mount

    return (
        <AppLayout>
            {loading ? (
                <Loading />
            ) : (
                <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-5">
                    {/* Cover Photo */}
                    <div className="mt-28 relative h-8 bg-gradient-to-tl from-blue-500 via-indigo-600 to-purple-700 rounded-3xl">
                        {/* Profile Photo */}
                        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 translate-y-1/2 ">
                            <img
                                src={
                                    userData?.profile_photo_path
                                        ? `https://server.wb.in.th/${userData.profile_photo_path}`
                                        : userData?.profile_photo_url ||
                                          '/images/blank-picture.webp'
                                }
                                alt="Profile"
                                className="w-36 h-36 rounded-full border-4 border-white object-cover transition-transform transform hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="text-center mt-5 mb-8">
                        <h1 className="text-4xl font-bold ">
                            {userData?.name}{' '}
                        </h1>
                        <p className="text-gray-600">{userData?.email}</p>
                        <p className="text-gray-600">{userData?.phone}</p>
                    </div>

                    {/* Timeline / Posts Section */}
                    <div className="w-full max-w-2xl mx-auto">
                        <div className="card bg-base-100 mb-5 text-gray-800 dark:text-white dark:glass p-3 shadow-xl">
                            <p className="text-lg my-1 text-center">
                                ระดับ : {getBadgeProps(userData?.role).text}
                            </p>
                        </div>
                        <div className="card bg-base-100 text-gray-800 dark:text-white dark:glass p-3 shadow-xl">
                            <div className="text-lg text-center mb-3">
                                สิทธิ์การใช้งาน
                            </div>
                            <div className="card-actions justify-center">
                                {userData?.type48 === 1 && (
                                    <div className="badge badge-outline badge-success">
                                        <FontAwesomeIcon
                                            icon={faCircleCheck}
                                            className="fa-fw  me-1"
                                        />{' '}
                                        ระบบนาซ่า
                                    </div>
                                )}
                                {userData?.type82 === 1 && (
                                    <div className="badge badge-outline badge-success">
                                        <FontAwesomeIcon
                                            icon={faCircleCheck}
                                            className="fa-fw  me-1"
                                        />{' '}
                                        ดีดีเมท
                                    </div>
                                )}
                                {userData?.typethai === 1 && (
                                    <div className="badge badge-outline badge-success">
                                        <FontAwesomeIcon
                                            icon={faCircleCheck}
                                            className="fa-fw  me-1"
                                        />{' '}
                                        ลาว
                                    </div>
                                )}
                                {userData?.typelaos === 1 && (
                                    <div className="badge badge-outline badge-success">
                                        <FontAwesomeIcon
                                            icon={faCircleCheck}
                                            className="fa-fw me-1"
                                        />{' '}
                                        ไทยออนไลน์
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
