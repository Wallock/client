import AppLayout from '@/components/Layouts/AppLayout'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalData, setModalData] = useState({})
    const [isEditMode, setIsEditMode] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const itemsPerPage = 20 // Limit to 20 items per page

    useEffect(() => {
        fetchAnnouncements()
    }, [currentPage])

    const fetchAnnouncements = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('accessToken')
            const response = await axios.get(
                'https://server.wb.in.th/api/announcements',
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
            setAnnouncements(response.data.data)
            setTotalPages(Math.ceil(response.data.total / itemsPerPage)) // Calculate total pages
        } catch (error) {
            console.error('Error fetching announcements:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (data = {}) => {
        setModalData(data)
        setIsEditMode(!!data.id) // If data has an id, we are in edit mode
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setModalData({})
    }

    const handleSave = async () => {
        const token = localStorage.getItem('accessToken')
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
        try {
            if (isEditMode) {
                await axios.put(
                    `https://server.wb.in.th/api/announcements/${modalData.id}`,
                    modalData,
                    { headers },
                )
                toast.success('Announcement updated successfully!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            } else {
                await axios.post(
                    'https://server.wb.in.th/api/announcements',
                    modalData,
                    { headers },
                )
                toast.success('Announcement added successfully!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            }
            fetchAnnouncements() // Refresh the data
            handleCloseModal()
        } catch (error) {
            console.error('Error saving announcement:', error)
            toast.error('Failed to save announcement. Please try again.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    const handleDelete = async id => {
        const token = localStorage.getItem('accessToken')
        const confirmation = confirm(
            'Are you sure you want to delete this announcement?',
        )
        if (confirmation) {
            try {
                await axios.delete(
                    `https://server.wb.in.th/api/announcements/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )
                fetchAnnouncements() // Refresh the data
                toast.success('Announcement remove successfully!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            } catch (error) {
                console.error('Error deleting announcement:', error)
                toast.error(
                    'Failed to remove announcement. Please try again.',
                    {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    },
                )
            }
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
                <h1 className="text-2xl font-bold mb-4">ข่าวสาร & อัพเดท</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary mb-4 px-4 py-2">
                    เพิ่มใหม่
                </button>
                {loading ? (
                    <div className="w-full p-3">
                        <div className="flex items-center justify-center flex-wrap gap-4">
                            <div className="skeleton h-32 w-full"></div>
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-full"></div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <table className="w-full table-auto mb-4">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">หัวข้อ</th>
                                    <th className="border px-4 py-2">
                                        วันที่สร้าง
                                    </th>
                                    <th className="border px-4 py-2">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.map(announcement => (
                                    <tr key={announcement.id}>
                                        <td className="border px-4 py-2">
                                            {announcement.title}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {new Date(
                                                announcement.created_at,
                                            ).toLocaleString('th-TH', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() =>
                                                    handleOpenModal(
                                                        announcement,
                                                    )
                                                }
                                                className="btn btn-warning me-1">
                                                แก้ไข
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        announcement.id,
                                                    )
                                                }
                                                className="btn btn-error ms-1">
                                                ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="btn disabled:btn-disabled">
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="btn disabled:btn-disabled">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditMode
                                ? 'Edit Announcement'
                                : 'Add Announcement'}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold">
                                หัวข้อ
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full max-w-xs"
                                value={modalData.title || ''}
                                onChange={e =>
                                    setModalData({
                                        ...modalData,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold">
                                เนื้อหา
                            </label>
                            <textarea
                                className="textarea textarea-bordered w-full"
                                value={modalData.content || ''}
                                onChange={e =>
                                    setModalData({
                                        ...modalData,
                                        content: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold">
                                Start Time
                            </label>
                            <input
                                type="datetime-local"
                                className="input input-bordered w-full px-3 py-2"
                                value={modalData.startTimestamp || ''}
                                onChange={e =>
                                    setModalData({
                                        ...modalData,
                                        startTimestamp: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold">
                                End Time
                            </label>
                            <input
                                type="datetime-local"
                                className="input input-bordered w-full px-3 py-2"
                                value={modalData.endTimestamp || ''}
                                onChange={e =>
                                    setModalData({
                                        ...modalData,
                                        endTimestamp: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="modal-action">
                            <button
                                onClick={handleSave}
                                className="btn btn-success me-1">
                                {isEditMode ? 'Update' : 'Add'}
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="btn btn-active ms-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
