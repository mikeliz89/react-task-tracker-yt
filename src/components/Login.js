import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {

    //states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {login} = useAuth()
    const navigate = useNavigate()

    async function onSubmit(e) {
        e.preventDefault()

        try {
            //clear the error
            setError('')
            setLoading(true)
            await login(email, password);
            //navigate to dashboard
            navigate('/');
        } catch(error) {
            setError('Failed to log in');
            console.log(error)
        }

        setLoading(false)
    }

    return (
        <>
            <header className="header">
                <h1>Log In</h1>
            </header>
            { error && <div className="error">{error}</div> }
            <form className='add-form' onSubmit={onSubmit}>
                <div className='form-control'>
                    <label>Email</label>
                    <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='form-control'>
                    <label>Password</label>
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <input disabled={loading} type='submit' value='Log In' className='btn btn-block' />
            </form>

            <div className="text-center">
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </>
    )
}
