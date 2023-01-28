
function LeftWrapper(props) {
    return (
        <span style={{ float: 'left' }}>
            {props.children}
        </span>
    )
}

export default LeftWrapper;