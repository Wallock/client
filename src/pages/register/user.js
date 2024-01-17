import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState } from 'react'
import SearchFilter from '@/components/laos/SearchFilter'
import Pagination from '@/components/laos/Pagination'
import WorkerCard from '@/components/laos/WorkerCard'
import WorkerDetailsDrawer from '@/components/laos/WorkerDetailsDrawer'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function user() {
    return (
        <AppLayout>
            <div className="w-full">
                <div className="flex items-center justify-center flex-wrap">
                    <div className="w-full lg:w-1/2">
                        <div className="card card-side bg-neutral text-neutral-content shadow-xl m-3">
                            <figure className="px-5">
                                <img
                                    src="https://48.wb.in.th/images/logo.png"
                                    alt="nasa"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">นาซ่าลาดพร้าว48</h2>
                                <p>How to park your car at your garage?</p>
                                <div className="card-actions justify-center">
                                    <button className="btn btn-primary">
                                        พม่า
                                    </button>
                                    <button className="btn btn-primary">
                                        ลาว
                                    </button>
                                    <button className="btn btn-primary">
                                        กัมพูชา
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="card card-side bg-neutral text-neutral-content shadow-xl m-3">
                            <figure className="px-5">
                                <img
                                    src="https://dd.wb.in.th/public/images/logodede.png"
                                    alt="dd"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    แม่บ้านดีดีเซอร์วิส
                                </h2>
                                <p>How to park your car at your garage?</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">
                                        Learn now!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="card card-side bg-neutral text-neutral-content shadow-xl m-3">
                            <figure className="px-5">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/187/187487.png"
                                    alt="Thai"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">คนไทย ออนไลน์</h2>
                                <p>How to park your car at your garage?</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">
                                        Learn now!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="card card-side bg-neutral text-neutral-content shadow-xl m-3">
                            <figure className="px-5">
                                <img
                                    src="https://laos.wb.in.th/public/images/laos.png"
                                    alt="laos"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    เมทอินเตอร์เซอร์วิส
                                </h2>
                                <p>How to park your car at your garage?</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">
                                        Learn now!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
