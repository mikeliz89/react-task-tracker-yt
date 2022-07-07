//react
import { Navigate } from 'react-router-dom';
//auth
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {

    //user
    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to="/login" />;
}
