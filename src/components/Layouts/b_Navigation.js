import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import { ResponsiveNavButton } from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faRightFromBracket,
    faEllipsisVertical,
    faBullhorn,
    faCircleUser,
    faGear,
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'

const BroadcastAnnouncement = ({ message }) => {
    const [isHovered, setIsHovered] = useState(false)
    return (
        <div className="bg-gray-200 text-black m-auto p-1 font-semibold rounded-xl shadow-md">
            <div className="px-2 inline-flex ">
                <div className="text-bold text-md text-red-500">
                    <FontAwesomeIcon
                        icon={faBullhorn}
                        className="fa-fw text-black px-1"
                        bounce
                    />
                    แจ้งเตือน :
                </div>
                <div className="overflow-hidden whitespace-nowrap my-auto">
                    <div
                        className={`inline-block animate-marquee text-sm ${
                            isHovered ? 'animate-marquee-stopped' : ''
                        }`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}>
                        {message}
                    </div>
                </div>
            </div>
        </div>
    )
}
const getBadgeProps = role => {
    const numericRole = Number(role) // Convert role to a number

    switch (numericRole) {
        case 99:
            return { color: 'gold', text: 'ผู้พัฒนา' }
        case 0:
            return { color: 'ghost', text: 'รอแอดตำแหน่ง' }
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
        default:
            return { color: 'gray', text: 'Unknown Role' }
    }
}

const Navigation = ({ user, profile }) => {
    const router = useRouter()
    const handleLogout = async () => {
        try {
            localStorage.removeItem('accessToken')
            router.push('/login')
        } catch (error) {
            console.error('Error logging out:', error)
            toast.error('Failed to log out. Please try again.')
        }
    }

    let badgeProps = { color: 'gray', text: 'Loading...' }

    if (profile?.role) {
        badgeProps = getBadgeProps(profile.role)
    }
    const [open, setOpen] = useState(false)
    const [announcement, setAnnouncement] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const token = localStorage.getItem('accessToken')

            if (!token) {
                router.push('/login')
                return
            }

            try {
                const response = await fetch(
                    'https://server.wb.in.th/api/announcements',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch announcements')
                }

                const { data: announcementsData } = await response.json()

                const currentTimestamp = new Date().getTime()

                // Sort announcements by startTimestamp in descending order
                const sortedAnnouncements = announcementsData
                    .map(announcement => ({
                        ...announcement,
                        startTimestamp: new Date(
                            announcement.startTimestamp,
                        ).getTime(),
                        endTimestamp: new Date(
                            announcement.endTimestamp,
                        ).getTime(),
                    }))
                    .filter(
                        announcement =>
                            currentTimestamp >= announcement.startTimestamp &&
                            currentTimestamp <= announcement.endTimestamp,
                    )
                    .sort((a, b) => b.startTimestamp - a.startTimestamp)

                // Set the latest valid announcement
                if (sortedAnnouncements.length > 0) {
                    setAnnouncement(sortedAnnouncements[0])
                } else {
                    setAnnouncement(null)
                }
            } catch (error) {
                setError(error.message)
            }
        }

        fetchAnnouncements()

        // Check current time every minute
        const interval = setInterval(fetchAnnouncements, 30000)

        return () => clearInterval(interval)
    }, [router])

    const currentTimestamp = new Date().getTime()
    return (
        <>
            <nav className="bg-white border-b border-gray-100 fixed w-full top-0 z-10 shadow">
                {/* Primary Navigation Menu */}
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-14">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-10 w-auto fill-current" />
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center">
                            {announcement && (
                                <BroadcastAnnouncement
                                    message={announcement.content}
                                />
                            )}
                        </div>
                        {/* Settings Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6 ">
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost btn-circle">
                                    <div className="avatar">
                                        <div className="w-9 mask rounded-full outline-dashed outline-1 outline-blue-500">
                                            <img
                                                src={profile?.avatar}
                                                alt="Profile Photo"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-2 w-40 p-2 shadow-lg">
                                    <li className="mb-1">
                                        <Link
                                            className="justify-start"
                                            href="/profile/user">
                                            <FontAwesomeIcon
                                                icon={faCircleUser}
                                                className="fa-lg"
                                            />
                                            โปรไฟล์
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <a className="justify-start">
                                            <FontAwesomeIcon
                                                icon={faGear}
                                                className="fa-lg"
                                            />
                                            ตั้งค่า
                                        </a>
                                    </li>
                                    <li className="mb-1">
                                        <a
                                            onClick={handleLogout}
                                            className="text-error justify-start">
                                            <FontAwesomeIcon
                                                icon={faRightFromBracket}
                                                className="fa-lg"
                                            />{' '}
                                            ออกจากระบบ
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Hamburger */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setOpen(open => !open)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    {open ? (
                                        <path
                                            className="inline-flex"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            className="inline-flex"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Responsive Navigation Menu */}
                {open && (
                    <div className="block sm:hidden">
                        {/* <div className="pt-2 pb-3 space-y-1">
                         <ResponsiveNavLink
                            href="/dashboard"
                            active={router.pathname === '/'}>
                            หน้าหลัก
                        </ResponsiveNavLink>
                    </div> */}

                        {/* Responsive Settings Options */}
                        <div className="pt-4 pb-1 border-t border-gray-200">
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <div className="avatar">
                                        <div className="w-9 h-9 mask mask-squircle">
                                            <img
                                                src={profile?.avatar}
                                                alt="Profile Photo"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-3">
                                    <div className="font-medium text-base text-gray-800">
                                        {user?.name}
                                        <div
                                            className={`badge badge-${badgeProps.color} badge-outline mx-1 text-xs font-semibold`}>
                                            {badgeProps.text}
                                        </div>
                                    </div>
                                    <div className="font-medium text-sm text-gray-500">
                                        {user?.email}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                {/* Authentication */}
                                <ResponsiveNavButton onClick={handleLogout}>
                                    <div className="flex items-center font-semibold rounded-box text-lg bg-red-600 text-white p-1 justify-center">
                                        <FontAwesomeIcon
                                            icon={faRightFromBracket}
                                            className="mr-2 h-5 w-5"
                                        />
                                        ออกจากระบบ
                                    </div>
                                </ResponsiveNavButton>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}

export default Navigation
