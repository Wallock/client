import Navigation from '@/components/Layouts/Navigation'
import MenuNav from '@/components/Layouts/MenuNav'
import supabase from '@/lib/supabaseClient'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import React from 'react'

const AppLayout = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
            } else {
                setUser(user)
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                setProfile(profiles[0])
            }
        }

        fetchUserData()
    }, [])
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
