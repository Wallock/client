import Navigation from '@/components/Layouts/Navigation'
import MenuNav from '@/components/Layouts/MenuNav'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCloud,
    faEnvelope,
    faGlobe,
    faPhone,
} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import React from 'react'
import { useProfile } from '@/lib/ProfileContext'
import { version, email, website, phone } from '@/lib/config'
import Link from 'next/link'
//UPDATE
const AppLayout = ({ children }) => {
    const router = useRouter()
    const profile = useProfile()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('accessToken')

            if (!token) {
                router.push('/login')
                return
            }

            try {
                const response = await fetch(
                    'https://server.wb.in.th/api/user',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch user data')
                }

                const data = await response.json()
                setUser(data)
            } catch (error) {
                //console.error('Error fetching user data:', error)
                router.push('/login')
            }
        }

        fetchUserData()
    }, [router])

    return (
        <>
            <Head>
                <title>JS-System v3</title>
            </Head>
            <div className="bg-gray-100 dark:bg-gray-900 flex">
                <MenuNav user={user} profile={profile} />

                <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
                    <Navigation user={user} profile={profile} />
                    <div className="w-full h-screen overflow-x-hidden border-t dark:border-gray-700 flex flex-col">
                        <main className="w-full flex-grow">{children}</main>
                        <footer className="footer bg-base-200 dark:glass text-base-content dark:text-white border-base-300 dark:border-gray-800 border-t px-10 py-4">
                            <aside className="grid-flow-col items-center">
                                <FontAwesomeIcon
                                    icon={faCloud}
                                    className="fa-xl"
                                />
                                <p>
                                    <label className="font-bold">
                                        Version : {version}
                                    </label>
                                    <br />
                                    Developer & Design By Wallock ©
                                    Nasaladphrao48 .co,tld
                                </p>
                            </aside>
                            <nav className="md:place-self-center md:justify-self-end">
                                <div className="grid grid-flow-col gap-4">
                                    <Link href={phone} target="_new">
                                        <FontAwesomeIcon
                                            icon={faPhone}
                                            className="fa-2x"
                                        />
                                    </Link>
                                    <Link href={website} target="_new">
                                        <FontAwesomeIcon
                                            icon={faGlobe}
                                            className="fa-2x"
                                        />
                                    </Link>
                                    <Link href={email} target="_new">
                                        <FontAwesomeIcon
                                            icon={faEnvelope}
                                            className="fa-2x"
                                        />
                                    </Link>
                                </div>
                            </nav>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AppLayout
