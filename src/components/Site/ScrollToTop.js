import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { ICONS, TRANSLATION } from '../../utils/Constants';
import Button from '../Buttons/Button';

export default function ScrollToTop({ disableAnimation }) {

    //translation  
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SCROLL_TO_TOP });

    //states
    const [isVisible, setIsVisible] = useState(false);

    const getScrollTop = () => {
        return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    };

    // Show button when page is scorlled upto given distance
    const toggleVisibility = () => {
        if (getScrollTop() > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        if (disableAnimation) {
            const scrollingElement = document.scrollingElement || document.documentElement;
            const previousScrollBehavior = scrollingElement.style.scrollBehavior;

            // Force immediate jump even if global CSS sets smooth scrolling.
            scrollingElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            requestAnimationFrame(() => {
                scrollingElement.style.scrollBehavior = previousScrollBehavior;
            });
            return;
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className='scroll-to-top-floating'>
            <Button
                onClick={scrollToTop}
                iconName={ICONS.ARROW_UP}
                text={t('go_to_top')}
                className='btn scroll-to-top-button'
            />
        </div>
    );
}

ScrollToTop.defaultProps = {
    disableAnimation: false,
};

ScrollToTop.propTypes = {
    disableAnimation: PropTypes.bool,
};


