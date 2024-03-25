import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
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

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
        script.defer = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const submitForm = async event => {
        event.preventDefault()
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
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
                <div className="bg-opacity-25 bg-wave"></div>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="container xl:px-32 px-5 py-24 mx-auto flex flex-wrap items-center">
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

                        <div className="lg:w-2/6 md:w-1/2 bg-white shadow-lg rounded-lg p-5 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                            {loading ? (
                                <div className="relative font-3 text-indigo-800 text-2xl m-4 justify-center text-center drop-shadow-md">
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        className="animate-spin text-indigo-800 mr-2"
                                    />
                                    Logging in...
                                </div>
                            ) : (
                                <form onSubmit={submitForm}>
                                    <ToastContainer />
                                    <h1 className="mb-5 block text-3xl font-semibold text-gray-700">
                                        Sign In
                                    </h1>
                                    <div className="relative mb-4">
                                        <label className="mb-1 block text-sm font-bold text-gray-700">
                                            Email
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
                                            className="input input-bordered w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg outline-none  text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                        />
                                    </div>

                                    <div className="relative mb-4">
                                        <label className="mb-1 block text-sm font-bold text-gray-700">
                                            Password
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
                                            className="input input-bordered w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200  outline-none text-lg text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
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
                                                Remember me
                                            </span>
                                        </label>
                                    </div>

                                    <div class="relative my-3">
                                        <div
                                            class="cf-turnstile"
                                            data-sitekey="0x4AAAAAAAUgEUg29ywY9_C2"></div>
                                    </div>

                                    <div className="relative">
                                        <button className="text-white drop-shadow-lg w-full border-0 py-2 px-8 focus:outline-none font-bold rounded text-xl bg-blue-600">
                                            Log In
                                        </button>
                                    </div>
                                    <p className="my-3 text-sm text-blue-800 py-4 text-center font-bold">
                                        หากลืมรหัสผ่านให้ติดต่อผู้พัฒนาโดยตรง
                                    </p>
                                </form>
                            )}
                        </div>

                        <div className="lg:w-2/6 md:w-1/2 bg-transparent rounded-lg p-8 flex flex-col md:ml-auto w-full mt-3 md:mt-0">
                            <p className="text-sm text-gray-700 mt-3 text-center font-black text-slate-400">
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
