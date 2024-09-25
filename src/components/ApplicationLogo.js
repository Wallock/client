import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

const ApplicationLogo = () => (
    <div>
        <h1 className="title-font m-0 font-extrabold lg:text-xl text-xl py-0 bg-gradient-to-r from-fuchsia-100 via-stone-200 to-pink-100 bg-clip-text text-transparent text-left">
            <FontAwesomeIcon icon={faGear} shake className="text-slate-200" />{' '}
            JS-System
            <sup className="text-red-500 lg:text-md text-xs">v3</sup>
        </h1>
        <p className="leading-none text-xs lg:max-w-lg text-slate-200 text-center ">
            ระบบจัดการองค์กรภายใน
        </p>
    </div>
)

export default ApplicationLogo
