import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheckCircle,
    faSave,
    faUserEdit,
    faKey,
    faUserLock,
    faEyeSlash,
    faUserCircle,
    faTimesCircle,
    faUserShield,
    faEye,
    faUsers,
} from '@fortawesome/free-solid-svg-icons'

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalData, setModalData] = useState({})
    const [isEditMode, setIsEditMode] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [lastUserCount, setLastUserCount] = useState(0)
    const itemsPerPage = 10 // Limit to 20 items per page
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [currentPage])

    useEffect(() => {
        const intervalId = setInterval(() => {
            checkForUpdates()
        }, 10000)

        return () => clearInterval(intervalId)
    }, [lastUserCount])

    const getBadgeProps = role => {
        const numericRole = Number(role) // Convert role to a number

        switch (numericRole) {
            case 0:
                return { color: 'ghost', text: 'ไม่มี' }
            case 1:
                return { color: 'primary', text: 'แอดมิน' }
            case 2:
                return { color: 'secondary', text: 'เซลล์' }
            case 3:
                return { color: 'warning', text: 'ผู้แก้ไข' }
            case 4:
                return { color: 'danger', text: 'ผู้จัดการ' }
            case 5:
                return { color: 'accent', text: 'ผู้ดูแล' }
            case 99:
                return { color: 'gold', text: 'ผู้พัฒนา' }
            default:
                return { color: 'gray', text: 'Unknown Role' }
        }
    }

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('accessToken')
            const response = await axios.get(
                'https://server.wb.in.th/api/users',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                    },
                },
            )
            setUsers(response.data.data)
            setTotalPages(Math.ceil(response.data.total / itemsPerPage)) // Calculate total pages
        } catch (error) {
            //console.error('Error :', error)
        } finally {
            setLoading(false)
        }
    }

    const checkForUpdates = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            const response = await axios.get(
                'https://server.wb.in.th/api/users/reload',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            )

            const newCount = response.data.data // ดึงยอด count ล่าสุดจาก response

            if (newCount !== lastUserCount) {
                // ถ้ายอด count เปลี่ยนแปลง
                setLastUserCount(newCount)
                fetchUsers() // ดึงข้อมูลใหม่
            }
        } catch (error) {
            //console.error('Error checking for updates:', error)
        }
    }

    const filteredUsers = users.filter(
        user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleOpenEditModal = (data = {}) => {
        setModalData(data)
        setIsEditMode(!!data.id) // If data has an id, we are in edit mode
        setIsEditModalOpen(true)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleOpenPasswordModal = (data = {}) => {
        setModalData(data)
        setIsPasswordModalOpen(true)
    }

    const handleOpenDetailsModal = (data = {}) => {
        setModalData(data)
        setIsDetailsModalOpen(true)
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
        setModalData({})
    }

    const handleClosePasswordModal = () => {
        setIsPasswordModalOpen(false)
        setModalData({})
    }

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false)
        setModalData({})
    }

    const handleSave = async () => {
        const token = localStorage.getItem('accessToken')
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }

        try {
            await axios.put(
                `https://server.wb.in.th/api/users/${modalData.id}`,
                {
                    name: modalData.name,
                    role: Number(modalData.role),
                    type48: modalData.type48,
                    type82: modalData.type82,
                    typethai: modalData.typethai,
                    typelaos: modalData.typelaos,
                    uid48: modalData.uid48,
                    uid82: modalData.uid82,
                    uidthai: modalData.uidthai,
                    uidlaos: modalData.uidlaos,
                },
                { headers },
            )
            toast.success('User updated successfully!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            fetchUsers() // Refresh the data
            handleCloseEditModal()
        } catch (error) {
            //console.error('Error checking for updates:', error)
            toast.error('Failed to update user. Please try again.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const handlePasswordReset = async newPassword => {
        const token = localStorage.getItem('accessToken')
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
        if (modalData.newPassword !== modalData.confirmPassword) {
            toast.error('Passwords do not match!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            return
        }
        try {
            await axios.put(
                `https://server.wb.in.th/api/users/${modalData.id}/reset-password`,
                { password: newPassword },
                { headers },
            )
            toast.success('Password reset successfully!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            handleClosePasswordModal()
        } catch (error) {
            //console.error('Error checking for updates:', error)
            toast.error('Failed to reset password. Please try again.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    return (
        <AppLayout>
            <ToastContainer />
            <div className="w-full p-4">
                <h1 className="text-2xl font-bold mb-4">
                    <FontAwesomeIcon icon={faUsers} /> User Management
                </h1>
                <div className="mb-4">
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="ค้นหาด้วยชื่อหรืออีเมล"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                {loading ? (
                    <div className="w-full p-3">
                        <div className="flex items-center justify-center flex-wrap gap-4">
                            <div className="skeleton h-32 w-full"> </div>
                            <div className="skeleton h-4 w-28"> </div>
                            <div className="skeleton h-4 w-full"> </div>
                            <div className="skeleton h-4 w-full"> </div>
                        </div>
                    </div>
                ) : (
                    <div className="card card bg-base-100 shadow-xl p-1 overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="text-center">
                                    <th>โปรไฟล์</th>
                                    <th>ชื่อผู้ใช้</th>
                                    <th>อีเมล</th>
                                    <th>ระดับ</th>
                                    <th>นาซ่า</th>
                                    <th>ดีดีเมท</th>
                                    <th>ไทยออนไลน์</th>
                                    <th>ลาว</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody className="hover">
                                {filteredUsers.map(user => (
                                    <tr
                                        key={user.id}
                                        onClick={() =>
                                            handleOpenDetailsModal(user)
                                        }
                                        className="cursor-pointer hover:bg-gray-100">
                                        <td className="text-center">
                                            <div className="avatar">
                                                <div className="w-12 h-12 mask mask-squircle">
                                                    <img
                                                        src={
                                                            user.profile_photo_url
                                                        }
                                                        alt="Profile Photo"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="text-center">
                                            <div
                                                className={`badge badge-${
                                                    getBadgeProps(user.role)
                                                        .color
                                                } badge-outline mx-1 text-xs font-semibold`}>
                                                {getBadgeProps(user.role).text}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {user.type48 ? (
                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    className="text-red-500"
                                                />
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {user.type82 ? (
                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    className="text-red-500"
                                                />
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {user.typethai ? (
                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    className="text-red-500"
                                                />
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {user.typelaos ? (
                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    className="text-red-500"
                                                />
                                            )}
                                        </td>
                                        <td className="space-x-1 text-center">
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    handleOpenEditModal(user)
                                                }}
                                                className="btn btn-square btn-sm">
                                                <FontAwesomeIcon
                                                    icon={faUserShield}
                                                />
                                            </button>
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    handleOpenPasswordModal(
                                                        user,
                                                    )
                                                }}
                                                className="btn btn-square btn-sm">
                                                <FontAwesomeIcon icon={faKey} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center m-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="btn btn-outline btn-sm disabled:btn-disabled">
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="btn btn-outline btn-sm disabled:btn-disabled">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-xl font-bold mb-4">
                            <FontAwesomeIcon icon={faUserEdit} /> แก้ไขข้อมูล
                        </h2>
                        <div className="mb-4">
                            <label className="input input-bordered font-semibold flex items-center gap-2">
                                ชื่อผู้ใช้
                                <input
                                    type="text"
                                    className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                    placeholder="name"
                                    value={modalData.name || ''}
                                    onChange={e =>
                                        setModalData({
                                            ...modalData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold">
                                ระดับ
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={modalData.role} // Set the value of the select element
                                onChange={e =>
                                    setModalData({
                                        ...modalData,
                                        role: e.target.value,
                                    })
                                }>
                                {/* Populate the select options based on getBadgeProps */}
                                <option value="0">
                                    {getBadgeProps(0).text}
                                </option>
                                <option value="1">
                                    {getBadgeProps(1).text}
                                </option>
                                <option value="2">
                                    {getBadgeProps(2).text}
                                </option>
                                <option value="3">
                                    {getBadgeProps(3).text}
                                </option>
                                <option value="4">
                                    {getBadgeProps(4).text}
                                </option>
                                <option value="5">
                                    {getBadgeProps(5).text}
                                </option>
                                <option value="99">
                                    {getBadgeProps(99).text}
                                </option>
                            </select>
                        </div>
                        <div className="divider">สิทธิ์การใช้งานระบบ</div>
                        <div className="mb-4 form-control">
                            <label className="cursor-pointer label">
                                <span className="label-text">ระบบ - นาซ่า</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success"
                                    checked={modalData.type48 || false}
                                    onChange={e =>
                                        setModalData({
                                            ...modalData,
                                            type48: e.target.checked,
                                        })
                                    }
                                />
                            </label>
                            {modalData.type48 ? (
                                <label className="input input-sm input-bordered flex items-center gap-2">
                                    UID - 48
                                    <input
                                        type="number"
                                        className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                        value={modalData.uid48 || ''}
                                        onChange={e =>
                                            setModalData({
                                                ...modalData,
                                                uid48: e.target.value,
                                            })
                                        }
                                    />
                                </label>
                            ) : (
                                <>
                                    <hr />
                                </>
                            )}
                        </div>
                        <div className="mb-4 form-control">
                            <label className="cursor-pointer label">
                                <span className="label-text">
                                    ระบบ - ดีดีเมท
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success"
                                    checked={modalData.type82 || false}
                                    onChange={e =>
                                        setModalData({
                                            ...modalData,
                                            type82: e.target.checked,
                                        })
                                    }
                                />
                            </label>
                            {modalData.type82 ? (
                                <label className="input input-sm input-bordered flex items-center gap-2">
                                    UID - 82
                                    <input
                                        type="number"
                                        className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                        value={modalData.uid82 || ''}
                                        onChange={e =>
                                            setModalData({
                                                ...modalData,
                                                uid82: e.target.value,
                                            })
                                        }
                                    />
                                </label>
                            ) : (
                                <>
                                    <hr />
                                </>
                            )}
                        </div>
                        <div className="mb-4 form-control">
                            <label className="cursor-pointer label">
                                <span className="label-text">
                                    ระบบ - ไทยออนไลน์
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success"
                                    checked={modalData.typethai || false}
                                    onChange={e =>
                                        setModalData({
                                            ...modalData,
                                            typethai: e.target.checked,
                                        })
                                    }
                                />
                            </label>
                            {modalData.typethai ? (
                                <label className="input input-sm input-bordered flex items-center gap-2">
                                    UID - Thai
                                    <input
                                        type="number"
                                        className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                        value={modalData.uidthai || ''}
                                        onChange={e =>
                                            setModalData({
                                                ...modalData,
                                                uidthai: e.target.value,
                                            })
                                        }
                                    />
                                </label>
                            ) : (
                                <>
                                    <hr />
                                </>
                            )}
                        </div>
                        <div className="mb-4 form-control">
                            <label className="cursor-pointer label">
                                <span className="label-text">ระบบ - ลาว</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success"
                                    checked={modalData.typelaos || false}
                                    onChange={e =>
                                        setModalData({
                                            ...modalData,
                                            typelaos: e.target.checked,
                                        })
                                    }
                                />
                            </label>
                            {modalData.typelaos ? (
                                <label className="input input-sm input-bordered flex items-center gap-2">
                                    UID - Laos
                                    <input
                                        type="number"
                                        className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                        value={modalData.uidlaos || ''}
                                        onChange={e =>
                                            setModalData({
                                                ...modalData,
                                                uidlaos: e.target.value,
                                            })
                                        }
                                    />
                                </label>
                            ) : (
                                <>
                                    <hr />
                                </>
                            )}
                        </div>
                        <div className="modal-action">
                            <button
                                onClick={handleSave}
                                className="btn btn-neutral ">
                                <FontAwesomeIcon icon={faSave} />
                                แก้ไข
                            </button>
                            <button
                                onClick={handleCloseEditModal}
                                className="btn btn-ghost">
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {isPasswordModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-xl font-bold mb-4">
                            <FontAwesomeIcon icon={faUserLock} /> Reset Password
                        </h2>
                        <div className="mb-4">
                            <label className="input input-bordered flex items-center gap-2">
                                Password
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                    value={modalData.newPassword || ''}
                                    onChange={e =>
                                        setModalData({
                                            ...modalData,
                                            newPassword: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    className="ml-2"
                                    onClick={togglePasswordVisibility}>
                                    {showPassword ? (
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    ) : (
                                        <FontAwesomeIcon icon={faEye} />
                                    )}
                                </button>
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="input input-bordered flex items-center gap-2">
                                Confirm Password
                                <input
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Confirm new password"
                                    className="border-none outline-none grow focus:outline-none focus:ring-0 focus:border-transparent"
                                    value={modalData.confirmPassword || ''}
                                    onChange={e =>
                                        setModalData({
                                            ...modalData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    className="ml-2"
                                    onClick={toggleConfirmPasswordVisibility}>
                                    {showConfirmPassword ? (
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    ) : (
                                        <FontAwesomeIcon icon={faEye} />
                                    )}
                                </button>
                            </label>
                        </div>
                        <div className="modal-action">
                            <button
                                onClick={() =>
                                    handlePasswordReset(modalData.newPassword)
                                }
                                className="btn btn-neutral">
                                <FontAwesomeIcon icon={faKey} /> Reset Password
                            </button>
                            <button
                                onClick={handleClosePasswordModal}
                                className="btn btn-ghost">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {isDetailsModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-xl font-bold mb-4">
                            <FontAwesomeIcon icon={faUserCircle} /> User Details
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold">
                                Username
                            </label>
                            <p>
                                {modalData.username}#{modalData.id}
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold">
                                Created At
                            </label>
                            <p>
                                {new Date(modalData.created_at).toLocaleString(
                                    'th-TH',
                                )}
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold">
                                Updated At
                            </label>
                            <p>
                                {new Date(modalData.updated_at).toLocaleString(
                                    'th-TH',
                                )}
                            </p>
                        </div>
                        <div className="modal-action">
                            <button
                                onClick={handleCloseDetailsModal}
                                className="btn btn-ghost ">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
