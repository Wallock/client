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
            <Component {...pageProps} />
            <SpeedInsights />
        </ProfileProvider>
    )
}

export default App
