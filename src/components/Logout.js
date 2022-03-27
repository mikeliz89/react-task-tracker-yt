import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export default function Logout() {

    const { logout } = useAuth()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [error, setError] = useState("")

    async function handleLogout() {
       setError('')

       try {
        await logout()

        navigate('/login');
       } catch(error) {
            setError(t('failed_to_log_out'))
            console.log(error);
       }
    }
    return (
        <>
          { error && <div className="error">{error}</div> }  
          <Button 
           onClick={() => handleLogout()} 
           text={t('log_out')}
           color="gray"
           className="btn" />
        </>
    )
}
