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
    faCheckCircle,
    faSyringe,
    faTrashAlt,
    faFileExcel,
    faChildren,
    faUserGroup,
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
        }, 10000)
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
        if (data?.emp_id) {
            try {
                const empApiUrl = `${f_url}/api/i_emp?token=${token}&data_id=${data.emp_id}`
                const empResponse = await axios.get(empApiUrl)
                setEmpData(empResponse.data[0]) // สมมติว่าข้อมูลพนักงานเป็น item แรก
            } catch (error) {
                //console.error('Error checking for updates:', error)
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
        }
    }

    const renderButtons = worker_status => {
        switch (worker_status) {
            case 'wait':
                return (
                    <>
                        <button
                            className="btn btn-warning font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('wait')}>
                            <FontAwesomeIcon
                                icon={faUserLock}
                                className="fa-lg"
                            />{' '}
                            จอง
                        </button>
                        <button
                            className="btn btn-outline btn-primary font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('changepp')}>
                            <FontAwesomeIcon
                                icon={faRightLeft}
                                className="fa-lg"
                            />{' '}
                            เปลี่ยน
                        </button>
                        <button
                            className="btn btn-outline btn-primary font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('retry')}>
                            <FontAwesomeIcon
                                icon={faUserGroup}
                                className="fa-lg"
                            />{' '}
                            เคลม
                        </button>
                        <button
                            className="btn btn-neutral font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('export')}>
                            <FontAwesomeIcon
                                icon={faCircleXmark}
                                className="fa-lg"
                            />{' '}
                            ไม่รับงาน
                        </button>
                    </>
                )
            case 'save':
                return (
                    <>
                        <button
                            className="btn btn-primary font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('wait')}>
                            <FontAwesomeIcon icon={faUser} className="fa-lg" />{' '}
                            ว่าง
                        </button>
                        <button
                            className="btn btn-outline btn-primary font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('changepp')}>
                            <FontAwesomeIcon
                                icon={faRightLeft}
                                className="fa-lg"
                            />{' '}
                            เปลี่ยน
                        </button>
                        <button
                            className="btn btn-outline btn-primary font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('retry')}>
                            <FontAwesomeIcon
                                icon={faUserGroup}
                                className="fa-lg"
                            />{' '}
                            เคลม
                        </button>
                        <button
                            className="btn btn-info font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('incomplete')}>
                            <FontAwesomeIcon
                                icon={faPhoneVolume}
                                className="fa-lg"
                            />{' '}
                            สัมภาษณ์แล้วรอ นจ.
                        </button>
                    </>
                )
            case 'incomplete':
                return (
                    <>
                        <button
                            className="btn btn-primary font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('wait')}>
                            <FontAwesomeIcon icon={faUser} className="fa-lg" />{' '}
                            ว่าง
                        </button>
                        <button
                            className="btn btn-info font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('woker')}>
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="fa-lg"
                            />{' '}
                            ได้งานแล้ว
                        </button>
                    </>
                )
            case 'worker':
                return (
                    <button
                        className="btn btn-primary font-semibold py-1 px-4 rounded-full"
                        onClick={() => handleOpenModal('wait')}>
                        <FontAwesomeIcon icon={faUser} className="fa-lg" /> ว่าง
                    </button>
                )
            case 'retry':
                return (
                    <>
                        <button
                            className="btn btn-primary font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('wait')}>
                            <FontAwesomeIcon icon={faUser} className="fa-lg" />{' '}
                            ว่าง
                        </button>
                        <button
                            className="btn btn-success font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('woker')}>
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="fa-lg"
                            />{' '}
                            ได้งานแล้ว
                        </button>
                    </>
                )
            case 'changepp':
                return (
                    <>
                        <button
                            className="btn btn-primary font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('wait')}>
                            <FontAwesomeIcon icon={faUser} className="fa-lg" />{' '}
                            ว่าง
                        </button>
                        <button
                            className="btn btn-success font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('bfprocess')}>
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="fa-lg"
                            />{' '}
                            ได้งานแล้ว
                        </button>
                    </>
                )
            case 'bfprocess':
                return (
                    <>
                        <button
                            className="btn btn-primary font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('wait')}>
                            <FontAwesomeIcon icon={faUser} className="fa-lg" />{' '}
                            ว่าง
                        </button>
                        <button
                            className="btn btn-info font-semibold py-1 px-4 rounded-full"
                            onClick={() => handleOpenModal('woker')}>
                            <FontAwesomeIcon
                                icon={faFileCirclePlus}
                                className="fa-lg"
                            />{' '}
                            รอทำ สย. ส่งตัวคนงาน
                        </button>
                    </>
                )
            case 'export':
                return (
                    <button
                        className="btn btn-error font-semibold py-1 px-4 rounded-full"
                        onClick={() => handleOpenModal('newupdate')}>
                        <FontAwesomeIcon
                            icon={faPersonWalkingArrowLoopLeft}
                            className="fa-lg"
                        />{' '}
                        รับงานใหม่
                    </button>
                )
            default:
                return null
        }
    }
    const updateWorkerStatus = async (newStatus, statusDetail, empId) => {
        try {
            if (!router.query.id) {
                throw new Error('Missing worker ID.')
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
            }

            //console.log('Update successful:', data)
            // ทำสิ่งที่ต้องการเมื่อการอัพเดทสำเร็จ
        } catch (error) {
            //console.error('Error updating worker status:', error.message)
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
                <div className="w-full p-5">
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
                <div className="bg-gray-200">
                    <div className="w-auto bg-white shadow-lg rounded-b-lg mx-5">
                        {/* Cover Photo */}
                        <div
                            className={`relative h-48 ${(() => {
                                const { styles } = getStatusData(
                                    data?.worker_status,
                                )
                                return styles
                            })()}`}>
                            {/* Header Section with Background Image */}
                            <div className="ribbon ribbon-top-left z-40">
                                {(() => {
                                    const {
                                        styles,
                                        icon,
                                        text,
                                    } = getStatusData(data?.worker_status)
                                    return (
                                        <span
                                            className={`font-bold bg-gray-600 text-white subpixel-antialiased`}>
                                            {text}
                                        </span>
                                    )
                                })()}
                            </div>
                            <div className="flex items-center justify-around w-full h-full">
                                <div className="m-2">
                                    <h1 className="font-bold text-6xl subpixel-antialiased opacity-50">
                                        {data?.worker_id}
                                    </h1>
                                </div>
                                <div className="m-2">
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
                            </div>

                            {/* Card Profile Image correctly */}
                            {isCardModalOpen && (
                                <div className="modal modal-open ">
                                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
                                        {' '}
                                    </div>
                                    <div className="modal-box max-w-6xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white">
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
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 flex flex-col justify-between p-4 ">
                                                    <div>
                                                        <h3 className="text-4xl font-bold text-white text-center text-shadow-lg">
                                                            รหัส:{' '}
                                                            {data.worker_id}
                                                        </h3>
                                                        <p className="text-green-600 w-1/2 font-semibold bg-white bg-opacity-70 flex justify-center rounded-full p-1 mt-1 text-center mx-auto">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faCheckCircle
                                                                }
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
                                                                {
                                                                    data.worker_nickname
                                                                }
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
                                                                {
                                                                    data.worker_weight
                                                                }{' '}
                                                                kg
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
                                                                {
                                                                    data.worker_religion
                                                                }
                                                            </span>
                                                        </p>
                                                        <p>
                                                            ส่วนสูง:{' '}
                                                            <span className="font-semibold">
                                                                {
                                                                    data.worker_height
                                                                }{' '}
                                                                cm
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            ในไทยมา:{' '}
                                                            <span className="font-semibold">
                                                                {
                                                                    data.worker_inthai
                                                                }
                                                            </span>
                                                        </p>
                                                        <p>
                                                            ที่อยู่:{' '}
                                                            <span className="font-semibold">
                                                                {
                                                                    data.worker_address
                                                                }
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
                                                                {
                                                                    data.workexp_position1
                                                                }
                                                            </p>
                                                            <p>
                                                                {
                                                                    data.workexp_name1
                                                                }{' '}
                                                                -{' '}
                                                                {
                                                                    data.workexp_time1
                                                                }
                                                            </p>
                                                            <p className="text-sm">
                                                                {
                                                                    data.workexp_detail1
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                    {data.workexp_name2 && (
                                                        <div className="p-2 bg-gray-100 rounded-lg shadow-sm">
                                                            <p className="font-bold">
                                                                {
                                                                    data.workexp_position2
                                                                }
                                                            </p>
                                                            <p>
                                                                {
                                                                    data.workexp_name2
                                                                }{' '}
                                                                -{' '}
                                                                {
                                                                    data.workexp_time2
                                                                }
                                                            </p>
                                                            <p className="text-sm">
                                                                {
                                                                    data.workexp_detail2
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Positioning Profile Image correctly */}
                            <div className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2">
                                <div className="bg-white flex items-center justify-center rounded-full p-1">
                                    {/* Profile Image with gradient border and status */}
                                    <div className="rounded-full relative transition-transform transform hover:scale-105 w-48 h-48">
                                        {/* Gradient Border */}
                                        <div
                                            className={`w-full h-full rounded-full p-5 animate-spin bg-gradient-to-r ${
                                                data?.worker_status === 'wait'
                                                    ? 'from-gray-800 to-gray-400'
                                                    : data?.worker_status ===
                                                      'save'
                                                    ? 'from-yellow-300 to-yellow-600'
                                                    : data?.worker_status ===
                                                      'incomplete'
                                                    ? 'from-indigo-400 to-blue-700'
                                                    : data?.worker_status ===
                                                      'woker'
                                                    ? 'from-green-400 to-cyan-500'
                                                    : data?.worker_status ===
                                                      'retry'
                                                    ? 'from-purple-400 to-pink-600'
                                                    : data?.worker_status ===
                                                      'changepp'
                                                    ? 'from-gray-300 to-gray-500'
                                                    : data?.worker_status ===
                                                      'bfprocess'
                                                    ? 'from-blue-300 to-cyan-400'
                                                    : data?.worker_status ===
                                                      'export'
                                                    ? 'from-rose-400 to-orange-500'
                                                    : 'from-gray-400 to-gray-600'
                                            }`}>
                                            <div className="w-full h-full bg-white rounded-full">
                                                {' '}
                                            </div>
                                        </div>
                                        {/* Static Image */}
                                        <div className="absolute inset-0 z-10 rounded-full">
                                            <img
                                                className="rounded-full object-cover w-full p-1 h-full"
                                                src={
                                                    data?.worker_image
                                                        ? `${f_url}/${data.worker_image}`
                                                        : '/images/blank-picture.webp'
                                                }
                                                alt={
                                                    data?.worker_id ||
                                                    'No image available'
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Information */}
                        <div className="flex flex-col items-center mt-4">
                            {/* Name and Info */}
                            <div className="text-center">
                                <h1 className="text-3xl font-bold">
                                    {data?.worker_fullname} (
                                    {data?.worker_nickname})
                                </h1>
                                <p className="text-gray-500">
                                    {' '}
                                    {data?.worker_nationality} ·{' '}
                                    {data?.worker_race}
                                </p>
                                <span className="mx-auto bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    <FontAwesomeIcon
                                        icon={faSyringe}
                                        className="fa-fw"
                                    />{' '}
                                    ฉีดวัคซีน {data?.worker_covid} เข็ม
                                </span>
                                {data?.worker_namelist === 1 ? (
                                    <span className="mx-auto bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
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

                            {/* Action Buttons */}
                            <div className="flex space-x-3 mt-4">
                                {renderButtons(data?.worker_status)}
                                {isModalOpen2 && (
                                    <div className="modal modal-open">
                                        <div className="modal-box">
                                            <h2 className="text-lg font-bold mb-4">
                                                รายละเอียดสถานะ
                                            </h2>
                                            <textarea
                                                className="textarea textarea-bordered w-full"
                                                placeholder="รายละเอียดสถานะ"
                                                value={statusDetail}
                                                onChange={e =>
                                                    setStatusDetail(
                                                        e.target.value,
                                                    )
                                                }>
                                                {' '}
                                            </textarea>
                                            <div className="modal-action">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={
                                                        handleSubmitStatus
                                                    }>
                                                    บันทึก
                                                </button>
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={handleCloseModal}>
                                                    ยกเลิก
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex justify-center mt-6 border-t">
                            <div className="flex space-x-6">
                                <button className="font-semibold text-blue-600 border-b-2 border-blue-600 py-3">
                                    ข้อมูลประวัติ
                                </button>
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
                                <button
                                    className="text-gray-400 py-3"
                                    disabled="disabled">
                                    ตั้งค่าคนงาน
                                </button>
                                <button
                                    className="text-red-600 py-3"
                                    onClick={handleDeleteClick}>
                                    ลบคนงาน
                                </button>
                            </div>
                        </div>
                    </div>

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
                            <div className="modal-box max-w-4xl w-full">
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
                                                        ผู้ใช้
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        สถานะ
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        วันที่
                                                    </th>
                                                    <th className="px-4 py-2">
                                                        หมายเหตุ
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
                                <p>คุณต้องการลบคนงานนี้หรือไม่?</p>
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

                    <div className="flex flex-wrap px-5 py-3">
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
                            <div className="grid grid-cols-2 gap-4">
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
                                                        {
                                                            data?.workexp_position1
                                                        }
                                                    </p>
                                                    <p className="text-sm">
                                                        {data?.workexp_detail1}
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
                                                        {data?.workexp_detail2}
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
                                                        {data?.workexp_detail3}
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
                                                        {data?.workexp_detail4}
                                                    </p>
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
                                        {logData.length === 0 ? (
                                            <>
                                                <div
                                                    role="alert"
                                                    className="alert">
                                                    <FontAwesomeIcon
                                                        icon={faCircleInfo}
                                                        className="fa-fw"
                                                    />
                                                    <span>ยังไม่มีข้อมูล</span>
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
                                                            icon={faCircleCheck}
                                                            className="fa-fw"
                                                        />
                                                    </div>
                                                    <div className="timeline-end timeline-box">
                                                        <p className="underline p-0">
                                                            {log.sy_position}
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
                                                {formatDate(workerStatusDate)}
                                            </p>
                                        </div>
                                        {empData ? (
                                            <div>
                                                <img
                                                    className="rounded-2xl glass right-6 -mt-12 z-10 w-32 h-32 shadow"
                                                    src={
                                                        empData?.profile_photo_url
                                                            ? empData.profile_photo_url
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
                            <div className="grid grid-cols-2 gap-4">
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
