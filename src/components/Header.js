import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext'
import  Logout  from '../components/Logout'

const Header = ({title}) => {

    const { currentUser } = useAuth()

    return (
        <div className="headerbox">
            <header className="header">
                <h1>{title}</h1>
                {currentUser && <Logout /> }
            </header>
            <span className="loggedin-user">{currentUser && "Logged in as: " + currentUser.email}</span>
        </div>
    )
}

Header.defaultProps = {
    title: 'default header title'
}

Header.propTypes = {
    title: PropTypes.string.isRequired
}

//CSS in JS
// const headingStyle = {
//     color: 'red', backgroundColor: 'black'
// }

export default Header
