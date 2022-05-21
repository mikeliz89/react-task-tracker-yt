import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button'

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
        } catch (error) {
            setError(t('failed_to_log_out'))
            console.log(error);
        }
    }
    return (
        <>
            {error && <div className="error">{error}</div>}
            <Button
                showIconLogout={true}
                onClick={() => handleLogout()}
                text={t('log_out')}
                color="gray"
                className="btn" />
        </>
    )
}
