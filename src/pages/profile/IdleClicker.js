import { useEffect, useState } from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import Pusher from 'pusher-js'
import { useProfile } from '@/lib/ProfileContext'
import Cookies from 'js-cookie'
import axios from 'axios'
import Loading from '@/lib/loading'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function IdleClicker() {
    const [clickCount, setClickCount] = useState(0)
    const profile = useProfile()
    const [loading, setLoading] = useState(true)
    const [networkError, setNetworkError] = useState(false)

    useEffect(() => {
        const fetchClickCount = async () => {
            if (!profile?.id) return

            try {
                const response = await fetch(
                    `https://server.wb.in.th/api/click/${profile.id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${Cookies.get(
                                'accessToken',
                            )}`,
                        },
                    },
                )
                const result = await response.json()
                if (response.ok) {
                    setClickCount(result.click_count) // Set initial click count from backend
                    setNetworkError(false)
                }
            } catch (error) {
                setNetworkError(true)
                toast.error('Network Error', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            } finally {
                setLoading(false) // Set loading to false only after fetching
            }
        }

        fetchClickCount()

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.PUSHER_CLUSTER || 'default_cluster',
        })
        const channel = pusher.subscribe('click-channel')
        channel.bind('increment', data => {
            setClickCount(data.clickCount)
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
            pusher.disconnect()
        }
    }, [profile])

    const handleClick = async () => {
        if (!profile?.id) return

        setClickCount(prevCount => prevCount + 1) // Increment locally

        try {
            await fetch('https://server.wb.in.th/api/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
                body: JSON.stringify({ clickCount: 1, userId: profile.id }), // Send increment by 1
            })
        } catch (error) {
            setNetworkError(true)
            toast.error('Network Error', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    return (
        <AppLayout>
            <ToastContainer />
            {loading ? (
                <Loading />
            ) : (
                <div className="flex h-full flex-col items-center justify-center">
                    <h1>Idle Clicker Game</h1>
                    <p className="text-2xl font-bold">Clicks: {clickCount}</p>
                    {networkError ? (
                        <p className="text-red-500 text-lg font-semibold">
                            Network Error
                        </p>
                    ) : (
                        <button
                            className="btn btn-lg text-white bg-gray-300 active:bg-gray-800"
                            onClick={handleClick}>
                            Click Me!
                        </button>
                    )}
                </div>
            )}
        </AppLayout>
    )
}
