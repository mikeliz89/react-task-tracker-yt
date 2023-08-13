import ScrollToTop from "../Site/ScrollToTop";

function PageContentWrapper({children}) {
    return (
        <>
            <div className='page-content'>
                {children}
            </div>
            <ScrollToTop />
        </>
    )
}

export default PageContentWrapper