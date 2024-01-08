import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true,
})

axios.interceptors.request.use(
    config => {
        // Assuming you have the XSRF token stored in a variable named xsrfToken
        const xsrfToken = 'your_xsrftoken_value_here'

        // Set the XSRF token in the request headers
        config.headers['X-XSRF-TOKEN'] = xsrfToken

        return config
    },
    error => {
        return Promise.reject(error)
    },
)

export default axios
