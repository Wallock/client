import AppLayout from '@/components/Layouts/AppLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { useProfile } from '@/lib/ProfileContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faAngleLeft,
    faAngleRight,
    faXmark,
    faCircleInfo,
    faPlus,
    faCamera,
    faFloppyDisk,
    faHashtag,
} from '@fortawesome/free-solid-svg-icons'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function RegistrationForm() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [capturedPhoto, setCapturedPhoto] = useState(null)
    const videoRef = useRef(null) // useRef ที่ถูกต้อง

    // Step 1: Personal Info
    const [workerId, setworkerId] = useState('')
    const [flag, setFlag] = useState('l') // เพิ่ม flag
    const [fullName, setFullName] = useState('')
    const [nickname, setNickname] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [gender, setGender] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [ethnicity, setEthnicity] = useState('') // เชื้อชาติ (race)
    const [nationality, setNationality] = useState('')
    const [religion, setReligion] = useState('')
    const [phone, setPhone] = useState('')
    const [altPhone, setAltPhone] = useState('')
    const [status, setStatus] = useState('')
    const [children, setChildren] = useState('')
    const [relationship, setRelationship] = useState('') // สถานะความสัมพันธ์
    const [race, setRace] = useState('') // ฟิลด์ race

    // Step 2: Address Info
    const [provinces, setProvinces] = useState([])
    const [selectedProvince, setSelectedProvince] = useState('')
    const [currentAddress, setCurrentAddress] = useState('')
    const [yearsInThailand, setYearsInThailand] = useState('')
    const [canTravel, setCanTravel] = useState('')
    const [workType, setWorkType] = useState('')

    // Step 3: Language and Skills
    const [thaiSpeaking, setThaiSpeaking] = useState('')
    const [thaiReading, setThaiReading] = useState('')
    const [thaiWriting, setThaiWriting] = useState('')
    const [englishSpeaking, setEnglishSpeaking] = useState('')
    const [englishReading, setEnglishReading] = useState('')
    const [englishWriting, setEnglishWriting] = useState('')
    const [otherLanguage, setOtherLanguage] = useState('')
    const [bikeSkill, setBikeSkill] = useState('')
    const [motorcycleSkill, setMotorcycleSkill] = useState('')
    const [carSkill, setCarSkill] = useState('')
    const [illness, setIllness] = useState('')
    const [illnessDetails, setIllnessDetails] = useState('')
    const [seriousIllness, setSeriousIllness] = useState('')
    const [seriousIllnessDetails, setSeriousIllnessDetails] = useState('')
    const [fearSmallPets, setFearSmallPets] = useState('')
    const [fearBigPets, setFearBigPets] = useState('')
    const [alcohol, setAlcohol] = useState('')
    const [motionSickness, setMotionSickness] = useState('')

    const [worker_skill_food, setworker_skill_food] = useState('')
    const [worker_skill_foodlevel, setworker_skill_foodlevel] = useState('')
    const [worker_skill_fooddetail, setworker_skill_fooddetail] = useState('')

    // Step 4: Work History
    const [workHistory, setWorkHistory] = useState([
        { companyName: '', position: '', workDetails: '', duration: '' },
    ])
    const [desiredJobs, setDesiredJobs] = useState([
        { jobPosition: '', salary: '' },
    ])

    // Step 5: Documents
    const [hasWorkPermit, setHasWorkPermit] = useState(false)
    const [workPermitNo, setWorkPermitNo] = useState('')
    const [workPermitExpiry, setWorkPermitExpiry] = useState('')
    const [passportNo, setPassportNo] = useState('')
    const [passportExpiry, setPassportExpiry] = useState('')
    const [visaExpiry, setVisaExpiry] = useState('')
    const [vaccinationNo, setVaccinationNo] = useState('') // ใช้เป็น covidanti
    const [source, setSource] = useState('') // แหล่งที่มาของข่าวสาร (knownews)
    const [note, setNote] = useState('') // detailother
    const [jobCode, setJobCode] = useState('')

    // เพิ่ม empidlock (emp_id, emp_id_lock)
    const [empidlock, setEmpidlock] = useState('')

    // Load Provinces Data
    useEffect(() => {
        axios
            .get(
                'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json',
            )
            .then(response => setProvinces(response.data))
            .catch
            //error => console.error('Error:', error))
            ()
    }, [])

    const handleNextStep = () => {
        if (validateStep()) {
            setStep(prevStep => prevStep + 1)
        } else {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน!')
        }
    }
    const handlePrevStep = () => setStep(prevStep => prevStep - 1)

    useEffect(() => {
        // ตรวจสอบว่ากล้องควรเปิดเฉพาะใน step ที่ 6 เท่านั้น
        if (step === 5 && videoRef.current) {
            const video = videoRef.current
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices
                    .getUserMedia({ video: { width: 1280, height: 720 } })
                    .then(stream => {
                        video.srcObject = stream
                        video.play()
                    })
                    .catch(error => {
                        //console.error('Error accessing camera: ', error)
                        alert(
                            'ไม่สามารถเข้าถึงกล้องได้ โปรดตรวจสอบการตั้งค่าและอนุญาตให้เข้าถึงกล้อง',
                        )
                    })
            } else {
                alert('เบราว์เซอร์ของคุณไม่รองรับการเปิดกล้อง')
            }
        }
    }, [step])

    // ฟังก์ชันถ่ายรูป
    const capturePhoto = () => {
        const video = videoRef.current
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/png')
        setCapturedPhoto(dataUrl)
    }
    const handleFinalStep = async () => {
        const formData = new FormData()
        formData.append('worker_id', workerId)
        formData.append('flag', flag)
        formData.append('race', ethnicity) // เพิ่มฟิลด์ race
        formData.append('nationality', nationality)
        formData.append('religion', religion)
        formData.append('fullname', fullName)
        formData.append('nickname', nickname)
        formData.append('birthday', birthdate)
        formData.append('gender', gender)
        formData.append('weight', weight)
        formData.append('height', height)
        formData.append('phone', phone)
        formData.append('altPhone', altPhone)
        formData.append('inthai', yearsInThailand)
        formData.append('address', currentAddress)
        formData.append('province', selectedProvince)
        formData.append('outside', canTravel)
        formData.append('overnight', workType)
        formData.append('relationship', relationship) // เพิ่ม relationship
        formData.append('wpcard', workPermitNo)
        formData.append('wpcardexp', workPermitExpiry)
        formData.append('ppcard', passportNo)
        formData.append('ppcardexp', passportExpiry)
        formData.append('visacardexp', visaExpiry)

        formData.append('worker_namelist', hasWorkPermit)

        formData.append('worker_smalldog', fearSmallPets)
        formData.append('worker_bigdog', fearBigPets)

        formData.append('worker_duo', jobCode || '-')
        formData.append('worker_sick', illness)
        formData.append('worker_sick_detail', illnessDetails || '-')

        formData.append('worker_verysick', seriousIllness)
        formData.append('worker_verysick_detail', seriousIllnessDetails || '-')

        formData.append('worker_landth_talk', thaiSpeaking)
        formData.append('worker_landth_view', thaiReading)
        formData.append('worker_landth_write', thaiWriting)

        formData.append('worker_landen_talk', englishSpeaking)
        formData.append('worker_landen_view', englishReading)
        formData.append('worker_landen_write', englishWriting)

        formData.append('worker_landother', otherLanguage)

        formData.append('worker_drinksmork', alcohol)
        formData.append('worker_boathunk', motionSickness)

        formData.append('worker_skill1', bikeSkill)
        formData.append('worker_skill2', motorcycleSkill)
        formData.append('worker_skill3', carSkill)

        formData.append('worker_skill_food', worker_skill_food)
        formData.append('worker_skill_foodlevel', worker_skill_foodlevel)
        formData.append(
            'worker_skill_fooddetail',
            worker_skill_fooddetail || '-',
        )

        formData.append('worker_baby', children)

        formData.append('covidanti', vaccinationNo) // ใช้ vaccinationNo เป็น covidanti
        formData.append('knownews', source) // แหล่งข่าว knownews
        formData.append('detailother', note) // ข้อมูลเพิ่มเติม

        formData.append('emp_id', empidlock) // เพิ่ม emp_id
        formData.append('emp_id_lock', empidlock) // เพิ่ม emp_id_lock

        // Convert capturedPhoto (Base64) to Blob
        const blob = dataURItoBlob(capturedPhoto)
        formData.append('image', blob, 'capturedPhoto.png') // Append image as a file

        // ประสบการณ์การทำงาน (Work History)
        workHistory.forEach((work, index) => {
            formData.append(`workexp_name${index + 1}`, work.companyName)
            formData.append(`workexp_position${index + 1}`, work.position)
            formData.append(`workexp_detail${index + 1}`, work.workDetails)
            formData.append(`workexp_time${index + 1}`, work.duration)
        })

        // ตำแหน่งงานที่ต้องการ (Desired Jobs)
        desiredJobs.forEach((job, index) => {
            formData.append(`workposition_id${index + 1}`, job.jobPosition)
            formData.append(`workposition_salary${index + 1}`, job.salary)
        })

        for (let [key, value] of formData.entries()) {
            //console.log(`${key}: ${value}`)
        }

        try {
            const response = await fetch(
                'https://laos.wb.in.th/api/addworker',
                {
                    method: 'POST',
                    body: formData, // ส่งข้อมูลในรูปแบบ FormData
                    headers: {},
                },
            )

            // ตรวจสอบว่า response สำเร็จหรือไม่
            if (!response.ok) {
                // ลองดึงข้อมูล error message จาก API response
                const errorData = await response.text()
                //console.log(errorData) // แสดงข้อผิดพลาดใน console
                let errorMessage = 'Unknown error'

                // ตรวจสอบว่ามี error message ที่ API ส่งกลับมาหรือไม่
                if (errorData && errorData.errors) {
                    // สร้างข้อความ error โดยการรวม field และ message
                    errorMessage = Object.entries(errorData.errors)
                        .map(
                            ([field, message]) =>
                                `${field}: ${message.join(', ')}`,
                        )
                        .join('\n')
                }

                // แสดงข้อผิดพลาดใน alert
                alert(`Error: ${errorMessage}`)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json() // ถ้า API ส่งข้อมูลกลับมาในรูปแบบ JSON
            //console.log('Success:', result)
            alert('Worker added successfully')
        } catch (error) {
            //console.error('Error:', error)
            alert(`Error: ${error.message}`)
        }
    }

    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1])
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], { type: mimeString })
    }

    const removeWorkHistory = index => {
        if (workHistory.length > 1) {
            const newHistory = workHistory.filter((_, i) => i !== index)
            setWorkHistory(newHistory)
        } else {
            alert('จำเป็นต้องมีขั้นต่ำ 1 รายการ')
        }
    }
    // ฟังก์ชัน removeDesiredJob
    const removeDesiredJob = index => {
        if (desiredJobs.length > 1) {
            const newJobs = desiredJobs.filter((_, i) => i !== index)
            setDesiredJobs(newJobs)
        } else {
            alert('จำเป็นต้องมีขั้นต่ำ 1 รายการ')
        }
    }

    const addWorkHistory = () => {
        if (workHistory.length < 8) {
            setWorkHistory([
                ...workHistory,
                {
                    companyName: '',
                    position: '',
                    workDetails: '',
                    duration: '',
                },
            ])
        } else {
            alert('คุณสามารถเพิ่มได้ไม่เกิน 8 ประสบการณ์การทำงาน')
        }
    }
    const addDesiredJob = () => {
        if (desiredJobs.length < 4) {
            setDesiredJobs([...desiredJobs, { jobPosition: '', salary: '' }])
        } else {
            alert('คุณสามารถเพิ่มได้ไม่เกิน 4 ตำแหน่งงานที่ต้องการ')
        }
    }
    const [errorFields, setErrorFields] = useState({})
    const provinceOptions = provinces.map(province => ({
        value: province.id,
        label: province.name_th,
    }))
    const validateStep = () => {
        let errors = {}
        let isValid = true

        if (step === 0) {
            // Step 1: ตรวจสอบข้อมูลส่วนตัว
            if (!workerId) {
                errors.workerId = 'กรุณาใส่รหัสสมัครงาน'
                isValid = false
            } else if (!/^[a-zA-Z0-9-]+$/.test(workerId)) {
                errors.workerId =
                    'รหัสสมัครงานต้องเป็นภาษาอังกฤษ ตัวเลข และเครื่องหมาย - เท่านั้น'
                isValid = false
            }
            if (!fullName) {
                errors.fullName = 'กรุณาใส่ชื่อ-นามสกุล'
                isValid = false
            }
            if (!nickname) {
                errors.nickname = 'กรุณาใส่ชื่อเล่น'
                isValid = false
            }
            if (!birthdate) {
                errors.birthdate = 'ยังไม่ได้ใส่วันเดือนปีเกิด'
                isValid = false
            }
            if (!height) {
                errors.height = 'กรุณาใส่ส่วนสูง'
                isValid = false
            }
            if (!weight) {
                errors.weight = 'กรุณาใส่น้ำหนัก'
                isValid = false
            }
            if (!ethnicity) {
                errors.ethnicity = 'กรุณาใส่เชื้อชาติ'
                isValid = false
            }
            if (!nationality) {
                errors.nationality = 'กรุณาใส่สัญชาติ'
                isValid = false
            }
            if (!religion) {
                errors.religion = 'กรุณาใส่ศาสนา'
                isValid = false
            }
            if (!phone) {
                errors.phone = 'กรุณาใส่เบอร์'
                isValid = false
            }
            if (!altPhone) {
                errors.altPhone = 'กรุณาใส่เบอร์สำรอง'
                isValid = false
            }
            if (!children) {
                errors.children = 'กรุณาระบุจำนวนลูกถ้าไม่มีให้ใส่ 0 '
                isValid = false
            }
            // สามารถเพิ่มเงื่อนไขเพิ่มเติมได้ เช่นการตรวจสอบวันเกิด เบอร์โทรศัพท์ เพศ เป็นต้น
        } else if (step === 1) {
            // Step 2: ตรวจสอบข้อมูลที่อยู่
            if (!selectedProvince) {
                errors.selectedProvince = 'กรุณาเลือกจังหวัด'
                isValid = false
            }
            if (!currentAddress) {
                errors.currentAddress = 'กรุณาใส่ที่อยู่ปัจจุบัน'
                isValid = false
            }
        }
        // ตรวจสอบข้อมูลสำหรับ step อื่นๆ เพิ่มเติมได้ที่นี่

        setErrorFields(errors) // เก็บ errorFields ที่เจอ
        return isValid
    }
    const getInputClassName = fieldName => {
        return errorFields[fieldName]
            ? 'input input-bordered input-error' // ถ้ามีข้อผิดพลาดให้แสดงเป็นขอบสีแดง
            : 'input input-bordered'
    }

    return (
        <AppLayout>
            <div className="w-full">
                <div className="text-center my-6">
                    {/* Steps Navigation */}
                    <ul className="steps">
                        <li
                            className={`step ${
                                step >= 0 ? 'step-neutral' : ''
                            }`}>
                            ข้อมูลส่วนตัว
                        </li>
                        <li
                            className={`step ${
                                step >= 1 ? 'step-neutral' : ''
                            }`}>
                            ข้อมูลที่อยู่
                        </li>
                        <li
                            className={`step ${
                                step >= 2 ? 'step-neutral' : ''
                            }`}>
                            ข้อมูลภาษาและความสามารถ
                        </li>
                        <li
                            className={`step ${
                                step >= 3 ? 'step-neutral' : ''
                            }`}>
                            ประวัติการทำงาน
                        </li>
                        <li
                            className={`step ${
                                step >= 4 ? 'step-neutral' : ''
                            }`}>
                            เอกสาร
                        </li>
                        <li
                            className={`step ${
                                step >= 5 ? 'step-neutral' : ''
                            }`}>
                            ถ่ายรูป
                        </li>
                    </ul>
                </div>
                <div className="card m-5 bg-base-100 text-neutral shadow-xl">
                    <div className="card-body">
                        <ToastContainer />
                        <div className="form-control my-0">
                            <label className="input input-bordered w-1/2 input-lg flex items-center gap-2">
                                <span className="whitespace-nowrap">
                                    <FontAwesomeIcon
                                        icon={faHashtag}
                                        className="fa-fw"
                                    />
                                    ใบสมัคร
                                </span>
                                <input
                                    type="text"
                                    value={workerId}
                                    onChange={e => setworkerId(e.target.value)}
                                    className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                    placeholder="0M-000000"
                                />
                            </label>
                            <div className="label">
                                <span className="label-text-alt text-red-500 font-semibold">
                                    **ไม่สามารถเปลี่ยนรหัสคนงานได้ภายหลัง
                                    กรุณาตรวจสอบก่อนบันทึก
                                </span>
                                <span className="label-text-alt">
                                    ระบบสมัครงาน - นาซ่า
                                </span>
                            </div>
                        </div>
                        <hr className="mb-3" />
                        {/* Step 1: Personal Information */}
                        {step === 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        ชื่อ-นามสกุล
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={e =>
                                            setFullName(e.target.value)
                                        }
                                        className={getInputClassName(
                                            'fullName',
                                        )}
                                        placeholder="กรอกชื่อ-นามสกุล"
                                    />
                                    {errorFields.fullName && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.fullName}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">ชื่อเล่น</label>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={e =>
                                            setNickname(e.target.value)
                                        }
                                        className={getInputClassName(
                                            'nickname',
                                        )}
                                        placeholder="กรอกชื่อเล่น"
                                    />
                                    {errorFields.nickname && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.nickname}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        วันเดือนปีเกิด
                                    </label>
                                    <input
                                        type="date"
                                        value={birthdate}
                                        onChange={e =>
                                            setBirthdate(e.target.value)
                                        }
                                        className={getInputClassName(
                                            'birthdate',
                                        )}
                                    />
                                    {errorFields.birthdate && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.birthdate}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">เพศ</label>
                                    <select
                                        value={gender}
                                        onChange={e =>
                                            setGender(e.target.value)
                                        }
                                        className="select select-bordered">
                                        <option disabled>กรุณาเลือก</option>
                                        <option value="1">ชาย</option>
                                        <option value="2">หญิง</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        ส่วนสูง (ซม.)
                                    </label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={e => {
                                            const value = parseInt(
                                                e.target.value,
                                                10,
                                            )
                                            if (value >= 0) {
                                                setHeight(e.target.value)
                                            }
                                        }}
                                        className={getInputClassName('height')}
                                        placeholder="กรอกส่วนสูง"
                                    />
                                    {errorFields.height && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.height}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        น้ำหนัก (กก.)
                                    </label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={e => {
                                            const value = parseInt(
                                                e.target.value,
                                                10,
                                            )
                                            if (value >= 0) {
                                                setWeight(e.target.value)
                                            }
                                        }}
                                        className={getInputClassName('weight')}
                                        placeholder="กรอกน้ำหนัก"
                                    />
                                    {errorFields.weight && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.weight}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">เชื้อชาติ</label>
                                    <input
                                        type="text"
                                        value={ethnicity}
                                        onChange={e =>
                                            setEthnicity(e.target.value)
                                        }
                                        className={getInputClassName(
                                            'ethnicity',
                                        )}
                                        placeholder="กรอกเชื้อชาติ"
                                    />
                                    {errorFields.ethnicity && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.ethnicity}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">สัญชาติ</label>
                                    <input
                                        type="text"
                                        value={nationality}
                                        onChange={e =>
                                            setNationality(e.target.value)
                                        }
                                        className={getInputClassName(
                                            'nationality',
                                        )}
                                        placeholder="กรอกสัญชาติ"
                                    />
                                    {errorFields.nationality && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.nationality}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">ศาสนา</label>
                                    <input
                                        type="text"
                                        value={religion}
                                        onChange={e =>
                                            setReligion(e.target.value)
                                        }
                                        className={getInputClassName(
                                            'religion',
                                        )}
                                        placeholder="กรอกศาสนา"
                                    />
                                    {errorFields.religion && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.religion}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">เบอร์ติดต่อ</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className={getInputClassName('phone')}
                                        placeholder="กรอกเบอร์ติดต่อ"
                                    />
                                    {errorFields.phone && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.phone}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">เบอร์สำรอง</label>
                                    <input
                                        type="text"
                                        value={altPhone}
                                        onChange={e =>
                                            setAltPhone(e.target.value)
                                        }
                                        className={getInputClassName(
                                            'altPhone',
                                        )}
                                        placeholder="กรอกเบอร์สำรอง"
                                    />
                                    {errorFields.altPhone && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.altPhone}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">สถานะ</label>
                                    <select
                                        value={relationship}
                                        onChange={e =>
                                            setRelationship(e.target.value)
                                        }
                                        className="select select-bordered">
                                        <option disabled>กรุณาเลือก</option>
                                        <option value="1">โสด</option>
                                        <option value="5">มีแฟน</option>
                                        <option value="2">แต่งงาน</option>
                                        <option value="3">ม่าย</option>
                                        <option value="4">แยกทาง</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">จำนวนลูก</label>
                                    <input
                                        type="number"
                                        value={children}
                                        onChange={e => {
                                            const value = parseInt(
                                                e.target.value,
                                                10,
                                            )
                                            if (value >= 0) {
                                                setChildren(value)
                                            }
                                        }}
                                        className={getInputClassName(
                                            'children',
                                        )}
                                        placeholder="กรอกจำนวนลูก"
                                    />
                                    {errorFields.children && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.children}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Address Information */}
                        {step === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        จังหวัดที่อยู่
                                    </label>
                                    <select
                                        value={selectedProvince}
                                        onChange={e =>
                                            setSelectedProvince(e.target.value)
                                        }
                                        className={getInputClassName(
                                            'selectedProvince',
                                        )}>
                                        {provinces.map((province, index) => (
                                            <option
                                                key={index}
                                                value={province.id}>
                                                {province.name_th}
                                            </option>
                                        ))}
                                    </select>
                                    {errorFields.selectedProvince && (
                                        <span className="text-red-500 text-sm">
                                            {errorFields.selectedProvince}
                                        </span>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        ที่อยู่ปัจจุบัน
                                    </label>
                                    <input
                                        type="text"
                                        value={currentAddress}
                                        onChange={e =>
                                            setCurrentAddress(e.target.value)
                                        }
                                        className="input input-bordered"
                                        placeholder="กรอกที่อยู่ปัจจุบัน"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        อยู่ไทยกี่ปี
                                    </label>
                                    <input
                                        type="number"
                                        value={yearsInThailand}
                                        onChange={e =>
                                            setYearsInThailand(e.target.value)
                                        }
                                        className="input input-bordered"
                                        placeholder="กรอกจำนวนปีที่อยู่ไทย"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        ไปต่างจังหวัด
                                    </label>
                                    <div className="flex space-x-4">
                                        <label className="label cursor-pointer">
                                            <input
                                                type="radio"
                                                name="canTravel"
                                                value="1"
                                                checked={canTravel === '1'}
                                                onChange={e =>
                                                    setCanTravel(e.target.value)
                                                }
                                                className="radio me-2"
                                            />
                                            <span className="label-text">
                                                ได้
                                            </span>
                                        </label>
                                        <label className="label cursor-pointer">
                                            <input
                                                type="radio"
                                                name="canTravel"
                                                value="2"
                                                checked={canTravel === '2'}
                                                onChange={e =>
                                                    setCanTravel(e.target.value)
                                                }
                                                className="radio me-2"
                                            />
                                            <span className="label-text">
                                                ไม่ได้
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="label">รูปแบบงาน</label>
                                    <div className="flex space-x-4">
                                        <label className="label cursor-pointer">
                                            <input
                                                type="radio"
                                                name="workType"
                                                value="1"
                                                checked={workType === '1'}
                                                onChange={e =>
                                                    setWorkType(e.target.value)
                                                }
                                                className="radio me-2"
                                            />
                                            <span className="label-text">
                                                อยู่ประจำ
                                            </span>
                                        </label>
                                        <label className="label cursor-pointer">
                                            <input
                                                type="radio"
                                                name="workType"
                                                value="2"
                                                checked={workType === '2'}
                                                onChange={e =>
                                                    setWorkType(e.target.value)
                                                }
                                                className="radio me-2"
                                            />
                                            <span className="label-text">
                                                ไป/กลับ
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Language and Skills */}
                        {step === 2 && (
                            <div className="space-y-8">
                                {/* โซนภาษา */}
                                <div className="card bg-base-100 border-2 border-gray-200 shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-4">
                                        ทักษะภาษา
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* ทักษะภาษาไทย */}
                                        <div className="form-control">
                                            <label className="label">
                                                ทักษะภาษาไทย - พูด
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="thaiSpeaking"
                                                        value="1"
                                                        checked={
                                                            thaiSpeaking === '1'
                                                        }
                                                        onChange={e =>
                                                            setThaiSpeaking(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="thaiSpeaking"
                                                        value="0"
                                                        onChange={e =>
                                                            setThaiSpeaking(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                ทักษะภาษาไทย - อ่าน
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="thaiReading"
                                                        value="1"
                                                        checked={
                                                            thaiReading === '1'
                                                        }
                                                        onChange={e =>
                                                            setThaiReading(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="thaiReading"
                                                        value="0"
                                                        onChange={e =>
                                                            thaiReading(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                ทักษะภาษาไทย - เขียน
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="thaiWriting"
                                                        value="1"
                                                        checked={
                                                            thaiWriting === '1'
                                                        }
                                                        onChange={e =>
                                                            setThaiWriting(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="thaiWriting"
                                                        value="0"
                                                        onChange={e =>
                                                            setThaiWriting(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* ทักษะภาษาอังกฤษ */}
                                        <div className="form-control">
                                            <label className="label">
                                                ทักษะภาษาอังกฤษ - พูด
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="englishSpeaking"
                                                        value="1"
                                                        checked={
                                                            englishSpeaking ===
                                                            '1'
                                                        }
                                                        onChange={e =>
                                                            setEnglishSpeaking(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="englishSpeaking"
                                                        value="0"
                                                        onChange={e =>
                                                            setEnglishSpeaking(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                ทักษะภาษาอังกฤษ - อ่าน
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="englishReading"
                                                        value="1"
                                                        checked={
                                                            englishReading ===
                                                            '1'
                                                        }
                                                        onChange={e =>
                                                            setEnglishReading(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="englishReading"
                                                        value="0"
                                                        onChange={e =>
                                                            setEnglishReading(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                ทักษะภาษาอังกฤษ - เขียน
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="englishWriting"
                                                        value="1"
                                                        checked={
                                                            englishWriting ===
                                                            '1'
                                                        }
                                                        onChange={e =>
                                                            setEnglishWriting(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="englishWriting"
                                                        value="0"
                                                        onChange={e =>
                                                            setEnglishWriting(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* ภาษาอื่นๆ */}
                                        <div className="form-control col-span-3">
                                            <label className="label">
                                                ภาษาอื่นๆ
                                            </label>
                                            <input
                                                type="text"
                                                value={otherLanguage}
                                                onChange={e =>
                                                    setOtherLanguage(
                                                        e.target.value,
                                                    )
                                                }
                                                className="input input-bordered"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* การทำอาหาร */}
                                <div className="card bg-base-100 border-2 border-gray-200 shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-4">
                                        ทักษะการทำอาหาร
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                ทำอาหารไทย
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="worker_skill_food"
                                                        value="1"
                                                        checked={
                                                            worker_skill_food ===
                                                            '1'
                                                        }
                                                        onChange={e =>
                                                            setworker_skill_food(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="worker_skill_food"
                                                        value="0"
                                                        onChange={e =>
                                                            setworker_skill_food(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                ระดับการทำอาหาร
                                            </label>
                                            <select
                                                value={worker_skill_foodlevel}
                                                onChange={e =>
                                                    setworker_skill_foodlevel(
                                                        e.target.value,
                                                    )
                                                }
                                                className="select select-bordered">
                                                <option disabled>
                                                    กรุณาเลือก
                                                </option>
                                                <option value="0">
                                                    ไม่ได้เลย
                                                </option>
                                                <option value="1">
                                                    ได้เบื้องต้น
                                                </option>
                                                <option value="2">
                                                    ได้ตามสั่ง
                                                </option>
                                                <option value="3">
                                                    ร้านอาหาร
                                                </option>
                                            </select>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                ระบุตัวอย่างอาหารที่ทำได้
                                            </label>
                                            <input
                                                type="text"
                                                value={worker_skill_fooddetail}
                                                onChange={e =>
                                                    setworker_skill_fooddetail(
                                                        e.target.value,
                                                    )
                                                }
                                                className="input input-bordered"
                                                placeholder="โปรดระบุ"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* โซนขับขี่ */}
                                <div className="card bg-base-100 border-2 border-gray-200 shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-4">
                                        ทักษะการขับขี่
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                ขี่จักรยาน
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="bikeSkill"
                                                        value="1"
                                                        checked={
                                                            bikeSkill === '1'
                                                        }
                                                        onChange={e =>
                                                            setBikeSkill(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="bikeSkill"
                                                        value="0"
                                                        onChange={e =>
                                                            setBikeSkill(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                ขี่จักรยานยนต์
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="motorcycleSkill"
                                                        value="1"
                                                        checked={
                                                            motorcycleSkill ===
                                                            '1'
                                                        }
                                                        onChange={e =>
                                                            setMotorcycleSkill(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="motorcycleSkill"
                                                        value="0"
                                                        onChange={e =>
                                                            setMotorcycleSkill(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                ขับรถยนต์
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="carSkill"
                                                        value="1"
                                                        checked={
                                                            carSkill === '1'
                                                        }
                                                        onChange={e =>
                                                            setCarSkill(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ได้
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="carSkill"
                                                        value="0"
                                                        onChange={e =>
                                                            setCarSkill(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่ได้
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* โซนสุขภาพ */}
                                <div className="card bg-base-100 border-2 border-gray-200 shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-4">
                                        ข้อมูลสุขภาพ
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* โรคประจำตัว */}
                                        <div className="form-control">
                                            <label className="label">
                                                โรคประจำตัว
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="illness"
                                                        value="1"
                                                        checked={
                                                            illness === '1'
                                                        }
                                                        onChange={e =>
                                                            setIllness(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        มี
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="illness"
                                                        value="0"
                                                        onChange={e =>
                                                            setIllness(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่มี
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        {illness === '1' && (
                                            <div className="form-control col-span-2">
                                                <label className="label">
                                                    ระบุโรคประจำตัว
                                                </label>
                                                <input
                                                    type="text"
                                                    value={illnessDetails}
                                                    onChange={e =>
                                                        setIllnessDetails(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="input input-bordered"
                                                />
                                            </div>
                                        )}

                                        {/* เคยป่วยหนัก */}
                                        <div className="form-control">
                                            <label className="label">
                                                เคยป่วยหนัก
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="seriousIllness"
                                                        value="1"
                                                        checked={
                                                            seriousIllness ===
                                                            '1'
                                                        }
                                                        onChange={e =>
                                                            setSeriousIllness(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        เคย
                                                    </span>
                                                </label>
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="seriousIllness"
                                                        value="0"
                                                        onChange={e =>
                                                            setSeriousIllness(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="radio me-2"
                                                    />
                                                    <span className="label-text">
                                                        ไม่เคย
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        {seriousIllness === '1' && (
                                            <div className="form-control col-span-2">
                                                <label className="label">
                                                    ระบุการป่วยหนัก
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        seriousIllnessDetails
                                                    }
                                                    onChange={e =>
                                                        setSeriousIllnessDetails(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="input input-bordered"
                                                />
                                            </div>
                                        )}

                                        {/* กลัวสัตว์เลี้ยง */}
                                        <div className="form-control">
                                            <label className="label">
                                                กลัวสัตว์เลี้ยงตัวเล็ก
                                            </label>
                                            <select
                                                value={fearSmallPets}
                                                onChange={e =>
                                                    setFearSmallPets(
                                                        e.target.value,
                                                    )
                                                }
                                                className="select select-bordered">
                                                <option disabled>
                                                    กรุณาเลือก
                                                </option>
                                                <option value="1">กลัว</option>
                                                <option value="0">
                                                    ไม่กลัว
                                                </option>
                                            </select>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                กลัวสัตว์เลี้ยงตัวใหญ่
                                            </label>
                                            <select
                                                value={fearBigPets}
                                                onChange={e =>
                                                    setFearBigPets(
                                                        e.target.value,
                                                    )
                                                }
                                                className="select select-bordered">
                                                <option disabled>
                                                    กรุณาเลือก
                                                </option>
                                                <option value="1">กลัว</option>
                                                <option value="0">
                                                    ไม่กลัว
                                                </option>
                                            </select>
                                        </div>

                                        {/* ดื่มเหล้า/สูบบุหรี่ */}
                                        <div className="form-control">
                                            <label className="label">
                                                ดื่มเหล้า/สูบบุหรี่
                                            </label>
                                            <select
                                                value={alcohol}
                                                onChange={e =>
                                                    setAlcohol(e.target.value)
                                                }
                                                className="select select-bordered">
                                                <option disabled>
                                                    กรุณาเลือก
                                                </option>
                                                <option value="0">
                                                    ไม่สนใจเลย
                                                </option>
                                                <option value="2">
                                                    มีบางครั้ง
                                                </option>
                                                <option value="1">
                                                    ขาดไม่ได้
                                                </option>
                                            </select>
                                        </div>

                                        {/* เมารถ/เมาเรือ */}
                                        <div className="form-control">
                                            <label className="label">
                                                เมารถ/เมาเรือ
                                            </label>
                                            <select
                                                value={motionSickness}
                                                onChange={e =>
                                                    setMotionSickness(
                                                        e.target.value,
                                                    )
                                                }
                                                className="select select-bordered">
                                                <option disabled>
                                                    กรุณาเลือก
                                                </option>
                                                <option value="0">
                                                    ไม่เมา
                                                </option>
                                                <option value="1">เมา</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Work History */}
                        {step === 3 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Work History Table */}
                                <div className="card bg-base-100 shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-4">
                                        ประสบการณ์การทำงาน{' '}
                                        <span className="badge badge-ghost font-normal text-xs">
                                            <FontAwesomeIcon
                                                icon={faCircleInfo}
                                                className="fa-fw me-1"
                                            />{' '}
                                            สามารถเพิ่มได้ ขั้นต่ำ 1 รายการ /
                                            สูงสุด 8 รายการ
                                        </span>
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th>ชื่อสถานที่</th>
                                                    <th>ตำแหน่ง</th>
                                                    <th>ลักษณะงาน</th>
                                                    <th>ระยะเวลา (ปี)</th>
                                                    <th> </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {workHistory.map(
                                                    (work, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        work.companyName
                                                                    }
                                                                    onChange={e => {
                                                                        const newHistory = [
                                                                            ...workHistory,
                                                                        ]
                                                                        newHistory[
                                                                            index
                                                                        ].companyName =
                                                                            e.target.value
                                                                        setWorkHistory(
                                                                            newHistory,
                                                                        )
                                                                    }}
                                                                    className="input input-bordered w-full"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        work.position
                                                                    }
                                                                    onChange={e => {
                                                                        const newHistory = [
                                                                            ...workHistory,
                                                                        ]
                                                                        newHistory[
                                                                            index
                                                                        ].position =
                                                                            e.target.value
                                                                        setWorkHistory(
                                                                            newHistory,
                                                                        )
                                                                    }}
                                                                    className="input input-bordered w-full"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        work.workDetails
                                                                    }
                                                                    onChange={e => {
                                                                        const newHistory = [
                                                                            ...workHistory,
                                                                        ]
                                                                        newHistory[
                                                                            index
                                                                        ].workDetails =
                                                                            e.target.value
                                                                        setWorkHistory(
                                                                            newHistory,
                                                                        )
                                                                    }}
                                                                    className="input input-bordered w-full"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        work.duration
                                                                    }
                                                                    onChange={e => {
                                                                        const newHistory = [
                                                                            ...workHistory,
                                                                        ]
                                                                        newHistory[
                                                                            index
                                                                        ].duration =
                                                                            e.target.value
                                                                        setWorkHistory(
                                                                            newHistory,
                                                                        )
                                                                    }}
                                                                    className="input input-bordered w-full"
                                                                />
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() =>
                                                                        removeWorkHistory(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className="btn btn-outline btn-circle btn-error btn-sm">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faXmark
                                                                        }
                                                                        className="fa-fw"
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* แสดงปุ่มเพิ่มประสบการณ์เมื่อจำนวนประสบการณ์น้อยกว่า 8 */}
                                    {workHistory.length < 8 && (
                                        <button
                                            onClick={addWorkHistory}
                                            className="btn btn-neutral mt-4">
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="fa-fw me-1"
                                            />
                                            เพิ่มประสบการณ์
                                        </button>
                                    )}
                                </div>

                                {/* Desired Jobs Table */}
                                <div className="card bg-base-100 shadow-md p-4">
                                    <h2 className="text-lg font-semibold mb-4">
                                        ตำแหน่งงานที่ต้องการ{' '}
                                        <span className="badge badge-ghost font-normal text-xs">
                                            <FontAwesomeIcon
                                                icon={faCircleInfo}
                                                className="fa-fw me-1"
                                            />{' '}
                                            สามารถเพิ่มได้ ขั้นต่ำ 1 รายการ /
                                            สูงสุด 4 รายการ
                                        </span>
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>ตำแหน่งที่ต้องการ</th>
                                                    <th>เงินเดือนที่ต้องการ</th>
                                                    <th> </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {desiredJobs.map(
                                                    (job, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <select
                                                                    value={
                                                                        job.jobPosition
                                                                    }
                                                                    onChange={e => {
                                                                        const newJobs = [
                                                                            ...desiredJobs,
                                                                        ]
                                                                        newJobs[
                                                                            index
                                                                        ].jobPosition =
                                                                            e.target.value
                                                                        setDesiredJobs(
                                                                            newJobs,
                                                                        )
                                                                    }}
                                                                    className="select select-bordered w-full">
                                                                    <option
                                                                        disabled>
                                                                        กรุณาเลือก
                                                                    </option>
                                                                    <option value="แม่บ้าน">
                                                                        แม่บ้าน
                                                                    </option>
                                                                    <option value="พี่เลี้ยง">
                                                                        พี่เลี้ยง
                                                                    </option>
                                                                    <option value="ดูแลผู้สูงอายุ">
                                                                        ดูแลผู้สูงอายุ
                                                                    </option>
                                                                    <option value="แม่บ้าน+พี่เลี้ยง">
                                                                        แม่บ้าน+พี่เลี้ยง
                                                                    </option>
                                                                    <option value="แม่บ้าน+ดูแลผู้สูงอายุ">
                                                                        แม่บ้าน+ดูแลผู้สูงอายุ
                                                                    </option>
                                                                    <option value="กรรมกร">
                                                                        กรรมกร
                                                                    </option>
                                                                    <option value="พ่อบ้าน">
                                                                        พ่อบ้าน
                                                                    </option>
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        job.salary
                                                                    }
                                                                    onChange={e => {
                                                                        const newJobs = [
                                                                            ...desiredJobs,
                                                                        ]
                                                                        newJobs[
                                                                            index
                                                                        ].salary =
                                                                            e.target.value
                                                                        setDesiredJobs(
                                                                            newJobs,
                                                                        )
                                                                    }}
                                                                    className="input input-bordered w-full"
                                                                />
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() =>
                                                                        removeDesiredJob(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className="btn btn-outline btn-circle btn-error btn-sm">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faXmark
                                                                        }
                                                                        className="fa-fw"
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* แสดงปุ่มเพิ่มตำแหน่งงานที่ต้องการเมื่อจำนวนตำแหน่งน้อยกว่า 4 */}
                                    {desiredJobs.length < 4 && (
                                        <button
                                            onClick={addDesiredJob}
                                            className="btn btn-neutral mt-4">
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="fa-fw me-1"
                                            />
                                            เพิ่มตำแหน่งงานที่ต้องการ
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Documents */}
                        {step === 4 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <span className="label-text">
                                                เอกสารใบอนุญาต
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={hasWorkPermit}
                                                onChange={e =>
                                                    setHasWorkPermit(
                                                        e.target.checked,
                                                    )
                                                }
                                                className="checkbox checkbox-primary"
                                            />
                                        </label>
                                    </div>

                                    {hasWorkPermit && (
                                        <>
                                            <div className="form-control">
                                                <label className="label">
                                                    เลขบัตร work permit
                                                </label>
                                                <input
                                                    type="text"
                                                    value={workPermitNo}
                                                    onChange={e =>
                                                        setWorkPermitNo(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="input input-bordered"
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    วันหมดอายุ work permit
                                                </label>
                                                <input
                                                    type="date"
                                                    value={workPermitExpiry}
                                                    onChange={e =>
                                                        setWorkPermitExpiry(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="input input-bordered"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="form-control">
                                        <label className="label">
                                            เลขบัตร Passport
                                        </label>
                                        <input
                                            type="text"
                                            value={passportNo}
                                            onChange={e =>
                                                setPassportNo(e.target.value)
                                            }
                                            className="input input-bordered"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            วันหมดอายุ Passport
                                        </label>
                                        <input
                                            type="date"
                                            value={passportExpiry}
                                            onChange={e =>
                                                setPassportExpiry(
                                                    e.target.value,
                                                )
                                            }
                                            className="input input-bordered"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="form-control">
                                        <label className="label">
                                            วันหมดอายุ visa
                                        </label>
                                        <input
                                            type="date"
                                            value={visaExpiry}
                                            onChange={e =>
                                                setVisaExpiry(e.target.value)
                                            }
                                            className="input input-bordered"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            ฉีดวัคซีนโควิด (จำนวนเข็ม)
                                        </label>
                                        <input
                                            type="number"
                                            value={vaccinationNo}
                                            onChange={e =>
                                                setVaccinationNo(e.target.value)
                                            }
                                            className="input input-bordered"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            ทราบข่าวสารมาจาก
                                        </label>
                                        <input
                                            type="text"
                                            value={source}
                                            onChange={e =>
                                                setSource(e.target.value)
                                            }
                                            className="input input-bordered"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            หมายเหตุ
                                        </label>
                                        <textarea
                                            value={note}
                                            onChange={e =>
                                                setNote(e.target.value)
                                            }
                                            className="textarea textarea-bordered">
                                            {' '}
                                        </textarea>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            รหัสงานคู่
                                        </label>
                                        <input
                                            type="text"
                                            value={jobCode}
                                            onChange={e =>
                                                setJobCode(e.target.value)
                                            }
                                            className="input input-bordered"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 6: Photo Capture */}
                        {step === 5 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* ซ้าย: กล้องสำหรับ live feed */}
                                    <div className="flex flex-col items-center w-full h-full">
                                        <div className="w-full h-60 md:h-full">
                                            <video
                                                ref={videoRef}
                                                className="w-full h-full object-cover border border-gray-300 rounded-lg"
                                                autoPlay>
                                                {' '}
                                            </video>
                                        </div>
                                        <canvas
                                            id="canvas"
                                            width="320"
                                            height="240"
                                            className="hidden">
                                            {' '}
                                        </canvas>
                                    </div>

                                    {/* ขวา: รูปที่ถ่ายได้ */}
                                    <div className="flex flex-col items-center w-full h-full">
                                        {capturedPhoto ? (
                                            <img
                                                src={capturedPhoto}
                                                alt="Captured"
                                                className="w-full h-full object-cover border border-gray-300 rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex justify-center items-center w-full h-full rounded-lg bg-gray-100 border border-gray-300">
                                                <span className="text-gray-400 text-2xl font-semibold">
                                                    กดปุ่มถ่ายรูป{' '}
                                                    <FontAwesomeIcon
                                                        icon={faCamera}
                                                        className="fa-fw"
                                                    />{' '}
                                                    เพื่อจับภาพ
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <hr className="mt-3" />
                        <div className="mt-6 flex justify-between">
                            {step > 0 && (
                                <button
                                    onClick={handlePrevStep}
                                    className="btn btn-outline btn-lg">
                                    <FontAwesomeIcon
                                        icon={faAngleLeft}
                                        className="fa-fw "
                                    />
                                    ย้อนกลับ
                                </button>
                            )}
                            {step > 4 && (
                                <>
                                    <button
                                        onClick={capturePhoto}
                                        className="btn btn-circle text-white btn-neutral btn-lg">
                                        <FontAwesomeIcon
                                            icon={faCamera}
                                            className="fa-xl"
                                        />
                                    </button>
                                    <button
                                        onClick={handleFinalStep}
                                        className="btn text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 btn-lg">
                                        <FontAwesomeIcon
                                            icon={faFloppyDisk}
                                            className="fa-fw "
                                        />
                                        บันทึก
                                    </button>
                                </>
                            )}
                            {step < 5 && (
                                <button
                                    onClick={handleNextStep}
                                    className="btn btn-outline btn-lg">
                                    ถัดไป
                                    <FontAwesomeIcon
                                        icon={faAngleRight}
                                        className="fa-fw "
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
