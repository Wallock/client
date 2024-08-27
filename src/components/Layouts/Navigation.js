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
    switch (role) {
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
    useEffect(() => {
        console.log('Profile role:', profile?.role)
    }, [profile])

    const { color, text } = getBadgeProps(profile?.role)
    const [open, setOpen] = useState(false)
    const [announcements, setAnnouncements] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data: announcementsData, error } = await supabase
                    .from('announcements')
                    .select('*')
                    .order('startTimestamp', { ascending: false })

                if (error) {
                    throw new Error(error.message)
                }

                setAnnouncements(
                    announcementsData.map(announcement => ({
                        ...announcement,
                        startTimestamp: new Date(
                            announcement.startTimestamp,
                        ).getTime(),
                        endTimestamp: new Date(
                            announcement.endTimestamp,
                        ).getTime(),
                    })),
                )
            } catch (error) {
                setError(error.message)
            }
        }

        fetchAnnouncements()

        // Check current time every minute
        const interval = setInterval(fetchAnnouncements, 30000)

        return () => clearInterval(interval)
    }, [])

    const currentTimestamp = new Date().getTime()
    return (
        <>
            <nav className="bg-white border-b border-gray-100 fixed w-full top-0 z-10 shadow">
                {/* Primary Navigation Menu */}
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-12">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-10 w-auto fill-current" />
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center">
                            {announcements &&
                                announcements.map(announcement => {
                                    const {
                                        id,
                                        message,
                                        startTimestamp,
                                        endTimestamp,
                                    } = announcement
                                    if (
                                        currentTimestamp >= startTimestamp &&
                                        currentTimestamp <= endTimestamp
                                    ) {
                                        return (
                                            <BroadcastAnnouncement
                                                key={id}
                                                message={message}
                                            />
                                        )
                                    }
                                    return null
                                })}
                        </div>
                        {/* Settings Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6 ">
                            <Dropdown
                                align="right"
                                width="48"
                                className="shadow-lg"
                                trigger={
                                    <button className="flex items-center  text-gray-600 hover:text-gray-800 focus:outline-none transition duration-150 ease-in-out">
                                        <div
                                            className={`badge badge-${color} badge-outline mx-1 text-xs font-semibold`}>
                                            {text}
                                        </div>
                                        <div className="mx-1 font-semibold text-lg">
                                            {profile?.name}
                                        </div>

                                        <div className="mx-1">
                                            <FontAwesomeIcon
                                                icon={faEllipsisVertical}
                                                className="fa-fw"
                                            />
                                        </div>
                                    </button>
                                }>
                                {/* Authentication */}
                                <DropdownButton onClick={handleLogout}>
                                    <div className="flex items-center font-semibold text-lg text-red-600 justify-center ">
                                        <FontAwesomeIcon
                                            icon={faRightFromBracket}
                                            className="mr-2 h-5 w-5"
                                        />
                                        ออกจากระบบ
                                    </div>
                                </DropdownButton>
                            </Dropdown>
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
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="h-8 w-8"
                                    />
                                </div>

                                <div className="ml-3">
                                    <div className="font-medium text-base text-gray-800">
                                        {user?.name}
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
