import Navigation from '@/components/Layouts/Navigation'
import MenuNav from '@/components/Layouts/MenuNav'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import React from 'react'
//UPDATE
const AppLayout = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)

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
                setProfile({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    avatar: data.profile_photo_url,
                    role: data.role,
                    type48: data.type48,
                    type82: data.type82,
                    typethai: data.typethai,
                    typelaos: data.typelaos,
                })
            } catch (error) {
                //console.error('Error fetching user data:', error)
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
                <div className="flex justify-between mx-auto px-0 mt-12">
                    <MenuNav user={user} profile={profile} />

                    <div className="w-5/6 ml-auto p-3">{children}</div>
                </div>
            </main>
        </div>
    )
}

export default AppLayout
