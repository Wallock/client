import AppLayout from '@/components/Layouts/AppLayout'
import { useRouter } from 'next/router'
import { useProfile } from '@/lib/ProfileContext'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Cookies from 'js-cookie'
import Loading from '@/lib/loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUserLock,
    faRightLeft,
    faCheckCircle,
    faSyringe,
    faTrashAlt,
    faFileExcel,
    faChildren,
    faUserGroup,
    faAnglesRight,
    faTimes,
    faCircleXmark,
    faGripLinesVertical,
    faUser,
    faBicycle,
    faMotorcycle,
    faSmoking,
    faCar,
    faVideo,
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
    faIdCard,
    faFlagCheckered,
    faCamera,
    faClockRotateLeft,
    faPaw,
    faHeartbeat,
    faPrint,
} from '@fortawesome/free-solid-svg-icons'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export default function Page() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [empData, setEmpData] = useState(null)
    const [logData, setLogData] = useState([]) // New state for log data
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const profile = useProfile()
    const token = `1amwall0ck`
    const f_url = `https://beta.wb.in.th`
    const d_url = `https://server.wb.in.th`
    const getname = `48`
    const empId = profile?.uid48
    const [isWorkLogModalOpen, setIsWorkLogModalOpen] = useState(false)
    const [isContractLogModalOpen, setIsContractLogModalOpen] = useState(false)
    const [workLogs, setWorkLogs] = useState([])
    const [isPaymentLogModalOpen, setIsPaymentLogModalOpen] = useState(false)
    const [paymentLogs, setPaymentLogs] = useState([])
    useEffect(() => {
        const checkUserStatus = () => {
            // Check the user's type48 status from the profile prop
            const userType48 = profile?.type48
            if (userType48 !== 1) {
                //console.error('Error Profile Type48 Token', profile?.type48)
                router.push('/dashboard')
            }
        }

        checkUserStatus()
        fetchData()
        const intervalId = setInterval(() => {
            fetchData(false)
        }, 5000)
        return () => clearInterval(intervalId)
    }, [])

    const [isCardModalOpen, setIsCardModalOpen] = useState(false)

    const handleOpenCardModal = () => {
        setIsCardModalOpen(true)
    }

    const handleCloseCardModal = () => {
        setIsCardModalOpen(false)
    }

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
            //console.error('Error checking for updates:', error)
            toast.error(`Error:. ${error}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            if (showLoading) {
                setLoading(false)
            }
        }
    }

    const fetchWorkLogData = async () => {
        try {
            const workLogApiUrl = `${f_url}/api/logs_w?token=${token}&id=${data.worker_id}`
            const workLogResponse = await axios.get(workLogApiUrl)
            setWorkLogs(workLogResponse.data)
        } catch (error) {
            //console.error('Error fetching work logs:', error)
            toast.error(`Error:. ${error}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    // Function to handle "การทำรายการ" button click
    const handleWorkLogClick = () => {
        fetchWorkLogData()
        setIsWorkLogModalOpen(true)
    }

    // Function to handle "การทำสัญญา" button click
    const handleContractLogClick = () => {
        fetchLogData() // This already fetches logs data
        setIsContractLogModalOpen(true)
    }

    // Function to close the modals
    const handleCloseWorkLogModal = () => setIsWorkLogModalOpen(false)
    const handleCloseContractLogModal = () => setIsContractLogModalOpen(false)
    const fetchEmpData = async () => {
        // ตรวจสอบว่า emp_id มีค่าก่อนทำการดึงข้อมูล
        const token = Cookies.get('accessToken')
        if (data?.emp_id) {
            try {
                const empResponse_deep = await fetch(
                    `${d_url}/api/i_emp/${getname}/${data.emp_id}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )
                const empResponse = await empResponse_deep.json()
                setEmpData(empResponse) // สมมติว่าข้อมูลพนักงานเป็น item แรก
            } catch (error) {
                //console.error('Error checking for updates:', error)
                toast.error(`Error:. ${error}`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            }
        }
    }

    const fetchLogData = async () => {
        try {
            // เรียกข้อมูล logs_a ก่อน
            const logApiUrl = `${f_url}/api/logs_a?token=${token}&id=${router.query.id}`
            const logResponse = await axios.get(logApiUrl)

            // ดึง logData ทั้งหมดมา
            const logs = logResponse.data

            // ทำการสร้าง Promise.all เพื่อเรียก API /api/archives_info สำหรับแต่ละ logs_tmpsyid
            const logDataWithInfo = await Promise.all(
                logs.map(async log => {
                    const archiveApiUrl = `${f_url}/api/archives_info?token=${token}&id=${log.logs_tmpsyid}`
                    try {
                        const archiveResponse = await axios.get(archiveApiUrl)

                        // สมมติว่าผลลัพธ์เป็น array จึงใช้ index 0 ในการเข้าถึง sy_master_fullname
                        const archiveInfo = archiveResponse.data[0] || {}

                        return {
                            ...log,
                            sy_master_nickname:
                                archiveInfo.sy_master_nickname || 'Unknown',
                            sy_position: archiveInfo.sy_position || 'Unknown',
                            sy_startdate: archiveInfo.sy_startdate || 'Unknown',
                            sy_date: archiveInfo.sy_date || 'Unknown',
                            sy_master_address:
                                archiveInfo.sy_master_address || 'Unknown',
                        }
                    } catch (error) {
                        //console.error('Error checking for updates:', error)
                        return {
                            ...log,
                            sy_master_nickname: 'Unknown', // แสดง Unknown เมื่อ API มีปัญหา
                            sy_position: 'Unknown',
                            sy_startdate: 'Unknown',
                            sy_date: 'Unknown',
                            sy_master_address: 'Unknown',
                        }
                    }
                }),
            )

            // อัพเดต logData ด้วยข้อมูล sy_master_fullname ที่ดึงมาได้
            setLogData(logDataWithInfo)
        } catch (error) {
            //console.error('Error checking for updates:', error)
            toast.error(`Error:. ${error}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const renderButtons = worker_status => {
        switch (worker_status) {
            case 'wait': //ว่างงาน
                return (
                    <>
                        <li>
                            <button
                                className="btn btn-warning btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('save')}>
                                <FontAwesomeIcon
                                    icon={faUserLock}
                                    className="fa-fw"
                                />{' '}
                                จอง
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-outline btn-primary btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('changepp')}>
                                <FontAwesomeIcon
                                    icon={faRightLeft}
                                    className="fa-fw"
                                />{' '}
                                เปลี่ยน
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-outline btn-primary btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('retry')}>
                                <FontAwesomeIcon
                                    icon={faUserGroup}
                                    className="fa-fw"
                                />{' '}
                                เคลม
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-neutral btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('export')}>
                                <FontAwesomeIcon
                                    icon={faCircleXmark}
                                    className="fa-fw"
                                />{' '}
                                ไม่รับงาน
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-error btn-lg text-white font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('newupdate')}>
                                <FontAwesomeIcon
                                    icon={faPersonWalkingArrowLoopLeft}
                                    className="fa-fw"
                                />{' '}
                                ดันคนงาน
                            </button>
                        </li>
                    </>
                )
            case 'save': //จอง
                return (
                    <>
                        <li>
                            <button
                                className="btn button-js btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('wait')}>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="fa-fw"
                                />{' '}
                                ว่าง
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-outline btn-primary btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('changepp')}>
                                <FontAwesomeIcon
                                    icon={faRightLeft}
                                    className="fa-fw"
                                />{' '}
                                เปลี่ยน
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-outline btn-primary btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('retry')}>
                                <FontAwesomeIcon
                                    icon={faUserGroup}
                                    className="fa-fw"
                                />{' '}
                                เคลม
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-info btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('bfprocess')}>
                                <FontAwesomeIcon
                                    icon={faPhoneVolume}
                                    className="fa-fw"
                                />{' '}
                                สัมภาษณ์แล้วรอ นจ.
                            </button>
                        </li>
                    </>
                )
            case 'incomplete': //รอทำสัญญา
                return (
                    <>
                        <li>
                            <button
                                className="btn button-js btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('wait')}>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="fa-fw"
                                />{' '}
                                ว่าง
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-success btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('woker')}>
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="fa-lg"
                                />{' '}
                                ได้งานแล้ว
                            </button>
                        </li>
                    </>
                )
            case 'woker': //ได้งานแล้ว
                return (
                    <li>
                        <button
                            className="btn button-js btn-lg font-bold mx-3 text-3xl rounded-full"
                            onClick={() => handleOpenModal('wait')}>
                            <FontAwesomeIcon icon={faUser} className="fa-fw" />{' '}
                            ว่าง
                        </button>
                    </li>
                )
            case 'retry': //เคลม
                return (
                    <>
                        <li>
                            <button
                                className="btn button-js btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('wait')}>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="fa-fw"
                                />{' '}
                                ว่าง
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-success btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('woker')}>
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="fa-fw"
                                />{' '}
                                ได้งานแล้ว
                            </button>
                        </li>
                    </>
                )
            case 'changepp': //เปลี่ยนตัว
                return (
                    <>
                        <li>
                            <button
                                className="btn button-js btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('wait')}>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="fa-fw"
                                />{' '}
                                ว่าง
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-success btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('bfprocess')}>
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="fa-fw"
                                />{' '}
                                ได้งานแล้ว
                            </button>
                        </li>
                    </>
                )
            case 'bfprocess': //สพ.แล้ว รอนจ.
                return (
                    <>
                        <li>
                            <button
                                className="btn btn-primary btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('wait')}>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="fa-fw"
                                />{' '}
                                ว่าง
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-info btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('incomplete')}>
                                <FontAwesomeIcon
                                    icon={faFileCirclePlus}
                                    className="fa-fw"
                                />{' '}
                                รอทำ สย. ส่งตัวคนงาน
                            </button>
                        </li>
                    </>
                )
            case 'export': //ไม่รับงาน
                return (
                    <>
                        <li>
                            <button
                                className="btn button-js btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('wait')}>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="fa-fw"
                                />{' '}
                                ว่าง
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-error text-white btn-lg font-bold mx-3 text-3xl rounded-full"
                                onClick={() => handleOpenModal('newupdate')}>
                                <FontAwesomeIcon
                                    icon={faPersonWalkingArrowLoopLeft}
                                    className="fa-fw"
                                />{' '}
                                รับงานใหม่
                            </button>
                        </li>
                    </>
                )
            default:
                return null
        }
    }
    const updateWorkerStatus = async (newStatus, statusDetail, empId) => {
        try {
            setLoading(true)

            if (!router.query.id) {
                throw new Error('Missing worker ID.')
            }

            if (!statusDetail) {
                statusDetail = '-'
            }
            //console.log('Sending Data:', {newStatus,statusDetail,empId,})
            // เรียกใช้ API ที่นี่เพื่ออัพเดทสถานะ worker
            const response = await fetch(`${f_url}/api/updatestatus`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    save_status: newStatus,
                    save_detail: statusDetail,
                    save_empid: empId,
                    save_wk: router.query.id,
                }),
            })

            const data = await response.json()
            if (!response.ok) {
                // ตรวจสอบกรณีที่ไม่สำเร็จ
                throw new Error(`Error: ${data.message || 'Unknown error'}`)
            } else {
                toast.success('อัพเดทสถานะเรียบร้อยแล้ว', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
                await fetchData(false)
            }

            //console.log('Update successful:', data)
            // ทำสิ่งที่ต้องการเมื่อการอัพเดทสำเร็จ
        } catch (error) {
            //console.error('Error updating worker status:', error.message)
            toast.error(
                'ไม่สามารถอัพเดทสถานะได้เนื่องจากติดสถานะท่านอื่นแล้ว',
                {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                },
            )
        } finally {
            setLoading(false) // ปิด popup loading ไม่ว่าจะสำเร็จหรือมี error
        }
    }

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true)
    }

    // Function to close the delete modal
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }

    const handleOpenPaymentLogModal = async () => {
        try {
            const paymentApiUrl = `${f_url}/api/i_taxs?token=${token}&id=${data?.worker_id}`
            const paymentResponse = await axios.get(paymentApiUrl)
            setPaymentLogs(paymentResponse.data)
            setIsPaymentLogModalOpen(true)
        } catch (error) {
            toast.error('Error fetching payment logs', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const handleClosePaymentLogModal = () => {
        setIsPaymentLogModalOpen(false)
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
                        'bg-gradient-to-t from-slate-900 to-slate-700 text-white ',
                    text: 'ว่างงาน',
                }
            case 'save':
                return {
                    styles:
                        'bg-gradient-to-t from-amber-200 to-yellow-500 text-slate-900',
                    text: 'จอง',
                }
            case 'incomplete':
                return {
                    styles:
                        'bg-gradient-to-t from-indigo-500 to-blue-500 text-white',
                    text: 'รอทำสัญญา',
                }
            case 'woker':
                return {
                    styles:
                        'bg-gradient-to-r from-emerald-400 to-cyan-400 text-white',
                    text: 'ได้งานแล้ว',
                }
            case 'retry':
                return {
                    styles:
                        'bg-gradient-to-t from-violet-500 to-purple-500 text-white',
                    text: 'เคลม',
                }
            case 'changepp':
                return {
                    styles:
                        'bg-gradient-to-t from-slate-300 to-slate-500 text-black',
                    text: 'เปลี่ยน',
                }
            case 'bfprocess':
                return {
                    styles:
                        'bg-gradient-to-t from-blue-200 to-cyan-200 text-slate-700',
                    text: 'สพ.แล้ว',
                }
            case 'export':
                return {
                    styles:
                        'bg-gradient-to-t from-rose-400 to-red-500 text-white',
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
    const [isModalOpen2, setIsModalOpen2] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const datapacks = data?.datapacks || []
    const [newStatus, setNewStatus] = useState('')
    const [statusDetail, setStatusDetail] = useState('')

    const handleImageClick = imageUrl => {
        setSelectedImage(imageUrl)
        setIsModalOpen(true)
    }

    const handleDeleteWorker = async () => {
        try {
            if (!data?.worker_id || !empId) {
                throw new Error('Missing worker ID or employee ID.')
            }

            const response = await fetch(`${f_url}/api/d_worker`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wid: data.worker_id,
                    emp_id: empId,
                }),
            })

            const result = await response.json()
            if (!response.ok) {
                throw new Error(result.message || 'Unknown error')
            }
            toast.success('Worker deleted successfully!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            setIsDeleteModalOpen(false)
            router.push('/dashboard') // Redirect to the dashboard or any desired page after deletion
        } catch (error) {
            toast.error(`Error:. ${error.message}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const handlePrintApplication = async () => {
        try {
            if (!data?.worker_id) {
                throw new Error('Missing worker ID.')
            }

            // Construct the URL for downloading the DOCX file
            const docxApiUrl = `${f_url}/api/i_pdf?token=${token}&id=${data.worker_id}`

            // Set the window location to the API URL to start the download
            window.location.href = docxApiUrl
        } catch (error) {
            toast.error(`Error: ${error.message}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const handleOpenModal = status => {
        setNewStatus(status) // เก็บสถานะที่กดปุ่ม
        setIsModalOpen2(true) // เปิด Modal
    }

    const handleCloseModal = () => {
        setIsModalOpen2(false)
        setStatusDetail('') // เคลียร์ข้อมูล statusDetail
    }

    const handleSubmitStatus = () => {
        updateWorkerStatus(newStatus, statusDetail, empId)
        handleCloseModal()
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedImage(null)
    }
    return (
        <AppLayout>
            <ToastContainer />
            {loading ? (
                <Loading />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[30%,70%] xl:grid-cols-[30%,70%] 2xl:grid-cols-[20%,80%]">
                    <div className="col-span-1 bg-gray-300 dark:glass">
                        <div className="flex flex-col content-around h-full text-bold overflow-y-auto">
                            <h1 className="font-black text-3xl subpixel-antialiased bg-gray-600 dark:glass text-white dark:text-gray-800 text-center py-2">
                                {data?.worker_id}
                            </h1>
                            <figure className="p-5 w-full">
                                <img
                                    src={`${f_url}/${data?.worker_image}`}
                                    alt={data?.worker_fullname}
                                    className="rounded-box shadow-lg bg-white p-1 w-full"
                                    style={{
                                        height: '320px', // กำหนดความสูงที่ต้องการ
                                        objectFit: 'cover', // ทำให้รูปไม่บิดเบือนแต่ยังครอบคลุมพื้นที่
                                    }}
                                />
                            </figure>
                            <div className="text-center mx-5 mb-5">
                                <h1 className="text-5xl font-black dark:text-white mb-2">
                                    {data?.worker_nickname}
                                </h1>
                                <p className="mx-auto bg-gray-800 text-white text-sm font-semibold px-2.5 py-0.5 rounded-full">
                                    <FontAwesomeIcon
                                        icon={faSyringe}
                                        className="fa-fw"
                                    />{' '}
                                    ฉีดวัคซีน {data?.worker_covid} เข็ม
                                </p>
                                {data?.worker_namelist === 1 ? (
                                    <span className="mx-auto bg-red-100 text-red-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                                        <FontAwesomeIcon
                                            icon={faFileExcel}
                                            className="fa-fw"
                                        />{' '}
                                        NameList
                                    </span>
                                ) : null}
                                {data?.worker_duo &&
                                data?.worker_duo !== '-' &&
                                data?.worker_duo !== '0' ? (
                                    <Link
                                        href={`/${getname}/info/${data?.worker_duo}`}>
                                        <span className="mx-1 bg-rose-100 text-rose-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                                            <FontAwesomeIcon
                                                icon={faChildren}
                                                className="fa-fw"
                                            />{' '}
                                            งานคู่ {data?.worker_duo}
                                        </span>
                                    </Link>
                                ) : null}
                            </div>
                            <div className="bg-white shadow-lg rounded-box my-1 p-2 mx-5">
                                <h2 className="text-xl font-bold flex justify-center items-center">
                                    {data?.worker_nationality} /{' '}
                                    {data?.worker_race}
                                </h2>
                            </div>
                            <div className="mx-auto my-2">
                                <button
                                    className="btn btn-circle shadow-lg m-2 bg-white hover:bg-gray-200 text-black hover:text-blue-800 tooltip tooltip-bottom"
                                    data-tip="ปริ๊นใบสมัคร"
                                    onClick={handlePrintApplication}>
                                    <FontAwesomeIcon
                                        icon={faPrint}
                                        className="fa-2x"
                                    />
                                </button>
                                <button
                                    className="btn btn-circle shadow-lg m-2 bg-white hover:bg-gray-200 text-black hover:text-blue-800 tooltip tooltip-bottom"
                                    data-tip="อัพโหลดรูป">
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        className="fa-2x"
                                    />
                                </button>
                                <button
                                    className="btn btn-circle shadow-lg m-2 bg-white hover:bg-gray-200 text-black hover:text-blue-800 tooltip tooltip-bottom"
                                    data-tip="อัพโหลดคลิป">
                                    <FontAwesomeIcon
                                        icon={faVideo}
                                        className="fa-2x"
                                    />
                                </button>
                                <button
                                    className="btn btn-circle shadow-lg m-2 bg-white hover:bg-gray-200 text-black hover:text-blue-800 tooltip tooltip-bottom"
                                    data-tip="การ์ด"
                                    onClick={handleOpenCardModal}>
                                    <FontAwesomeIcon
                                        icon={faIdCard}
                                        className="fa-2x"
                                    />
                                </button>
                            </div>
                            <div className="mx-auto my-2">
                                <div className="drawer drawer-end">
                                    <input
                                        id="my-drawer-4"
                                        type="checkbox"
                                        className="drawer-toggle"
                                    />
                                    <div className="drawer-content justify-center items-center">
                                        <label
                                            htmlFor="my-drawer-4"
                                            className="drawer-button btn btn-wide btn-lg shadow-lg m-2 text-3xl text-white text-shadow-sm bg-gradient-to-r from-blue-500 to-blue-700 rounded-full tooltip tooltip-bottom flex justify-center items-center"
                                            data-tip="ดำเนินการ">
                                            <FontAwesomeIcon
                                                icon={faAnglesRight}
                                                fade
                                                className="fa-fw me-1"
                                            />
                                            ดำเนินการ
                                        </label>
                                    </div>
                                    <div className="drawer-side z-30">
                                        <label
                                            htmlFor="my-drawer-4"
                                            aria-label="close sidebar"
                                            className="drawer-overlay">
                                            {' '}
                                        </label>
                                        <ul className="menu menu-lg bg-base-200 text-base-content min-h-full w-1/4 p-4 space-y-4">
                                            <li className="menu-title text-xl text-center">
                                                ดำเนินการ
                                            </li>
                                            {/* Sidebar content here */}
                                            {renderButtons(data?.worker_status)}
                                        </ul>
                                    </div>
                                    {isModalOpen2 && (
                                        <div className="modal modal-open">
                                            <div className="modal-box text-center">
                                                <h2 className="text-2xl font-bold mb-4">
                                                    รายละเอียดสถานะ
                                                </h2>
                                                <textarea
                                                    className="textarea textarea-bordered  text-lg w-full"
                                                    placeholder="โปรดระบุเหตุผลทุกครั้ง"
                                                    value={statusDetail}
                                                    onChange={e =>
                                                        setStatusDetail(
                                                            e.target.value,
                                                        )
                                                    }>
                                                    {' '}
                                                </textarea>
                                                <div className="modal-action text-center">
                                                    <button
                                                        className="btn btn-lg btn-1/2 button-js"
                                                        onClick={
                                                            handleSubmitStatus
                                                        }>
                                                        บันทึก
                                                    </button>
                                                    <button
                                                        className="btn btn-lg btn-error text-white"
                                                        onClick={
                                                            handleCloseModal
                                                        }>
                                                        ยกเลิก
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white">
                        <div className="flex justify-center my-3">
                            <div className="flex space-x-5 text-xl bg-white shadow-lg rounded-full mx-3 px-5 font-bold">
                                <button
                                    className="text-gray-600 py-3"
                                    onClick={handleWorkLogClick}>
                                    การทำรายการ
                                </button>
                                <button
                                    className="text-gray-600 py-3"
                                    onClick={handleContractLogClick}>
                                    การทำสัญญา
                                </button>
                                <button
                                    className="text-gray-600 py-3"
                                    onClick={handleOpenPaymentLogModal}>
                                    การชำระเงิน
                                </button>
                                {profile?.role != 2 && (
                                    <button className="text-gray-600 py-3">
                                        ตั้งค่าคนงาน
                                    </button>
                                )}
                                {profile?.role != 2 && (
                                    <button
                                        className="text-red-600 py-3"
                                        onClick={handleDeleteClick}>
                                        ลบคนงาน
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap px-5 py-3">
                            <div className="w-full py-3 pr-0 sm:w-1/2 pb-0 sm:pr-2">
                                <div className="bg-white text-gray-800 dark:bg-gray-400 rounded-box p-5 shadow-sm mb-3">
                                    <h2 className="text-xl font-bold mb-4">
                                        <FontAwesomeIcon
                                            icon={faCircleInfo}
                                            className="fa-fw"
                                        />{' '}
                                        ข้อมูลประวัติ
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
                                        {/* เพศ */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                เพศ
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
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

                                        {/* น้ำหนัก */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                <FontAwesomeIcon
                                                    icon={faWeightScale}
                                                    className="fa-fw"
                                                />{' '}
                                                น้ำหนัก
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
                                                {data?.worker_weight}กก.
                                            </span>
                                        </div>

                                        {/* ส่วนสูง */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                <FontAwesomeIcon
                                                    icon={faTextHeight}
                                                    className="fa-fw"
                                                />{' '}
                                                ส่วนสูง
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
                                                {data?.worker_height}ซม.
                                            </span>
                                        </div>

                                        {/* อายุ */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                <FontAwesomeIcon
                                                    icon={faCakeCandles}
                                                    className="fa-fw"
                                                />{' '}
                                                อายุ
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
                                                {age} ปี
                                            </span>
                                        </div>

                                        {/* ที่อยู่ */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                ที่อยู่
                                            </h4>
                                            <span className="mt-2 text-lg font-medium text-gray-700">
                                                {data?.worker_address}
                                            </span>
                                        </div>

                                        {/* สถานะ */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                สถานะ
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
                                                {data?.worker_relationship ===
                                                '1'
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

                                        {/* ลูก */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                ลูก
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
                                                {data?.worker_baby === null
                                                    ? 'ไม่มี'
                                                    : data?.worker_baby}
                                            </span>
                                        </div>

                                        {/* อยู่ไทยมา */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                อยู่ไทยมา
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
                                                {data?.worker_inthai === '0'
                                                    ? 'ตั้งแต่เกิด'
                                                    : data?.worker_inthai}
                                            </span>
                                        </div>

                                        {/* ศาสนา */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                ศาสนา
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
                                                {data?.worker_religion}
                                            </span>
                                        </div>

                                        {/* วันเกิด */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                วันเกิด
                                            </h4>
                                            <span className="mt-2 text-lg font-medium text-gray-700">
                                                {formatDate(birthday)}
                                            </span>
                                        </div>

                                        {/* รูปแบบ */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                รูปแบบ
                                            </h4>
                                            <span className="mt-2 text-lg font-medium text-gray-700">
                                                {data?.worker_overnight === 1
                                                    ? 'อยู่ประจำ'
                                                    : 'ไป-กลับ'}
                                            </span>
                                        </div>

                                        {/* เดินทาง */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                เดินทาง
                                            </h4>
                                            <span className="mt-2 text-lg font-medium text-gray-700">
                                                {data?.worker_outside === 1
                                                    ? 'ไปได้ทุกที่'
                                                    : 'ในพื้นที่อยู่เท่านั้น'}
                                            </span>
                                        </div>

                                        {/* ทราบข่าวจาก */}
                                        <div className="px-4">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                ทราบข่าวจาก
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
                                                {data?.worker_knownews}
                                            </span>
                                        </div>

                                        {/* หมายเหตุ */}
                                        <div className="px-4 col-span-1 lg:col-span-1 2xl:col-span-2 ">
                                            <h4 className="text-gray-800 text-sm font-semibold">
                                                หมายเหตุ
                                            </h4>
                                            <span className="mt-2 text-2xl font-medium text-gray-700">
                                                {data?.worker_detailother}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Section for เบอร์ติดต่อ and เบอร์สำรอง */}
                                    <div className="flex flex-wrap w-full mt-3 p-3">
                                        <div className="grid flex-grow place-items-center">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                <FontAwesomeIcon
                                                    icon={faSquarePhone}
                                                    className="fa-fw"
                                                />{' '}
                                                เบอร์ติดต่อ
                                            </h3>
                                            <a
                                                href={`tel:${data?.worker_phone}`}>
                                                <kbd className="kbd text-3xl font-bold text-gray-800">
                                                    {data?.worker_phone}
                                                </kbd>
                                            </a>
                                        </div>
                                        <div className="grid flex-grow place-items-center">
                                            <h3 className="text-xl font-bold  text-gray-800">
                                                <FontAwesomeIcon
                                                    icon={faMobileScreenButton}
                                                    className="fa-fw"
                                                />{' '}
                                                เบอร์สำรอง
                                            </h3>
                                            <a
                                                href={`tel:${data?.worker_phone2}`}>
                                                <kbd className="kbd text-3xl font-bold text-gray-800">
                                                    {data?.worker_phone2}
                                                </kbd>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-100 h-56 m-auto shadow-lg bg-red-100 rounded-xl relative text-white mb-3">
                                    <img
                                        className="relative object-cover w-full h-full rounded-xl"
                                        src="/images/passport.png"
                                    />

                                    <div className="w-full px-8 absolute pb-7 top-3">
                                        <div className="flex justify-between">
                                            <div className="">
                                                <p className="font-light">
                                                    ชื่อ
                                                </p>
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

                                        <div className="py-2">
                                            <div className="flex justify-between">
                                                <div className="">
                                                    <p className="font-light text-xs text-xs">
                                                        หมดอายุ
                                                    </p>
                                                    <p className="font-medium tracking-wider text-sm">
                                                        {
                                                            data?.worker_wpcard_exp
                                                        }
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
                                                        {
                                                            data?.worker_passport_exp
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-white text-gray-800 dark:bg-gray-400 rounded-box p-6 shadow-sm mb-3">
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
                                                            {
                                                                data?.workexp_position1
                                                            }
                                                        </p>
                                                        <p className="text-sm">
                                                            {
                                                                data?.workexp_detail1
                                                            }
                                                        </p>
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
                                                            {
                                                                data?.workexp_position2
                                                            }
                                                        </p>
                                                        <p className="text-sm">
                                                            {
                                                                data?.workexp_detail2
                                                            }
                                                        </p>
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
                                                            {
                                                                data?.workexp_position3
                                                            }
                                                        </p>
                                                        <p className="text-sm">
                                                            {
                                                                data?.workexp_detail3
                                                            }
                                                        </p>
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
                                                            {
                                                                data?.workexp_position4
                                                            }
                                                        </p>
                                                        <p className="text-sm">
                                                            {
                                                                data?.workexp_detail4
                                                            }
                                                        </p>
                                                    </div>
                                                    <hr />
                                                </li>
                                            ) : null}
                                        </ul>
                                    </div>
                                    <div className="bg-white text-gray-800 dark:bg-gray-400 rounded-box p-6 shadow-sm mb-3">
                                        <h2 className="text-xl font-bold mb-4">
                                            <FontAwesomeIcon
                                                icon={faBusinessTime}
                                                className="fa-fw"
                                            />{' '}
                                            ประวัติรับงานจากบริษัท
                                        </h2>
                                        <ul className="timeline timeline-vertical">
                                            {logData.length === 0 ? (
                                                <>
                                                    <div
                                                        role="alert"
                                                        className="alert">
                                                        <FontAwesomeIcon
                                                            icon={faCircleInfo}
                                                            className="fa-fw"
                                                        />
                                                        <span>
                                                            ยังไม่มีข้อมูล
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                logData.map((log, index) => (
                                                    <li key={index}>
                                                        <div className="timeline-start">
                                                            {log.logs_tmpsyid}
                                                        </div>
                                                        <div className="timeline-middle">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faCircleCheck
                                                                }
                                                                className="fa-fw"
                                                            />
                                                        </div>
                                                        <div className="timeline-end timeline-box">
                                                            <p className="underline p-0">
                                                                {
                                                                    log.sy_position
                                                                }
                                                            </p>
                                                            <p className="text-sm">
                                                                {
                                                                    log.sy_master_address
                                                                }
                                                            </p>
                                                        </div>
                                                        <hr />
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
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
                                                <h2 className="text-4xl font-bold mb-2">
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
                                                                className={`font-bold text-shadow`}>
                                                                {text}
                                                            </p>
                                                        )
                                                    })()}
                                                </h2>
                                                <p className="font-semibold text-black rounded-box shadow px-2 bg-white mb-2">
                                                    {data?.worker_status_detail}
                                                </p>
                                                <p className="text-xs text-white">
                                                    อัพเดทล่าสุด{' '}
                                                    {formatDate(
                                                        workerStatusDate,
                                                    )}
                                                </p>
                                            </div>
                                            {empData ? (
                                                <div>
                                                    <img
                                                        className="rounded-2xl glass right-6 -mt-12 z-10 w-32 h-32 shadow"
                                                        src={
                                                            empData.profile_photo_path
                                                                ? `https://server.wb.in.th/${empData.profile_photo_path}`
                                                                : '/images/blank-picture.webp'
                                                        }
                                                        alt={
                                                            empData?.id ||
                                                            'No image available'
                                                        } // แสดงข้อความสำรองหากไม่มี empData.id
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
                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                    <div className="bg-white text-gray-800 dark:bg-gray-400 rounded-box shadow-sm p-6 mb-3">
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
                                                        .map(
                                                            (
                                                                datapack,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        datapack.id
                                                                    }
                                                                    className="relative">
                                                                    <img
                                                                        src={
                                                                            datapack.values
                                                                                ? `${f_url}/${datapack.values}`
                                                                                : '/images/blank-picture.webp'
                                                                        }
                                                                        alt={`รูปที่ ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className={`w-36 h-36 object-cover ${
                                                                            index ===
                                                                            0
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
                                                            ),
                                                        )}
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
                                                            onClick={
                                                                closeModal
                                                            }>
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
                                    <div className="bg-white text-gray-800 dark:bg-gray-400 rounded-box p-6 shadow-sm mb-3">
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
                                                <li className="bg-white text-gray-800 dark:text-white dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between border border-b-4 hover:border-blue-800">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-gray-300">
                                                            <FontAwesomeIcon
                                                                icon={faBars}
                                                                className="text-2xl"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold">
                                                                {
                                                                    data?.workposition_id1
                                                                }
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="badge badge-outline">
                                                            {' '}
                                                            {Number(
                                                                data?.workposition_salary1,
                                                            )?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                            {data?.workposition_id2 !== '-' && (
                                                <li className="bg-white text-gray-800 dark:text-white dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between border border-b-4 hover:border-blue-800">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-gray-300">
                                                            <FontAwesomeIcon
                                                                icon={faBars}
                                                                className="text-2xl"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold">
                                                                {
                                                                    data?.workposition_id2
                                                                }
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="badge badge-outline">
                                                            {' '}
                                                            {Number(
                                                                data?.workposition_salary2,
                                                            )?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                            {data?.workposition_id3 !== '-' && (
                                                <li className="bg-white text-gray-800 dark:text-white dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between border border-b-4 hover:border-blue-800">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-gray-300">
                                                            <FontAwesomeIcon
                                                                icon={faBars}
                                                                className="text-2xl"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold">
                                                                {
                                                                    data?.workposition_id3
                                                                }
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="badge badge-outline">
                                                            {' '}
                                                            {Number(
                                                                data?.workposition_salary3,
                                                            )?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                            {data?.workposition_id4 !== '-' && (
                                                <li className="bg-white text-gray-800 dark:text-white dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between border border-b-4 hover:border-blue-800">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-gray-300 ">
                                                            <FontAwesomeIcon
                                                                icon={faBars}
                                                                className="text-2xl"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold">
                                                                {
                                                                    data?.workposition_id4
                                                                }
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="badge badge-outline">
                                                            {' '}
                                                            {Number(
                                                                data?.workposition_salary4,
                                                            )?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-white text-gray-800 dark:bg-gray-400 rounded-box p-6 shadow-sm mb-3">
                                    <h2 className="text-xl font-bold mb-4">
                                        <FontAwesomeIcon
                                            icon={faBroom}
                                            className="fa-fw"
                                        />{' '}
                                        ทักษะ
                                    </h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
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
                                                        {data?.worker_skill1 ===
                                                        '1'
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
                                                        {data?.worker_skill2 ===
                                                        '1'
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
                                                        {data?.worker_skill3 ===
                                                        '1'
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
                                                    {
                                                        data?.worker_skill_fooddetail
                                                    }
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
                                                    {data?.worker_verysick ===
                                                    '0'
                                                        ? 'ไม่ป่วย'
                                                        : 'เคยป่วยหนัก'}
                                                </div>
                                                <div className="text-xs font-semibold text-gray-400">
                                                    {
                                                        data?.worker_verysick_detail
                                                    }
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
                                                    {data?.worker_drinksmork ===
                                                    '0'
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
                                <div className="bg-white text-gray-800 dark:bg-gray-400 rounded-box p-6 shadow-sm mb-3">
                                    <h2 className="text-xl font-bold mb-4">
                                        <FontAwesomeIcon
                                            icon={faFlagCheckered}
                                            className="fa-fw"
                                        />{' '}
                                        ภาษา
                                    </h2>
                                    {/* Repeat this for each education item */}

                                    <div className="stats dark:bg-gray-700 stats-vertical lg:stats-horizontal w-full">
                                        <div className="stat p-3">
                                            <div className="stat-title dark:text-white text-2xl font-semibold text-center">
                                                ไทย
                                            </div>
                                            <div className="stat-desc dark:text-white text-lg">
                                                {data?.worker_landth_talk ===
                                                0 ? (
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
                                                {data?.worker_landth_view ===
                                                0 ? (
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
                                                {data?.worker_landth_write ===
                                                0 ? (
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
                                            <div className="stat-title dark:text-white text-2xl font-semibold text-center">
                                                อังกฤษ
                                            </div>
                                            <div className="stat-desc dark:text-white text-lg">
                                                {data?.worker_landen_talk ===
                                                0 ? (
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
                                                {data?.worker_landen_view ===
                                                0 ? (
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
                                                {data?.worker_landen_write ===
                                                0 ? (
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
                                            <div className="stat-title dark:text-white text-2xl font-semibold text-center">
                                                อื่นๆ
                                            </div>
                                            <div className="stat-desc dark:text-white text-lg text-center">
                                                {data?.worker_landother}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Card Profile Image correctly */}
                    {isCardModalOpen && (
                        <div className="modal modal-open ">
                            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
                                {' '}
                            </div>
                            <div className="modal-box max-w-7xl h-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold text-white text-shadow-sm">
                                        <FontAwesomeIcon
                                            icon={faGripLinesVertical}
                                            className="fa-fw me-1"
                                        />
                                        บัตรประจำตัวคนงาน
                                    </h2>
                                    <button
                                        className="text-white text-2xl"
                                        onClick={handleCloseCardModal}>
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            className="fa-lg"
                                        />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {/* Profile Image */}
                                    <div className="col-span-1 bg-white text-black rounded-lg shadow-lg relative">
                                        <img
                                            src={`${f_url}/${datapacks[0]?.values}`}
                                            alt="Worker"
                                            className="w-full h-full rounded-lg"
                                        />
                                        <div className="absolute inset-0 flex flex-col justify-between p-4 ">
                                            <div>
                                                <h3 className="text-4xl font-bold text-gray-800 text-center text-shadow-sm">
                                                    รหัส: {data.worker_id}
                                                </h3>
                                                <p className="text-green-600 w-1/2 font-semibold bg-white bg-opacity-70 flex justify-center rounded-full p-1 mt-1 text-center mx-auto">
                                                    <FontAwesomeIcon
                                                        icon={faCheckCircle}
                                                        className="fa-lg me-1"
                                                    />
                                                    ตรวจโควิดแล้ว
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-2xl font-bold text-white text-shadow-sm">
                                                    แอดไลน์สอบถาม
                                                </h3>
                                                <p className="text-green-600 text-2xl font-bold bg-black bg-opacity-55 shadow-lg rounded-full px-2">
                                                    @maid2013
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Section */}
                                    <div className="col-span-2 bg-white text-black rounded-lg p-4 shadow-lg">
                                        <h3 className="text-xl font-bold mb-2 badge badge-lg">
                                            ข้อมูลส่วนตัว
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4 bg-gray-100 p-2 rounded-lg">
                                            <div>
                                                <p>
                                                    ชื่อเล่น:{' '}
                                                    <span className="font-semibold">
                                                        {data.worker_nickname}
                                                    </span>
                                                </p>
                                                <p>
                                                    สัญชาติ:{' '}
                                                    <span className="font-semibold">
                                                        {
                                                            data.worker_nationality
                                                        }
                                                    </span>
                                                </p>
                                                <p>
                                                    น้ำหนัก:{' '}
                                                    <span className="font-semibold">
                                                        {data.worker_weight} kg
                                                    </span>
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    อายุ:{' '}
                                                    <span className="font-semibold">
                                                        {new Date().getFullYear() -
                                                            new Date(
                                                                data.worker_birthday,
                                                            ).getFullYear()}{' '}
                                                        ปี
                                                    </span>
                                                </p>
                                                <p>
                                                    ศาสนา:{' '}
                                                    <span className="font-semibold">
                                                        {data.worker_religion}
                                                    </span>
                                                </p>
                                                <p>
                                                    ส่วนสูง:{' '}
                                                    <span className="font-semibold">
                                                        {data.worker_height} cm
                                                    </span>
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    ในไทยมา:{' '}
                                                    <span className="font-semibold">
                                                        {data.worker_inthai}
                                                    </span>
                                                </p>
                                                <p>
                                                    ที่อยู่:{' '}
                                                    <span className="font-semibold">
                                                        {data.worker_address}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-2 badge badge-lg">
                                                    ทักษะภาษา
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-gray-100 rounded-lg p-2">
                                                        <h4 className="font-bold">
                                                            ภาษาไทย
                                                        </h4>
                                                        <p>
                                                            พูด:{' '}
                                                            <span
                                                                className={
                                                                    data.worker_landth_talk ===
                                                                    '1'
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }>
                                                                {data.worker_landth_talk ===
                                                                '1'
                                                                    ? 'ได้'
                                                                    : 'ไม่ได้'}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            อ่าน:{' '}
                                                            <span
                                                                className={
                                                                    data.worker_landth_view ===
                                                                    '1'
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }>
                                                                {data.worker_landth_view ===
                                                                '1'
                                                                    ? 'ได้'
                                                                    : 'ไม่ได้'}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            เขียน:{' '}
                                                            <span
                                                                className={
                                                                    data.worker_landth_write ===
                                                                    '1'
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }>
                                                                {data.worker_landth_write ===
                                                                '1'
                                                                    ? 'ได้'
                                                                    : 'ไม่ได้'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div className="bg-gray-100 rounded-lg p-2">
                                                        <h4 className="font-bold">
                                                            ภาษาอังกฤษ
                                                        </h4>
                                                        <p>
                                                            พูด:{' '}
                                                            <span
                                                                className={
                                                                    data.worker_landen_talk ===
                                                                    '1'
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }>
                                                                {data.worker_landen_talk ===
                                                                '1'
                                                                    ? 'ได้'
                                                                    : 'ไม่ได้'}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            อ่าน:{' '}
                                                            <span
                                                                className={
                                                                    data.worker_landen_view ===
                                                                    '1'
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }>
                                                                {data.worker_landen_view ===
                                                                '1'
                                                                    ? 'ได้'
                                                                    : 'ไม่ได้'}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            เขียน:{' '}
                                                            <span
                                                                className={
                                                                    data.worker_landen_write ===
                                                                    '1'
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }>
                                                                {data.worker_landen_write ===
                                                                '1'
                                                                    ? 'ได้'
                                                                    : 'ไม่ได้'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-bold mb-2 badge badge-lg">
                                                    ความสามารถ/บุคลิกภาพ
                                                </h3>
                                                <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-lg p-2">
                                                    <p>
                                                        อาหารไทย:{' '}
                                                        <span className="font-semibold">
                                                            {data.worker_skill_foodlevel ===
                                                            '1'
                                                                ? 'ได้เบื้องต้น'
                                                                : data.worker_skill_foodlevel ===
                                                                  '2'
                                                                ? 'ได้ตามสั่ง'
                                                                : 'ไม่ได้'}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        ขี่จักรยาน:{' '}
                                                        <span
                                                            className={
                                                                data.worker_skill1 ===
                                                                '1'
                                                                    ? 'text-green-600'
                                                                    : 'text-red-600'
                                                            }>
                                                            {data.worker_skill1 ===
                                                            '1'
                                                                ? 'ได้'
                                                                : 'ไม่ได้'}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        ขี่จักรยานยนต์:{' '}
                                                        <span
                                                            className={
                                                                data.worker_skill2 ===
                                                                '1'
                                                                    ? 'text-green-600'
                                                                    : 'text-red-600'
                                                            }>
                                                            {data.worker_skill2 ===
                                                            '1'
                                                                ? 'ได้'
                                                                : 'ไม่ได้'}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        ขับรถยนต์:{' '}
                                                        <span
                                                            className={
                                                                data.worker_skill3 ===
                                                                '1'
                                                                    ? 'text-green-600'
                                                                    : 'text-red-600'
                                                            }>
                                                            {data.worker_skill3 ===
                                                            '1'
                                                                ? 'ได้'
                                                                : 'ไม่ได้'}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        เมารถ/เรือ:{' '}
                                                        <span className="font-semibold">
                                                            {data.worker_boathunk ===
                                                            '1'
                                                                ? 'มีปัญหา'
                                                                : 'ไม่เมา'}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        หมา/แมว:{' '}
                                                        <span className="font-semibold">
                                                            {data.worker_smalldog ===
                                                                '1' &&
                                                            data.worker_bigdog ===
                                                                '1'
                                                                ? 'ไม่กลัว'
                                                                : 'กลัว'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold mt-4 mb-2 badge badge-lg">
                                            ประวัติการทำงาน
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {data.workexp_name1 && (
                                                <div className="p-2 bg-gray-100 rounded-lg shadow-sm">
                                                    <p className="font-bold">
                                                        {data.workexp_position1}
                                                    </p>
                                                    <p>
                                                        {data.workexp_name1} -{' '}
                                                        {data.workexp_time1}
                                                    </p>
                                                    <p className="text-sm">
                                                        {data.workexp_detail1}
                                                    </p>
                                                </div>
                                            )}
                                            {data.workexp_name2 && (
                                                <div className="p-2 bg-gray-100 rounded-lg shadow-sm">
                                                    <p className="font-bold">
                                                        {data.workexp_position2}
                                                    </p>
                                                    <p>
                                                        {data.workexp_name2} -{' '}
                                                        {data.workexp_time2}
                                                    </p>
                                                    <p className="text-sm">
                                                        {data.workexp_detail2}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Payment Log Modal */}
                    {isPaymentLogModalOpen && (
                        <div className="modal modal-open">
                            <div className="modal-box max-w-4xl w-full">
                                <h2 className="text-lg font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faGripLinesVertical}
                                        className="fa-fw me-1"
                                    />
                                    การชำระเงิน
                                </h2>
                                {paymentLogs.length === 0 ? (
                                    <p>ยังไม่มีข้อมูลการชำระเงิน</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">
                                                        ผู้ใช้
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        หมายเหตุ
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        วันที่
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        จำนวนเงิน (บาท)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paymentLogs.map(
                                                    (log, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-100">
                                                            <td className="border px-4 py-2">
                                                                {log.tax_uid}
                                                            </td>
                                                            <td className="border px-4 py-2">
                                                                {log.tax_comment ||
                                                                    'ไม่มีหมายเหตุ'}
                                                            </td>
                                                            <td className="border px-4 py-2">
                                                                {new Date(
                                                                    log.tax_date,
                                                                ).toLocaleString()}
                                                            </td>
                                                            <td className="border px-4 py-2 text-right">
                                                                {log.tax_value.toLocaleString()}{' '}
                                                                บาท
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                                {/* Total Row */}
                                                <tr className="font-bold">
                                                    <td
                                                        colSpan="3"
                                                        className="border px-4 py-2 text-right">
                                                        ยอดรวมทั้งหมด
                                                        (ที่ยังไม่ได้ชำระ)
                                                    </td>
                                                    <td className="border px-4 py-2 text-right">
                                                        {paymentLogs
                                                            .reduce(
                                                                (total, log) =>
                                                                    total +
                                                                    log.tax_value,
                                                                0,
                                                            )
                                                            .toLocaleString()}{' '}
                                                        บาท
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                <div className="modal-action">
                                    <button
                                        className="btn"
                                        onClick={handleClosePaymentLogModal}>
                                        ปิด
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Work Log Modal */}
                    {isWorkLogModalOpen && (
                        <div className="modal modal-open">
                            <div className="modal-box areamax-w-4xl w-full">
                                <button
                                    onClick={handleCloseWorkLogModal}
                                    className="absolute top-6 right-3 text-gray-500 hover:text-gray-700">
                                    <FontAwesomeIcon
                                        icon={faCircleXmark}
                                        className="fa-lg"
                                    />
                                </button>
                                <h2 className="text-lg font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faGripLinesVertical}
                                        className="fa-fw me-1"
                                    />
                                    การทำรายการ
                                </h2>
                                {workLogs.length === 0 ? (
                                    <p>ยังไม่มีข้อมูลการทำรายการ</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">
                                                        UID
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        Status
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        Date
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        Commit
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {workLogs.map((log, index) => (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-gray-100">
                                                        <td className="border px-4 py-2">
                                                            {log.logs_tmpuid}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {
                                                                getStatusData(
                                                                    log.logs_status,
                                                                ).text
                                                            }
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {new Date(
                                                                log.created_at,
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {log.logs_comment ||
                                                                'ไม่มีความคิดเห็น'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                <div className="modal-action">
                                    <button
                                        className="btn"
                                        onClick={handleCloseWorkLogModal}>
                                        ปิด
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contract Log Modal */}
                    {isContractLogModalOpen && (
                        <div className="modal modal-open">
                            <div className="modal-box max-w-4xl w-full">
                                <h2 className="text-lg font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faGripLinesVertical}
                                        className="fa-fw me-1"
                                    />
                                    การทำสัญญา
                                </h2>
                                {logData.length === 0 ? (
                                    <p>ยังไม่มีข้อมูลการทำสัญญา</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">
                                                        ผู้ใช้
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        สถานะ
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        วันที่
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        ความคิดเห็น
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {logData.map((log, index) => (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-gray-100">
                                                        <td className="border px-4 py-2">
                                                            {log.logs_tmpuid}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {log.logs_status}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {new Date(
                                                                log.created_at,
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {log.logs_comment ||
                                                                'ไม่มีความคิดเห็น'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                <div className="modal-action">
                                    <button
                                        className="btn"
                                        onClick={handleCloseContractLogModal}>
                                        ปิด
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {isDeleteModalOpen && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h2 className="text-lg font-bold mb-4">
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="fa-fw me-1 text-error"
                                    />
                                    ยืนยันการลบ
                                </h2>
                                <p className="font-semibold">
                                    คุณต้องการลบคนงานนี้หรือไม่?
                                </p>
                                <p className="text-red-500 text-sm">
                                    **โปรดระวัง
                                    หากลบข้อมูลคนงานแล้วจะไม่สามารถกู้คืนใดๆได้อีก
                                </p>
                                <div className="modal-action">
                                    <button
                                        className="btn btn-error text-white"
                                        onClick={handleDeleteWorker}>
                                        ยืนยัน
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={handleCloseDeleteModal}>
                                        ยกเลิก
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </AppLayout>
    )
}
