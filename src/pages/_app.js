import 'tailwindcss/tailwind.css'
import 'components/styles/globals.css'
import 'components/styles/banner.css'
import { ProfileProvider } from 'lib/ProfileContext'

const App = ({ Component, pageProps }) => {
    return (
        <ProfileProvider>
            <Component {...pageProps} />
        </ProfileProvider>
    )
}

export default App
