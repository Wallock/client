import Axios from 'axios'

const axiosInstance = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
})

// Placeholder function to retrieve CSRF token
const getCSRFToken = () => {
    // Implement your logic to retrieve the CSRF token
    // For example, if the token is stored in a meta tag:
    const metaTag = document.querySelector('meta[name="csrf-token"]')
    return metaTag ? metaTag.content : null
}

// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
        // Add CSRF token to the headers if it's available
        const csrfToken = getCSRFToken()
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken
        }
        return config
    },
    error => {
        return Promise.reject(error)
    },
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => {
        // Handle successful responses
        return response
    },
    error => {
        // Handle errors
        return Promise.reject(error)
    },
)

export default axiosInstance
