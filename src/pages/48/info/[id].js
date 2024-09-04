import AppLayout from '@/components/Layouts/AppLayout'
import { useRouter } from 'next/router'
import { useProfile } from '@/lib/ProfileContext'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUserLock,
    faRightLeft,
    faSyringe,
    faFileExcel,
    faChildren,
    faUserGroup,
    faCircle,
    faCircleXmark,
    faUser,
    faBicycle,
    faMotorcycle,
    faSmoking,
    faCar,
    faComment,
    faPhoneVolume,
    faCircleCheck,
    faPersonWalkingArrowLoopLeft,
    faPerson,
    faPersonDress,
    faCarSide,
    faHospitalUser,
    faCakeCandles,
    faWeightScale,
    faTextHeight,
    faFileCirclePlus,
    faCircleInfo,
    faImage,
    faAddressCard,
    faBroom,
    faUtensils,
    faSquarePhone,
    faMobileScreenButton,
    faBars,
    faBusinessTime,
    faHouseUser,
    faBullhorn,
    faFlagCheckered,
    faStarOfLife,
    faClockRotateLeft,
    faPaw,
    faHeartbeat,
} from '@fortawesome/free-solid-svg-icons'

export default function Page() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [empData, setEmpData] = useState(null)
    const [logData, setLogData] = useState([]) // New state for log data
    const profile = useProfile()
    const token = `1amwall0ck`
    const f_url = `https://beta.wb.in.th`
    const getname = `48`

    useEffect(() => {
        const checkUserStatus = () => {
            // Check the user's type48 status from the profile prop
            const userType48 = profile?.type48

            if (userType48 !== 1) {
                console.error('Error Profile Type48 Token', profile?.type48)
                router.push('/dashboard')
            }
        }

        checkUserStatus()
        fetchData()
        const intervalId = setInterval(() => {
            fetchData(false)
        }, 10000)
        return () => clearInterval(intervalId)
    }, [])

    const fetchData = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true)
            }

            let apiUrl = `${f_url}/api/i_worker?token=${token}&data_id=${router.query.id}`
            const response = await axios.get(apiUrl)
            const newData = response.data

            setData(newData[0])

            if (showLoading) {
                setLoading(false)
            }
        } catch (error) {
            if (showLoading) {
                setLoading(false)
            }
        }
    }

    const fetchEmpData = async () => {
        // ตรวจสอบว่า emp_id มีค่าก่อนทำการดึงข้อมูล
        if (data?.emp_id) {
            try {
                const empApiUrl = `${f_url}/api/i_emp?token=${token}&data_id=${data.emp_id}`
                const empResponse = await axios.get(empApiUrl)
                setEmpData(empResponse.data[0]) // สมมติว่าข้อมูลพนักงานเป็น item แรก
            } catch (error) {
                console.error('Failed to fetch employee data', error)
            }
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
            fetchEmpData()
            fetchLogData()
        }
    }, [router.query.id])

    useEffect(() => {
        // ตรวจสอบให้แน่ใจว่า data ถูกโหลดก่อนเรียก fetchEmpData
        if (data?.emp_id) {
            fetchEmpData()
        }
    }, [data?.emp_id])
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
                    styles:
                        'bg-gradient-to-r from-slate-900 to-slate-700 text-white',
                    text: 'ว่างงาน',
                }
            case 'save':
                return {
                    styles:
                        'bg-gradient-to-r from-amber-200 to-yellow-500 text-slate-900',
                    text: 'จอง',
                }
            case 'incomplete':
                return {
                    styles:
                        'bg-gradient-to-r from-indigo-500 to-blue-500 text-white',
                    text: 'รอทำสัญญา',
                }
            case 'woker':
                return {
                    styles:
                        'bg-gradient-to-r from-emerald-400 to-cyan-400 text-emerald-700',
                    text: 'ได้งานแล้ว',
                }
            case 'retry':
                return {
                    styles:
                        'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
                    text: 'เคลม',
                }
            case 'changepp':
                return {
                    styles:
                        'bg-gradient-to-r from-slate-300 to-slate-500 text-black',
                    text: 'เปลี่ยน',
                }
            case 'bfprocess':
                return {
                    styles:
                        'bg-gradient-to-r from-blue-200 to-cyan-200 text-slate-700',
                    text: 'สพ.แล้ว',
                }
            case 'export':
                return {
                    styles:
                        'bg-gradient-to-r from-red-500 to-orange-500 text-slate-800',
                    text: 'ห้ามส่งงาน',
                }
            default:
                return {
                    styles: '',
                    text: 'Unknown Status',
                }
        }
    }
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const datapacks = data?.datapacks || []

    const handleImageClick = imageUrl => {
        setSelectedImage(imageUrl)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedImage(null)
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

                            <div className="rounded-full transition-transform transform hover:scale-105 border-4 border-white absolute bottom-0 transform translate-y-3/4 w-48 h-48 ml-16 sm:mt-72 w-32 h-32">
                                <img
                                    className="rounded-full object-cover w-48 h-48 "
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
                                        <FontAwesomeIcon
                                            icon={faSyringe}
                                            className="fa-fw"
                                        />{' '}
                                        ฉีดวัคซีน {data?.worker_covid} เข็ม
                                    </span>
                                    {data?.worker_namelist === 1 ? (
                                        <span className="mx-1 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            <FontAwesomeIcon
                                                icon={faFileExcel}
                                                className="fa-fw"
                                            />{' '}
                                            NameList
                                        </span>
                                    ) : null}
                                    {data?.worker_duo &&
                                    data?.worker_duo !== '-' ? (
                                        <Link
                                            href={`/${getname}/info/${data?.worker_duo}`}>
                                            <span className="mx-1 bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                <FontAwesomeIcon
                                                    icon={faChildren}
                                                    className="fa-fw"
                                                />{' '}
                                                งานคู่กับ {data?.worker_duo}
                                            </span>
                                        </Link>
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
                    <div className="flex flex-wrap ">
                        <div className="w-full py-3 pr-0 sm:w-1/2 pb-0 sm:pr-2">
                            <div className="bg-white rounded-box p-5 shadow-sm mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faCircleInfo}
                                        className="fa-fw"
                                    />{' '}
                                    ข้อมูลประวัติ
                                </h2>
                                <div className="flex flex-wrap justify-between items-center mt-4">
                                    <div className="px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            เพศ
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-500">
                                            {data?.worker_gender === 1 ? (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faPerson}
                                                        className="text-blue-500"
                                                    />{' '}
                                                    ชาย
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faPersonDress}
                                                        className="text-pink-500"
                                                    />{' '}
                                                    หญิง
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    <div className="px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            <FontAwesomeIcon
                                                icon={faCakeCandles}
                                                className="fa-fw"
                                            />{' '}
                                            อายุ
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-500">
                                            {age} ปี
                                        </span>
                                    </div>
                                    <div className="px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            <FontAwesomeIcon
                                                icon={faWeightScale}
                                                className="fa-fw"
                                            />{' '}
                                            น้ำหนัก
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-500">
                                            {data?.worker_weight}กก.
                                        </span>
                                    </div>
                                    <div className="px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            <FontAwesomeIcon
                                                icon={faTextHeight}
                                                className="fa-fw"
                                            />{' '}
                                            ส่วนสูง
                                        </h4>
                                        <span className="mt-2 text-xl font-medium text-gray-500">
                                            {data?.worker_height}ซม.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-between items-center mt-4">
                                    <div className="px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            ที่อยู่
                                        </h4>
                                        <span className="mt-2 text-lg font-medium text-gray-500">
                                            {data?.worker_address}
                                        </span>
                                    </div>
                                    <div className="border-l border-gray-100 px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            สถานะ
                                        </h4>
                                        <span className="mt-2 text-lg font-medium text-gray-500">
                                            {data?.worker_relationship === '1'
                                                ? 'โสด'
                                                : data?.worker_relationship ===
                                                  '2'
                                                ? 'แต่งงาน'
                                                : data?.worker_relationship ===
                                                  '3'
                                                ? 'ม่าย'
                                                : data?.worker_relationship ===
                                                  '4'
                                                ? 'แยกทาง'
                                                : data?.worker_relationship ===
                                                  '5'
                                                ? 'มีแฟน'
                                                : 'ไม่ระบุ'}
                                        </span>
                                    </div>
                                    <div className="border-l border-gray-100 px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            ลูก
                                        </h4>
                                        <span className="mt-2 text-lg font-medium text-gray-500">
                                            {data?.worker_baby === null
                                                ? 'ไม่มี'
                                                : data?.worker_baby}
                                        </span>
                                    </div>
                                    <div className="border-l border-gray-100 px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            อยู่ไทยมา
                                        </h4>
                                        <span className="mt-2 text-lg font-medium text-gray-500">
                                            {data?.worker_inthai === '0'
                                                ? 'ตั้งแต่เกิด'
                                                : data?.worker_inthai}
                                        </span>
                                    </div>
                                    <div className="border-l border-gray-100 px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            ศาสนา
                                        </h4>
                                        <span className="mt-2 text-lg font-medium text-gray-500">
                                            {data?.worker_religion}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-between items-center mt-4">
                                    <div className="px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold ">
                                            วันเกิด
                                        </h4>
                                        <span className="mt-2 text-md font-medium text-gray-500">
                                            {formatDate(birthday)}
                                        </span>
                                    </div>
                                    <div className="border-l border-gray-100 px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold">
                                            รูปแบบ
                                        </h4>
                                        <span className="mt-2 text-md font-medium text-gray-500">
                                            {data?.worker_overnight === 1
                                                ? 'อยู่ประจำ'
                                                : 'ไป-กลับ'}
                                        </span>
                                    </div>
                                    <div className="border-l border-gray-100 px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold">
                                            เดินทาง
                                        </h4>
                                        <span className="mt-2 text-md font-medium text-gray-500">
                                            {data?.worker_outside === 1
                                                ? 'ไปได้ทุกที่'
                                                : 'ในพื้นที่อยู่เท่านั้น'}
                                        </span>
                                    </div>
                                    <div className="border-l border-gray-100 px-4">
                                        <h4 className="text-gray-600 text-sm font-semibold">
                                            ทราบข่าวจาก
                                        </h4>
                                        <span className="mt-2 text-md font-medium text-gray-500">
                                            {data?.worker_knownews}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 mt-5">
                                    {' '}
                                </div>
                                <div className="flex flex-wrap w-full p-3">
                                    <div className="grid flex-grow place-items-center">
                                        <h3 className="text-lg font-bold">
                                            <FontAwesomeIcon
                                                icon={faSquarePhone}
                                                className="fa-fw"
                                            />{' '}
                                            เบอร์ติดต่อ
                                        </h3>

                                        <a href={`tel:${data?.worker_phone}`}>
                                            <kbd className="kbd">
                                                {data?.worker_phone}
                                            </kbd>
                                        </a>
                                    </div>
                                    <div className="divider divider-horizontal">
                                        หรือ
                                    </div>
                                    <div className="grid flex-grow place-items-center">
                                        <h3 className="text-lg font-bold">
                                            <FontAwesomeIcon
                                                icon={faMobileScreenButton}
                                                className="fa-fw"
                                            />{' '}
                                            เบอร์สำรอง
                                        </h3>
                                        <a href={`tel:${data?.worker_phone2}`}>
                                            <kbd className="kbd">
                                                {data?.worker_phone2}
                                            </kbd>
                                        </a>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 mt-5">
                                    {' '}
                                </div>
                                <div className="card bg-base-300 rounded-box grid h-10 place-items-center">
                                    หมายเหตุ : {data?.worker_detailother}
                                </div>
                            </div>

                            <div className="w-100 h-56 m-auto bg-red-100 rounded-xl relative text-white mb-3">
                                <img
                                    className="relative object-cover w-full h-full rounded-xl"
                                    src="/images/passport.png"
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

                                    <div className="flex flex-wrap justify-between">
                                        <div>
                                            <p className="font-light">
                                                เลขบัตร
                                            </p>
                                            <p className="font-medium tracking-more-wider">
                                                {data?.worker_wpcard}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-light">
                                                สัญชาติ
                                            </p>
                                            <p className="font-medium tracking-more-wider">
                                                {data?.worker_nationality} -{' '}
                                                {data?.worker_race}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2">
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
                        <div className="w-full py-3 pl-0 sm:w-1/2 pb-0 sm:pl-2">
                            {data?.worker_status != 'wait' && (
                                <div
                                    className={`card w-full rounded-box p-5 mb-3 shadow-sm border-2 border-white ${(() => {
                                        const { styles } = getStatusData(
                                            data?.worker_status,
                                        )
                                        return styles
                                    })()}`}>
                                    <div className="flex justify-between">
                                        <div>
                                            <h2 className="text-4xl font-bold">
                                                {(() => {
                                                    const {
                                                        styles,
                                                        icon,
                                                        text,
                                                    } = getStatusData(
                                                        data?.worker_status,
                                                    )
                                                    return (
                                                        <p
                                                            className={`font-bold text-shadow-sm`}>
                                                            {text}
                                                        </p>
                                                    )
                                                })()}
                                            </h2>
                                            <p className="font-semibold text-gray-800 mb-3">
                                                {data?.worker_status_detail}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                อัพเดทล่าสุด{' '}
                                                {formatDate(workerStatusDate)}
                                            </p>
                                        </div>
                                        {empData ? (
                                            <div>
                                                <img
                                                    className=" rounded-xl object-cover right-6 -mt-12 z-10 w-32 h-32 shadow"
                                                    src={`${empData?.profile_photo_url}`}
                                                    alt={empData?.id}
                                                />
                                                <p className="whitespace-nowrap">
                                                    ผู้ดูแล : {empData.name}
                                                </p>
                                            </div>
                                        ) : (
                                            'กำลังโหลดข้อมูลผู้ดูแล...'
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="bg-white rounded-box shadow-sm p-6 mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        className="fa-fw"
                                    />{' '}
                                    รูปภาพ
                                </h2>
                                <div className="flex justify-center p-0">
                                    {datapacks.length === 0 ? (
                                        <div className="flex justify-center items-center">
                                            <img
                                                src="/images/blank-picture.webp"
                                                alt="No image available"
                                                className="w-72 h-72 object-cover rounded-lg"
                                            />
                                        </div>
                                    ) : datapacks.length === 1 ? (
                                        <div className="relative flex justify-center items-center">
                                            <img
                                                src={`${f_url}/${datapacks[0].values}`}
                                                alt="รูปที่ 1"
                                                className="w-72 h-72 object-cover rounded-xl border-2 border-gray-100 hover:border-blue-600 hover:border-dashed transition duration-300 ease-in-out"
                                            />
                                            <div
                                                className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 rounded-xl transition duration-300 ease-in-out"
                                                onClick={() =>
                                                    handleImageClick(
                                                        `${f_url}/${datapacks[0].values}`,
                                                    )
                                                }>
                                                <span className="text-white text-lg font-semibold">
                                                    คลิ๊กเพื่อซูม
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-1">
                                            {datapacks
                                                .slice(0, 4)
                                                .map((datapack, index) => (
                                                    <div
                                                        key={datapack.id}
                                                        className="relative">
                                                        <img
                                                            src={
                                                                datapack.values
                                                                    ? `${f_url}/${datapack.values}`
                                                                    : '/images/blank-picture.webp'
                                                            }
                                                            alt={`รูปที่ ${
                                                                index + 1
                                                            }`}
                                                            className={`w-36 h-36 object-cover ${
                                                                index === 0
                                                                    ? 'rounded-tl-lg'
                                                                    : index ===
                                                                      1
                                                                    ? 'rounded-tr-lg'
                                                                    : index ===
                                                                      2
                                                                    ? 'rounded-bl-lg'
                                                                    : 'rounded-br-lg'
                                                            }`}
                                                            onClick={() =>
                                                                handleImageClick(
                                                                    datapack.values
                                                                        ? `${f_url}/${datapack.values}`
                                                                        : '/images/blank-picture.webp',
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>

                                {/* Modal */}
                                {isModalOpen && (
                                    <div
                                        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
                                            isModalOpen
                                                ? 'opacity-100 visible'
                                                : 'opacity-0 invisible'
                                        }`}>
                                        <div
                                            className={`bg-white rounded-lg overflow-hidden max-w-3xl w-full mx-4 transform transition-transform duration-300 ${
                                                isModalOpen
                                                    ? 'scale-100'
                                                    : 'scale-90'
                                            }`}>
                                            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                                                <h2 className="text-lg font-semibold">
                                                    พรีวิวรูป
                                                </h2>
                                                <button
                                                    className="text-gray-500 hover:text-gray-700"
                                                    onClick={closeModal}>
                                                    ✕
                                                </button>
                                            </div>
                                            <div className="flex justify-center">
                                                <img
                                                    src={selectedImage}
                                                    alt="Selected"
                                                    className="max-w-full max-h-[70vh] object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="bg-white rounded-box p-6 shadow-sm mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faHouseUser}
                                        className="fa-fw"
                                    />{' '}
                                    งานที่ต้องการ
                                </h2>
                                {/* Repeat this for each education item */}
                                <ul className="list-none space-y-1">
                                    {data?.workposition_id1 !== '-' && (
                                        <li className="bg-base-100 rounded-lg p-4 flex items-center justify-between border border-b-4 hover:border-blue-800">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-gray-300">
                                                    <FontAwesomeIcon
                                                        icon={faBars}
                                                        className="text-2xl"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">
                                                        {data?.workposition_id1}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="badge badge-outline">
                                                    เงินเดือน ฿
                                                    {Number(
                                                        data?.workposition_salary1,
                                                    )?.toLocaleString()}
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                    {data?.workposition_id2 !== '-' && (
                                        <li className="bg-base-100 rounded-lg p-4 flex items-center justify-between border border-b-4 hover:border-blue-800">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-gray-300">
                                                    <FontAwesomeIcon
                                                        icon={faBars}
                                                        className="text-2xl"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">
                                                        {data?.workposition_id2}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="badge badge-outline">
                                                    เงินเดือน ฿
                                                    {Number(
                                                        data?.workposition_salary2,
                                                    )?.toLocaleString()}
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                    {data?.workposition_id3 !== '-' && (
                                        <li className="bg-base-100 rounded-lg p-4 flex items-center justify-between border border-b-4 hover:border-blue-800">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-gray-300">
                                                    <FontAwesomeIcon
                                                        icon={faBars}
                                                        className="text-2xl"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">
                                                        {data?.workposition_id3}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="badge badge-outline">
                                                    เงินเดือน ฿
                                                    {Number(
                                                        data?.workposition_salary3,
                                                    )?.toLocaleString()}
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                    {data?.workposition_id4 !== '-' && (
                                        <li className="bg-base-100 rounded-lg p-4 flex items-center justify-between border border-b-4 hover:border-blue-800">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-gray-300 ">
                                                    <FontAwesomeIcon
                                                        icon={faBars}
                                                        className="text-2xl"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">
                                                        {data?.workposition_id4}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="badge badge-outline">
                                                    เงินเดือน ฿
                                                    {Number(
                                                        data?.workposition_salary4,
                                                    )?.toLocaleString()}
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="bg-white rounded-box p-6 shadow-sm mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faBroom}
                                        className="fa-fw"
                                    />{' '}
                                    ทักษะ
                                </h2>
                                <div className="grid md:grid-cols-1 xl:grid-cols-3 gap-0">
                                    <div className="flex items-center p-2 bg-white rounded-lg shadow-xs">
                                        <div className="p-4 mr-4 text-blue-500 bg-blue-100 border hover:border-blue-800  rounded-full">
                                            <FontAwesomeIcon
                                                icon={faBicycle}
                                                className="fa-lg"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600">
                                                จักรยาน
                                            </div>
                                            <div className="text-lg font-semibold text-gray-700">
                                                <p
                                                    className={
                                                        data?.worker_skill1 ===
                                                        '1'
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                    }>
                                                    {data?.worker_skill1 === '1'
                                                        ? 'ได้'
                                                        : 'ไม่ได้'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-2 bg-white rounded-lg shadow-xs">
                                        <div className="p-4 mr-4 text-blue-500 bg-blue-100 border hover:border-blue-800 rounded-full">
                                            <FontAwesomeIcon
                                                icon={faMotorcycle}
                                                className="fa-lg"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600">
                                                จักรยานยนต์
                                            </div>
                                            <div className="text-lg font-semibold text-gray-700">
                                                <p
                                                    className={
                                                        data?.worker_skill2 ===
                                                        '1'
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                    }>
                                                    {data?.worker_skill2 === '1'
                                                        ? 'ได้'
                                                        : 'ไม่ได้'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-2 bg-white rounded-lg shadow-xs">
                                        <div className="p-4 mr-4 text-blue-500 bg-blue-100 border hover:border-blue-800 rounded-full">
                                            <FontAwesomeIcon
                                                icon={faCar}
                                                className="fa-lg"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600">
                                                รถยนต์
                                            </div>
                                            <div className="text-lg font-semibold text-gray-700">
                                                <p
                                                    className={
                                                        data?.worker_skill3 ===
                                                        '1'
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                    }>
                                                    {data?.worker_skill3 === '1'
                                                        ? 'ได้'
                                                        : 'ไม่ได้'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-2 bg-white rounded-lg shadow-xs">
                                        <div className="p-4 mr-4 text-purple-500 bg-purple-100 border hover:border-purple-800 rounded-full">
                                            <FontAwesomeIcon
                                                icon={faPaw}
                                                className="fa-lg"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600">
                                                ไม่ถูกกับ
                                            </div>
                                            <div className="text-sm font-semibold text-purple-700">
                                                {data?.worker_smalldog === 0
                                                    ? ''
                                                    : 'สัตว์ตัวเล็ก'}{' '}
                                                และ{' '}
                                                {data?.worker_bigdog === 0
                                                    ? ''
                                                    : 'สัตว์ตัวใหญ่'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-2 bg-white rounded-lg shadow-xs">
                                        <div className="p-4 mr-4 text-pink-500 bg-pink-100 border hover:border-pink-800 rounded-full">
                                            <FontAwesomeIcon
                                                icon={faCarSide}
                                                className="fa-lg"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600">
                                                การเดินทาง
                                            </div>
                                            <div className="text-md font-semibold text-gray-700">
                                                {data?.worker_boathunk === 0
                                                    ? 'ไม่มีปัญหา'
                                                    : 'เมารถเมาเรือ'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-2 bg-white rounded-lg shadow-xs">
                                        <div className="p-4 mr-4 text-yellow-500 bg-yellow-100 border hover:border-yellow-800 rounded-full">
                                            <FontAwesomeIcon
                                                icon={faUtensils}
                                                className="fa-lg"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600">
                                                ทำอาหาร
                                            </div>
                                            <div className="text-md font-semibold text-gray-700">
                                                {data?.worker_skill_foodlevel ===
                                                '1'
                                                    ? 'เบื้องต้น'
                                                    : data?.worker_skill_foodlevel ===
                                                      '2'
                                                    ? 'ตามสั่ง'
                                                    : data?.worker_skill_foodlevel ===
                                                      '3'
                                                    ? 'ได้ทุกอย่าง'
                                                    : 'ไม่ได้'}
                                            </div>
                                            <p className="text-xs font-semibold text-gray-400">
                                                {data?.worker_skill_fooddetail}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-2 bg-white rounded-lg shadow-xs">
                                        <div className="p-4 mr-4 text-emerald-500 bg-emerald-100 border hover:border-emerald-800 rounded-full">
                                            <FontAwesomeIcon
                                                icon={faHeartbeat}
                                                className="fa-lg"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600">
                                                สุขภาพ
                                            </div>
                                            <div className="text-md font-semibold text-gray-700">
                                                {data?.worker_sick === '0'
                                                    ? 'ไม่มีโรค'
                                                    : 'โรคประจำตัว'}
                                            </div>
                                            <div className="text-xs font-semibold text-gray-400">
                                                {data?.worker_sick_detail}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-2 bg-white rounded-lg shadow-xs">
                                        <div className="p-4 mr-4 text-red-500 bg-red-100 border hover:border-red-800 rounded-full">
                                            <FontAwesomeIcon
                                                icon={faHospitalUser}
                                                className="fa-lg"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600">
                                                การรักษา
                                            </div>
                                            <div className="text-md font-semibold text-gray-700">
                                                {data?.worker_verysick === '0'
                                                    ? 'ไม่ป่วย'
                                                    : 'เคยป่วยหนัก'}
                                            </div>
                                            <div className="text-xs font-semibold text-gray-400">
                                                {data?.worker_verysick_detail}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-2 bg-white rounded-lg shadow-xs">
                                        <div className="p-4 mr-4 text-zinc-500 bg-zinc-100 border hover:border-zinc-800 rounded-full">
                                            <FontAwesomeIcon
                                                icon={faSmoking}
                                                className="fa-lg"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600">
                                                สิ่งเสพติด
                                            </div>
                                            <div className="text-md font-semibold text-gray-700">
                                                {data?.worker_drinksmork === '0'
                                                    ? 'ไม่เลย'
                                                    : data?.worker_drinksmork ===
                                                      1
                                                    ? 'บางครั้ง'
                                                    : 'ติดหนัก'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-box p-6 shadow-sm mb-3">
                                <h2 className="text-xl font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faFlagCheckered}
                                        className="fa-fw"
                                    />{' '}
                                    ภาษา
                                </h2>
                                {/* Repeat this for each education item */}

                                <div className="stats stats-vertical lg:stats-horizontal w-full">
                                    <div className="stat p-3">
                                        <div className="stat-title text-2xl font-semibold text-center">
                                            ไทย
                                        </div>
                                        <div className="stat-desc text-lg">
                                            {data?.worker_landth_talk === 0 ? (
                                                <FontAwesomeIcon
                                                    icon={faCircleXmark}
                                                    className="text-error fa-fw"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="text-success fa-fw"
                                                />
                                            )}
                                            พูด
                                            <br />
                                            {data?.worker_landth_view === 0 ? (
                                                <FontAwesomeIcon
                                                    icon={faCircleXmark}
                                                    className="text-error fa-fw"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="text-success fa-fw"
                                                />
                                            )}
                                            อ่าน
                                            <br />
                                            {data?.worker_landth_write === 0 ? (
                                                <FontAwesomeIcon
                                                    icon={faCircleXmark}
                                                    className="text-error fa-fw"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="text-success fa-fw"
                                                />
                                            )}
                                            เขียน
                                        </div>
                                    </div>

                                    <div className="stat p-3">
                                        <div className="stat-title text-2xl font-semibold text-center">
                                            อังกฤษ
                                        </div>
                                        <div className="stat-desc text-lg">
                                            {data?.worker_landen_talk === 0 ? (
                                                <FontAwesomeIcon
                                                    icon={faCircleXmark}
                                                    className="text-error fa-fw"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="text-success fa-fw"
                                                />
                                            )}
                                            พูด
                                            <br />
                                            {data?.worker_landen_view === 0 ? (
                                                <FontAwesomeIcon
                                                    icon={faCircleXmark}
                                                    className="text-error fa-fw"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="text-success fa-fw"
                                                />
                                            )}
                                            อ่าน
                                            <br />
                                            {data?.worker_landen_write === 0 ? (
                                                <FontAwesomeIcon
                                                    icon={faCircleXmark}
                                                    className="text-error fa-fw"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className="text-success fa-fw"
                                                />
                                            )}
                                            เขียน
                                        </div>
                                    </div>

                                    <div className="stat p-3">
                                        <div className="stat-title text-2xl font-semibold text-center">
                                            อื่นๆ
                                        </div>
                                        <div className="stat-desc text-lg text-center">
                                            {data?.worker_landother}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
