import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {

    //states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {signup} = useAuth()

    async function onSubmit(e) {
        e.preventDefault()

        //validation
        if(!email || !password || !passwordConfirm) {
            setError('Please fill all the fields')
            return
        }

        if(password != passwordConfirm) {
            setError('Passwords do not match!');
            return
        }

        try {
            //clear the error
            setError('')
            setLoading(true)
            await signup(email, password);
        } catch(error) {
            setError('Failed to create an account');
            console.log(error)
        }

        setLoading(false)

        //clear the form
        setEmail('')
        setPassword('')
        setPasswordConfirm('')
    }

    return (
        <>
            <header className="header">
                <h1>Sign Up</h1>
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
                <div className='form-control'>
                    <label>Password Confirmation</label>
                    <input type='password' placeholder='Password' value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                </div>
                <input disabled={loading} type='submit' value='Sign Up' className='btn btn-block' />
            </form>

            <div className="textCenter">
                Already have an account? Log In    
            </div>
        </>
    )
}
