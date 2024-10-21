import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faRightFromBracket,
    faEllipsisVertical,
    faBullhorn,
    faCircleUser,
    faGear,
    faNewspaper,
    faUsers,
    faUserPlus,
    faFlaskVial,
} from '@fortawesome/free-solid-svg-icons'
import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
const BroadcastAnnouncement = ({ message }) => {
    const [isHovered, setIsHovered] = useState(false)
    return (
        <div className="bg-gray-200 text-black m-auto p-1 font-semibold rounded-xl shadow-md">
            <div className="px-2 inline-flex">
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
                        onMouseLeave={() => setIsHovered(false)}
                        dangerouslySetInnerHTML={{ __html: message }}
                    />
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
const MenuItem = ({ href, icon, label }) => {
    const router = useRouter()
    const isActive = router.pathname === href

    return (
        <Link href={href}>
            <div
                className={`flex items-center justify-start px-4 py-3 ${
                    isActive
                        ? 'bg-blue-900 text-white rounded-xl'
                        : 'hover:bg-blue-700 text-gray-200 '
                } transition-all duration-200`}>
                <FontAwesomeIcon icon={icon} className="fa-lg me-3" />
                <p className="text-lg font-semibold">{label}</p>
            </div>
        </Link>
    )
}

const Navigation = ({ user, profile }) => {
    const router = useRouter()
    const handleLogout = async () => {
        try {
            localStorage.removeItem('accessToken')
            router.push('/login')
        } catch (error) {
            //console.error('Error logging out:', error)
            toast.error('Failed to log out. Please try again.')
        }
    }

    const [settingsOpen, setSettingsOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
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
            {/* Desktop Header */}
            <header className="w-full items-center bg-white py-2 px-6 hidden sm:flex">
                <div className="w-1/2">
                    {announcement && (
                        <BroadcastAnnouncement message={announcement.content} />
                    )}
                </div>
                <div className="relative w-1/2 flex justify-end">
                    {/* ปุ่มโปรไฟล์ */}
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="relative z-10 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 hover:border-blue-300 focus:border-blue-300 focus:outline-none">
                        <div className="mask rounded-full outline-dashed outline-1 outline-blue-500">
                            <img src={profile?.avatar} alt="Profile Photo" />
                        </div>
                    </button>
                    {/* แสดงเมนูโปรไฟล์เฉพาะเมื่อ isProfileMenuOpen เป็น true */}
                    {isProfileMenuOpen && (
                        <div className="absolute w-36 bg-white rounded-lg shadow-lg font-semibold py-2 mt-16 z-50">
                            <a
                                className="block px-4 py-2 text-slate-800 hover:text-blue-800"
                                href="/profile/user">
                                <FontAwesomeIcon
                                    icon={faCircleUser}
                                    className="fa-lg me-2"
                                />{' '}
                                โปรไฟล์
                            </a>
                            <a
                                href="/profile/setting"
                                className="block px-4 py-2 text-slate-800 hover:text-blue-800">
                                <FontAwesomeIcon
                                    icon={faGear}
                                    className="fa-lg me-2"
                                />{' '}
                                ตั้งค่า
                            </a>
                            <a
                                onClick={handleLogout}
                                className="block px-4 py-2 text-red-600 hover:text-red-800">
                                <FontAwesomeIcon
                                    icon={faRightFromBracket}
                                    className="fa-lg me-2"
                                />{' '}
                                Sign Out
                            </a>
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile Header */}
            <header className="w-full bg-blue-700 py-3 px-6 sm:hidden">
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <ApplicationLogo className="block h-10 w-auto fill-current" />
                    </Link>
                    {/* ปุ่มเปิด/ปิดเมนู */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-white text-3xl focus:outline-none">
                        <i className="fas fa-bars"> </i>
                    </button>
                </div>

                {/* แสดงเมนูเฉพาะเมื่อ isMenuOpen เป็น true */}
                {isMenuOpen && (
                    <nav className="text-white text-base font-semibold pt-3 ">
                        <MenuItem
                            href="/dashboard"
                            icon={faNewspaper}
                            label="ข่าวสาร"
                        />
                        {Number(profile?.type48) === 1 && (
                            <MenuItem
                                href="/48/worker"
                                icon={faUsers}
                                label="นาซ่า"
                            />
                        )}
                        {Number(profile?.type82) === 1 && (
                            <MenuItem
                                href="/82/worker"
                                icon={faUsers}
                                label="ดีดีเมท"
                            />
                        )}
                        {Number(profile?.typelaos) === 1 && (
                            <MenuItem
                                href="/laos/worker"
                                icon={faUsers}
                                label="ลาว"
                            />
                        )}
                        {Number(profile?.typethai) === 1 && (
                            <MenuItem
                                href="/online/worker"
                                icon={faUsers}
                                label="ไทยออนไลน์"
                            />
                        )}
                        <MenuItem
                            href="/register/user"
                            icon={faUserPlus}
                            label="สมัครใหม่"
                        />
                        <MenuItem
                            href="/test"
                            icon={faFlaskVial}
                            label="Function Test"
                        />
                        {Number(profile?.role) === 99 && (
                            <>
                                <MenuItem
                                    href="/admincp"
                                    onClick={() =>
                                        setSettingsOpen(!settingsOpen)
                                    }
                                    icon={faGear}
                                    label="ตั้งค่า"
                                />
                            </>
                        )}
                    </nav>
                )}
            </header>
        </>
    )
}

export default Navigation
