import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTasks,
    faXmark,
    faCircleXmark,
    faUsersRectangle,
    faServer,
} from '@fortawesome/free-solid-svg-icons'

const SearchFilter = ({
    searchWorkerId,
    handleSearchWorkerId,
    handleResetSearch,
    setSearchWorkerId,
    systemName,
    showOnlyTypeT,
    showOnlyTypeC,
    showOnlyTypeM,
    showOnlyTypeL,
    setShowOnlyTypeT,
    setShowOnlyTypeC,
    setShowOnlyTypeM,
    setShowOnlyTypeL,

    showOvernightt,
    showOvernightf,
    setShowOnlyOvernightt,
    setShowOnlyOvernightf,
    selectedStatus,
    setSelectedStatus,
    selectedJob,
    setSelectedJob,

    selectedZone,
    setSelectedZone,

    selectedOutside,
    setSelectedOutside,
}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    return (
        <>
            <div className="flex items-center justify-center">
                <div className="navbar bg-white dark:bg-gray-800 shadow-md px-3">
                    <div className="navbar navbar-start hidden lg:flex">
                        {/* ไม่ใช้ collapse-class แต่ใช้การควบคุมด้วย state */}
                        <div className="relative mx-5">
                            {/* รูปทรงสี่เหลี่ยม ตัดสีฟ้า และแบบเฉียง */}
                            <div className="absolute inset-0 bg-blue-600 transform -skew-x-12">
                                {' '}
                            </div>
                            <div className="relative z-10 text-xl font-bold text-center text-white text-shadow-sm px-4 py-2">
                                <FontAwesomeIcon
                                    icon={faServer}
                                    className="fa-fw me-2"
                                />
                                {systemName}
                            </div>
                        </div>
                        <div className="bg-gray-100 border-2 rounded-box mx-5 p-2 shadow-md">
                            <div
                                className="text-lg font-semibold cursor-pointer "
                                onClick={() => setIsPopupOpen(true)}>
                                <FontAwesomeIcon
                                    icon={faTasks}
                                    className="me-2"
                                />{' '}
                                ตั้งค่าการแสดงผล
                            </div>
                        </div>
                    </div>
                    <div className="navbar navbar-end lg:navbar-center w-full lg:w-1/2">
                        <div className="join">
                            <input
                                type="text"
                                placeholder="ค้นหารหัส / ชื่อ / เบอร์โทร ได้ที่นี่"
                                value={searchWorkerId}
                                onChange={e =>
                                    setSearchWorkerId(e.target.value)
                                }
                                className="input bg-gray-100 w-full lg:w-80 join-item"
                            />
                            <button
                                className="btn btn-neutral join-item"
                                onClick={() =>
                                    handleSearchWorkerId(searchWorkerId)
                                }>
                                ค้นหารหัส
                            </button>
                            <button
                                className="btn btn-error btn-outline join-item"
                                onClick={() => handleResetSearch()}>
                                รีเซ็ต
                            </button>
                        </div>
                    </div>
                </div>
                {/* Popup Modal */}
                {isPopupOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-11/12 lg:w-1/2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold font-3 drop-shadow">
                                    <FontAwesomeIcon
                                        icon={faTasks}
                                        className="me-2"
                                    />{' '}
                                    ตั้งค่าการแสดงผล
                                </h2>
                                <button
                                    className="text-slat-800"
                                    onClick={() => setIsPopupOpen(false)}>
                                    <FontAwesomeIcon
                                        icon={faCircleXmark}
                                        className="fa-2xl"
                                    />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                {/* โซนประเทศ */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                    <ul className="bg-gray-100 menu menu-sm rounded-box mb-1">
                                        <li className="menu-title">
                                            โซนประเทศ
                                        </li>
                                        <li>
                                            <div className="form-control p-0 px-2">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={showOnlyTypeT}
                                                        className="checkbox me-3"
                                                        onChange={() =>
                                                            setShowOnlyTypeT(
                                                                !showOnlyTypeT,
                                                            )
                                                        }
                                                    />
                                                    <span className="label-text">
                                                        ไทย
                                                    </span>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-control p-0 px-2">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={showOnlyTypeC}
                                                        className="checkbox me-3"
                                                        onChange={() =>
                                                            setShowOnlyTypeC(
                                                                !showOnlyTypeC,
                                                            )
                                                        }
                                                    />
                                                    <span className="label-text">
                                                        กัมพูชา
                                                    </span>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-control p-0 px-2">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={showOnlyTypeM}
                                                        className="checkbox me-3"
                                                        onChange={() =>
                                                            setShowOnlyTypeM(
                                                                !showOnlyTypeM,
                                                            )
                                                        }
                                                    />
                                                    <span className="label-text">
                                                        พม่า
                                                    </span>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-control p-0 px-2">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={showOnlyTypeL}
                                                        className="checkbox me-3"
                                                        onChange={() =>
                                                            setShowOnlyTypeL(
                                                                !showOnlyTypeL,
                                                            )
                                                        }
                                                    />
                                                    <span className="label-text">
                                                        ลาว
                                                    </span>
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                    {/* รูปแบบงาน */}
                                    <ul className="bg-gray-100 menu rounded-box mb-1">
                                        <li className="menu-title">
                                            รูปแบบงาน
                                        </li>
                                        <li>
                                            <div className="form-control p-0 px-2">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={showOvernightt}
                                                        className="checkbox me-3"
                                                        onChange={() =>
                                                            setShowOnlyOvernightt(
                                                                !showOvernightt,
                                                            )
                                                        }
                                                    />
                                                    <span className="label-text">
                                                        ไป-กลับ
                                                    </span>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-control p-0 px-2">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={showOvernightf}
                                                        className="checkbox me-3"
                                                        onChange={() =>
                                                            setShowOnlyOvernightf(
                                                                !showOvernightf,
                                                            )
                                                        }
                                                    />
                                                    <span className="label-text">
                                                        อยู่ประจำ
                                                    </span>
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* ประเภทงาน */}
                                <ul className="bg-gray-100 menu menu-horizontal rounded-box mb-1">
                                    <li className="menu-title w-full">
                                        ประเภทงาน
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="JobGroup"
                                                    checked={
                                                        selectedJob === null
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedJob(null)
                                                    }
                                                />
                                                <span className="label-text">
                                                    ทั้งหมด
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="JobGroup"
                                                    checked={
                                                        selectedJob ===
                                                        'แม่บ้านทั่วไป'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedJob(
                                                            'แม่บ้านทั่วไป',
                                                        )
                                                    }
                                                />
                                                <span className="label-text">
                                                    แม่บ้านทั่วไป
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="JobGroup"
                                                    checked={
                                                        selectedJob ===
                                                        'พี่เลี้ยงน้อง'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedJob(
                                                            'พี่เลี้ยงน้อง',
                                                        )
                                                    }
                                                />
                                                <span className="label-text">
                                                    พี่เลี้ยงเด็ก
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="JobGroup"
                                                    checked={
                                                        selectedJob ===
                                                        'ดูแลผู้สูงอายุ'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedJob(
                                                            'ดูแลผู้สูงอายุ',
                                                        )
                                                    }
                                                />
                                                <span className="label-text">
                                                    คนดูแลผู้สูงอายุ
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="JobGroup"
                                                    checked={
                                                        selectedJob ===
                                                        'แม่บ้านพี่เลี้ยงน้อง'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedJob(
                                                            'แม่บ้านพี่เลี้ยงน้อง',
                                                        )
                                                    }
                                                />
                                                <span className="label-text">
                                                    แม่บ้าน+พี่เลี้ยงเด็ก
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="JobGroup"
                                                    checked={
                                                        selectedJob ===
                                                        'แม่บ้านดูแลผู้สูงอายุ'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedJob(
                                                            'แม่บ้านดูแลผู้สูงอายุ',
                                                        )
                                                    }
                                                />
                                                <span className="label-text">
                                                    แม่บ้าน+คนดูแลผู้สูงอายุ
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="JobGroup"
                                                    checked={
                                                        selectedJob === 'กรรมกร'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedJob('กรรมกร')
                                                    }
                                                />
                                                <span className="label-text">
                                                    กรรมกร
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="JobGroup"
                                                    checked={
                                                        selectedJob ===
                                                        'พ่อบ้านทั่วไป'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedJob(
                                                            'พ่อบ้านทั่วไป',
                                                        )
                                                    }
                                                />
                                                <span className="label-text">
                                                    พ่อบ้าน
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                </ul>

                                {/* พื้นที่ */}
                                <ul className="bg-gray-100 menu rounded-box mb-1">
                                    <li className="menu-title">พื้นที่ทำงาน</li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="OutsideGroup"
                                                    checked={
                                                        selectedOutside === null
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedOutside(null)
                                                    }
                                                />
                                                <span className="label-text">
                                                    ได้ทั้งหมด
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="OutsideGroup"
                                                    checked={
                                                        selectedOutside === '2'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedOutside('2')
                                                    }
                                                />
                                                <span className="label-text">
                                                    เฉพาะในกรุงเทพ
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="OutsideGroup"
                                                    checked={
                                                        selectedOutside === '1'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedOutside('1')
                                                    }
                                                />
                                                <span className="label-text">
                                                    สามารถไปต่างจังหวัดได้
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                </ul>

                                {/* ภูมิภาค */}
                                <ul className="bg-gray-100 menu menu-horizontal rounded-box mb-1">
                                    <li className="menu-title w-full">
                                        ภูมิภาค
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="ZoneGroup"
                                                    checked={
                                                        selectedZone === null
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedZone(null)
                                                    }
                                                />
                                                <span className="label-text">
                                                    ทุกภาค
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="ZoneGroup"
                                                    checked={
                                                        selectedZone === '1'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedZone('1')
                                                    }
                                                />
                                                <span className="label-text">
                                                    ภาคเหนือ
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="ZoneGroup"
                                                    checked={
                                                        selectedZone === '2'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedZone('2')
                                                    }
                                                />
                                                <span className="label-text">
                                                    ภาคอีสาน
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="ZoneGroup"
                                                    checked={
                                                        selectedZone === '3'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedZone('3')
                                                    }
                                                />
                                                <span className="label-text">
                                                    ภาคกลาง
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="ZoneGroup"
                                                    checked={
                                                        selectedZone === '4'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedZone('4')
                                                    }
                                                />
                                                <span className="label-text">
                                                    ภาคตะวันออก
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="ZoneGroup"
                                                    checked={
                                                        selectedZone === '5'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedZone('5')
                                                    }
                                                />
                                                <span className="label-text">
                                                    ภาคตะวันตก
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="form-control p-0 px-2">
                                            <label className="label cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="ZoneGroup"
                                                    checked={
                                                        selectedZone === '6'
                                                    }
                                                    className="radio me-3"
                                                    onChange={() =>
                                                        setSelectedZone('6')
                                                    }
                                                />
                                                <span className="label-text">
                                                    ภาคใต้
                                                </span>
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* ปุ่มปิด popup */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    className="btn border-3 text-lg border-blue-900 bg-blue-600 text-white hover:bg-blue-800 w-full shadow-lg"
                                    onClick={() => setIsPopupOpen(false)}>
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        className="fa-fw"
                                    />
                                    ปิดหน้าต่าง
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full">
                <div className="flex items-center justify-evenly">
                    {/* สถานะ */}
                    <ul className="menu menu-sm menu-horizontal mb-1">
                        <li className="menu-title w-full">สถานะ</li>
                        <li>
                            <button
                                className={`btn text-xl font-bold mx-1 ${
                                    selectedStatus === null
                                        ? 'button-js'
                                        : 'button-js-outline'
                                }`}
                                onClick={() => setSelectedStatus(null)}>
                                ทั้งหมด
                            </button>
                        </li>
                        <li>
                            <button
                                className={`btn text-xl font-bold mx-1 ${
                                    selectedStatus === 'wait'
                                        ? 'button-js'
                                        : 'button-js-outline'
                                }`}
                                onClick={() => setSelectedStatus('wait')}>
                                ว่างงาน
                            </button>
                        </li>
                        <li>
                            <button
                                className={`btn text-xl font-bold mx-1 ${
                                    selectedStatus === 'save'
                                        ? 'button-js'
                                        : 'button-js-outline'
                                }`}
                                onClick={() => setSelectedStatus('save')}>
                                ติดจอง
                            </button>
                        </li>
                        <li>
                            <button
                                className={`btn text-xl font-bold mx-1 ${
                                    selectedStatus === 'changepp'
                                        ? 'button-js'
                                        : 'button-js-outline'
                                }`}
                                onClick={() => setSelectedStatus('changepp')}>
                                เปลี่ยน
                            </button>
                        </li>
                        <li>
                            <button
                                className={`btn text-xl font-bold mx-1 ${
                                    selectedStatus === 'retry'
                                        ? 'button-js'
                                        : 'button-js-outline'
                                }`}
                                onClick={() => setSelectedStatus('retry')}>
                                เคลม
                            </button>
                        </li>
                        <li>
                            <button
                                className={`btn text-xl font-bold mx-1 ${
                                    selectedStatus === 'incomplete'
                                        ? 'button-js'
                                        : 'button-js-outline '
                                }`}
                                onClick={() => setSelectedStatus('incomplete')}>
                                รอทำสัญญา
                            </button>
                        </li>
                        <li>
                            <button
                                className={`btn text-xl font-bold mx-1 ${
                                    selectedStatus === 'bfprocess'
                                        ? 'button-js'
                                        : 'button-js-outline'
                                }`}
                                onClick={() => setSelectedStatus('bfprocess')}>
                                สพ.แล้ว
                            </button>
                        </li>
                        <li>
                            <button
                                className={`btn text-xl font-bold mx-1 ${
                                    selectedStatus === 'woker'
                                        ? 'button-js'
                                        : 'button-js-outline'
                                }`}
                                onClick={() => setSelectedStatus('woker')}>
                                ได้งานแล้ว
                            </button>
                        </li>
                        <li>
                            <button
                                className={`btn text-xl font-bold mx-1 ${
                                    selectedStatus === 'export'
                                        ? 'button-js'
                                        : 'button-js-outline'
                                }`}
                                onClick={() => setSelectedStatus('export')}>
                                ไม่ส่งงาน
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default SearchFilter
