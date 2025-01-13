import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AppLayout from '@/components/Layouts/AppLayout'
import Link from 'next/link'
import axios from 'axios'
import Cookies from 'js-cookie'
import Loading from '@/lib/loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUserLock,
    faRightLeft,
    faFileArrowUp,
    faTrashCan,
    faCheckCircle,
    faSyringe,
    faTriangleExclamation,
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

const EditWorker = () => {
    const router = useRouter()
    const { id } = router.query // ดึง ID จาก URL
    const [workerData, setWorkerData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!id) return
        const fetchWorkerData = async () => {
            try {
                const response = await axios.get(
                    `https://beta.wb.in.th/api/i_worker?token=1amwall0ck&data_id=${id}`,
                )
                console.log(response.data[0]) // ตรวจสอบโครงสร้างข้อมูล
                setWorkerData(response.data[0])
                setLoading(false)
            } catch (err) {
                setError('ไม่สามารถดึงข้อมูลได้')
                setLoading(false)
            }
        }
        fetchWorkerData()
    }, [id])

    const handleInputChange = e => {
        const { name, value } = e.target
        setWorkerData(prevData => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            // ส่งข้อมูลไปที่ API สำหรับแก้ไขข้อมูล
            const response = await axios.put(
                `https://beta.wb.in.th/api/i_worker?token=1amwall0ck&data_id=${id}`,
                workerData,
            )
            alert('บันทึกข้อมูลเรียบร้อย')
            router.push('/') // กลับไปยังหน้าหลัก
        } catch (err) {
            console.error('Error updating data:', err)
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
        }
    }

    return (
        <AppLayout>
            <ToastContainer />
            {loading ? (
                <Loading />
            ) : (
                <div className="container mx-auto p-4">
                    <h1 className="text-4xl text-shadow font-bold mb-5 text-center">
                        แก้ไขข้อมูลคนงาน
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="card mx-auto max-w-2xl mb-5 bg-white rounded-pill p-5 shadow-lg">
                        <div className=" grid grid-cols-2 gap-4">
                            {Object.keys(workerData).map(key => (
                                <div key={key} className="mb-4">
                                    <label className="block font-semibold mb-1">
                                        {key.replace(/_/g, ' ')}
                                    </label>
                                    {key === 'worker_address' ||
                                    key === 'phone' ||
                                    key === 'worker_id' ? (
                                        <input
                                            type="text"
                                            name={key}
                                            value={workerData[key] || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    ) : key === 'worker_birthday' ||
                                      key === 'worker_wpcard_exp' ||
                                      key === 'worker_passport_exp' ||
                                      key === 'worker_visa_exp' ||
                                      key === 'tax_startdate' ? (
                                        <input
                                            type="date"
                                            name={key}
                                            value={workerData[key] || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <input
                                            type={
                                                key.includes('id') ||
                                                key.includes('salary') ||
                                                key.includes('weight') ||
                                                key.includes('height')
                                                    ? 'number'
                                                    : 'text'
                                            }
                                            name={key}
                                            value={workerData[key] || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="flex justify-center items-center mx-auto max-w-2xl bg-blue-500 btn btn-lg btn-block text-white rounded hover:bg-blue-600">
                            บันทึกข้อมูล
                        </button>
                    </form>
                </div>
            )}
        </AppLayout>
    )
}

export default EditWorker
