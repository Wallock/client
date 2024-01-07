import React, { useEffect, useState } from 'react'

import axios from 'axios'

const TestPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [userId, setUserId] = useState(null)

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'https://api.wb.in.th/api/login2',
                {
                    username,
                    password,
                },
            )

            const { success, user, message } = response.data

            if (success) {
                setUserId(user.id)
                console.log(`Login successful. User ID: ${user.id}`)
            } else {
                console.error(`Login failed. Message: ${message}`)
            }
        } catch (error) {
            console.error('Error during login:', error)
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleLogin}>Login</button>
            {userId && <p>User ID: {userId}</p>}
        </div>
    )
}

export default TestPage
