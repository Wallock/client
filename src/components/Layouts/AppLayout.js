import Navigation from '@/components/Layouts/Navigation'
import MenuNav from '@/components/Layouts/MenuNav'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import React from 'react'
import { useProfile } from '@/lib/ProfileContext'
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
                console.error('Error fetching user data:', error)
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
            <div className="bg-gray-100 flex">
                <MenuNav user={user} profile={profile} />
                <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
                    <Navigation user={user} profile={profile} />
                    <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
                        <main className="w-full flex-grow">{children}</main>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AppLayout
