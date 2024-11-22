import AppLayout from '@/components/Layouts/AppLayout'
import Confetti from '@/components/Confetti'
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
    const [birthday, setbirthday] = useState('')
    const [freeday, setfreeday] = useState('')
    const [lineID, setlineID] = useState('')
    const [phone, setphone] = useState('')
    const [profilePhoto, setProfilePhoto] = useState(null) // Set to file object
    const [updateMessage, setUpdateMessage] = useState('')
    const [showConfetti, setShowConfetti] = useState(false) // State to control confetti

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

            const {
                name,
                email,
                birthday,
                freeday,
                lineID,
                phone,
                profile_photo_url,
            } = response.data
            setUserData(response.data)
            setName(name)
            setEmail(email)
            setbirthday(birthday)
            setfreeday(freeday)
            setlineID(lineID)
            setphone(phone)
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
            formData.append('birthday', birthday)
            formData.append('freeday', freeday)
            formData.append('lineID', lineID)
            formData.append('phone', phone)

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
            setShowConfetti(true)

            setTimeout(() => {
                setShowConfetti(false)
            }, 3000)

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
                                        <label className="font-semibold">
                                            Name (ชื่อผู้ใช้งาน)
                                        </label>
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
                                        <label className="font-semibold">
                                            Email
                                        </label>
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
                                    <label className="input input-bordered flex items-center my-2 gap-2">
                                        <label className="font-semibold">
                                            Birthday (วันเกิด)
                                        </label>
                                        <input
                                            type="date"
                                            className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                            placeholder="birthday"
                                            id="birthday"
                                            value={birthday}
                                            onChange={e =>
                                                setbirthday(e.target.value)
                                            }
                                        />
                                    </label>
                                    <label className="input input-bordered flex items-center my-2 gap-2">
                                        <label className="font-semibold">
                                            FreeDay (วันหยุด)
                                        </label>
                                        <select
                                            className=" border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                            value={freeday} // Set the value of the select element
                                            onChange={e =>
                                                setfreeday(e.target.value)
                                            }>
                                            {/* Populate the select options based on getBadgeProps */}
                                            <option value="1">วันจันทร์</option>
                                            <option value="2">วันอังคาร</option>
                                            <option value="3">วันพุธ</option>
                                            <option value="4">
                                                วันพฤหัสบดี
                                            </option>
                                            <option value="5">วันศุกร์</option>
                                            <option value="6">วันเสาร์</option>
                                            <option value="7">
                                                วันอาทิตย์
                                            </option>
                                        </select>
                                    </label>
                                    <label className="input input-bordered flex items-center my-2 gap-2">
                                        <label className="font-semibold">
                                            Line ID (ไลน์)
                                        </label>
                                        <input
                                            type="text"
                                            className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                            placeholder="ไอดีไลน์หรือเบอร์โทร"
                                            id="lineID"
                                            value={lineID}
                                            onChange={e =>
                                                setlineID(e.target.value)
                                            }
                                        />
                                    </label>
                                    <label className="input input-bordered flex items-center my-2 gap-2">
                                        <label className="font-semibold">
                                            Phone Number (เบอร์ติดต่อ)
                                        </label>
                                        <input
                                            type="text"
                                            className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                            placeholder="ป้อนเบอร์ติดต่อ"
                                            id="phone"
                                            value={phone}
                                            onChange={e =>
                                                setphone(e.target.value)
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
                                            accept=".jpg, .jpeg, .png, .webp" // Restrict file types
                                            onChange={e => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    // Validate file type
                                                    const validTypes = [
                                                        'image/jpeg',
                                                        'image/jpg',
                                                        'image/png',
                                                        'image/webp',
                                                    ]
                                                    if (
                                                        validTypes.includes(
                                                            file.type,
                                                        )
                                                    ) {
                                                        setProfilePhoto(file) // Set the file as profilePhoto if valid
                                                    } else {
                                                        alert(
                                                            'Invalid file type. Please select a jpg, jpeg, png, or webp file.',
                                                        )
                                                    }
                                                }
                                            }}
                                            className="file-input file-input-bordered w-full"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <Confetti show={showConfetti} />
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
