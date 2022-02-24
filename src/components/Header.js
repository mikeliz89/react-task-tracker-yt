import PropTypes from 'prop-types';

const Header = ({title}) => {
    return (
        <header className="header">
            <h1>{title}</h1>
        </header>
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
