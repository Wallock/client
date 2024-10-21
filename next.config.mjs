import million from 'million/compiler'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'beta.wb.in.th',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'server.wb.in.th',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'dd.wb.in.th',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'thai.wb.in.th',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'laos.wb.in.th',
                pathname: '/**',
            },
        ],
    },
}

const millionConfig = {
    auto: true,
    output: 'export',
}

export default million.next(nextConfig, millionConfig)
