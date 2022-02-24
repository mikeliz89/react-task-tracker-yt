import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext'
import  Logout  from '../components/Logout'

const Header = ({title}) => {

    const { currentUser } = useAuth()

    return (
        <>
            <header className="header">
                <h1>{title}</h1>
                {currentUser && <Logout /> }
            </header>
            {currentUser && "Email: " + currentUser.email}
        </>
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
