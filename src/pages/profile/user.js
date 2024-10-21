import AppLayout from '@/components/Layouts/AppLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '@/lib/loading'

export default function Profile() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState(null)

    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('accessToken') // Get token from localStorage

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

                    <div className="w-full max-w-2xl my-5 mx-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="card bg-base-100 text-gray-800 dark:text-white dark:glass p-3 shadow-xl">
                                คนงานของฉัน
                            </div>
                            <div className="card bg-base-100 text-gray-800 dark:text-white dark:glass p-3 shadow-xl">
                                ทำรายการไปแล้ว
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Posts Section */}
                    <div className="w-full max-w-2xl mx-auto">
                        <div className="card bg-base-100 text-gray-800 dark:text-white dark:glass p-3 shadow-xl">
                            <p className="text-lg">
                                Username : {userData?.username}
                            </p>
                            <p className="text-lg">Role : {userData?.role}</p>
                            <p className="text-lg">48 : {userData?.type48}</p>
                            <p className="text-lg">82 : {userData?.type82}</p>
                            <p className="text-lg">
                                ThaiOnline : {userData?.typethai}
                            </p>
                            <p className="text-lg">
                                Laos : {userData?.typelaos}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
