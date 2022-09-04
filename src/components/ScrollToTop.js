//react
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
//button
import Button from "./Button";

export default function ScrollToTop() {

    //translation  
    const { t } = useTranslation('scrolltotop', { keyPrefix: 'scrolltotop' });

    //states
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scorlled upto given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
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
        <div className="scroll-to-top" style={{ float: 'right' }}>
            {isVisible &&
                <Button onClick={scrollToTop} iconName='arrow-up' text={t('go_to_top')} />}
        </div>
    );
}