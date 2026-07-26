import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { auth } from '../firebase-config';
import { TRANSLATION } from '../utils/Constants';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //user
    const [currentUser, setCurrentUser] = useState();

    //states
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe;
    }, [])

    //expose / export functions to others to see
    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword
    }
    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className='app-initial-loading' role='status' aria-live='polite'>
                    <span className='app-initial-loading-spinner' aria-hidden='true' />
                    <span>{tCommon('loading')}</span>
                </div>
            ) : children}
        </AuthContext.Provider>
    )
}



