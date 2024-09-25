import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faNewspaper,
    faGear,
    faUsers,
    faUserPlus,
    faFlaskVial,
    faInbox,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ApplicationLogo from '@/components/ApplicationLogo'

const MenuItem = ({ href, icon, label }) => {
    const router = useRouter()
    const isActive = router.pathname === href

    return (
        <Link href={href}>
            <div
                className={`flex items-center justify-start mx-2 my-1 px-4 py-3 ${
                    isActive
                        ? 'bg-blue-900 text-white rounded-xl'
                        : 'hover:bg-blue-700 text-gray-200 rounded-xl'
                } transition-all duration-200`}>
                <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={icon} className="mr-4 h-8 w-8" />
                    <p className="text-xl">{label}</p>
                </div>
            </div>
            <div
                className="tooltip tooltip-bottom lg:hidden inline-block"
                data-tip={label}>
                <FontAwesomeIcon icon={icon} className="h-8 w-8" />
            </div>
        </Link>
    )
}

const MenuNav = ({ profile }) => {
    const [settingsOpen, setSettingsOpen] = useState(false)

    return (
        <aside className="relative bg-blue-600 h-screen w-64 hidden sm:block shadow-xl">
            <div className="p-6">
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <Link href="/">
                        <ApplicationLogo className="block h-10 w-auto fill-current" />
                    </Link>
                </div>
                <Link
                    href="/register/user"
                    className="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserPlus} className="mr-3" />{' '}
                    สมัครใหม่
                </Link>
            </div>
            <nav className="text-white text-base font-semibold pt-3">
                <MenuItem
                    href="/dashboard"
                    icon={faNewspaper}
                    label="ข่าวสาร"
                />
                {Number(profile?.type48) === 1 && (
                    <MenuItem href="/48/worker" icon={faUsers} label="นาซ่า" />
                )}
                {Number(profile?.type82) === 1 && (
                    <MenuItem
                        href="/82/worker"
                        icon={faUsers}
                        label="ดีดีเมท"
                    />
                )}
                {Number(profile?.typelaos) === 1 && (
                    <MenuItem href="/laos/worker" icon={faUsers} label="ลาว" />
                )}
                {Number(profile?.typethai) === 1 && (
                    <MenuItem
                        href="/online/worker"
                        icon={faUsers}
                        label="ไทยออนไลน์"
                    />
                )}
                <MenuItem href="/test" icon={faFlaskVial} label="ทดสอบ" />
                {Number(profile?.role) === 99 && (
                    <>
                        <MenuItem
                            href="/admincp"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            icon={faGear}
                            label="ตั้งค่า"
                        />
                    </>
                )}
            </nav>
            <a
                href="#"
                className="absolute w-full bottom-0 bg-blue-700 text-white text-shadow-sm flex items-center text-lg font-semibold justify-center py-4">
                <FontAwesomeIcon icon={faInbox} className="me-3" />
                ติดต่อทีมซับพอต
            </a>
        </aside>
    )
}

export default MenuNav
