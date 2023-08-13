import ScrollToTop from "../Site/ScrollToTop";

export default function PageContentWrapper({ children }) {
    return (
        <>
            <div className='page-content'>
                {children}
            </div>
            <ScrollToTop />
        </>
    )
}
