// components/Confetti.js
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const Confetti = ({ show }) => {
    useEffect(() => {
        if (show) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
        }
    }, [show])

    return null // This component does not render anything
}

export default Confetti
