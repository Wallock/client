import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSpinner,
    faRightToBracket,
    faKey,
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'
import supabase from '@/lib/supabaseClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LoginPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState({ email: '', password: '' })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const [captchaToken, setCaptchaToken] = useState()

    const submitForm = async event => {
        event.preventDefault()
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
                options: { captchaToken },
            })
            if (error) {
                setLoading(false)
                toast.error('บัญชีหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            } else {
                // เข้าสู่ระบบสำเร็จ
                router.push('/dashboard') // หรือไปยังหน้าอื่นที่คุณต้องการ
            }
        } catch (error) {
            setLoading(false)
        }
    }
    return (
        <div>
            <Head>
                <title>JS-System v3</title>
            </Head>
            <section className="text-gray-600 body-font bg-gradient-to-b from-blue-800 to-indigo-700">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="container xl:px-32 px-5 py-auto mx-auto flex flex-wrap items-center">
                        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0 w-full">
                            <h1 className="title-font drop-shadow-xl font-extrabold lg:text-7xl text-5xl text-transparent py-2 bg-clip-text bg-gradient-to-r from-slate-50 to-gray-400 text-center md:text-left">
                                JS-System
                                <sup className="text-red-500 drop-shadow-md lg:text-4xl text-xl">
                                    v3
                                </sup>
                            </h1>
                            <p className="leading-relaxed drop-shadow-md mt-1 lg:text-2xl text-xl lg:max-w-xl text-slate-50 font-medium text-center md:text-left ">
                                ระบบจัดการพนักงานและองค์กรภายใน
                            </p>
                        </div>

                        <div className="transition ease-in-out duration-500 hover:-translate-y-1 hover:scale-105 lg:w-2/6 md:w-1/2 border-2 border-indigo-100 rounded-3xl bg-white shadow-lg rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                            {loading ? (
                                <div className="relative font-3 text-indigo-800 text-2xl m-4 justify-center text-center drop-shadow-md">
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        className="animate-spin text-indigo-800 mr-2"
                                    />
                                    กำลังเข้าสู่ระบบ...
                                </div>
                            ) : (
                                <form onSubmit={submitForm}>
                                    <ToastContainer />

                                    <div className="pb-3 flex items-center border-b border-gray-100 mb-5">
                                        <div className="fa-2x text-gray-100 bg-indigo-800 px-2 rounded-xl">
                                            <FontAwesomeIcon icon={faKey} />
                                        </div>
                                        <div className="ml-4">
                                            <h1 className="block text-3xl font-semibold text-gray-700">
                                                เข้าสู่ระบบ
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="relative mb-4">
                                        <label className="mb-1 block text-sm font-bold text-gray-700">
                                            บัญชีอีเมล
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            onChange={event =>
                                                setEmail(event.target.value)
                                            }
                                            required
                                            autoFocus
                                            autoComplete="email"
                                            value={email}
                                            className="w-full p-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white"
                                        />
                                    </div>

                                    <div className="relative mb-4">
                                        <label className="mb-1 block text-sm font-bold text-gray-700">
                                            รหัสผ่าน
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            onChange={event =>
                                                setPassword(event.target.value)
                                            }
                                            required
                                            value={password}
                                            autoComplete="current-password"
                                            className="w-full p-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white"
                                        />
                                    </div>

                                    <div className="relative my-3">
                                        <label
                                            htmlFor="remember_me"
                                            className="inline-flex items-center font-semibold">
                                            <input
                                                id="remember_me"
                                                type="checkbox"
                                                name="remember"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                onChange={event =>
                                                    setShouldRemember(
                                                        event.target.checked,
                                                    )
                                                }
                                            />

                                            <span className="ml-2 text-sm text-gray-600">
                                                จดจำการเข้าสู่ระบบไว้เสมอ
                                            </span>
                                        </label>
                                    </div>

                                    <div class="relative my-3">
                                        <HCaptcha
                                            sitekey="120d9aa3-d47a-4f36-8197-f04262417241"
                                            onVerify={token => {
                                                setCaptchaToken(token)
                                            }}
                                            language="th"
                                        />
                                    </div>

                                    <div className="relative">
                                        <button className="text-white drop-shadow-lg w-full border-0 py-2 px-8 focus:outline-none font-semibold rounded text-xl bg-blue-600">
                                            <FontAwesomeIcon
                                                icon={faRightToBracket}
                                                className="fa-fw"
                                            />{' '}
                                            Sign In
                                        </button>
                                    </div>
                                    <p className="text-sm text-blue-800 pt-4 text-center font-bold border-t border-gray-100 mt-5">
                                        <FontAwesomeIcon
                                            icon={faCircleInfo}
                                            className="fa-fw"
                                        />{' '}
                                        หากลืมรหัสผ่านให้ติดต่อผู้พัฒนาโดยตรง
                                    </p>
                                </form>
                            )}
                        </div>

                        <div className="lg:w-2/6 md:w-1/2 p-8 flex flex-col md:ml-auto w-full mt-3 md:mt-0">
                            <p className="text-sm text-gray-100 mt-3 text-center font-bold drop-shadow-xl">
                                Developer & Design By Wallock
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LoginPage
