import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faListCheck,
    faLanguage,
    faSimCard,
    faPassport,
    faUserNurse,
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

export default function regM() {
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState('')
    const [phone, setPhone] = useState('')
    const [altPhone, setAltPhone] = useState('')
    const [provinces, setProvinces] = useState([])
    const [selectedProvince, setSelectedProvince] = useState('')

    useEffect(() => {
        axios
            .get(
                'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json',
            )
            .then(response => {
                setProvinces(response.data)
                if (response.data.length > 0) {
                    setSelectedProvince(response.data[0].name_th) // เลือกจังหวัดแรกเป็นค่าเริ่มต้น
                }
            })
            .catch(error => console.error('Error:', error))
    }, [])

    const handleChange = event => {
        setSelectedProvince(event.target.value)
    }

    const handlePhoneChange = (value, setValue) => {
        // ตรวจสอบว่าข้อมูลที่ป้อนเป็นตัวเลขและมีความยาวไม่เกิน 11 ตัวอักษร
        if (/^\d{0,10}$/.test(value)) {
            setValue(value)
        }
    }

    const handleNumberChange = (value, setValue, max) => {
        if (
            /^\d*$/.test(value) &&
            (value === '' || (value >= 0 && value <= max))
        ) {
            setValue(value)
        }
    }

    return (
        <AppLayout>
            <div className="w-full">
                <div className="card bg-base-100 text-neutral shadow-xl">
                    <div className="card-body">
                        <div className="divider">
                            <h1 className="card-title lg:text-3xl text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-500 text-4xl font-bold justify-center">
                                <FontAwesomeIcon
                                    icon={faListCheck}
                                    className="pr-1 text-primary"
                                />{' '}
                                ลงทะเบียน!
                            </h1>
                        </div>
                        <form className="space-y-4">
                            <div className="flex flex-wrap">
                                <div className="form-control w-full md:w-1/2 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            รหัสสมัครงาน / รหัสลงทะเบียน
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="5M-000000"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="form-control w-full md:w-1/2 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            ประเทศที่เกิดและเดินทางมา
                                        </span>
                                        <span className="label-text-alt text-gray-300">
                                            **ไม่สามารถแก้ไขภายหลังได้
                                            หากเลือกผิด
                                        </span>
                                    </div>
                                    <select className="select select-bordered w-full">
                                        <option disabled selected>
                                            กรุณาเลือก
                                        </option>
                                        <option>พม่า</option>
                                        <option>ลาว</option>
                                        <option>กัมพูชา</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            เชื้อชาติ
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="เชื้อชาติ"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            สัญชาติ
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="สัญชาติ"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="form-control  w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            ศาสนา
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="ศาสนา"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </div>
                            <div className="divider">ข้อมูลส่วนตัว</div>
                            <div className="flex flex-wrap">
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            ชื่อ-นามสกุล (ชื่อเต็ม)
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="ชื่อตามบัตรประชาชน"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            ชื่อเล่น
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="ชื่อเล่น"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="form-control  w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            เพศ
                                        </span>
                                    </div>
                                    <select className="select select-bordered w-full">
                                        <option disabled selected>
                                            กรุณาเลือก
                                        </option>
                                        <option>ชาย</option>
                                        <option>หญิง</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            วันเดือนปีเกิด (คศ.)
                                        </span>
                                    </div>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            น้ำหนัก
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="น้ำหนัก"
                                        value={weight}
                                        onChange={e =>
                                            handleNumberChange(
                                                e.target.value,
                                                setWeight,
                                                300,
                                            )
                                        }
                                    />
                                </div>
                                <div className="form-control  w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            ส่วนสูง
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="ส่วนสูง"
                                        value={height}
                                        onChange={e =>
                                            handleNumberChange(
                                                e.target.value,
                                                setHeight,
                                                250,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            เบอร์ติดต่อ
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={phone}
                                        onChange={e =>
                                            handlePhoneChange(
                                                e.target.value,
                                                setPhone,
                                            )
                                        }
                                        placeholder="หมายเลขโทรศัพท์"
                                    />
                                </div>
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            เบอร์ติดต่อสำรอง
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={altPhone}
                                        onChange={e =>
                                            handlePhoneChange(
                                                e.target.value,
                                                setAltPhone,
                                            )
                                        }
                                        placeholder="หมายเลขโทรศัพท์สำรอง"
                                    />
                                </div>
                                <div className="form-control  w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            อยู่ไทยมากี่ปี
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="จำนวนปีที่อยู่ไทย"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            จังหวัด
                                        </span>
                                    </div>
                                    <select
                                        className="select select-bordered w-full "
                                        value={selectedProvince}
                                        onChange={handleChange}>
                                        <option disabled selected>
                                            กรุณาเลือก
                                        </option>
                                        {provinces.map((province, index) => (
                                            <option
                                                key={index}
                                                value={province.id}>
                                                {province.name_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            ที่อยู่ปัจจุบัน
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="ที่อยู่ปัจจุบันที่พักอาศัย"
                                    />
                                </div>
                                <div className="form-control  w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            ไปงานต่างจังหวัด
                                        </span>
                                    </div>
                                    <select className="select select-bordered w-full">
                                        <option disabled selected>
                                            กรุณาเลือก
                                        </option>
                                        <option>ได้</option>
                                        <option>ไม่ได้</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="form-control w-full md:w-1/2 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            สถานะ
                                        </span>
                                    </div>
                                    <select className="select select-bordered w-full">
                                        <option disabled selected>
                                            กรุณาเลือก
                                        </option>
                                        <option>โสด</option>
                                        <option>มีแฟน</option>
                                        <option>แต่งงานแล้ว</option>
                                        <option>ม่าย</option>
                                        <option>แยกทาง</option>
                                    </select>
                                </div>
                                <div className="form-control w-full md:w-1/2 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            มีลูกกี่คน
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="หากไม่มีให้ใส่ 0"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="form-control w-full px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            รูปแบบงาน
                                        </span>
                                    </div>
                                    <select className="select select-bordered w-full ">
                                        <option disabled selected>
                                            กรุณาเลือก
                                        </option>
                                        <option>อยู่ประจำ</option>
                                        <option>ไป-กลับ</option>
                                        <option>ได้ทั้งหมด</option>
                                    </select>
                                </div>
                            </div>
                            <div className="divider">เอกสาร</div>
                            <div className="flex flex-wrap">
                                <div className="form-control w-full md:w-1/3 p-3 mb-1 max-w-md mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg border border-gray-200 shadow-md overflow-hidden">
                                    <div className="flex justify-center mb-4">
                                        <h5 className="text-white text-xl font-bold">
                                            <FontAwesomeIcon icon={faSimCard} />{' '}
                                            รหัสประชาชน / Work permit
                                        </h5>
                                    </div>
                                    <div className="flex items-center px-3">
                                        <p className="text-lg font-semibold text-white">
                                            เลขบัตร
                                        </p>
                                        <input
                                            type="text"
                                            className="input input-bordered"
                                            placeholder="เลข 13 หลัก"
                                            maxLength="13"
                                            minLength="13"
                                        />
                                    </div>
                                    <div className="flex items-center px-3 my-4">
                                        <p className="text-lg font-semibold text-white">
                                            วันหมดอายุ
                                        </p>
                                        <input
                                            type="date"
                                            className="input input-bordered"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div className="form-control w-full md:w-1/3 p-3 mb-1 max-w-md mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-lg border border-gray-200 shadow-md overflow-hidden">
                                    <div className="flex justify-center mb-4">
                                        <h5 className="text-white text-xl font-bold">
                                            <FontAwesomeIcon
                                                icon={faPassport}
                                            />{' '}
                                            หนังสือเดินทาง / Passport
                                        </h5>
                                    </div>
                                    <div className="flex items-center px-3">
                                        <p className="text-lg font-semibold text-white">
                                            เลขบัตร
                                        </p>
                                        <input
                                            type="text"
                                            className="input input-bordered"
                                            placeholder="เลขหนังสือเดินทาง"
                                        />
                                    </div>
                                    <div className="flex items-center px-3 my-3">
                                        <p className="text-lg font-semibold text-white">
                                            วันหมดอายุ
                                        </p>
                                        <input
                                            type="date"
                                            className="input input-bordered"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div className="form-control w-full md:w-1/3 p-3 mb-1 max-w-md mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-lg border border-gray-200 shadow-md overflow-hidden">
                                    <div className="flex justify-center mb-4">
                                        <h5 className="text-white text-xl font-bold">
                                            <FontAwesomeIcon
                                                icon={faUserNurse}
                                            />{' '}
                                            วีซ่า / VISA
                                        </h5>
                                    </div>
                                    <div className="flex items-center px-3">
                                        <p className="text-lg font-semibold text-white">
                                            วันหมดอายุบัตร VISA
                                        </p>
                                        <input
                                            type="date"
                                            className="input input-bordered w-full"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="flex justify-between items-center px-3">
                                        <div className="label">
                                            <span className="text-lg font-semibold text-white">
                                                ใบอนุญาต
                                            </span>
                                        </div>
                                        <select className="select w-1/2">
                                            <option disabled selected>
                                                กรุณาเลือก
                                            </option>
                                            <option>มี</option>
                                            <option>ไม่มี</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="divider">ภาษาและการสื่อสาร</div>
                            <div className="flex flex-wrap">
                                <div className="w-full md:w-1/3 px-2 mb-1">
                                    <div className="card bg-base-100 shadow-xl">
                                        <figure className="bg-neutral-500 text-white font-bold p-2 text-lg justify-center">
                                            <FontAwesomeIcon
                                                icon={faLanguage}
                                                className="pr-2"
                                            />
                                            ภาษาไทย
                                        </figure>
                                        <div className="card-body p-0">
                                            <div className="flex">
                                                <div className="form-control w-1/3 p-0">
                                                    <h2 className="card-title justify-center">
                                                        พูด
                                                    </h2>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-0"
                                                            className="radio"
                                                            checked
                                                        />
                                                        <span className="label-text">
                                                            ได้
                                                        </span>
                                                    </label>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-0"
                                                            className="radio"
                                                        />
                                                        <span className="label-text">
                                                            ไม่ได้
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="divider divider-horizontal p-0 mx-1"></div>
                                                <div className="form-control w-1/3 p-0">
                                                    <h2 className="card-title justify-center">
                                                        อ่าน
                                                    </h2>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-2"
                                                            className="radio"
                                                            checked
                                                        />
                                                        <span className="label-text">
                                                            ได้
                                                        </span>
                                                    </label>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-2"
                                                            className="radio"
                                                        />
                                                        <span className="label-text">
                                                            ไม่ได้
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="divider divider-horizontal p-0 mx-1"></div>
                                                <div className="form-control w-1/3 p-0">
                                                    <h2 className="card-title justify-center">
                                                        เขียน
                                                    </h2>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-3"
                                                            className="radio"
                                                            checked
                                                        />
                                                        <span className="label-text">
                                                            ได้
                                                        </span>
                                                    </label>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-3"
                                                            className="radio"
                                                        />
                                                        <span className="label-text">
                                                            ไม่ได้
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 px-2 mb-1">
                                    <div className="card bg-base-100 shadow-xl">
                                        <figure className="bg-neutral-500 text-white font-bold p-2 text-lg justify-center">
                                            <FontAwesomeIcon
                                                icon={faLanguage}
                                                className="pr-2"
                                            />
                                            ภาษาอังกฤษ
                                        </figure>
                                        <div className="card-body p-0">
                                            <div className="flex">
                                                <div className="form-control w-1/3 p-0">
                                                    <h2 className="card-title justify-center">
                                                        พูด
                                                    </h2>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-4"
                                                            className="radio"
                                                            checked
                                                        />
                                                        <span className="label-text">
                                                            ได้
                                                        </span>
                                                    </label>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-4"
                                                            className="radio"
                                                        />
                                                        <span className="label-text">
                                                            ไม่ได้
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="divider divider-horizontal p-0 mx-1"></div>
                                                <div className="form-control w-1/3 p-0">
                                                    <h2 className="card-title justify-center">
                                                        อ่าน
                                                    </h2>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-5"
                                                            className="radio"
                                                            checked
                                                        />
                                                        <span className="label-text">
                                                            ได้
                                                        </span>
                                                    </label>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-5"
                                                            className="radio"
                                                        />
                                                        <span className="label-text">
                                                            ไม่ได้
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="divider divider-horizontal p-0 mx-1"></div>
                                                <div className="form-control w-1/3 p-0">
                                                    <h2 className="card-title justify-center">
                                                        เขียน
                                                    </h2>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-6"
                                                            className="radio"
                                                            checked
                                                        />
                                                        <span className="label-text">
                                                            ได้
                                                        </span>
                                                    </label>
                                                    <label className="label cursor-pointer px-3">
                                                        <input
                                                            type="radio"
                                                            name="radio-6"
                                                            className="radio"
                                                        />
                                                        <span className="label-text">
                                                            ไม่ได้
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-control w-full md:w-1/3 px-2 mb-1">
                                    <div className="label">
                                        <span className="label-text font-semibold">
                                            ภาษาอื่น ๆ หากมี
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="หากไม่มีให้ใส่ขีด"
                                        maxLength="9"
                                        minLength="9"
                                    />
                                </div>
                            </div>
                            <div className="divider">ประวัติการทำงาน</div>
                            <div className="flex flex-wrap">..</div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                บันทึกข้อมูล
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
