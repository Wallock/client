import AppLayout from '@/components/Layouts/AppLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Loading from '@/lib/loading'

export default function UpdateProfile() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profilePhoto, setProfilePhoto] = useState(null) // Set to file object
    const [updateMessage, setUpdateMessage] = useState('')

    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const token = Cookies.get('accessToken')

            if (!token) {
                router.push('/login')
                return
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

            const { name, email, profile_photo_url } = response.data
            setUserData(response.data)
            setName(name)
            setEmail(email)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    // Function to update user profile
    const updateProfile = async e => {
        e.preventDefault()
        try {
            const token = Cookies.get('accessToken')

            const formData = new FormData()
            formData.append('name', name)
            formData.append('email', email)

            if (profilePhoto) {
                formData.append('profile_photo', profilePhoto)
            }

            const response = await axios.post(
                'https://server.wb.in.th/api/user/update',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            setUpdateMessage('Profile updated successfully!')
            router.push('/profile/user') // Redirect back to the profile page after update
        } catch (error) {
            setUpdateMessage('Failed to update profile.')
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <AppLayout>
            {loading ? (
                <Loading />
            ) : (
                <div className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white p-5">
                    <h1 className="text-3xl font-bold text-center mb-8">
                        แก้ไขโปรไฟล์
                    </h1>

                    {/* Update Profile Form */}
                    <form onSubmit={updateProfile}>
                        <div className="w-full max-w-2xl my-5 mx-auto">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="card bg-base-100 dark:glass text-gray-900 p-3 shadow-xl">
                                    <label className="input input-bordered flex items-center my-2 gap-2">
                                        Name
                                        <input
                                            type="text"
                                            className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                            placeholder="name"
                                            id="name"
                                            value={name}
                                            onChange={e =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </label>
                                    <label className="input input-bordered flex items-center my-2 gap-2">
                                        Email
                                        <input
                                            type="email"
                                            className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                            placeholder="email"
                                            id="email"
                                            value={email}
                                            onChange={e =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </label>
                                    <label className="form-control w-full my-2">
                                        <div className="label">
                                            <span className="label-text">
                                                Profile Photo
                                            </span>
                                            <span className="label-text-alt text-error">
                                                *jpg,jpeg,png,webp only
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            id="profilePhoto"
                                            onChange={e =>
                                                setProfilePhoto(
                                                    e.target.files[0],
                                                )
                                            } // Set the file as profilePhoto
                                            className="file-input file-input-bordered w-full"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <button
                                type="submit"
                                className="btn rounded-full button-js">
                                อัพเดทโปรไฟล์
                            </button>
                        </div>
                        {updateMessage && (
                            <p className="text-center mt-4 text-green-500">
                                {updateMessage}
                            </p>
                        )}
                    </form>
                </div>
            )}
        </AppLayout>
    )
}
