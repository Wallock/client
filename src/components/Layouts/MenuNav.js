import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faNewspaper,
    faGear,
    faUsers,
    faUserPlus,
    faFlaskVial,
    faBars,
    faInbox,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ApplicationLogo from '@/components/ApplicationLogo'

const MenuItem = ({ href, icon, label, isCollapsed }) => {
    const router = useRouter()
    const isActive = router.pathname === href

    return (
        <Link href={href}>
            <div
                className={`flex items-center justify-start mx-2 my-1 px-4 py-3 ${
                    isActive
                        ? 'bg-blue-900 dark:bg-gray-900 text-white rounded-xl'
                        : 'hover:bg-blue-700 hover:dark:bg-gray-600 text-gray-200 rounded-xl'
                } transition-all duration-200`}>
                <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={icon} className="mr-4 h-8 w-8" />
                    {!isCollapsed && <p className="text-xl">{label}</p>}
                </div>
            </div>
            <div
                className={`tooltip tooltip-bottom lg:hidden inline-block ${
                    isCollapsed ? '' : 'hidden'
                }`}
                data-tip={label}>
                <FontAwesomeIcon icon={icon} className="h-8 w-8" />
            </div>
        </Link>
    )
}

const MenuNav = ({ profile }) => {
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false) // Added state to control collapse

    return (
        <aside
            className={`relative bg-blue-600 h-screen ${
                isCollapsed ? 'w-20' : 'w-64'
            } hidden sm:block shadow-xl transition-all duration-300`}>
            <div className="p-6 flex justify-between items-center">
                <div
                    className={`flex items-center justify-center ${
                        isCollapsed ? 'hidden' : ''
                    }`}>
                    <Link href="/">
                        <ApplicationLogo className="block h-10 w-auto fill-current" />
                    </Link>
                </div>
                {/* Toggle button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`text-white focus:outline-none ${
                        isCollapsed ? 'm-auto' : ''
                    }`}>
                    <FontAwesomeIcon icon={faBars} className="fa-lg" />
                </button>
            </div>
            <Link
                href="/register/user"
                className={`btn btn-md bg-white font-bold text-lg m-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center ${
                    isCollapsed ? 'hidden' : ''
                }`}>
                <FontAwesomeIcon icon={faUserPlus} className="mr-3" /> สมัครใหม่
            </Link>

            <nav className="text-white text-base font-semibold pt-3">
                <MenuItem
                    href="/dashboard"
                    icon={faNewspaper}
                    label="ข่าวสาร"
                    isCollapsed={isCollapsed}
                />
                {Number(profile?.type48) === 1 && (
                    <MenuItem
                        href="/48/worker"
                        icon={faUsers}
                        label="นาซ่า"
                        isCollapsed={isCollapsed}
                    />
                )}
                {Number(profile?.type82) === 1 && (
                    <MenuItem
                        href="/82/worker"
                        icon={faUsers}
                        label="ดีดีเมท"
                        isCollapsed={isCollapsed}
                    />
                )}
                {Number(profile?.typelaos) === 1 && (
                    <MenuItem
                        href="/laos/worker"
                        icon={faUsers}
                        label="ลาว"
                        isCollapsed={isCollapsed}
                    />
                )}
                {Number(profile?.typethai) === 1 && (
                    <MenuItem
                        href="/online/worker"
                        icon={faUsers}
                        label="ไทยออนไลน์"
                        isCollapsed={isCollapsed}
                    />
                )}
                <MenuItem
                    href="/test"
                    icon={faFlaskVial}
                    label="สัญญาจ้าง"
                    isCollapsed={isCollapsed}
                />
                {Number(profile?.role) === 99 && (
                    <>
                        <MenuItem
                            href="/admincp"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            icon={faGear}
                            label="ตั้งค่า"
                            isCollapsed={isCollapsed}
                        />
                    </>
                )}
            </nav>
            <a
                href="#"
                className={`absolute w-full bottom-0 bg-blue-700 text-white dark:bg-gray-900 text-shadow-sm flex items-center text-lg font-semibold justify-center py-4 ${
                    isCollapsed ? 'justify-center' : ''
                }`}>
                <FontAwesomeIcon icon={faInbox} className="me-3" />
                {!isCollapsed && 'ติดต่อทีมซับพอต'}
            </a>
        </aside>
    )
}

export default MenuNav
