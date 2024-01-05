import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: false,
    withXSRFToken: true,
})

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Content-Type'] = 'application/json'

export default axios
