import AppLayout from '@/components/Layouts/AppLayout'
import React from 'react'
import { useRouter } from 'next/router'

export default function Page() {
    const router = useRouter()

    return (
        <AppLayout>
            <p>Post: {router.query.id}</p>
        </AppLayout>
    )
}
