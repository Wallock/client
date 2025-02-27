import AppLayout from '@/components/Layouts/AppLayout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '@/lib/ProfileContext'

import SearchFilter from '@/components/control/SearchFilter'
import Pagination from '@/components/control/Pagination'
import WorkerCard from '@/components/control/WorkerCard'
import WorkerDetailsDrawer from '@/components/control/WorkerDetailsDrawer'
import axios from 'axios'
import Loading from '@/lib/loading'

export default function Home() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [imageLoading, setImageLoading] = useState(true)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedWorkerId, setSelectedWorkerId] = useState(null)
    const [searchWorkerId, setSearchWorkerId] = useState('')
    const [resetSearch, setResetSearch] = useState(false)
    const [showOnlyTypeT, setShowOnlyTypeT] = useState(false)
    const [showOnlyTypeC, setShowOnlyTypeC] = useState(false)
    const [showOnlyTypeM, setShowOnlyTypeM] = useState(false)
    const [showOnlyTypeL, setShowOnlyTypeL] = useState(false)
    const [showOvernightt, setShowOnlyOvernightt] = useState(false)
    const [showOvernightf, setShowOnlyOvernightf] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [selectedJob, setSelectedJob] = useState(null)
    const [selectedZone, setSelectedZone] = useState(null)
    const [selectedOutside, setSelectedOutside] = useState(null)
    const [filteredData, setFilteredData] = useState([])
    const profile = useProfile()

    const token = `1amwall0ck`
    const f_url = `https://beta.wb.in.th`
    const getname = `48`

    useEffect(() => {
        const checkUserStatus = () => {
            // Check the user's type48 status from the profile prop
            const userType48 = profile?.type48

            if (userType48 !== 1) {
                router.push('/dashboard')
            }
        }

        checkUserStatus()
    }, [profile])

    const fetchData = async () => {
        try {
            setLoading(true)

            let apiUrl = `${f_url}/api/worker?token=${token}&page=${currentPage}`

            if (searchWorkerId && !resetSearch) {
                apiUrl += `&search=${searchWorkerId}`
            }

            if (selectedStatus !== null) {
                apiUrl += `&status=${selectedStatus}`
            }

            if (selectedJob !== null) {
                apiUrl += `&job=${selectedJob}`
            }

            if (selectedZone !== null) {
                apiUrl += `&zone=${selectedZone}`
            }

            if (selectedOutside !== null) {
                apiUrl += `&outside=${selectedOutside}`
            }

            const response = await axios.get(apiUrl)

            const result = response.data

            // Check if result has last_page before using it
            if ('last_page' in result) {
                setLastPage(result.last_page)
            }

            if (resetSearch) {
                setSearchWorkerId('')
            }
            setData(result.data)
            setLoading(false)
            setResetSearch(false)
        } catch (error) {
            //console.error('Error fetching data:', error)
            setLoading(false)
        } finally {
            setResetSearch(false) // Move this line to the finally block to ensure it's always reset
        }
    }

    useEffect(() => {
        fetchData()
    }, [
        currentPage,
        lastPage,
        selectedStatus,
        selectedJob,
        selectedZone,
        selectedOutside,
    ])

    useEffect(() => {
        if (data) {
            let filtered = data

            // Filter by worker type
            if (
                showOnlyTypeT ||
                showOnlyTypeC ||
                showOnlyTypeM ||
                showOnlyTypeL
            ) {
                filtered = filtered.filter(item => {
                    if (showOnlyTypeT && item.worker_type === 't') return true
                    if (showOnlyTypeC && item.worker_type === 'c') return true
                    if (showOnlyTypeM && item.worker_type === 'm') return true
                    if (showOnlyTypeL && item.worker_type === 'l') return true
                    return false
                })
            }

            // Filter by overnight
            if (showOvernightt || showOvernightf) {
                filtered = filtered.filter(item => {
                    if (showOvernightt && item.worker_overnight === '2')
                        return true
                    if (showOvernightf && item.worker_overnight === '1')
                        return true
                    return false
                })
            }

            setFilteredData(filtered)
        }
    }, [
        data,
        showOnlyTypeT,
        showOnlyTypeC,
        showOnlyTypeM,
        showOnlyTypeL,
        showOvernightt,
        showOvernightf,
    ])

    useEffect(() => {
        //console.log('Drawer Open State Updated:', drawerOpen)
    }, [drawerOpen])

    useEffect(() => {
        //console.log('Selected Worker ID Updated:', selectedWorkerId)
    }, [selectedWorkerId])

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData()
        }, 1 * 60 * 1000)

        return () => clearInterval(intervalId)
    }, [
        currentPage,
        lastPage,
        searchWorkerId,
        selectedStatus,
        selectedJob,
        selectedZone,
        selectedOutside,
    ])

    const handleNextPage = () => {
        // Increment the current page when loading next page
        setCurrentPage(prevPage => prevPage + 1)
    }

    const handlePrevPage = () => {
        // Decrement the current page when loading previous page, ensuring it doesn't go below 1
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1))
    }

    const generatePageNumbers = () => {
        const maxButtons = 5 // Maximum number of pagination buttons to show
        const pages = []
        let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1)
        let endPage = startPage + maxButtons - 1

        // Ensure that the last page is not exceeded
        if (endPage > lastPage) {
            endPage = lastPage
            startPage = Math.max(endPage - maxButtons + 1, 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return pages
    }

    const handleFreeButtonClick = workerId => {
        //console.log('Worker ID:', workerId) // Log the worker ID
        setSelectedWorkerId(workerId)
        setDrawerOpen(true)
        //console.log('Drawer Open:', drawerOpen) // Log the drawer state
    }
    const getBackgroundClass = workpositionId => {
        switch (workpositionId) {
            case 'แม่บ้านทั่วไป':
                return 'text-green-700'
            case 'พี่เลี้ยงน้อง':
                return 'text-orange-500'
            case 'ดูแลผู้สูงอายุ':
                return 'text-red-600'
            case 'แม่บ้านดูแลผู้สูงอายุ':
                return 'text-red-600'
            case 'แม่บ้านพี่เลี้ยงน้อง':
                return 'text-orange-500'
            case 'กรรมกร':
                return 'text-blue-500'
            case 'พ่อบ้านทั่วไป':
                return 'text-blue-500'
            case '-':
                return 'text-black'
            // Add more cases as needed
            default:
                return 'text-black' // Default to no background color
        }
    }

    const getFlagUrl = nationality => {
        switch (nationality) {
            case 'm':
                return '/flag/myanmar.svg'
            case 't':
                return '/flag/thai.svg'
            case 'c':
                return '/flag/cambodia.svg'
            case 'l':
                return '/flag/laos.svg'
            default:
                return '/flag/blank.svg'
        }
    }

    const handleSearchWorkerId = () => {
        fetchData()
    }

    const handleResetSearch = () => {
        setSearchWorkerId('')
        setResetSearch(true)
        fetchData()
        setCurrentPage(1)
        setResetSearch(false)
    }

    return (
        <AppLayout>
            <div className="w-full">
                <SearchFilter
                    systemName={getname}
                    url_count={f_url}
                    searchWorkerId={searchWorkerId}
                    handleSearchWorkerId={handleSearchWorkerId}
                    handleResetSearch={handleResetSearch}
                    setSearchWorkerId={setSearchWorkerId}
                    showOnlyTypeT={showOnlyTypeT}
                    showOnlyTypeC={showOnlyTypeC}
                    showOnlyTypeM={showOnlyTypeM}
                    showOnlyTypeL={showOnlyTypeL}
                    setShowOnlyTypeT={setShowOnlyTypeT}
                    setShowOnlyTypeC={setShowOnlyTypeC}
                    setShowOnlyTypeM={setShowOnlyTypeM}
                    setShowOnlyTypeL={setShowOnlyTypeL}
                    showOvernightt={showOvernightt}
                    showOvernightf={showOvernightf}
                    setShowOnlyOvernightt={setShowOnlyOvernightt}
                    setShowOnlyOvernightf={setShowOnlyOvernightf}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    selectedJob={selectedJob}
                    setSelectedJob={setSelectedJob}
                    selectedZone={selectedZone}
                    setSelectedZone={setSelectedZone}
                    selectedOutside={selectedOutside}
                    setSelectedOutside={setSelectedOutside}
                />
            </div>
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
                <>
                    <div className="w-full my-3 p-3">
                        <div className="flex items-center justify-center flex-wrap gap-4">
                            {filteredData.map(item => (
                                <WorkerCard
                                    key={item.id}
                                    item={item}
                                    imageLoading={imageLoading}
                                    setImageLoading={setImageLoading}
                                    //handleFreeButtonClick={
                                    //    handleFreeButtonClick
                                    //}
                                    getBackgroundClass={getBackgroundClass}
                                    getFlagUrl={getFlagUrl}
                                    getfapi={f_url}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                handlePageClick={setCurrentPage}
                generatePageNumbers={generatePageNumbers}
            />
            <WorkerDetailsDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                workerId={selectedWorkerId}
                getfapi={f_url}
                getname={getname}
                gettoken={token}
            />
        </AppLayout>
    )
}
