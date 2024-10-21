// components/config.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Config = createContext()
export const version = '1.0a'
export const email = 'mailto:wallock32@gmail.com'
export const website = 'https://server.wb.in.th/login'
export const phone = 'tel:0962087650'
