import AppLayout from '@/components/Layouts/AppLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUserLock,
    faRightLeft,
    faUserGroup,
    faCircleXmark,
    faUser,
    faPhoneVolume,
    faCircleCheck,
    faPersonWalkingArrowLoopLeft,
    faFileCirclePlus,
    faCircleInfo,
    faImage,
    faAddressCard,
    faBroom,
    faBusinessTime,
    faBullhorn,
    faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons'

export default function Page() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [logData, setLogData] = useState([]) // New state for log data

    const token = `1amwall0ck`
    const f_url = `https://beta.wb.in.th`
    const getname = `48`

    const fetchData = async () => {
        try {
            setLoading(true)

            let apiUrl = `${f_url}/api/i_worker?token=${token}&data_id=${router.query.id}`

            const response = await axios.get(apiUrl)
            const newData = response.data
            setData(newData[0])
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const fetchLogData = async () => {
        try {
            const logApiUrl = `${f_url}/api/logs_a?token=${token}&id=9M-01706`
            const logResponse = await axios.get(logApiUrl)
            setLogData(logResponse.data)
        } catch (error) {
            console.error('Failed to fetch log data', error)
        }
    }

    useEffect(() => {
        // ตรวจสอบว่ามีค่า router.query.id และไม่ใช่ค่าเดิมก่อนทำการโหลดข้อมูลใหม่
        if (router.query.id && router.query.id !== data?.worker_id) {
            fetchData()
            fetchLogData()
        }
    }, [router.query.id])
    const birthday = new Date(data?.worker_birthday)
    const today = new Date()
    const workerStatusDateStr = data?.worker_status_date
    const workerStatusDate = workerStatusDateStr
        ? new Date(workerStatusDateStr.replace(' ', 'T'))
        : new Date()
    let age = today.getFullYear() - birthday.getFullYear()
    function formatDate(date) {
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear() + 543
        return `${day}/${month}/${year}`
    }

    const getStatusData = status => {
        switch (status) {
            case 'wait':
                return {
                    styles: 'bg-red-100 text-red-500',
                    text: 'ว่างงาน',
                }
            case 'save':
                return {
                    styles: 'bg-amber-100 text-amber-500',
                    text: 'จอง',
                }
            case 'incomplete':
                return {
                    styles: 'bg-blue-100 text-blue-500',
                    text: 'รอทำสัญญา',
                }
            case 'woker':
                return {
                    styles: 'bg-emerald-100 text-emerald-500',
                    text: 'ได้งานแล้ว',
                }
            case 'retry':
                return {
                    styles: 'bg-purple-100 text-purple-500',
                    text: 'เคลม',
                }
            case 'changepp':
                return {
                    styles: 'bg-gray-100 text-black',
                    text: 'เปลี่ยน',
                }
            case 'bfprocess':
                return {
                    styles: 'bg-sky-100 text-sky-500',
                    text: 'สพ.แล้ว',
                }
            case 'export':
                return {
                    styles: 'bg-red-100 text-red-500',
                    text: 'ห้ามส่งงาน',
                }
            default:
                return {
                    styles: '',
                    text: 'Unknown Status',
                }
        }
    }
    return (
        <AppLayout>
            {loading ? (
                <div className="w-full p-3">
                    <div className="flex items-center justify-center flex-wrap gap-4">
                        {[...Array(30)].map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-4 w-full lg:w-48 mx-1">
                                <div className="skeleton h-32 w-full"> </div>
                                <div className="skeleton h-4 w-28"> </div>
                                <div className="skeleton h-4 w-full"> </div>
                                <div className="skeleton h-4 w-full"> </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-100 p-0">
                    {/* Header Section with Background Image */}
                    <div className="rounded-box bg-white">
                        <div className="rounded-box bg-gradient-to-t from-indigo-500 to-blue-500 h-48 w-full relative sm:h-62">
                            <img
                                className="rounded-box absolute inset-0 w-full h-full object-cover object-top"
                                src="/images/bg-blue.webp"
                                alt="Cover Image"
                            />

                            <div className="ribbon ribbon-top-left">
                                {(() => {
                                    const {
                                        styles,
                                        icon,
                                        text,
                                    } = getStatusData(data?.worker_status)
                                    return (
                                        <span className={`font-bold ${styles}`}>
                                            {text}
                                        </span>
                                    )
                                })()}
                            </div>

                            <h1 className="title-font m-0 font-extrabold text-center text-4xl  flex justify-center items-center sm:text-7xl text-white opacity-30 pt-10 sm:pt-3 px-2 h-48">
                                {data?.worker_id}
                            </h1>
                            {/* Profile Image */}

                            <div className="rounded-full border-4 border-white absolute bottom-0 transform translate-y-3/4 w-48 h-48 ml-16 sm:mt-72 w-32 h-32">
                                <img
                                    className="rounded-full object-cover w-48 h-48"
                                    src={`${f_url}/${data?.worker_image}`}
                                    alt={data?.worker_id}
                                />
                            </div>

                            <div className="absolute bottom-0 right-0 bg-gray-800 text-white py-1 px-2 rounded-br-lg">
                                เปลี่ยนรูป
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center py-3 lg:pt-6 sm:justify-start mx-auto sm:ml-64 pt-40">
                            <div className="w-full flex justify-center sm:w-1/2 sm:justify-start">
                                {/* Profile Summary Section */}
                                <div className="px-6 py-3">
                                    <h1 className="text-3xl font-bold">
                                        {data?.worker_fullname} (
                                        {data?.worker_nickname})
                                    </h1>
                                    <p className="text-gray-700">
                                        {data?.worker_nationality} -{' '}
                                        {data?.worker_race}
                                    </p>
                                    <span className="mx-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        ฉีดวัคซีนแล้ว {data?.worker_covid} เข็ม
                                    </span>
                                    {data?.worker_namelist === 1 ? (
                                        <span className="mx-1 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            NameList
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2">
                                {/* Action Button Section */}

                                <div className="py-3 text-right">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {data?.worker_status === 'wait' && (
                                            <>
                                                <button className="btn btn-warning">
                                                    <FontAwesomeIcon
                                                        icon={faUserLock}
                                                        className="fa-lg"
                                                    />{' '}
                                                    จอง
                                                </button>
                                                <button className="btn btn-outline btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faRightLeft}
                                                        className="fa-lg"
                                                    />{' '}
                                                    เปลี่ยน
                                                </button>
                                                <button className="btn btn-outline btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faUserGroup}
                                                        className="fa-lg"
                                                    />{' '}
                                                    เคลม
                                                </button>
                                                <button className="btn btn-neutral">
                                                    <FontAwesomeIcon
                                                        icon={faCircleXmark}
                                                        className="fa-lg"
                                                    />{' '}
                                                    ไม่รับงาน
                                                </button>
                                            </>
                                        )}

                                        {data?.worker_status === 'save' && (
                                            <>
                                                <button className="btn btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className="fa-lg"
                                                    />{' '}
                                                    ว่าง
                                                </button>
                                                <button className="btn btn-outline btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faRightLeft}
                                                        className="fa-lg"
                                                    />{' '}
                                                    เปลี่ยน
                                                </button>
                                                <button className="btn btn-outline btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faUserGroup}
                                                        className="fa-lg"
                                                    />{' '}
                                                    เคลม
                                                </button>
                                                <button className="btn btn-info">
                                                    <FontAwesomeIcon
                                                        icon={faPhoneVolume}
                                                        className="fa-lg"
                                                    />{' '}
                                                    สัมภาษณ์แล้วรอ นจ.
                                                </button>
                                            </>
                                        )}

                                        {data?.worker_status ===
                                            'incomplete' && (
                                            <>
                                                <button className="btn btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className="fa-lg"
                                                    />{' '}
                                                    ว่าง
                                                </button>
                                                <button className="btn btn-info">
                                                    <FontAwesomeIcon
                                                        icon={faCircleCheck}
                                                        className="fa-lg"
                                                    />{' '}
                                                    ได้งานแล้ว
                                                </button>
                                            </>
                                        )}

                                        {data?.worker_status === 'woker' && (
                                            <button className="btn btn-primary">
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                    className="fa-lg"
                                                />{' '}
                                                ว่าง
                                            </button>
                                        )}

                                        {data?.worker_status === 'retry' && (
                                            <>
                                                <button className="btn btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className="fa-lg"
                                                    />{' '}
                                                    ว่าง
                                                </button>
                                                <button className="btn btn-success">
                                                    <FontAwesomeIcon
                                                        icon={faCircleCheck}
                                                        className="fa-lg"
                                                    />{' '}
                                                    ได้งานแล้ว
                                                </button>
                                            </>
                                        )}

                                        {data?.worker_status === 'changepp' && (
                                            <>
                                                <button className="btn btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className="fa-lg"
                                                    />{' '}
                                                    ว่าง
                                                </button>
                                                <button className="btn btn-success">
                                                    <FontAwesomeIcon
                                                        icon={faCircleCheck}
                                                        className="fa-lg"
                                                    />{' '}
                                                    ได้งานแล้ว
                                                </button>
                                            </>
                                        )}

                                        {data?.worker_status ===
                                            'bfprocess' && (
                                            <>
                                                <button className="btn btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className="fa-lg"
                                                    />{' '}
                                                    ว่าง
                                                </button>
                                                <button className="btn btn-info">
                                                    <FontAwesomeIcon
                                                        icon={faFileCirclePlus}
                                                        className="fa-lg"
                                                    />{' '}
                                                    รอทำ สย. ส่งตัวคนงาน
                                                </button>
                                            </>
                                        )}

                                        {data?.worker_status === 'export' && (
                                            <button className="btn btn-error">
                                                <FontAwesomeIcon
                                                    icon={
                                                        faPersonWalkingArrowLoopLeft
                                                    }
                                                    className="fa-lg"
                                                />{' '}
                                                รับงานใหม่
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {data?.worker_status != 'wait' && (
                        <>
                            <div
                                role="alert"
                                className="alert bg-amber-200 p-4 mx-auto font-semibold my-3">
                                <FontAwesomeIcon
                                    icon={faBullhorn}
                                    className="fa-xl"
                                />
                                <span>{formatDate(workerStatusDate)}</span>
                                <span>{data?.worker_status_detail}</span>
                            </div>
                        </>
                    )}
                    <div className="flex flex-wrap">
                        <div className="w-full py-3 pr-0 sm:w-1/2 pb-0 sm:pr-2">
                            <div className="bg-white rounded-box p-6 shadow-sm mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faCircleInfo}
                                        className="fa-fw"
                                    />{' '}
                                    ข้อมูลประวัติ
                                </h2>
                                <div className="flex justify-between items-center mt-4">
                                    <div>
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            เพศ
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-800">
                                            {data?.worker_gender === 1
                                                ? 'ชาย'
                                                : 'หญิง'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            อายุ
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-800">
                                            {age} ปี
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            น้ำหนัก
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-800">
                                            {data?.worker_weight}กก.
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            ส่วนสูง
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-800">
                                            {data?.worker_height}cm.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <div>
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            วันเดือนปีเกิด
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-800">
                                            {formatDate(birthday)}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-600 text-sm font-semibold">
                                            รูปแบบ
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-800">
                                            {data?.worker_overnight === 1
                                                ? 'อยู่ประจำ'
                                                : 'ไป-กลับ'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-600 text-sm font-semibold">
                                            เดินทาง
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-800">
                                            {data?.worker_outside === 1
                                                ? 'ไปได้ทุกที่'
                                                : 'ในพื้นที่อยู่เท่านั้น'}
                                        </span>
                                    </div>
                                </div>

                                <div className="divider"> </div>
                                <div className="flex w-full">
                                    <div className="grid h-20 flex-grow place-items-center">
                                        <h3 className="text-lg font-bold">
                                            เบอร์ติดต่อ
                                        </h3>
                                        <p>
                                            <a
                                                href={`tel:${data?.worker_phone}`}>
                                                <kbd className="kbd">
                                                    {data?.worker_phone}
                                                </kbd>
                                            </a>
                                        </p>
                                    </div>
                                    <div className="divider divider-horizontal">
                                        หรือ
                                    </div>
                                    <div className="grid h-20 flex-grow place-items-center">
                                        <h3 className="text-lg font-bold">
                                            เบอร์สำรอง
                                        </h3>
                                        <p>
                                            <a
                                                href={`tel:${data?.worker_phone2}`}>
                                                <kbd className="kbd">
                                                    {data?.worker_phone2}
                                                </kbd>
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                {/* Experience item ends */}
                            </div>

                            <div className="w-100 h-56 m-auto bg-red-100 rounded-xl relative text-white mb-3">
                                <img
                                    className="relative object-cover w-full h-full rounded-xl"
                                    src="/images/kGkSg1v.png"
                                />

                                <div className="w-full px-8 absolute top-6">
                                    <div className="flex justify-between">
                                        <div className="">
                                            <p className="font-light">ชื่อ</p>
                                            <p className="font-medium tracking-widest">
                                                {data?.worker_fullname}
                                            </p>
                                        </div>
                                        <h2 className="text-xl font-bold mb-4">
                                            <FontAwesomeIcon
                                                icon={faAddressCard}
                                                className="fa-fw"
                                            />{' '}
                                            บัตรประจำตัว
                                        </h2>
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-light">เลขบัตร</p>
                                        <p className="font-medium tracking-more-wider">
                                            {data?.worker_wpcard}
                                        </p>
                                    </div>
                                    <div className="pt-3 pr-6">
                                        <div className="flex justify-between">
                                            <div className="">
                                                <p className="font-light text-xs text-xs">
                                                    หมดอายุ
                                                </p>
                                                <p className="font-medium tracking-wider text-sm">
                                                    {data?.worker_wpcard_exp}
                                                </p>
                                            </div>
                                            <div className="">
                                                <p className="font-light text-xs">
                                                    VISA หมดอายุ
                                                </p>
                                                <p className="font-medium tracking-wider text-sm">
                                                    {data?.worker_visa_exp}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="">
                                                <p className="font-light text-xs text-xs">
                                                    Passport
                                                </p>
                                                <p className="font-medium tracking-wider text-sm">
                                                    {data?.worker_passport}
                                                </p>
                                            </div>
                                            <div className="">
                                                <p className="font-light text-xs">
                                                    PP หมดอายุ
                                                </p>
                                                <p className="font-medium tracking-wider text-sm">
                                                    {data?.worker_passport_exp}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-box p-6 shadow-sm mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faClockRotateLeft}
                                        className="fa-fw"
                                    />{' '}
                                    ประวัติการทำงาน
                                </h2>
                                <ul className="timeline timeline-vertical">
                                    {data?.workexp_position1 != null ? (
                                        <li>
                                            <div className="timeline-start">
                                                {data?.workexp_name1}{' '}
                                                {data?.workexp_time1}
                                            </div>
                                            <div className="timeline-middle">
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="fa-fw"
                                                />
                                            </div>
                                            <div className="timeline-end timeline-box">
                                                <p className="underline p-0">
                                                    {data?.workexp_position1}
                                                </p>
                                                {data?.workexp_detail1}
                                            </div>
                                            <hr />
                                        </li>
                                    ) : null}
                                    {data?.workexp_position2 != null ? (
                                        <li>
                                            <hr />
                                            <div className="timeline-start">
                                                {data?.workexp_name2}{' '}
                                                {data?.workexp_time2}
                                            </div>
                                            <div className="timeline-middle">
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="fa-fw"
                                                />
                                            </div>
                                            <div className="timeline-end timeline-box">
                                                <p className="underline p-0">
                                                    {data?.workexp_position2}
                                                </p>
                                                {data?.workexp_detail2}
                                            </div>
                                            <hr />
                                        </li>
                                    ) : null}
                                    {data?.workexp_position3 != null ? (
                                        <li>
                                            <hr />
                                            <div className="timeline-start">
                                                {data?.workexp_name3}{' '}
                                                {data?.workexp_time3}
                                            </div>
                                            <div className="timeline-middle">
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="fa-fw"
                                                />
                                            </div>
                                            <div className="timeline-end timeline-box">
                                                <p className="underline p-0">
                                                    {data?.workexp_position3}
                                                </p>
                                                {data?.workexp_detail3}
                                            </div>
                                            <hr />
                                        </li>
                                    ) : null}
                                    {data?.workexp_position4 != null ? (
                                        <li>
                                            <hr />
                                            <div className="timeline-start">
                                                {data?.workexp_name4}{' '}
                                                {data?.workexp_time4}
                                            </div>
                                            <div className="timeline-middle">
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="fa-fw"
                                                />
                                            </div>
                                            <div className="timeline-end timeline-box">
                                                <p className="underline p-0">
                                                    {data?.workexp_position4}
                                                </p>
                                                {data?.workexp_detail4}
                                            </div>
                                            <hr />
                                        </li>
                                    ) : null}
                                </ul>
                            </div>
                        </div>
                        <div className="w-full py-3 pl-0 sm:w-1/2 pb-0 sm:pl-2">
                            <div className="bg-white rounded-box shadow-sm p-6 mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        className="fa-fw"
                                    />{' '}
                                    รูปภาพ
                                </h2>
                                <div className="flex justify-center p-0">
                                    <div className="grid grid-cols-2 grid-rows-2 gap-1">
                                        <div className="relative">
                                            <img
                                                src={`${f_url}/${data?.worker_image}`}
                                                alt="รูปที่ 1"
                                                className="w-36 h-36 object-cover rounded-tl-lg"
                                            />
                                        </div>
                                        <div className="relative">
                                            <img
                                                src={`${f_url}/${data?.worker_image}`}
                                                alt="รูปที่ 2"
                                                className="w-36 h-36 object-cover rounded-tr-lg"
                                            />
                                        </div>
                                        <div className="relative">
                                            <img
                                                src={`${f_url}/${data?.worker_image}`}
                                                alt="รูปที่ 3"
                                                className="w-36 h-36 object-cover rounded-bl-lg"
                                            />
                                        </div>
                                        <div className="relative">
                                            <img
                                                src={`${f_url}/${data?.worker_image}`}
                                                alt="รูปที่ 4"
                                                className="w-36 h-36 object-cover rounded-br-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-box p-6 shadow-sm mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faBroom}
                                        className="fa-fw"
                                    />{' '}
                                    ทักษะ
                                </h2>
                                {/* Repeat this for each education item */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold">
                                        Skill 1
                                    </h3>
                                    <p className="text-gray-600">
                                        {data?.worker_skill1}
                                    </p>
                                    <h3 className="text-lg font-bold">
                                        Skill 2
                                    </h3>
                                    <p className="text-gray-600">
                                        {data?.worker_skill2}
                                    </p>
                                    <h3 className="text-lg font-bold">
                                        Skill 3
                                    </h3>
                                    <p className="text-gray-600">
                                        {data?.worker_skill3}
                                    </p>
                                    {data?.worker_skill_food === '1' && (
                                        <>
                                            <h3 className="text-lg font-bold">
                                                Level Food
                                            </h3>
                                            <p className="text-gray-600">
                                                {data?.worker_skill_foodlevel}
                                            </p>
                                            <h3 className="text-lg font-bold">
                                                Status
                                            </h3>
                                            <p className="text-gray-600">
                                                {data?.worker_skill_fooddetail}
                                            </p>
                                        </>
                                    )}
                                </div>
                                {/* Education item ends */}
                            </div>

                            <div className="bg-white rounded-box p-6 shadow-sm mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faBusinessTime}
                                        className="fa-fw"
                                    />{' '}
                                    ประวัติรับงานจากบริษัท
                                </h2>
                                <ul className="timeline timeline-vertical">
                                    {logData.map((log, index) => (
                                        <li key={index}>
                                            <div className="timeline-start">
                                                {log.logs_tmpsyid}
                                            </div>
                                            <div className="timeline-middle">
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="fa-fw"
                                                />
                                            </div>
                                            <div className="timeline-end timeline-box">
                                                <p className="underline p-0">
                                                    {log.logs_tmpsyid}
                                                </p>
                                                {log.logs_tmpsyid}
                                            </div>
                                            <hr />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
