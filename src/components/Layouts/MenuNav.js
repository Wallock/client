import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUserGroup,
    faNewspaper,
    faGear,
    faUsers,
    faUserPlus,
    faFlaskVial,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

const MenuItem = ({ href, icon, label }) => {
    const router = useRouter()
    const isActive = router.pathname === href

    return (
        <Link href={href} className={`px-4 ${isActive ? 'active' : ''}`}>
            <div className="lg:inline-block hidden h-full">
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
        <div className="w-1/6 h-screen fixed bg-white lg:p-3 p-0 lg:overflow-y-auto overflow-hidden lg:border-r-0 border-r">
            <ul className="menu mb-3 m-0 p-0 text-gray-600">
                <li className="py-1">
                    <MenuItem
                        href="/dashboard"
                        icon={faNewspaper}
                        label="ข่าวสาร"
                    />
                </li>
                {Number(profile?.type48) === 1 && (
                    <li className="py-1">
                        <MenuItem
                            href="/48/worker"
                            icon={faUsers}
                            label="นาซ่า"
                        />
                    </li>
                )}
                {Number(profile?.type82) === 1 && (
                    <li className="py-1">
                        <MenuItem
                            href="/82/worker"
                            icon={faUsers}
                            label="ดีดีเมท"
                        />
                    </li>
                )}
                {Number(profile?.typelaos) === 1 && (
                    <li className="py-1">
                        <MenuItem
                            href="/laos/worker"
                            icon={faUsers}
                            label="ลาว"
                        />
                    </li>
                )}
                {Number(profile?.typethai) === 1 && (
                    <li className="py-1">
                        <MenuItem
                            href="/online/worker"
                            icon={faUsers}
                            label="ไทยออนไลน์"
                        />
                    </li>
                )}
                <li className="py-1">
                    <MenuItem
                        href="/register/user"
                        icon={faUserPlus}
                        label="สมัครใหม่"
                    />
                </li>
                <li className="py-1 text-red-500">
                    <MenuItem
                        href="/test"
                        icon={faFlaskVial}
                        label="Function Test"
                    />
                </li>
                {Number(profile?.role) === 99 && (
                    <li className="pb-1 lg:inline-block hidden">
                        <div
                            className={`lg:inline-block hidden w-full cursor-pointer ${
                                settingsOpen ? 'open' : ''
                            }`}
                            onClick={() => setSettingsOpen(!settingsOpen)}>
                            <div className="flex items-center justify-start">
                                <FontAwesomeIcon
                                    icon={faGear}
                                    className="mr-4 h-8 w-8 text-blue-500"
                                />
                                <p className="text-xl">ตั้งค่า</p>
                            </div>
                            {settingsOpen && (
                                <ul className="mt-2">
                                    <li>
                                        <Link href="/settings/users">
                                            ผู้ใช้งาน
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/settings/system">
                                            ตั้งค่าระบบ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/settings/announcements">
                                            ประกาศ
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                        <div
                            className="lg:hidden inline-blocks px-4 "
                            onClick={() => setSettingsOpen(!settingsOpen)}>
                            <div
                                className="tooltip tooltip-bottom"
                                data-tip="ตั้งค่า">
                                <FontAwesomeIcon
                                    icon={faGear}
                                    className="h-8 w-8 text-blue-600"
                                />
                            </div>
                            {settingsOpen && (
                                <ul className="mt-2">
                                    <li>
                                        <Link href="/settings/users">
                                            ผู้ใช้งาน
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/settings/system">
                                            ตั้งค่าระบบ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/settings/announcements">
                                            ประกาศ
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default MenuNav
