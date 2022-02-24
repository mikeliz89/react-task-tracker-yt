import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import {useNavigate} from 'react-router-dom'

export default function Logout() {

    const { logout } = useAuth()
    const navigate = useNavigate()

    const [error, setError] = useState("")

    async function handleLogout() {
       setError('')

       try {
        await logout()

        navigate('/login');
       } catch(Exception) {
            setError('Failed to log out')
            console.log(Exception);
       }
    }

    return (
        <>
          { error && <div class="error">{error}</div> }  
          <Button onClick={() => handleLogout() } text="Log Out" />
        </>
    )
}
