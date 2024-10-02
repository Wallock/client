// context/ProfileContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const ProfileContext = createContext()

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState(null)
    const router = useRouter()

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
                    uid48: data.uid48,
                    uid82: data.uid82,
                    uidthai: data.uidthai,
                    uidlaos: data.uidlaos,
                })
            } catch (error) {
                router.push('/login')
            }
        }

        fetchUserData()
    }, [router])

    return (
        <ProfileContext.Provider value={profile}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    return useContext(ProfileContext)
}
