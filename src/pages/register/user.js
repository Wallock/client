import AppLayout from '@/components/Layouts/AppLayout'
import React from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '@/lib/ProfileContext'
import Link from 'next/link'

export default function user() {
    const profile = useProfile()
    return (
        <AppLayout>
            <div className="w-full p-5">
                <div className="hero rounded-lg bg-gradient-to-b from-blue-600 to-violet-600">
                    <div className="hero-overlay bg-opacity-60 rounded-lg">
                        {' '}
                    </div>
                    <div className="hero-content text-center text-neutral-content">
                        <div className="max-w-md my-3">
                            <h1 className="mb-0 text-5xl font-semibold drop-shadow-xl">
                                สมัครคนงานใหม่
                            </h1>
                            <p className="drop-shadow-md">
                                ระบบสมัครงานออนไลน์ สำหรับจัดการคนงาน
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center flex-wrap m-5">
                    {Number(profile?.type48) === 1 && (
                        <div className="w-full lg:w-1/2">
                            <div className="card lg:card-side bg-base-100 text-neutral shadow-xl m-3">
                                <figure className="px-5">
                                    <img
                                        src="https://48.wb.in.th/images/logo.png"
                                        alt="nasa"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                        }}
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title justify-center font-bold">
                                        นาซ่าลาดพร้าว48
                                    </h2>
                                    <div className="card-actions justify-center">
                                        <Link
                                            href="/48/reg-m"
                                            className="btn btn-neutral font-semibold text-lg">
                                            <div className="avatar">
                                                <div className="w-5 rounded-full">
                                                    <img src="/icon/m.webp" />
                                                </div>
                                            </div>
                                            พม่า
                                        </Link>
                                        <Link
                                            href="/48/reg-l"
                                            className="btn btn-neutral font-semibold text-lg">
                                            <div className="avatar">
                                                <div className="w-5 rounded-full">
                                                    <img src="/icon/l.webp" />
                                                </div>
                                            </div>
                                            ลาว
                                        </Link>
                                        <Link
                                            href="/48/reg-c"
                                            className="btn btn-neutral font-semibold text-lg">
                                            <div className="avatar">
                                                <div className="w-5 rounded-full">
                                                    <img src="/icon/c.webp" />
                                                </div>
                                            </div>
                                            กัมพูชา
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {Number(profile?.type82) === 1 && (
                        <div className="w-full lg:w-1/2">
                            <div className="card lg:card-side bg-base-100 text-neutral shadow-xl m-3">
                                <figure className="px-5 lg:hidden">
                                    <img
                                        src="https://dd.wb.in.th/public/images/logodede.png"
                                        alt="dd"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                        }}
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title justify-center font-bold">
                                        แม่บ้านดีดีเซอร์วิส
                                    </h2>
                                    <div className="card-actions justify-center">
                                        <Link
                                            href="/82/reg-m"
                                            className="btn btn-neutral font-semibold text-lg">
                                            <div className="avatar">
                                                <div className="w-5 rounded-full">
                                                    <img src="/icon/m.webp" />
                                                </div>
                                            </div>
                                            พม่า
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {Number(profile?.typethai) === 1 && (
                        <div className="w-full lg:w-1/2">
                            <div className="card lg:card-side bg-base-100 text-neutral shadow-xl m-3">
                                <figure className="px-5 lg:hidden">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/187/187487.png"
                                        alt="Thai"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                        }}
                                    />
                                </figure>
                                <div className="card-body ">
                                    <h2 className="card-title justify-center font-bold">
                                        คนไทย ออนไลน์
                                    </h2>
                                    <div className="card-actions justify-center">
                                        <Link
                                            href="/online/reg-48"
                                            className="btn btn-neutral font-semibold text-lg">
                                            <div className="avatar">
                                                <div className="w-5 rounded-full">
                                                    <img src="/icon/t.webp" />
                                                </div>
                                            </div>
                                            รหัส 48
                                        </Link>
                                        <Link
                                            href="/online/reg-g"
                                            className="btn btn-neutral font-semibold text-lg">
                                            <div className="avatar">
                                                <div className="w-5 rounded-full">
                                                    <img src="/icon/t.webp" />
                                                </div>
                                            </div>
                                            รหัส G
                                        </Link>
                                        <Link
                                            href="/online/reg-jno"
                                            className="btn btn-neutral font-semibold text-lg">
                                            <div className="avatar">
                                                <div className="w-5 rounded-full">
                                                    <img src="/icon/t.webp" />
                                                </div>
                                            </div>
                                            รหัส JNO
                                        </Link>
                                        <Link
                                            href="/online/reg-jnw"
                                            className="btn btn-neutral font-semibold text-lg">
                                            <div className="avatar">
                                                <div className="w-5 rounded-full">
                                                    <img src="/icon/t.webp" />
                                                </div>
                                            </div>
                                            รหัส JNW
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {Number(profile?.typelaos) === 1 && (
                        <div className="w-full lg:w-1/2">
                            <div className="card lg:card-side bg-base-100 text-neutral shadow-xl m-3">
                                <figure className="px-5 lg:hidden">
                                    <img
                                        src="https://laos.wb.in.th/public/images/laos.png"
                                        alt="laos"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                        }}
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title justify-center font-bold">
                                        เมทอินเตอร์เซอร์วิส
                                    </h2>
                                    <div className="card-actions justify-center">
                                        <Link
                                            href="/laos/reg-l"
                                            className="btn btn-neutral text-lg font-semibold">
                                            <div className="avatar">
                                                <div className="w-5 rounded-full">
                                                    <img src="/icon/l.webp" />
                                                </div>
                                            </div>
                                            ลาว
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
