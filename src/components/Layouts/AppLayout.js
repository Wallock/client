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
        <div className="min-h-screen bg-gray-100 ">
            <Head>
                <title>JS-System v3</title>
            </Head>
            <main>
                <Navigation user={user} profile={profile} />
                <div className="flex justify-between mx-auto px-0 mt-14">
                    <MenuNav user={user} profile={profile} />

                    <div className="w-5/6 ml-auto p-3">{children}</div>
                </div>
            </main>
        </div>
    )
}

export default AppLayout
