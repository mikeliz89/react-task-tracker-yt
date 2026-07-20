import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { useProfileSettings } from '../../contexts/ProfileSettingsContext';
import ScrollToTop from "../Site/ScrollToTop";

export default function PageContentWrapper({ children, scrollToTopOnMount, disableScrollToTopAnimation }) {
    const { disableScrollToTopAnimation: profileDisableScrollToTopAnimation } = useProfileSettings() || {};

    const effectiveDisableScrollToTopAnimation = profileDisableScrollToTopAnimation ?? disableScrollToTopAnimation;

    useEffect(() => {
        if (!scrollToTopOnMount) {
            return;
        }

        if (effectiveDisableScrollToTopAnimation) {
            window.scrollTo(0, 0);
            return;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [scrollToTopOnMount, effectiveDisableScrollToTopAnimation]);

    return (
        <>
            <div className='page-content'>
                {children}
            </div>
            <ScrollToTop disableAnimation={effectiveDisableScrollToTopAnimation} />
        </>
    )
}

PageContentWrapper.defaultProps = {
    scrollToTopOnMount: false,
    disableScrollToTopAnimation: false,
};

PageContentWrapper.propTypes = {
    children: PropTypes.node,
    scrollToTopOnMount: PropTypes.bool,
    disableScrollToTopAnimation: PropTypes.bool,
};

