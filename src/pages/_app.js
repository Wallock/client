import 'tailwindcss/tailwind.css'
import 'components/styles/globals.css'
import 'components/styles/banner.css'
import 'components/styles/boxgift.css'
import 'components/styles/home.css'
import { ProfileProvider } from '@/lib/ProfileContext'
import { SpeedInsights } from '@vercel/speed-insights/next'

const App = ({ Component, pageProps }) => {
    return (
        <ProfileProvider>
            <Head>
                <title>JS-System v3</title>
                <meta
                    name="description"
                    content="ระบบจัดการพนักงานและองค์กรภายใน"
                />
                <meta property="og:site_name" content="JS-System v3" />
                <meta
                    property="og:url"
                    content="https://jssystem.vercel.app/"
                />
                <meta property="og:title" content="JS-System v3" />
                <meta
                    property="og:description"
                    content="ระบบจัดการพนักงานและองค์กรภายใน"
                />
            </Head>
            <Component {...pageProps} />
            <SpeedInsights />
        </ProfileProvider>
    )
}

export default App
