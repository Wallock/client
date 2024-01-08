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
    async config => {
        // Fetch CSRF cookie
        await axios.get('/sanctum/csrf-cookie')

        // Extract XSRF token from the cookie
        const xsrfToken = getCookie('XSRF-TOKEN')

        // Set the XSRF token in the request headers
        config.headers['X-XSRF-TOKEN'] = xsrfToken

        return config
    },
    error => {
        return Promise.reject(error)
    },
)

// Helper function to get cookie value by name
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) return match[2]
}

export default axios
