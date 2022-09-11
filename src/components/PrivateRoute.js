import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as Constants from '../utils/Constants';

export default function PrivateRoute({ children }) {

    //user
    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to={Constants.NAVIGATION_LOGIN} />;
}
