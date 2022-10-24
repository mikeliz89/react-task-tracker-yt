import ScrollToTop from "../Site/ScrollToTop";

function PageContentWrapper(props) {
    return (
        <>
            <div className='page-content'>
                {props.children}
            </div>
            <ScrollToTop />
        </>
    )
}

export default PageContentWrapper