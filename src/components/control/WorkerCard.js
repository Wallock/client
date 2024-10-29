import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCircleCheck,
    faCirclePause,
    faFileCircleCheck,
    faClock,
    faArrowRightArrowLeft,
    faPersonCircleExclamation,
    faUserCheck,
    faCircleXmark,
    faQuestion,
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
const WorkerCard = ({
    item,
    imageLoading,
    setImageLoading,
    handleFreeButtonClick,
    getBackgroundClass,
    getFlagUrl,
    getfapi,
}) => {
    const getStatusData = status => {
        switch (status) {
            case 'wait':
                return {
                    styles: 'bg-gray-100 text-gray-500 border-gray-500',
                    icon: faClock,
                    text: 'ว่างงาน',
                }
            case 'save':
                return {
                    styles: 'bg-amber-400 text-gray-800 border-amber-800',
                    icon: faCirclePause,
                    text: 'จอง',
                }
            case 'incomplete':
                return {
                    styles: 'bg-blue-500 text-white border-blue-500',
                    icon: faFileCircleCheck,
                    text: 'รอทำสัญญา',
                }
            case 'woker':
                return {
                    styles: 'bg-emerald-600 text-white border-emerald-200',
                    icon: faCircleCheck,
                    text: 'ได้งานแล้ว',
                }
            case 'retry':
                return {
                    styles: 'bg-purple-500 text-white border-purple-200',
                    icon: faPersonCircleExclamation,
                    text: 'เคลม',
                }
            case 'changepp':
                return {
                    styles: 'bg-gray-500 text-white border-white',
                    icon: faArrowRightArrowLeft,
                    text: 'เปลี่ยน',
                }
            case 'bfprocess':
                return {
                    styles: 'bg-cyan-400 text-gray-700 border-gray-800',
                    icon: faUserCheck,
                    text: 'สพ.แล้ว',
                }
            case 'export':
                return {
                    styles: 'bg-red-100 text-red-500 border-red-500',
                    icon: faCircleXmark,
                    text: 'ห้ามส่งงาน',
                }
            default:
                return {
                    styles: '',
                    icon: faQuestion,
                    text: 'Unknown Status',
                }
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full lg:w-48 mx-1">
            <Link href={`./info/${item?.worker_id}`}>
                <div
                    className={`relative p-0.5 rounded-xl transition duration-300 hover:scale-105 bg-gradient-to-r bg-gradient-to-r ${
                        item?.worker_status === 'wait'
                            ? 'from-transparent to-transparent' // เพิ่มความแตกต่างระหว่างสีเข้มและสว่าง
                            : item?.worker_status === 'save'
                            ? 'from-yellow-400 to-yellow-800' // เพิ่มความสว่างและคอนทราสต์
                            : item?.worker_status === 'incomplete'
                            ? 'from-indigo-400 to-blue-800' // ใช้สีที่เข้มและสว่างขึ้น
                            : item?.worker_status === 'woker'
                            ? 'from-green-400 to-cyan-800' // เพิ่มสีที่สดใสขึ้น
                            : item?.worker_status === 'retry'
                            ? 'from-purple-400 to-pink-800' // เพิ่มคอนทราสต์ระหว่างสี
                            : item?.worker_status === 'changepp'
                            ? 'from-gray-400 to-gray-800' // ใช้สีที่มีความแตกต่างมากขึ้น
                            : item?.worker_status === 'bfprocess'
                            ? 'from-blue-400 to-cyan-800' // ใช้สีน้ำเงินที่สว่างขึ้น
                            : item?.worker_status === 'export'
                            ? 'from-red-400 to-orange-500' // เพิ่มความสดใสของสีแดงและส้ม
                            : 'from-transparent to-transparent' // ค่าเริ่มต้นที่เพิ่มคอนทราสต์เล็กน้อย
                    }`}>
                    {/* Card content */}
                    <div
                        className="card indicator w-full bg-base-100 dark:bg-gray-700 shadow-xl rounded-xl "
                        style={{ height: '340px' }}>
                        {/* onClick={() => handleFreeButtonClick(item.worker_id)}> */}
                        <figure
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '190px',
                            }}>
                            {imageLoading && (
                                <span className="loading loading-bars loading-lg">
                                    {' '}
                                </span>
                            )}
                            <img
                                src={
                                    item.worker_image
                                        ? `${getfapi}/${item.worker_image}`
                                        : '/images/blank-picture.webp'
                                }
                                alt={
                                    item.worker_fullname || 'No image available'
                                } // แสดงข้อความสำรองหากไม่มี worker_fullname
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: imageLoading ? 'none' : 'block',
                                }}
                                onLoad={() => setImageLoading(false)}
                            />
                            <figcaption
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    background: 'rgba(45, 45, 45, 0.6)',
                                    color: 'white',
                                    padding: '5px',
                                    fontSize: '18px',
                                }}>
                                {item.worker_nickname}
                            </figcaption>
                            <figcaption
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '0',
                                    background: 'rgba(0, 0, 0, 0)',
                                    padding: '3px',
                                }}>
                                <img
                                    width={35}
                                    height={35}
                                    src={getFlagUrl(item.worker_type)}
                                    alt={`Flag for ${item.worker_type}`}
                                    style={{
                                        width: '50px',
                                        height: 'auto',
                                    }}
                                />
                            </figcaption>
                        </figure>
                        <span className="indicator-item indicator-center badge badge-neutral">
                            <div className="font-bold">
                                {item.worker_id}{' '}
                                {item.worker_namelist === 1 ? (
                                    <label className="text-red-400">
                                        NameList
                                    </label>
                                ) : null}
                            </div>
                        </span>
                        <div className="card-body p-0 overflow-hidden">
                            {(() => {
                                const { styles, icon, text } = getStatusData(
                                    item.worker_status,
                                )
                                return (
                                    <h2
                                        className={`card-title py-1 font-bold justify-center border-dashed border-b ${styles}`}>
                                        <FontAwesomeIcon
                                            icon={icon}
                                            className="fa-fw"
                                        />
                                        {text}
                                    </h2>
                                )
                            })()}
                            <div className="px-2">
                                <ul className="list">
                                    {item.workposition_id1 && (
                                        <li
                                            className={`badge text-xs p-1 ${getBackgroundClass(
                                                item.workposition_id1,
                                            )}`}>
                                            {item.workposition_id1}
                                        </li>
                                    )}
                                    {item.workposition_id2 && (
                                        <li
                                            className={`badge text-xs p-1 ${getBackgroundClass(
                                                item.workposition_id2,
                                            )}`}>
                                            {item.workposition_id2}
                                        </li>
                                    )}
                                    {item.workposition_id3 && (
                                        <li
                                            className={`badge text-xs p-1 ${getBackgroundClass(
                                                item.workposition_id3,
                                            )}`}>
                                            {item.workposition_id3}
                                        </li>
                                    )}
                                    {item.workposition_id4 && (
                                        <li
                                            className={`badge text-xs p-1 ${getBackgroundClass(
                                                item.workposition_id4,
                                            )}`}>
                                            {item.workposition_id4}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="card-actions justify-center border-dashed border-t py-2 px-2">
                            <p className="text-center text-xs font-semibold text-gray-400 dark:text-gray-300">
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                    className="fa-fw me-1"
                                />
                                คลิ๊กเพื่อดูรายละเอียด
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default WorkerCard
