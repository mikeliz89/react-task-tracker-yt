import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import { ICONS, TRANSLATION } from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';

export default function ScrollToTop() {

    //translation  
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SCROLL_TO_TOP });

    //states
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scorlled upto given distance
    const toggleVisibility = () => {
        if (window.scrollY > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <RightWrapper>
            {isVisible &&
                <Button onClick={scrollToTop} iconName={ICONS.ARROW_UP} text={t('go_to_top')} />}
        </RightWrapper>
    );
}