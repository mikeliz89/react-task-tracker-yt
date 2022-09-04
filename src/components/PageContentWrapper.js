
function PageContentWrapper(props) {
    return (
        <div className='page-content'>
            {props.children}
        </div>
    )
}

export default PageContentWrapper